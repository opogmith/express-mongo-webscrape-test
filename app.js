require("./src/middlewares/database.middleware");
const config = require("./src/config");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MorganMiddleware = require("./src/middlewares/morgan.middleware");

const ResponseFormatter = require("./src/middlewares/responseFormatter.middleware");
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(MorganMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(ResponseFormatter);

app.use("/api", routes);

//*General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res._500("Internal Server Error");
});

const port = config.PORT;

app.listen(port, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }

  console.log(`Server is running on port ${port}`);
});
