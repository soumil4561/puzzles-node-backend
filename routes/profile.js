const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Post = require('../models/post.js');
const Comment = require('../models/comment.js');

router.get("/:username", async (req, res) => {
    const user = await User.findOne({username: req.params.username}, 'username userPhoto postsCreated commentsCreated');
    if(user == null) {
        res.send({
            user: null
        })
        return;
    }
    const posts = [];
    const comments = [];
    for(let i = 0; i < user.postsCreated.length; i++) {
        const post = await Post.findOne({_id: user.postsCreated[i]},'postTitle postContent postCreated postTopic postImageFile likes dislikes postTopicID');
        posts.push(post);
    }
    for(let i = 0; i < user.commentsCreated.length; i++) {
        const comment = await Comment.findOne({_id: user.commentsCreated[i]},'commentContent commentCreated commentPost commentPostTitle commentPostTopic');
        comments.push(comment);
    }
    // for(let i = 0; i < comments.length; i++) {
    //     const post = await Post.findOne({_id: comments[i].commentPost}, 'postTitle postTopic');
    //     comments[i].commentPostTitle = post.postTitle;
    //     comments[i].commentPostTopic = post.postTopic;
    // }
    res.send({user: user, posts: posts});
});

module.exports = router;