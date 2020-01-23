import React, { useReducer, useEffect } from "react";
import EventEmitter, { events } from "../events";
import { setup } from "../twilioClient";

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
      Call status: {status}
      {status === events.incoming && (
        <>
          <button type="button" onClick={() => connection.accept()}>
            Accept
          </button>
          <button type="button" onClick={() => connection.reject()}>
            Decline
          </button>
        </>
      )}
      {status === events.connect && (
        <>
          <input type="number" onKeyPress={e => connection.sendDigits(e.key)} />

          <button type="button" onClick={() => connection.disconnect()}>
            Drop
          </button>
          <button
            type="button"
            onClick={() => connection.mute(!connection.isMuted())}
          >
            Mute
          </button>
        </>
      )}
    </div>
  );
};
