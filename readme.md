# Simple Twilio phone ui

A local server with a browser interface to receive calls.


## Setup

###1.
Clone project and install dependencies with `npm i`
###2.
Start a tunnel from the project folder by running `npm run tunnel`
###3.
Create a Twml app from [Twilio console](https://www.twilio.com/console/voice/twiml/apps).  
Under the **voice** tab, add your ngrok tunnel address followed by `/redirectToClient`

![Set voice endpoint](https://github.com/raffaele-abramini/simple-twilio-phone-ui/blob/master/docs/images/twml-app.png "Set TWML app")
 
 Once done and saved, copy this newly created application SID.
 
###4.
Buy or go to an existing Twilio phone number from your [console](https://www.twilio.com/console/phone-numbers/incoming). Under Voice/Fax, set:
- **Accept incoming** to `voice call`
- **Configure with** to `TwML App`
- **Twiml app** to your newly created app.

And save!

![Configure phone number](https://github.com/raffaele-abramini/simple-twilio-phone-ui/blob/master/docs/images/phone-number.png "Configure number")


###5.
In the repository, clone `secret.dummy.json` as a `secret.json` file and fill it with your credentials.
```
{
  "accountSid": "", // your account sid (found at https://www.twilio.com/console)
  "authToken": "", // your auth token (found at https://www.twilio.com/console)
  "appSid":"", // your new Twml app SID
  "phoneNumber": "" // your new phone number
}
```


###6.

Finally, just run `npm start`. You can navigate to http://localhost:1234/ to see your UI.


## Limitations and troubleshooting

If you don't have a premium account of ngrok, you'll have to update your TWML app endpoint every time you run `npm run tunnel`.