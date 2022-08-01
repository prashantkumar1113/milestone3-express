require("dotenv").config();
const fetch = require("node-fetch");
const router = require("express").Router();

router.post("/load", async (req, res) => {
    // console.log("Loading...");
    // res.send("Loading...");
    const response = await fetch(
        `${process.env.SPORTS_API_URL}/v4/sports/baseball_mlb/odds/?regions=us&markets=h2h&apiKey=${process.env.SPORTS_API_KEY}`
    );
    const data = await response.json();
    // console.log(data);
    res.json(data);
});

module.exports = router;
