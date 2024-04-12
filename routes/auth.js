const express = require('express');
const router = express.Router();

const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user');

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
        User.findOrCreate({ googleID: profile.id, email: profile._json.email }, function (err, result) {
            if(err){
                console.log(err);
            }
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
                res.send({ success: true, message: 'Registration successful', userID: req.user.id, redirect: '/register/setup' })
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
                res.send({
                    success: true,
                    message: 'Authentication successful',
                    redirect: '/home'
                })
            });
        }
    });
});

router.delete('/logout', (req, res) => {
    req.logout((err) => {
        if(err){
            console.log(err);
            res.send({
                success: false,
                message: 'Logout failed',
                error: err.message
            })
        }
        else{
            req.session.destroy((err) => {
                if(err){
                    console.log(err);
                    res.send({
                        success: false,
                        message: 'Logout failed',
                        error: err.message
                    })
                } 
                else{
                    res.send({
                        success: true,
                        message: 'Logout successful',
                        redirect: '/auth/login'
                    })
                }
            });
        }
    });
});

router.post('/register/setup', async (req, res) => {
    const UserID = req.user.id;
    await User.updateOne({ _id: UserID }, { username: req.body.username, email: req.user.email });
    res.redirect('/home');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

router.get('/google/home',
    passport.authenticate('google', 
    { failureRedirect: 'auth/login',
    successRedirect: process.env.CLIENT_URL }),
    function (req, res) {
        const userID = req.user.id;
        const data = {
            success: true,
            message: 'Authentication successful',
            user: {
                userID: userID,
                email: req.user.email
            },
        }
        if (req.user.username === undefined) {
            data.redirect = '/register/setup';
            res.send(data);
        }
        else {
            data.redirect = '/home';
            res.send(data);
        }
    });

router.get('/login/success', async (req, res) => {
    if(req.isAuthenticated()){
        const userID = req.user.id;
        const userData = await User.findOne({ _id: userID },'profilePhoto');
        if(req.user.username === undefined){
            res.status(200).json({
                success: true,
                message: 'Authentication successful',
                user: {
                    userID: userID,
                    profilePhoto: userData.profilePhoto
                },
                redirect: '/register/setup'
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: 'Authentication successful',
                user: {
                    userID: userID,
                    username: req.user.username,
                    profilePhoto: userData.profilePhoto
                },
                redirect: '/home'
            })
        }
    }
    else{
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: 'User not logged in'
        })
    }
});


module.exports = router;