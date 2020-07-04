const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const facebookStrategy = require('passport-facebook').Strategy
const jwt = require('jsonwebtoken')
expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(expressSession)

const secret = process.env.secretKey
const port = process.env.PORT || 3000

//root route
app.get('/', (req, res) => {
    console.log("In the root of the application")
})

//Invalid credentials / denied access
app.get('auth/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/profile',(req, res) => {
    res.send(`Welcome mr ${req.session.user.displayName}!`)
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
    cb(null, user.id);
});
  
passport.deserializeUser(function(obj, cb) {
    console.log({obj}, "in deser")
    cb(null, obj);
});

//Handle Facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}))

//Oauth callback 
app.get('/auth/facebook/redirect', passport.authenticate('facebook', {scope: ['email']}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/profile')
})

app.listen(port, () => {
    console.log("App started at", port)
})