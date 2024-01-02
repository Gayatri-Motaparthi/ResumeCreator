const express = require("express");
const path = require("path");
const app = express();
const db = require('./database/db');
const bodyParser = require("body-parser");

app.use(express.static("public", { "Content-Type": "application/javascript" }));
app.use(express.static(path.join(__dirname, 'routes')));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const Router = require("./routes/home");
app.use("/", Router);

var http = require('http');
const server = http.createServer(app);

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port http://127.0.0.1:3000`);
});