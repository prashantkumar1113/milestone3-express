const DB_URI = process.env.DATABASE_URL;
const {Pool} = require("pg");
const client = new Pool({
    connectionString: DB_URI,
    ssl: {
        rejectUnauthorized: false,
    },
});

const addGames = async (
    game_id,
    home_team,
    away_team,
    home_moneyline,
    away_moneyline,
    start_time
) => {
    await client.query(
        "INSERT INTO games(game_id, game_home_team, game_away_team, game_home_moneyline, game_away_moneyline, game_start_time) values ($1, $2, $3, $4, $5, $6) ",
        [
            game_id,
            home_team,
            away_team,
            home_moneyline,
            away_moneyline,
            start_time,
        ]
    );
};

const markAsStarted = async (game_id) => {
    return await client.query(
        "UPDATE games SET game_has_started=true WHERE game_id=$1",
        [game_id]
    );
};

const getGameStart = async (game_id) => {
    return (
        await client.query(
            "SELECT game_start_time FROM games WHERE game_id=$1",
            [game_id]
        )
    ).rows[0].game_start_time;
};

const getUncompletedGames = async () => {
    return (
        await client.query(
            "SELECT game_id FROM games WHERE game_is_completed=false"
        )
    ).rows;
};

const addGameWinner = async (game_winner, game_id) => {
    return await client.query(
        "UPDATE games SET game_winner=$1, game_is_completed=true WHERE game_id=$2",
        [game_winner, game_id]
    );
};

const getYesterdaysGames = async (comparison_time) => {
    return (
        await client.query(
            "SELECT * FROM games WHERE game_start_time>$1 AND game_is_completed=true",
            [comparison_time]
        )
    ).rows;
};

const getUpcomingGames = async (current_time) => {
    return await client.query(
        "SELECT * from games WHERE game_start_time > $1",
        [current_time]
    );
};

module.exports = {
    addGames,
    markAsStarted,
    getGameStart,
    getUncompletedGames,
    getYesterdaysGames,
    addGameWinner,
    getUpcomingGames,
    getGameIds: async () =>
        (await client.query("SELECT game_id FROM games")).rows,
};
