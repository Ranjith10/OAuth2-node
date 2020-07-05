const express = require('express')
const router = express.Router()
const passport = require('passport')

//Handle Facebook authentication
router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}))

//Oauth callback 
router.get('/facebook/redirect', passport.authenticate('facebook', {scope: ['email']}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/profile')
})

//Invalid credentials / denied access
router.get('/failed', (req, res) => res.send('You Failed to log in!'))

module.exports = router