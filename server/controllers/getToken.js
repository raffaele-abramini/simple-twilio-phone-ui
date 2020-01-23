const ClientCapability = require('twilio').jwt.ClientCapability;
const secret = require("../../secret.json");


module.exports = (req, res) => {

  const identity = "cane";
  // put your Twilio API credentials here
  const accountSid = secret.accountSid;
  const authToken = secret.authToken;

  // put your Twilio Application Sid here
  const appSid = secret.appSid;

  const capability = new ClientCapability({
    accountSid,
    authToken
  });

  capability.addScope(new ClientCapability.IncomingClientScope(identity));
  capability.addScope(new ClientCapability.OutgoingClientScope({
    applicationSid: appSid,
    clientName: identity,
  }));

  // Include identity and token in a JSON response
  res.set('Content-Type', 'application/json');
  res.send({
    identity: identity,
    token: capability.toJwt(),
  });
};