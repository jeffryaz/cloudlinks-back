const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs");
const Router = require("./routes/router");
require("dotenv").config();

const app = express();
const logFile = fs.createWriteStream("./log/log-request.log", { flags: "a" });
app.use(
  logger(
    ':remote-addr HTTP/:http-version [:date[iso]] ":method :url" :status :res[content-length] Byte - :response-time ms',
    { stream: logFile }
  )
);
app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.get("/", function (req, res) {
  res.send("Server Berjalan. Dilarang Mengakses Tanpa Izin");
});
Router.init(app);

const port = process.env.PORT || 3739;
app.listen(port, () => {
  console.log(
    `Service NodeJs ExpressJs ORM KnexJs with Postgresql is running on port ${port}`
  );
});
module.exports = app;
