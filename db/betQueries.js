const DB_URI = process.env.DB_URI;
const {Pool} = require("pg");
const client = new Pool({
    connectionString: DB_URI,
    ssl: {
        rejectUnauthorized: false,
    },
});

const addBet = async (bet_team, bet_amount, user_id, game_id) => {
    await client.query(
        "INSERT INTO bets(bet_team, bet_amount, user_id, game_id) values ($1, $2, $3, $4) ",
        [bet_team, bet_amount, user_id, game_id]
    );
};

module.exports = {addBet};
