const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Post = require('../models/post.js');

router.get("/", async (req, res) => {
    if(req.isAuthenticated()) {
        const user = await User.findOne({_id: req.user.id},'username email userCreated');
        res.status(200).send({user:user});
    }
    else {
        res.redirect('/login');
    }
});

router.get("/posts", async (req, res) => {
    
    if(req.isAuthenticated()) {
        const type = req.query.type;
        if(type === 'created') {
            const userPosts = await User.findOne({_id: req.user.id},'postsCreated');
            const posts = await Post.find({_id: {$in: userPosts.postsCreated}},'postTitle postCreated postContent postTopic');
            res.status(200).send(posts);
        }
        else if(type === 'liked') {
            const userPosts = await User.findOne({_id: req.user.id},'postsLiked');
            const posts = await Post.find({_id: {$in: userPosts.postsLiked}},'postTitle postCreated postContent postTopic');
            res.status(200).send(posts);
        }

        else if(type === 'saved'){
            const userPosts = await User.findOne({_id: req.user.id},'savedPosts');
            const posts = await Post.find({_id: {$in: userPosts.savedPosts}},'postTitle postCreated postContent postTopic');
            res.status(200).send(posts);
        }

        else {
            res.status(400).send({message:"Invalid type"});
        }
    }
    else {
        res.redirect('/login');
    }
});

module.exports = router;