require("dotenv").config();
const axios = require("axios");

const router = require("express").Router();
const db = require("../db/index");
const apiKey = process.env.API_KEY;

const regions = "us";
const markets = "h2h";
const oddsFormat = "decimal"; // decimal | american
const dateFormat = "unix"; // iso | unix

//get upcoming games from API

// const upcomingGames = axios
//   .get(`https://api.the-odds-api.com/v4/sports/baseball_mlb/odds`, {
//     params: {
//       apiKey,
//       regions,
//       markets,
//       oddsFormat,
//       dateFormat,
//     },
//   })
//   .then((response) => {
//     // response.data.data contains a list of live and
//     //   upcoming events and odds for different bookmakers.
//     // Events are ordered by start time (live events are first)
//     console.log(JSON.stringify(response.data));

//     // Check your usage
//     console.log("Remaining requests", response.headers["x-requests-remaining"]);
//     console.log("Used requests", response.headers["x-requests-used"]);
//   })
//   .catch((error) => {
//     console.log("Error status", error.response.status);
//     console.log(error.response.data);
//   });

//get game ids that exist in the database currently, will use to avoid post requests that duplicate ids
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT game_id FROM games;");
    const response = res.json(rows);
    console.log(response);
  } catch (error) {
    console.error(error.message);
  }
});

//post games to database
router.post("/upcominggames", async (req, res) => {});

console.log(
  "The time you are looking for is ",
  (Math.floor(new Date().getTime() / 1000) - 1659219086) / (60 * 60)
);
