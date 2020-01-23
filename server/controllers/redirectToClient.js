const VoiceResponse = require("twilio").twiml.VoiceResponse;
const secret = require("../../secret");
const globals = require("../globals");

module.exports = function redirectToClient(toNumber) {
  // Create a TwiML voice response
  const twiml = new VoiceResponse();

  if (toNumber) {
    if (globals.goToBrowser) {
      twiml.dial().client(
        {
          statusCallbackEvent: {
            completed: () => console.log("done")
          }
        },
        globals.identity
      );
    } else {
      twiml.say(
        "I'm going to say a very, VERY long reply over here. Listen: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, accusantium ad excepturi impedit magni neque nulla optio quibusdam quo reiciendis repudiandae saepe sapiente tempore totam, voluptatem? Cupiditate fuga quos vitae? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, accusantium ad excepturi impedit magni neque nulla optio quibusdam quo reiciendis repudiandae saepe sapiente tempore totam, voluptatem? Cupiditate fuga quos vitae? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, accusantium ad excepturi impedit magni neque nulla optio quibusdam quo reiciendis repudiandae saepe sapiente tempore totam, voluptatem? Cupiditate fuga quos vitae?"
      );
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
