const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
require('dotenv').config()
const profileRouter = require('./routes/profile')
const authenticationRouter = require('./routes/authentication')
const passportConfig = require('./config/passportConfig')

//Setting up Express APP
const app = express()
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

app.listen(port, () => {
    console.log("App started at", port)
})