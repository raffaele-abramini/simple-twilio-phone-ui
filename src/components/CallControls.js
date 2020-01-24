import React, { useReducer, useEffect } from "react";
import EventEmitter, { events } from "../events";
import websocketEvents from "../../websocketEvents";
import { setup } from "../twilioClient";
import { Button, Input, Status } from "./styles";

import io from "socket.io-client";

const rejectingNextCall = "busy for next call";
const fakingNextAnswer = "faking next answer";
const holdNextCall = "holdongs";

const reducer = (state = {}, action) => {
  switch (action.type) {
    case rejectingNextCall:
      return {
        status: rejectingNextCall
      };
    case fakingNextAnswer:
      return {
        status: fakingNextAnswer
      };
    case holdNextCall:
      return {
        status: holdNextCall
      };
    case events.ready:
      return {
        status: events.ready,
        connection: null
      };
    case events.incoming:
      return {
        status: events.incoming,
        connection: action.payload
      };
    case events.connect:
      return {
        ...state,
        status: events.connect
      };
    case events.disconnect:
      return {
        ...state,
        status: state.status === holdNextCall ? holdNextCall : events.ready
      };
    case events.cancel:
      return {
        status: events.cancel,
        connection: action.payload
      };
    default:
      return state;
  }
};
let socket;

export const CallControls = () => {
  const [{ status, connection }, dispatch] = useReducer(reducer, {
    status: "loading"
  });

  useEffect(() => {
    EventEmitter.on(events.ready, () => dispatch({ type: events.ready }));
    EventEmitter.on(events.incoming, ({ connection }) => {
      dispatch({ type: events.incoming, payload: connection });
    });
    EventEmitter.on(events.connect, () => dispatch({ type: events.connect }));
    EventEmitter.on(events.cancel, () => dispatch({ type: events.ready }));
    EventEmitter.on(events.disconnect, () =>
      dispatch({ type: events.disconnect })
    );

    socket = io.connect("http://127.0.0.1:1337");

    socket.on(websocketEvents.applyChangeHandleCall, ({ value }) => {
      switch (value) {
        case "fakeAnswer":
          return dispatch({ type: fakingNextAnswer });
        case "hold":
          return dispatch({ type: holdNextCall });
        case "busy":
          return dispatch({ type: rejectingNextCall });
        default:
          return dispatch({ type: events.ready });
      }
    });

    setup();

    window.setAnswer = value => {
      if (!value) {
        console.log(
          "No values passed. Possible values: `fakeAnswer`, `busy`, `hold`, `default`"
        );
      }
      socket.emit(websocketEvents.requestChangeHandleCall, {
        value
      });
    };

    return EventEmitter.removeAllListeners;
  }, []);

  const renderCallOptions = () => (
    <>
      <p>
        <Button onClick={() => window.setAnswer("fakeAnswer")}>
          Send automatic response
        </Button>
      </p>
      <p>
        <Button onClick={() => window.setAnswer("busy")}>
          Send busy signal
        </Button>
      </p>
      <p>
        <Button onClick={() => window.setAnswer("hold")}>Hold</Button>
      </p>
    </>
  );

  return (
    <div>
      <p>
        Call status: <Status status={status}>{status}</Status>
      </p>
      {status === fakingNextAnswer && <div>Automatic response sent.</div>}
      {status === rejectingNextCall && <div>Call rejected as busy.</div>}
      {status === holdNextCall && (
        <div>
          <p>Call hold.</p>
          <Button green onClick={() => window.setAnswer("default")}>
            Resume call
          </Button>
        </div>
      )}
      {status === events.ready && (
        <>
          <p style={{ color: "#888", fontStyle: "italic" }}>
            Call the above number to proceed
          </p>
          <p style={{ marginTop: 50, marginBottom: 30 }}>
            or choose one of the options to change the behaviour for the next
            incoming call.
          </p>
          {renderCallOptions()}
        </>
      )}
      {status === events.incoming && (
        <>
          <Button
            id="accept"
            type="button"
            green
            onClick={() => connection.accept()}
          >
            Accept
          </Button>
          <Button
            id="decline"
            type="button"
            red
            onClick={() => connection.reject()}
          >
            Decline
          </Button>
          {renderCallOptions()}
        </>
      )}
      {status === events.connect && (
        <>
          <div>
            <Input
              type="number"
              style={{ width: 300 }}
              placeholder="Send digits by typing here"
              onKeyPress={e => connection.sendDigits(e.key)}
            />
          </div>

          <Button
            id="hangup"
            type="button"
            red
            onClick={() => connection.disconnect()}
          >
            Hangup
          </Button>
          <Button
            id="mute"
            type="button"
            onClick={() => connection.mute(!connection.isMuted())}
          >
            Mute
          </Button>
          {renderCallOptions()}
        </>
      )}
    </div>
  );
};
