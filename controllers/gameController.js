const axios = require("axios");

const router = require("express").Router();
const db = require("../db/index");
const apiKey = process.env.API_KEY;

const regions = "us";
const markets = "h2h";
const oddsFormat = "decimal"; // decimal | american
const dateFormat = "unix"; // iso | unix

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
        let gameIds = (await db.checkGames()).map((game) => game.game_id);

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
        res.status(200).json({message: `Added games to db`});
    } catch (error) {
        console.log(error);
        res.status(404).json({message: "Error posting games"});
    }
});

router.get("/upcoming", async (req, res) => {
    // const games = await db.getUpcomingGames();
    // console.log("Game", games);
    // res.json(games);
    const {rows} = await db.query("SELECT * FROM games");
    res.json(rows);
});

// console.log(
//   (Math.floor(new Date().getTime() / 1000) - 1659219086) / (60 * 60)
// );

module.exports = router;
