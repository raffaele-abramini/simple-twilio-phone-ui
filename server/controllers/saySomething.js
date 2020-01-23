const VoiceResponse = require("twilio").twiml.VoiceResponse;
const globals = require("../globals");

module.exports = function saySomething() {
  globals.goToBrowser = false;
};
