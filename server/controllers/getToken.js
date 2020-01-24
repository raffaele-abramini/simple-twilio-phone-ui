const ClientCapability = require("twilio").jwt.ClientCapability;
const secret = require("../../secret.json");
const globals = require("../globals");

module.exports = (req, res) => {
  const { identity } = globals;
  const { accountSid, authToken, appSid } = secret;

  const capability = new ClientCapability({
    accountSid,
    authToken
  });

  capability.addScope(new ClientCapability.IncomingClientScope(identity));
  capability.addScope(
    new ClientCapability.OutgoingClientScope({
      applicationSid: appSid,
      clientName: identity
    })
  );

  // Include identity and token in a JSON response
  res.set("Content-Type", "application/json");
  res.send({
    identity: identity,
    token: capability.toJwt()
  });
};
