const DB_URI = process.env.DB_URI;
const { Pool } = require("pg");
const client = new Pool({
  connectionString: DB_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

const DEFAULT_USER_BANKROLL = 1000;

async function userExists(email, sub) {
    // Check to see if a user exists.
    return (await client.query('select user_id from users where user_email=$1 or user_id=$2', [email, sub])).rows?.length > 0;
}

async function getUserBalance(sub) {
    if (!sub) return -1;
    // If the user doesn't exist, it will return -1. We should make sure a user can't go into the neg on their balance
    return (await client.query('select user_bankroll from users where user_id=$1', [sub])).rows?.[0]?.user_bankroll ?? -1;
}

const createUser = async (userId, picture, nickname, email) => {
    // return error message, or true if successful?
    let error = null;
    await client.query(
        'insert into users(user_id, user_picture, user_nickname, user_email, user_bankroll) values($1, $2, $3, $4, $5)',
        [userId, picture, nickname, email.toLowerCase(), DEFAULT_USER_BANKROLL]
    )
    .catch(insertError => error = insertError);
    return error ?? true;
}

const addUserFunds = async (userId, amount) => {
    let error = null;
    await client.query(
        'update users set user_bankroll=user_bankroll+$1 where user_id=$2',
        [amount, userId]
    )
    .catch(updateError => error = updateError);
    return error ?? true;
}

const removeUserFunds = async (userId, amount) => {
    let error = null;
    await client.query(
        'update users set user_bankroll=user_bankroll-$1 where user_id=$2',
        [amount, userId]
    )
    .catch(updateError => error = updateError);
    return error ?? true;
}

async function getCompletedBets(sub) {
    //todo
    return 0;
}

module.exports = {
    userExists,
    createUser,
    getUserBalance,
    addUserFunds,
    removeUserFunds
}