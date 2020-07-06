const passport = require('passport')
const facebookStrategy = require('passport-facebook').Strategy

//Fetching the secure info from env file
const secret = process.env.secretKey

//Configuring passport facebook strategy 
passport.use(new facebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/facebook/redirect",
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
    cb(null, obj);
});