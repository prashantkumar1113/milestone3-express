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

const alreadyBet = async(user_id, game_id) => {
    const result = await client.query(
        "SELECT * FROM bets WHERE user_id=$1 AND game_id=$2" ,
        [user_id, game_id]
    );
    console.log(result.rows.length)
    return 1
}

const getUserBets = async (userId) => {
    return await client.query(
        "SELECT * FROM bets FULL OUTER JOIN games ON bets.game_id = games.game_id WHERE user_id=$1",
        [userId]
    );
};

module.exports = {
    addBet,
    alreadyBet,
    getUserBets,
};
