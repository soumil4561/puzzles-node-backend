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

const getPosts = async function (topicFollowed) {
    try{
        let posts = [];
        let counter1 = 0;
        let counter2 = topicFollowed.length - 1;
        while(posts.length < 10){
            if(counter1 > counter2){
                break;
            }
            const post1 = await Post.find({postTopic: topicFollowed[counter1].topicName}, 'postTitle postCreatorID postTopic postContent postCreated').sort({postCreated: -1}).limit(10-posts.length);
            const post2 = await Post.find({postTopic: topicFollowed[counter2].topicName}, 'postTitle postCreatorID postTopic postContent postCreated').sort({postCreated: -1}).limit(10-posts.length);
            posts = posts.concat(post1);
            posts = posts.concat(post2);
            counter1++;
            counter2--;
        }
        return posts;
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {getUserFollowedTopics, getPosts};