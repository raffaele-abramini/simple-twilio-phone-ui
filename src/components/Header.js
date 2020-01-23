import React, { useEffect, useState } from "react";
import EventEmitter, { events } from "../events";
import { fromPhoneNumber } from "../../secret";

export const Header = () => {
  const [identity, setIdentity] = useState("");
  useEffect(() => {
    EventEmitter.on(events._receivedIdentity, ({ identity }) =>
      setIdentity(identity)
    );
  }, []);
  return (
    <div>
      <p>
        Hey! You are logged with a client named <strong>{identity}</strong>.
      </p>
      <p>To interact, please call {fromPhoneNumber}</p>
    </div>
  );
};
