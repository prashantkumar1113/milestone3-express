const router = require("express").Router();
const db = require("../db/index");

router.post('/newuser', async (req, res) => {
    const {
        email,
        nickname,
        picture,
        sub: userId
    } = req.body;

    // If user already exists, we will return a response without inserting into our db
    if (await db.userExists(userId)) return res.status(200).json({error: 'user already exists'});
    await db.createUser(userId, picture, nickname, email);
    
    // we have to return something here back to the browser for them to redirect
    res.status(201).json({message: "user has been created"});
});

router.get("/balance/:sub", async (req, res) => {
    const userId = req.params.sub;
    const balance = await db.getUserBalance(userId);
    if (!userId || balance === -1) return res.status(404).json({error: 'user does not exist'})
    res.status(200).json({amount: balance});
});

router.get('/balance/add/:sub/:amt', async (req, res) => {
    const
        userId = req.params.sub,
        amount = req.params.amt;
    if (!userId || !amount || amount <= 0) return res.status(404).json({error: 'User/amount null or invalid'});
    const response = await db.addUserFunds(userId, amount);
    res.status(200).send(response);
});

router.get('/balance/sub/:sub/:amt', async (req, res) => {
    const
        userId = req.params.sub,
        amount = req.params.amt;
    if (!userId || !amount || amount <= 0) return res.status(404).json({error: 'User/amount null or invalid'});
    const currentBalance = await db.getUserBalance(userId);
    if (currentBalance - amount < 0) return res.status(404).json({error: 'Insufficient funds'});
    const response = await db.removeUserFunds(userId, amount);
    res.status(200).send(response);
});

module.exports = router;
