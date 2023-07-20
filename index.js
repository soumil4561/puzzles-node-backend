//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const MongoStore = require('connect-mongo');

app.use(cors(
    {
        origin: true,
        credentials: true
    }
));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

const passport = require('passport');
const session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET,
    credentials: true,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_HOST,
        collectionName: 'sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

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

const profileRouter = require('./routes/profile.js');
app.use('/profile', profileRouter);

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