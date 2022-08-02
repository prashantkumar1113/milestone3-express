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
        }

        res.status(201).json({
            message: "Added bet",
        });
    } catch (error) {
        res.status(403).json({
            message: "Failed to add bet",
        });
    }
});

module.exports = router;
