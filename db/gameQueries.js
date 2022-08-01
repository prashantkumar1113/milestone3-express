const DB_URI = process.env.DB_URI;
const { Pool } = require("pg");
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
    "INSERT INTO games(game_id, home_team, away_team, home_moneyline, away_moneyline, start_time) values ($1, $2, $3, $4, $5, $6) ",
    [game_id, home_team, away_team, home_moneyline, away_moneyline, start_time]
  );
};

// const checkGames = async () => {
//   const existingGames = await client.query("SELECT game_id FROM games").rows;
//   return existingGames;
// };

module.exports = {
  addGames,
  checkGames: async () =>
    (await client.query("SELECT game_id FROM games")).rows,
};
