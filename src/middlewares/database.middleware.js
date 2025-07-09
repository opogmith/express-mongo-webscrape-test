const mongoose = require("mongoose");
const config = require("../config");

const conString = `mongodb+srv://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}/${config.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(conString);

//Connection Events
mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${config.DB_NAME} database.`);
});

mongoose.connection.on("disconnected", () => {
  console.log(`Mongoose disconnected to ${config.DB_NAME} database.`);
});

mongoose.connection.on("reconnected", () => {
  console.log(`Mongoose reconected to ${config.DB_NAME} database.`);
});

mongoose.connection.on("disconnecting", () => {
  console.log(`Mongoose disconnecting to ${config.DB_NAME} database.`);
});

mongoose.connection.on("close", () => {
  console.log(`Mongoose closed connection to ${config.DB_NAME} database.`);
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});
