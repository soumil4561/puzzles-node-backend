const mongoose = require("../config/db");

const Topic = require('../models/topic.js');
const Post = require('../models/post.js');
const User = require('../models/user.js');

const getUserFollowedTopics  = async function (userId) {
    try{
        const topicFollowed = await User.findById(userId, 'topicsFollowed');
        const topics = await Topic.find({_id: {$in: topicFollowed.topicsFollowed}},'topicName topicPhoto');
        return topics;
    }
    catch(err){
        console.log(err);
    }
}

const getInitialPosts = async function (topicFollowed) {
    try{
        const posts = await Post.find({postTopic: {$in: topicFollowed}}, 'postTitle postCreatorName postTopic postContent postCreated postImageFile').sort({postCreated: -1}).limit(8);
        return posts;
        }
        
    catch(err){
        console.log(err);
    }
}

const getMorePosts = async function (topicFollowed, lastPostIDTime) {
    try{
        const posts = await Post.find({postTopic: {$in: topicFollowed}, postCreated: {$lt: lastPostIDTime}}, 'postTitle postCreatorName postTopic postContent postCreated postImageFile').sort({postCreated: -1}).limit(1);
        console.log(posts);
        return posts;
    }
    catch(err){
        console.log(err);
    }

}

module.exports = {getUserFollowedTopics, getInitialPosts, getMorePosts};