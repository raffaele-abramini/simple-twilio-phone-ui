const http = require('http');
const express = require('express');
const twilio = require('./api/twilio');
const getToken = require('./controllers/getToken');
const voiceResponse = require('./controllers/voice');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:1234"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/token', getToken);

app.get('/call', (req, res) => {
  twilio.makeCall();
  res.send("calling");
});

app.get('/drop', (req, res) => {
  twilio.dropCall();
  res.send("dropping");
});

app.post('/voice', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(voiceResponse(req.body.To));
});

http.createServer(app).listen(1337, '127.0.0.1');
console.log('Twilio Client app server running at http://127.0.0.1:1337/');