require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const cors = require('cors');

//Connection to db via node postgres
const client = require("./db/index");
client.connect();

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(cors());

// ROUTES
const {
  userController,
} = require('./controllers/')


app.get("/", (req, res) => {
  console.log("root url");
  res.send("Hello Word!");
});

app.use('/user/', userController);

// LISTEN
const port = process.env.PORT ?? 5000;
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

console.log(require("./controllers/index"));
