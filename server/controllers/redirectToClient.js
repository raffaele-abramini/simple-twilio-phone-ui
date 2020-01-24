const VoiceResponse = require("twilio").twiml.VoiceResponse;
const globals = require("../globals");
const handlWebsocket = require("../handleWebsocket");

const resetAnswerBehaviour = () =>
  handlWebsocket.setCallOption({
    value: globals.handleCallOptions.default
  });

module.exports = function redirectToClient(toNumber) {
  // Create a TwiML voice response
  const twiml = new VoiceResponse();

  if (toNumber) {
    if (globals.handleCall === globals.handleCallOptions.default) {
      twiml.dial().client(globals.identity);
    } else if (globals.handleCall === globals.handleCallOptions.busy) {
      twiml.reject({ reason: "busy" });
      resetAnswerBehaviour();
    } else if (globals.handleCall === globals.handleCallOptions.fakeAnswer) {
      twiml.say(
        "This is an automated response. And on this bombshell, goodnight!"
      );
      resetAnswerBehaviour();
    } else {
      twiml.say("Mmmm we broke something in the client.");
      console.error("Invalid `handleCall` value:", globals.handleCall);
      resetAnswerBehaviour();
    }
  } else {
    twiml.say("Thanks, goodbye!");
  }

  return twiml.toString();
};

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
