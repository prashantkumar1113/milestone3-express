require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const app = express();
const logger = require("morgan");

// MIDDLEWARE
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(logger("dev"));

// Mongo Database Connection
// mongoose.connect(
//     process.env.MONGO_URI,
//     {useNewUrlParser: true, useUnifiedTopology: true},
//     () => {
//         console.log("connected to mongo: ", process.env.MONGO_URI);
//     }
// );

// CONTROLLERS
// app.use("/books", require("./controllers/books_controller"));

// ROUTES
app.get("/", (req, res) => {
    console.log("root url");
    res.send("Hello Word!");
});

// LISTEN
const port = process.env.PORT ? process.env.PORT : 3001;
app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});
