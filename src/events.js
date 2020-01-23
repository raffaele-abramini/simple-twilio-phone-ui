import EventEmitter from "events";

export default new EventEmitter();

export const events = {
  ready: "ready",
  error: "error",
  connect: "connect",
  disconnect: "disconnect",
  incoming: "incoming",
  reject: "reject",
  cancel: "cancel"
};
