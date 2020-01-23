const secret = require("../../secret.json");
const client = require("twilio");

let call;

const makeCall = () => client(secret.accountSid, secret.authToken).calls
  .create({
    twiml: '<Response><Say>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto blanditiis corporis eaque eius eum incidunt iure labore nulla odio repellendus. Alias commodi cumque dolor dolorum harum id quibusdam reiciendis unde.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto blanditiis corporis eaque eius eum incidunt iure labore nulla odio repellendus. Alias commodi cumque dolor dolorum harum id quibusdam reiciendis unde.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto blanditiis corporis eaque eius eum incidunt iure labore nulla odio repellendus. Alias commodi cumque dolor dolorum harum id quibusdam reiciendis unde.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto blanditiis corporis eaque eius eum incidunt iure labore nulla odio repellendus. Alias commodi cumque dolor dolorum harum id quibusdam reiciendis unde.</Say></Response>',
    to: secret.toPhoneNumber,
    from: secret.fromPhoneNumber
  })
  .then(_call => {
    call = _call;
    console.log(call)
  });


const dropCall = () => call.disconnect().then(() => console.log("disconnected")).catch(console.error);

module.exports = { makeCall, dropCall };