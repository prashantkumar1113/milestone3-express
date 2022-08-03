const DB_URI = process.env.DB_URI;
const {Pool} = require("pg");
const client = new Pool({
    connectionString: DB_URI,
    ssl: {
        rejectUnauthorized: false,
    },
});

const DEFAULT_USER_BANKROLL = 1000;

const queryWithError = async (text, params) => {
    let error = null;
    await client.query(text, params).catch((e) => (error = e));
    return error ?? true;
};

const userExists = async (email, sub) => {
    // Check to see if a user exists.
    return (
        (await client.query(
            "SELECT user_id FROM users WHERE user_email=$1 OR user_id=$2",
            [email, sub]
        ).rows?.length) > 0
    );
};

const getUserBalance = async (sub) => {
    if (!sub) return -1;
    // If the user doesn't exist, it will return -1. We should make sure a user can't go into the neg on their balance
    return (
        (
            await client.query(
                "SELECT user_bankroll FROM users WHERE user_id=$1",
                [sub]
            )
        ).rows?.[0]?.user_bankroll ?? -1
    );
};

const createUser = async (userId, picture, nickname, email) => {
    return await queryWithError(
        "INSERT INTO users(user_id, user_picture, user_nickname, user_email, user_bankroll) VALUES($1, $2, $3, $4, $5)",
        [userId, picture, nickname, email.toLowerCase(), DEFAULT_USER_BANKROLL]
    );
};

const addUserFunds = async (userId, amount) => {
    return await queryWithError(
        "UPDATE users SET user_bankroll=user_bankroll+$1 WHERE user_id=$2",
        [amount, userId]
    );
};

const removeUserFunds = async (userId, amount) => {
    return await addUserFunds(userId, -amount);
};

const getUserBets = async (userId) => {
    return await client.query(
        "SELECT * FROM bets FULL OUTER JOIN games ON bets.game_id = games.game_id WHERE user_id=$1",
        [userId]
    );
};

module.exports = {
    userExists,
    createUser,
    getUserBalance,
    addUserFunds,
    removeUserFunds,
    getUserBets,
};
