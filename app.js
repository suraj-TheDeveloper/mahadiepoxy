const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const indexRouter = require("./src/router/billing.router");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public/")));

app.set("view engine", "ejs");
app.set('views', path.join( __dirname ,'src/view'));

app.use("/", indexRouter);

module.exports = app;