import Twilio from "twilio-client";
import { api } from "./api";
import Emitter, { events } from "./events";
const log = console.log;

export const setup = async () => {
  const response = await api.get("/token");
  const data = response.data;

  Emitter.emit(events._receivedIdentity, { identity: data.identity });

  log("Got a token.", data.identity);

  // Setup Twilio.Device
  const device = new Twilio.Device(data.token, {
    fakeLocalDTMF: true,
    enableRingingState: true
  });

  device.on("ready", function(device) {
    console.log("ready");
    Emitter.emit(events.ready, { device });
  });

  device.on("error", function(error) {
    console.log("error", error);
    Emitter.emit(events.error, { error });
  });

  device.on("connect", function(connection) {
    console.log("connect", connection);
    Emitter.emit(events.connect, { connection });
  });

  device.on("disconnect", function(connection) {
    console.log("disconnect", connection);
    Emitter.emit(events.disconnect, { connection });
  });

  device.on("incoming", function(connection) {
    console.warn("setting `Connection` variable");
    window.connection = connection;
    console.log("incoming", connection);
    Emitter.emit(events.incoming, { connection });
  });

  device.on("reject", function(connection) {
    console.log("reject", connection);
    Emitter.emit(events.reject, { connection });
  });

  device.on("cancel", function(connection) {
    console.log("cancel", connection);
    Emitter.emit(events.cancel, { connection });
  });
  device.on("close", function(connection) {
    console.log("close", connection);
    Emitter.emit(events.close, { connection });
  });

  console.log(Twilio.Device.audio);
};
