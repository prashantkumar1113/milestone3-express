const router = require("express").Router();
const db = require("../db/index");

router.post("/new", async (req, res) => {
    try {
        let {bet_team, bet_amount, user_id, game_id} = req.body;
        bet_amount = parseInt(bet_amount);

        const current_time = Math.floor(new Date().getTime() / 1000);
        const game_start_time = await db.getGameStart(game_id);
        const game_has_started = game_start_time < current_time;
        let user_bankroll = parseFloat(await db.getUserBalance(user_id));
        const user_can_bet = bet_amount <= user_bankroll;
        const betted_on_game = await db.alreadyBet(user_id, game_id);

        // if (game_has_started) await db.markAsStarted(game_id);
        // console.log(user_can_bet);
        if (
            !game_has_started &&
            user_can_bet &&
            !betted_on_game &&
            bet_amount > 0
        ) {
            bet_amount = parseInt(bet_amount);
            user_bankroll = parseFloat(user_bankroll.toFixed(2));
            await db.addBet(bet_team, bet_amount, user_id, game_id);
            await db.removeUserFunds(user_id, bet_amount);
        }

        //TO-DO: Change error responses
        if (!user_can_bet) {
            res.status(403).json({
                message: "User funds inadequate",
            });
        } else if (game_has_started) {
            res.status(403).json({
                message: "This game has already begun",
            });
        } else {
            res.status(201).json({
                bankroll: user_bankroll,
                amount: user_bankroll - bet_amount,
            });
        }
    } catch (error) {
        res.status(403).json({
            message: "Failed to add bet",
        });
        console.log(error);
    }
});

router.get("/profile/:sub", async (req, res) => {
    const userId = req.params.sub;
    if (!userId) return res.status(404).json({error: "User invalid"});
    const response = await db.getUserBets(userId);
    res.status(200).send(response.rows);
});

// This route could probably be better
router.get("/profile/:sub/:start/:end/:type", async (req, res) => {
    const userId = req.params.sub;
    const {start, end} = req.params;
    const type = req.params.type ?? "all";
    if (start < 0 || end < 0)
        return res.status(404).json({error: "Start and end values invalid"});
    if (!userId) return res.status(404).json({error: "User invalid"});
    const response = await db.getUserBetsPaginate(userId, start, end, type);
    res.status(200).send(response.rows);
});

module.exports = router;
