const router = require("express").Router();
const db = require("../db/index");

router.post("/new", async (req, res) => {
    try {
        const {bet_team, bet_amount, user_id, game_id} = req.body;
        const current_time = Math.floor(new Date().getTime() / 1000);
        const game_start_time = await db.getGameStart(game_id);
        const game_has_started = game_start_time < current_time;
        const user_bankroll = await db.getUserBalance(user_id);
        const user_can_bet = bet_amount <= user_bankroll;

        if (game_has_started) await db.markAsStarted(game_id);

        if (!game_has_started && user_can_bet) {
            await db.addBet(bet_team, bet_amount, user_id, game_id);
            await db.removeUserFunds(user_id, bet_amount);
        }

        //TO-DO: Change error responses
        if (!user_can_bet) {
            res.status(403).json({
                message: "Get more money you filthy peasant",
            });
        } else if (game_has_started) {
            res.status(403).json({
                message: "This game already started slowpoke",
            });
        } else {
            res.status(201).json({
                message: "Added bet",
            });
        }
    } catch (error) {
        res.status(403).json({
            message: "Failed to add bet",
        });
    }
});

module.exports = router;
