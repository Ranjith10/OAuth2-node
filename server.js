const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const facebookStrategy = require('passport-facebook').Strategy
expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
require('dotenv').config()
const profileRouter = require('./routes/profile')
const authenticationRouter = require('./routes/authentication')

const app = express()

//Fetching the secure info from env file
const secret = process.env.secretKey
const port = process.env.PORT || 3000

//Initialising the middleware
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(expressSession)

//root route
app.get('/', (req, res) => {
    console.log("In the root of the application")
})

//Redirecting to Oauth2.0 Authentication
app.use('/auth', authenticationRouter)

//Redirecting to profile 
app.use('/profile', profileRouter)

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


app.listen(port, () => {
    console.log("App started at", port)
})