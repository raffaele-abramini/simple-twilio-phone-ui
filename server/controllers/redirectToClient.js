const VoiceResponse = require("twilio").twiml.VoiceResponse;
const globals = require("../globals");
const secret = require("../../secret");
const handleWebsocket = require("../handleWebsocket");

module.exports = function redirectToClient(toNumber, CallSid) {
  // Create a TwiML voice response
  globals.callId = CallSid;
  const response = new VoiceResponse();

  if (toNumber) {
    if (globals.handleCall === globals.handleCallOptions.default) {
      response.dial().client(globals.identity);
    } else if (globals.handleCall === globals.handleCallOptions.busy) {
      response.reject({ reason: "busy" });
      handleWebsocket.setServerCallOption(globals.handleCallOptions.default);
    } else if (globals.handleCall === globals.handleCallOptions.fakeAnswer) {
      response.say(
        "This is an automated response. And on this bombshell, goodnight!"
      );
      handleWebsocket.setServerCallOption(globals.handleCallOptions.default);
    } else if (globals.handleCall === globals.handleCallOptions.enqueue) {
      response.play(
        "http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-Borghestral.mp3"
      );
    } else {
      response.say("Mmmm we broke something in the client.");
      console.error("Invalid `handleCall` value:", globals.handleCall);
    }
  } else {
    response.say("Thanks, goodbye!");
  }

  return response.toString();
};

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
