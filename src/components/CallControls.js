import React, { useReducer, useEffect } from "react";
import EventEmitter, { events } from "../events";
import websocketEvents from "../../websocketEvents";
import { setup } from "../twilioClient";
import { Button, Input, Status } from "./styles";

import io from "socket.io-client";

const rejectingNextCall = "busy for next call";
const fakingNextAnswer = "faking next answer";

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
  const [{ status, connection }, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    EventEmitter.on(events.ready, () => dispatch({ type: events.ready }));
    EventEmitter.on(events.incoming, ({ connection }) => {
      dispatch({ type: events.incoming, payload: connection });
    });
    EventEmitter.on(events.connect, () => dispatch({ type: events.connect }));
    EventEmitter.on(events.cancel, () => dispatch({ type: events.ready }));
    EventEmitter.on(events.disconnect, () => dispatch({ type: events.ready }));

    socket = io.connect("http://127.0.0.1:1337");

    socket.on(websocketEvents.applyChangeHandleCall, ({ value }) => {
      switch (value) {
        case "fakeAnswer":
          return dispatch({ type: fakingNextAnswer });
        case "busy":
          return dispatch({ type: rejectingNextCall });
        default:
          return dispatch({ type: events.ready });
      }
    });

    setup();

    window.setNextCall = value => {
      if (!value) {
        console.log("No values passed. Possible values: `fakeAnswer`, `busy`");
      }
      socket.emit(websocketEvents.requestChangeHandleCall, {
        value
      });
    };

    return EventEmitter.removeAllListeners;
  }, []);

  return (
    <div>
      <p>
        Call status: <Status status={status}>{status}</Status>
      </p>
      {status === fakingNextAnswer && (
        <div>Next call will received an automated answer</div>
      )}
      {status === rejectingNextCall && (
        <div>Next call will be rejected as "busy"</div>
      )}
      {status === events.ready && (
        <>
          <p style={{ color: "#888", fontStyle: "italic" }}>
            Call the above number to proceed
          </p>
          <p>
            or{" "}
            <Button onClick={() => window.setNextCall("fakeAnswer")}>
              Send an automatic response for the next incoming call.
            </Button>
          </p>
          <p>
            or{" "}
            <Button onClick={() => window.setNextCall("busy")}>
              Be busy for next call
            </Button>
          </p>
        </>
      )}
      {status === events.incoming && (
        <>
          <Button id="accept" type="button" onClick={() => connection.accept()}>
            Accept
          </Button>
          <Button
            id="decline"
            type="button"
            onClick={() => connection.reject()}
          >
            Decline
          </Button>
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
        </>
      )}
    </div>
  );
};
