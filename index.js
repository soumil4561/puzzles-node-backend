//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose");

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const homeRouter = require('./routes/home.js');
app.use('/', homeRouter);

const authRouter = require('./routes/auth.js');
app.use('/auth', authRouter);

const postRouter = require('./routes/post.js');
app.use('/post', postRouter);

const topicRouter = require('./routes/topic.js');
app.use('/topic', topicRouter);

const utilityRouter = require('./routes/utility.js');
app.use('/utility', utilityRouter);

app.get('*', function(req, res){
    if(req.isAuthenticated()){
        res.status(404).render('404.ejs', {user: req.user});
    } else {
        res.status(404).render('404.ejs', {user: null});
    }
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server started on port 3000');
});