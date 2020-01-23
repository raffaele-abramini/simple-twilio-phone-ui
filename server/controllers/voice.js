const VoiceResponse = require('twilio').twiml.VoiceResponse;
const secret = require("../../secret");

module.exports = function voiceResponse(toNumber) {
  // Create a TwiML voice response
  const twiml = new VoiceResponse();

  if (toNumber) {
    // Wrap the phone number or client name in the appropriate TwiML verb
    // if is a valid phone number
    const attr = isAValidPhoneNumber(toNumber) ? 'number' : 'client';

    const dial = twiml.dial({
      callerId: config.callerId,
    });
    dial[attr]({}, toNumber);
  } else {
    twiml.say('Fuck off narendra');
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