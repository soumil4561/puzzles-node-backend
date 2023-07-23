const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const Topic = require('../models/topic');
const {addComment, likeComment, dislikeComment, deleteComment} = require('../controllers/comment');

router.post("/createComment", async (req, res) => {
    if(req.isAuthenticated()) {
        const comment = new Comment({
            commentContent: req.body.commentContent,
            commentCreatorID: req.user.id,
            commentCreated: Date.now(),
            commentCreatorName: req.user.username,
            commentLikes: 0,
            commentDislikes: 0,
            commentReplies: [],
            commentParent: null,
            commentPost: req.body.commentPost
        });
        res.send(await addComment(comment, req.body.commentPost, req.user.id));
    }
});

router.post("/comment", async(req, res) => {
    if(req.isAuthenticated()) {
        if (req.body.type == "like") return (await likeComment(req.body.commentID, req.user.id));
        else if (req.body.type == "dislike") return (await dislikeComment(req.body.commentID, req.user.id));
    }
    else {
        res.redirect('/auth/login');
    }
});

router.delete("/deleteComment", (req, res) => {
    if(req.isAuthenticated()) {
        deleteComment(req.body.commentID, req.body.commentPost);
        res.redirect('/post/'+req.body.commentPost);
    }
    else {
        res.redirect('/auth/login');
    }
});

router.patch("/replyComment", (req, res) => {
    if(req.isAuthenticated()) {
        const comment = new Comment({
            commentContent: req.body.commentContent,
            commentCreatorID: req.user.id,
            commentCreated: Date.now(),
            commentCreatorName: req.user.username,
            commentLikes: 0,
            commentDislikes: 0,
            commentReplies: [],
            commentParent: req.body.commentParent,
            commentPost: req.body.commentPost
        });
        addComment(comment, req.body.commentPost, req.user.id);
        res.redirect('/post/'+req.body.commentPost);
    }
    else {
        res.redirect('/auth/login');
    }
});

router.get("/searchTopic/:topicName", async (req, res) => {
    const topicName = req.params.topicName;
    const topicList = await Topic.find({topicName : {$regex: topicName, $options: 'i'}},
    "topicName topicFollwers.length")
    .limit(5)
    .sort({topicFollowers: -1});
    res.send(topicList);
});

router.get("/getTopicList", async (req, res) => {
    try{
        const topics = await Topic.find({}, "topicName topicCreated topicFollowers.length topicPhoto");
        res.send({success: true, topics: topics});
    }
    catch(error){
        console.log(error);
        res.send({success: false, error: error});
    }
}); 

router.post("/test", async (req, res) => {
    
});





module.exports = router;