const express = require('express');
const router = express.Router();
const Post = require('../models/post.js');
const User = require('../models/user.js');
const Topic = require('../models/topic.js');
const Comment = require('../models/comment.js');
const {getUserFollowedTopics} = require('../controllers/home.js');
const {createPost, likePost, dislikePost, savePost, getUserPostInfo, deletePost} = require('../controllers/post.js');
const {handleImages} = require('../controllers/images.js');

router.post("/createPost", async(req, res) => {
    const data = JSON.parse(await handleImages(req));
    if(req.isAuthenticated()) {
        const post = new Post({
            postTitle: data.postTitle,
            postContent: data.postContent,
            postCreatorID: req.user.id,
            postCreated: Date.now(),
            postTopic: data.postTopic,
            postTopicID: data.postTopicID,
            postImageFile: data.postImageFile,
            likes: 0,
            dislikes: 0,
            comments: []
        });
        if(req.user.username != null) {
            post.postCreatorName = req.user.username;
        }
        const savedpost = await createPost(post);
        await Topic.updateOne({_id: data.postTopicID}, {$push: {topicPosts: savedpost._id}});
        await User.updateOne({_id: req.user.id}, {$push: {postsCreated: savedpost._id}});
        res.send({redirect: '/posts/'+savedpost._id, postID: savedpost._id});
    }
    else {
        res.redirect('/auth/login');
    }
});

router.patch("/:postID/uploadPostImage", async (req, res) => {
    const image = await handleImages(req);
    const postID = req.params.postID;
    await Post.updateOne({_id: postID}, {postImageFile: image});
    res.send("Image uploaded");
    
    }
);

router.get("/:postID", async (req, res) => {
    const postID = req.params.postID;
    const post = await Post.findOne({_id: postID});
    var comments = [];
    for(var i = 0; i < post.comments.length; i++){
        const comment = await Comment.findOne({_id: post.comments[i]});
        comments.push(comment);
    }
    res.send({post: post, comments: comments});
});

router.post("/:postID/function", async (req, res) => {
    const postID = req.body.postID;
    const type = req.body.type;
    if(req.isAuthenticated()){
        if(type == "like"){
            res.send(await likePost(postID, req.user.id));
        }
        else if(type == "dislike"){
            res.send(await dislikePost(postID, req.user.id));
        }
        else if(type == "save"){
            res.send(await savePost(postID, req.user.id));
        }
    }
});

router.get("/:postID/user", async (req, res) => {
    if(req.isAuthenticated()){
        const postID = req.body.postID;
        const userID = req.user.id;
        res.send(await getUserPostInfo(postID, userID));
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
        
    }
    else {
        res.redirect('/auth/login');
}});

module.exports = router;