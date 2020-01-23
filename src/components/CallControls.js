import React, { useReducer, useEffect } from "react";
import EventEmitter, { events } from "../events";
import { setup } from "../twilioClient";
import { api } from "../api";
import { Button, Input, Status } from "./styles";

const reducer = (state = {}, action) => {
  switch (action.type) {
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

    setup();

    return EventEmitter.removeAllListeners;
  }, []);

  return (
    <div>
      <p>
        Call status: <Status status={status}>{status}</Status>
      </p>
      {status === events.ready && (
        <p style={{ color: "#888", fontStyle: "italic" }}>Waiting for a call</p>
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
