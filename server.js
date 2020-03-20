const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));

// enables environment variables by
// parsing the .env file and assigning it to process.env
dotenv.config({
  path: "./.env"
});

app.get("/ping", function(req, res) {
  return res.send("pong");
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
