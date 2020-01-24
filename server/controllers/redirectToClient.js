const VoiceResponse = require("twilio").twiml.VoiceResponse;
const secret = require("../../secret");
const globals = require("../globals");

module.exports = function redirectToClient(toNumber) {
  // Create a TwiML voice response
  const twiml = new VoiceResponse();

  if (toNumber) {
    if (globals.goToBrowser) {
      twiml.dial().client(globals.identity);
    } else {
      twiml.say(
        "This is an automated response. And on this bombshell, goodnight!"
      );
      globals.goToBrowser = true;
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
