import React, { useState, useEffect } from "react";
import { api } from "../api";
import {setup} from "../setup";

export const PhoneForm = () => {
  const [number, setNumber] = useState("");

  useEffect(() => {
    setup();
  }, []);

    return (
        <form onSubmit={e => e.preventDefault()}>
          <label htmlFor="phonenumber">Phone number</label>
          <input type="text" name="phonenumber" onClick={(e) => setNumber(e.target.value)}/>
          <button onClick={() => {
            api.get("/call")
          }}>Make a call</button>
          <button onClick={() => {
            api.get("/drop")
          }}>drop it</button>
        </form>
    )
};
