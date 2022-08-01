const router = require("express").Router();
const db = require("../db/index");

router.post("/newuser", async (req, res) => {
    const {email, nickname, picture, sub: userId} = req.body;

    // Check if the user already exists
    const checkUser = async () => {
        const response = await db.query(
            "select * from users where user_email=$1 or user_id=$2",
            [email.toLowerCase(), userId]
        );
        return response?.rows.length > 0;
    };

    // If user already exists, we will return a response without inserting into our db
    if (await checkUser())
        return res.status(200).json({error: "user already exists"});

    // Create a new user
    const createUser = async () => {
        await db.query(
            "insert into users(user_id, user_picture, user_nickname, user_email, user_bankroll) values($1, $2, $3, $4, $5)",
            [userId, picture, nickname, email.toLowerCase(), 1000]
        );
    };

    createUser()
        // .then(res => console.log(res))
        .catch((e) => console.log(e));

    // we have to return something here back to the browser for them to redirect
    res.status(201).json({message: "user has been created"});
});

router.get("/balance/:sub", async (req, res) => {
    const userId = req.params.sub;
    const getUserBalance = async () =>
        await db.query("select user_bankroll from users where user_id=$1", [
            userId,
        ]);

    return !userId || (response = await getUserBalance())?.rows.length < 1
        ? res.status(404).json({error: "user does not exist"})
        : res.status(200).json({amount: response?.rows[0].user_bankroll});
});

module.exports = router;
