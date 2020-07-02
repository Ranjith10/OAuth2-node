const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const facebookStrategy = require('passport-facebook').Strategy
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(passport.initialize())

const secret = process.env.secretKey
const port = process.env.PORT || 3000
//root route
app.get('/', (req, res) => {
    console.log("In the root of the application")
})

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))


var opts = {}
opts.jwtFromRequest = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};

passport.use(new facebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/facebook-redirect",
        profileFields: ['id', 'displayName', 'email', 'picture']
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile)
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

app.get('/facebook-redirect', passport.authenticate('facebook', {scope: 'email', failureRedirectt: '/failed' }, (req, res) => {
    console.log('Facebook redirection!')
    let user = {
        displayName: req.user.displayName,
        name: req.user._json.name,
        email: req.user._json.email,
        provider: req.user.provider
    }
    console.log({user})
    res.cookie('jwt', token)
    res.redirect('/good')
}))

app.listen(port, () => {
    console.log("App started at", port)
})