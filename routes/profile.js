const express = require('express')
const router = express.Router()

// In this route you can see that if the user is logged in u can acess his info in: req.user
router.get('/',(req, res) => {
    res.send(`Welcome mr ${req.session.user.displayName}!`)
})

module.exports = router