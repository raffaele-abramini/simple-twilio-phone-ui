const express = require("express");
const getToken = require("./controllers/getToken");
const redirectToClient = require("./controllers/redirectToClient");
const globals = require("./globals");
const handleWebsocket = require("./handleWebsocket");

const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

globals.io = io;

io.on("connection", handleWebsocket);
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:1234");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/token", getToken);

app.post("/redirectToClient", (req, res) => {
  res.set("Content-Type", "text/xml");
  res.send(redirectToClient(req.body.To, req.body.CallSid));
});

http.listen(1337, "127.0.0.1");

console.log("Twilio Client app server running at http://127.0.0.1:1337/");
