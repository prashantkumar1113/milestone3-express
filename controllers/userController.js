const router = require('express').Router();

router.post('/newuser', async (req, res) => {
    // Check in user db if this user exists
    // Add it if not
    console.log(req.body);

    // we have to return something here back to the browser for them to redirect
    res.status(200).json({coolMessage: "newuser"});
});

module.exports = router;