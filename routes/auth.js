const express = require('express');
const router = express.Router();

const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user');
const Session = require('../models/session');

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/home",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    async function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleID: profile.id, profilePhoto: profile._json.picture, email: profile._json.email }, function (err, result) {
            return cb(err, result);
        });
    }));

router.post('/register', (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email
    });

    User.register(user, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            if (err.code === 11000) {
                res.send({ success: false, message: 'Registration failed', error: 'User already exists' });
            }
            res.send({ success: false, message: 'Registration failed', error: err.message });
        }
        else {
            passport.authenticate('local')(req, res, () => {
                const sessionID = req.sessionID;
                const userID = req.user.id;
                const sessionCreated = Date.now();
                const sessionData = {
                    sessionID: sessionID,
                    userID: userID,
                    sessionCreated: sessionCreated
                }
                Session.create(sessionData);
                res.send({ success: true, message: 'Registration successful', user: userID, sessionID: sessionID, redirect: '/auth/setup' })
            });
        }
    });
});

router.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, {session:true} , (err) => {
        if (err) {
            console.log(err);
            res.send({
                success: false,
                message: 'Authentication failed',
                error: err.message
            })
        }
        else {
            passport.authenticate('local')(req, res, async () => {
                //first store session id in session collection
                const sessionID = req.sessionID;
                const userID = req.user.id;
                const sessionCreated = Date.now();
                const sessionData = {
                    sessionID: sessionID,
                    userID: userID,
                    sessionCreated: sessionCreated
                }
                await Session.create(sessionData);
                res.send({
                    success: true,
                    message: 'Authentication successful',
                    user: userID,
                    redirect: '/home'
                })
            });
        }
    });
});

router.post('/logout',  async (req, res) => {
    const sessionID = req.body.sessionID;
    await Session.deleteOne({ sessionID: sessionID });
    req.logout(async function (err) {
        if (err) {
            console.log(err);
        }
        else {           
            res.send({
                success: true,
                message: 'Logout successful',
                redirect: '/auth/login'
            })
        }
    });
});

router.get('/setup', (req, res) => {
    res.render('setup.ejs', { user: req.user });
});

router.post('/setup', async (req, res) => {
    const UserID = req.user.id;
    await User.updateOne({ _id: UserID }, { username: req.body.username, email: req.user.email });
    res.redirect('/home');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

router.get('/google/home',
    passport.authenticate('google', { failureRedirect: 'auth/login' }),
    function (req, res) {
        const userID = req.user.id;
        if (req.user.username === undefined) {
            res.redirect('/auth/setup');
        }
        else {
            res.redirect('/home');
        }
    });

router.get("/checksession", async (req, res) => {
    const sessionID = req.sessionID;
    const session = await Session.findOne({ sessionID: sessionID });
    if(req.isAuthenticated() || session){
        res.send({ success: true, message: 'Session exists', user: req.user.id });
    }
    else{
        res.send({ success: false, message: 'Session does not exist' });
    }
});

module.exports = router;