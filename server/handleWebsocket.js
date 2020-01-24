const globals = require("./globals");
const websocketEvents = require("../websocketEvents");

module.exports = function handleWebsocket(socket) {
  globals.socket = socket;

  socket.on(websocketEvents.requestChangeHandleCall, setCallOption);
};

const setCallOption = ({ value }) => {
  globals.handleCall = globals.handleCallOptions[value];
  globals.io.emit(websocketEvents.applyChangeHandleCall, { value });
};

module.exports.setCallOption = setCallOption;
