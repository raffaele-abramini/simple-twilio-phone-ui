module.exports = {
  identity: "SimplePhoneAppClientID",
  handleCall: "default",
  currentCall: null,
  socket: null,
  io: null,
  callId: null,
  handleCallOptions: {
    default: "default",
    fakeAnswer: "fakeAnswer",
    busy: "busy",
    enqueue: "enqueue"
  }
};
