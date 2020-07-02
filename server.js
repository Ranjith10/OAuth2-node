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
        callbackURL: "http://localhost:3000/facebookRedirect",
        profileFields: ['id', 'displayName', 'email', 'picture']
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile)
        console.log("FACEBOOK BASED OAUTH VALIDATION GETTING CALLED")
        return cb(null, profile);
    })
);

app.get('/profile', passport.authenticate('jwt', { session: false }) ,(req,res)=>{
    res.send(`THIS IS UR PROFILE MAAANNNN ${req.user.email}`)
})

//Handle Facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}))

app.get('/facebook-redirect', passport.authenticate('facebook', {scope: 'email'}, (req, res) => {
    console.log('Facebook redirection!')
    let user = {
        displayName: req.user.displayName,
        name: req.user._json.name,
        email: req.user._json.email,
        provider: req.user.provider
    }
    console.log({user})
    
    findOrCreate(user)
    let token = jwt.sign({
        data: user,},
        secret,
        {expiresIn : '1h'}
    )
    res.cookie('jwt', token)
    res.redirect('/')
}))

function findOrCreate(user){
    if(CheckUser(user)){  // if user exists then return user
        return user
    }else{
        DATA.push(user) // else create a new user
    }
}
function CheckUser(input){
    console.log(DATA)
    console.log(input)
  
    for (var i in DATA) {
        if(input.email==DATA[i].email && (input.password==DATA[i].password || DATA[i].provider==input.provider))
        {
            console.log('User found in DATA')
            return true
        }
        else
         null
            //console.log('no match')
      }
    return false
}

app.listen(port, () => {
    console.log("App started at", port)
})