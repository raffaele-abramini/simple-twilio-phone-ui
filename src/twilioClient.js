import Twilio from "twilio-client";
import { api } from "./api";
import Emitter, { events } from "./events";
import log from "loglevel";

export const setup = async () => {
  const response = await api.get("/token");
  const data = response.data;

  Emitter.emit(events._receivedIdentity, { identity: data.identity });

  // Setup Twilio.Device
  const device = new Twilio.Device(data.token, {
    fakeLocalDTMF: true,
    enableRingingState: true
  });

  device.on("ready", function(device) {
    log.info("Device ready!");
    Emitter.emit(events.ready, { device });
  });

  device.on("error", function(error) {
    log.info("error", error);
    Emitter.emit(events.error, { error });
  });

  device.on("connect", function(connection) {
    log.info("connect", connection);
    Emitter.emit(events.connect, { connection });
  });

  device.on("disconnect", function(connection) {
    log.info("disconnect", connection);
    Emitter.emit(events.disconnect, { connection });
  });

  device.on("incoming", function(connection) {
    window.connection = connection;
    log.info("incoming", connection);
    Emitter.emit(events.incoming, { connection });
  });

  device.on("reject", function(connection) {
    log.info("reject", connection);
    Emitter.emit(events.reject, { connection });
  });

  device.on("cancel", function(connection) {
    log.info("cancel", connection);
    Emitter.emit(events.cancel, { connection });
  });

  device.on("close", function(connection) {
    log.info("close", connection);
    Emitter.emit(events.close, { connection });
  });
};
