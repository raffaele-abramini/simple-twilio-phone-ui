import EventEmitter from "events";

export default new EventEmitter();

export const events = {
  _receivedIdentity: "_receivedIdentity",
  ready: "ready",
  error: "error",
  connect: "connect",
  disconnect: "disconnect",
  incoming: "incoming",
  reject: "reject",
  cancel: "cancel"
};
