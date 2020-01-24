module.exports = {
  identity: "SimplePhoneAppClientID",
  handleCall: "default",
  currentCall: null,
  socket: null,
  io: null,
  handleCallOptions: {
    default: "default",
    fakeAnswer: "fakeAnswer",
    busy: "busy"
  }
};
