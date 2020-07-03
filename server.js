const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const facebookStrategy = require('passport-facebook').Strategy
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(passport.initialize())

const secret = process.env.secretKey
const port = process.env.PORT || 3000
//root route
app.get('/', (req, res) => {
    console.log("In the root of the application")
})

const isLoggedIn = (req, res, next) => {
    let authHeader = req.header.cookie
    if(!authHeader) return res.status(401).send({message: 'You are not authorized for this resource'})

    // let token = authHeader.split(' ')[1]
    jwt.verify(authHeader, secret, (err, user) => {
        if(err) return res.status(403)
        console.log({user})
        req.user = user
        next()
    })
}

app.get('auth/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn ,(req, res) => {
    let a = req.headers
    console.dir(a)

    res.send(`Welcome mr ${req}!`)
})

passport.use(new facebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/redirect",
        profileFields: ['id', 'displayName', 'email', 'picture']
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log("FACEBOOK BASED OAUTH VALIDATION GETTING CALLED")
        return cb(null, profile);
    })
);

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

//Handle Facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}))

app.get('/auth/facebook/redirect', passport.authenticate('facebook', {scope: 'email'}), (req, res) => {
    
    res.send(`Welcome Mr.${req.user.displayName}`)
    // res.redirect('/good')
})

app.listen(port, () => {
    console.log("App started at", port)
})