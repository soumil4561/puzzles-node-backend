const express = require('express');
const router = express.Router();
const Post = require('../models/post.js');
const User = require('../models/user.js');
const Topic = require('../models/topic.js');
const Comment = require('../models/comment.js');
const {getUserFollowedTopics} = require('../controllers/home.js');
const {createPost, likePost, dislikePost, savePost, unsavePost, deletePost} = require('../controllers/post.js');

router.get("/createPost", (req, res) => {
    if(req.isAuthenticated()) {
        const topics = getUserFollowedTopics(req.user.id);
        res.render('createPost.ejs', {topics: topics, user: req.user});
    }  
    else {
        res.redirect('/auth/login');
    }
});

router.post("/createPost", async(req, res) => {
    if(req.isAuthenticated()) {
        const post = new Post({
            postTitle: req.body.postTitle,
            postContent: req.body.postContent,
            postCreatorID: req.user.id,
            postCreated: Date.now(),
            postTopic: req.body.postTopic,
            likes: 0,
            dislikes: 0,
            comments: []
        });
        if(req.body.postImage != null) {
            post.postImage = req.body.postImage;
        }
        if(req.user.username != null) {
            post.postCreatorName = req.user.username;
        }
        const savedpost = await createPost(post);
        console.log(savedpost);
        return savedpost;
    }
    else {
        res.redirect('/auth/login');
    }
});

router.get("/:postID", async (req, res) => {
    const postID = req.params.postID;
    const post = await Post.findOne({_id: postID});
    var comments = [];
    for(var i = 0; i < post.comments.length; i++){
        const comment = await Comment.findOne({_id: post.comments[i]});
        comments.push(comment);
    }
    if(req.isAuthenticated()){
        res.render('post.ejs', {post: post, comments: comments, user: req.user});
    } else {
        res.render('post.ejs', {post: post, comments: comments, user: null});
    }
});

router.post("/:postID/function", async (req, res) => {
    const postID = req.body.postID;
    const type = req.body.type;
    if(req.isAuthenticated()){
        if(type == "like"){
            return likePost(postID, req.user.id);
        }
        else if(type == "dislike"){
            return dislikePost(postID, req.user.id);
        }
        else if(type == "save"){
            return savePost(postID, req.user.id);
        }
        else if(type == "unsave"){
            return unsavePost(postID, req.user.id);
        }
        res.redirect('/post/'+postID);
    }
});

router.delete("/:postID", async (req, res) => {
    if(!req.isAuthenticated()){
        console.log("Not authenticated");
        res.redirect('/auth/login');
    }
    else{
        const postID = req.body.postID;
        const post = await Post.findOne({_id: postID});
        if(req.user.id != post.postCreatorID){
            console.log("Not authorized");
            res.redirect('/post/'+postID);
        }
        else{
            deletePost(post);
            res.json({redirect: '/home'});
        }
    }
});

router.patch("/:postID", async (req, res) => {
    const postID = req.params.postID;
    const post = await Post.findOne({_id: postID});
    if(req.user.id != post.postCreatorID){
        res.redirect('/post/'+postID);
    }
    else{
        const body = req.body;
        Post.updateOne({_id: postID}, body).then((result) => {
            console.log("Post updated");
            res.json({redirect: '/post/'+postID});
        }).catch((err) => console.log(err));
    }
});

router.get("/:postID/edit", async (req, res) => {
    const postID = req.params.postID;
    if (req.isAuthenticated()) {
        const post = await Post.findOne({_id: postID});
        res.render('editPost.ejs', {post: post});
    }
    else {
        res.redirect('/auth/login');
}});

module.exports = router;