const axios = require("axios");

const router = require("express").Router();
const db = require("../db/index");
const apiKey = process.env.API_KEY;

const regions = "us";
const markets = "h2h";
const oddsFormat = "decimal"; // decimal | american
const dateFormat = "unix"; // iso | unix
const daysFrom = "1";

const current_time = Math.floor(new Date().getTime() / 1000);

//post games to database
router.post("/upcoming", async (req, res) => {
    try {
        let upcomingGames;
        await axios
            .get(`https://api.the-odds-api.com/v4/sports/baseball_mlb/odds`, {
                params: {
                    apiKey,
                    regions,
                    markets,
                    oddsFormat,
                    dateFormat,
                },
            })
            .then((response) => {
                // checking usage
                console.log(
                    "Remaining requests",
                    response.headers["x-requests-remaining"]
                );
                console.log(
                    "Used requests",
                    response.headers["x-requests-used"]
                );
                upcomingGames = response.data;
            })
            .catch((error) => {
                console.log(
                    "Error status",
                    error.response?.status ? error.response.status : error
                );
                console.log(error.response.data);
            });

        //GET EXISTING GAME IDS FROM DB
        let gameIds = (await db.getGameIds()).map((game) => game.game_id);

        const gamesToPost = upcomingGames.filter((game) => {
            return !gameIds.includes(game.id);
        });

        for (let i = 0; i < gamesToPost.length; i++) {
            let {outcomes} = gamesToPost[i].bookmakers[0].markets[0];
            let home_moneyline;
            let away_moneyline;
            let {
                id: game_id,
                home_team,
                away_team,
                commence_time: start_time,
            } = gamesToPost[i];

            const determineHomeMoneyline = () => {
                for (let i = 0; i < 2; i++) {
                    if (outcomes[i].name === home_team) {
                        home_moneyline = outcomes[i].price;
                        away_moneyline = outcomes[Math.abs(i - 1)].price;
                    } else {
                        home_moneyline = outcomes[Math.abs(i - 1)].price;
                        away_moneyline = outcomes[i].price;
                    }
                }
            };
            determineHomeMoneyline();
            await db.addGames(
                game_id,
                home_team,
                away_team,
                home_moneyline,
                away_moneyline,
                start_time
            );
        }
        res.status(201).json({message: `Added games to db`});
    } catch (error) {
        console.log(error);
        res.status(404).json({message: "Error posting games"});
    }
});

//DRY this out
//ALSO this might be more RESTful as a PUT instead of a POST ¯\_(ツ)_/¯
router.put("/results", async (req, res) => {
    try {
        let gamesFromAPI;

        await axios
            .get(`https://api.the-odds-api.com/v4/sports/baseball_mlb/scores`, {
                params: {
                    apiKey,
                    regions,
                    markets,
                    oddsFormat,
                    dateFormat,
                    daysFrom,
                },
            })
            .then((response) => {
                console.log(
                    "Remaining requests",
                    response.headers["x-requests-remaining"]
                );
                console.log(
                    "Used requests",
                    response.headers["x-requests-used"]
                );
                gamesFromAPI = response.data;
            })
            .catch((error) => {
                console.log(
                    "Error status",
                    error.response?.status ? error.response.status : error
                );
                console.log(error.response.data);
            });

        var finishedGames = gamesFromAPI.filter(function (game) {
            return game.completed === true;
        });
        // console.log(finishedGames);

        let gamesToCompare = (await db.getUncompletedGames()).map(
            (game) => game.game_id
        );

        const gamesToMarkComplete = finishedGames.filter((game) => {
            return gamesToCompare.includes(game.id);
        });
        // marking games as complete in the database
        for (let i = 0; i < gamesToMarkComplete.length; i++) {
            let {scores} = gamesToMarkComplete[i];
            // console.log(scores);

            const determineWinner = () => {
                let winner;
                for (let i = 0; i < 2; i++) {
                    if (scores[i].score > scores[Math.abs(i - 1)].score) {
                        winner = scores[i].name;
                    } else {
                        winner = scores[Math.abs(i - 1)].name;
                    }
                }
                return winner;
            };
            let game_winner = determineWinner();
            let {id: game_id} = gamesToMarkComplete[i];
            await db.addGameWinner(game_winner, game_id);
        }

        res.status(200).json({
            message: "Test",
        });
    } catch (error) {
        res.status(404).json({
            message: "Didn't work",
        });
    }
});

router.get("/upcoming", async (req, res) => {
    try {
        const upcomingGames = await db.getUpcomingGames(current_time);
        res.status(200).json(upcomingGames.rows);
    } catch (error) {
        res.status(404).json({
            message: "Data retrieval failed",
        });
    }
});

module.exports = router;
