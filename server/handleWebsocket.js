const secret = require("../secret");
const globals = require("./globals");
const websocketEvents = require("../websocketEvents");
const client = require("twilio")(secret.accountSid, secret.authToken);

module.exports = function handleWebsocket(socket) {
  globals.socket = socket;

  socket.on(websocketEvents.requestChangeHandleCall, setCallOption);
};
const setServerCallOption = value => {
  globals.handleCall = globals.handleCallOptions[value];
  globals.io.emit(websocketEvents.applyChangeHandleCall, { value });
};

const setCallOption = ({ value }) => {
  setServerCallOption(value);

  let twiml;

  if (value === globals.handleCallOptions.default) {
    twiml = `<Response><Dial><Client>${globals.identity}</Client></Dial></Response>`;
  } else if (value === globals.handleCallOptions.busy) {
    twiml = `<Response><Reject reason="busy"></Reject></Response>`;
    setServerCallOption(globals.handleCallOptions.default);
  } else if (globals.handleCall === globals.handleCallOptions.fakeAnswer) {
    twiml = `<Response><Say>This is an automated response. And on this bombshell, goodnight!</Say></Response>`;
    setServerCallOption(globals.handleCallOptions.default);
  } else if (globals.handleCall === globals.handleCallOptions.enqueue) {
    twiml = `<Response><Play>http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-Borghestral.mp3</Play></Response>`;
  } else {
    twiml = `<Response><Say>Mmmm we broke something in the client.</Say></Response>`;
    console.error("Invalid `handleCall` value:", globals.handleCall);
  }

  client.calls(globals.callId).update({
    twiml
  });
};

module.exports.setCallOption = setCallOption;
module.exports.setServerCallOption = setServerCallOption;
