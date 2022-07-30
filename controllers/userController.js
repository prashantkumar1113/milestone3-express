const router = require('express').Router();
const db = require('../db/index');

router.post('/newuser', async (req, res) => {

    const {
        email,
        nickname,
        picture,
        sub: userId
    } = req.body;

    // Check if the user already exists
    const checkUser = async () => {
        const query = {
            text: 'select * from users where user_email=$1 or user_id=$2',
            values: [email.toLowerCase(), userId]
        }
        const response = await db.query(query.text, query.values);
        return response?.rows.length > 0;
    }

    // If user already exists, we will return a response without inserting into our db
    if (await checkUser()) return res.status(200).json({error: 'user already exists'});

    // Create a new user
    const createUser = async () => {
        const query = {
            text: 'insert into users(user_id, user_picture, user_nickname, user_email, user_bankroll) values($1, $2, $3, $4, $5)',
            values: [userId, picture, nickname, email.toLowerCase(), 1000]
        }
        await db.query(query.text, query.values);
    }

    createUser()
        .then(res => console.log(res))
        .catch(e => console.log(e));

    // we have to return something here back to the browser for them to redirect
    res.status(200).json({message: 'user has been created'});
});

module.exports = router;