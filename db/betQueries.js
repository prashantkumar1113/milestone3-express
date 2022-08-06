const DB_URI = process.env.DATABASE_URL;
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

const getUncompletedBets = async () => {
    return (
        await client.query("SELECT * FROM bets WHERE bet_is_completed=false")
    ).rows;
};

const addGameWinner = async (game_winner, game_id) => {
    return await client.query(
        "UPDATE games SET game_winner=$1, game_is_completed=true WHERE game_id=$2",
        [game_winner, game_id]
    );
};

const markBetsAsCompleted = async (bet_outcome, bet_id) => {
    return await client.query(
        "UPDATE bets SET bet_is_completed=true, bet_success=$1 WHERE bet_id=$2",
        [bet_outcome, bet_id]
    );
};

const alreadyBet = async (user_id, game_id) => {
    const result = await client.query(
        "SELECT * FROM bets WHERE user_id=$1 AND game_id=$2",
        [user_id, game_id]
    );
    return result.rows.length > 0;
};

const getUserBets = async (userId) => {
    return await client.query(
        "SELECT * FROM bets FULL OUTER JOIN games ON bets.game_id = games.game_id WHERE user_id=$1",
        [userId]
    );
};

module.exports = {
    addBet,
    getUncompletedBets,
    markBetsAsCompleted,
    alreadyBet,
    getUserBets,
};
