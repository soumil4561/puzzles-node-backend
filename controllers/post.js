const User = require("../models/user.js");
const Topic = require("../models/topic.js");
const Post = require("../models/post.js");
const { getUserFollowedTopics } = require("./home.js");

const createPost = async (post, userID, topicName) => {
    try{
        const savepost = await post.save();
        await User.updateOne({_id: userID}, {$push: {posts: savepost._id}});
        await Topic.updateOne({topicName: topicName}, {$push: {posts: savepost._id}});
        return savepost;
    }
    catch(err){
        console.log(err);
    }
}

const likePost = async (postID, userID) => {
    //check if user has already liked the post
    if(await User.findOne({_id: userID, postsLiked: postID}) != null) {
        return {likes: await Post.findOne({_id: postID}, "likes")};
    }
    //check if user has already disliked the post
    if(await User.findOne({_id: userID, postsDisliked: postID}) != null) {
        await User.updateOne({_id: userID}, {$pull: {postsDisliked: postID}});
        const current = await Post.findOne({_id: postID}, "dislikes");
        var updatedDislikes = current.dislikes - 1;
        const body = {dislikes: updatedDislikes};
        await Post.updateOne({_id: postID}, body);
    }
    await User.updateOne({_id: userID}, {$push: {postsLiked: postID}});
    const current = await Post.findOne({_id: postID}, "likes dislikes");
    var updatedLikes = current.likes + 1;
    const body = {likes: updatedLikes};
    await Post.updateOne({_id: postID}, body);
    return body;
}

const dislikePost = async (postID, userID) => {
    //check if user has already disliked the post
    if(await User.findOne({_id: userID, postsDisliked: postID}) != null) {
        return {dislikes: await Post.findOne({_id: postID}, "dislikes")};
    }
    //check if user has already liked the post
    if(await User.findOne({_id: userID, postsLiked: postID}) != null) {
        await User.updateOne({_id: userID}, {$pull: {postsLiked: postID}});
        const currentLikes = await Post.findOne({_id: postID}, "likes");
        var updatedLIkes = currentLikes.likes - 1;
        const body = {likes: updatedLIkes};
        await Post.updateOne({_id: postID}, body);
    }
    await User.updateOne({_id: userID}, {$push: {postsDisliked: postID}});
    const current = await Post.findOne({_id: postID}, "likes dislikes");
    var updatedDislikes = current.dislikes + 1;
    const body = {likes: current.likes, dislikes: updatedDislikes};
    Post.updateOne({_id: postID}, body);
    return body;
}

const savePost = async (postID, userID) => {
    if(await User.findOne({_id: userID, savedPosts: postID}) != null) {
        return false;
    }
    await User.updateOne({_id: userID}, {$push: {savedPosts: postID}})
    .then(() => {return true}). catch(() => {return false});
    
}

const unsavePost = async (postID, userID) => {
    //check if user has already saved the post
    if(await User.findOne({_id: userID, savedPosts: postID}) == null) {
        return false;
    }
    await User.updateOne({_id: userID}, {$pull: {savedPosts: postID}})
    .then(() => {return true}). catch(() => {return false});
}

const deletePost = async (post) => {
    try{
        await Topic.updateOne({topicName: post.postTopic}, {$pull: {topicPosts: post._id}});
        await User.updateOne({_id: post.postCreatorID}, {$pull: {postsCreated: post._id}});
        await Post.findOneAndRemove({_id: post._id}).then((result) => {
            return true;
        }).catch((err) =>{
            console.log(err);
            return false;
        });
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {createPost, likePost, dislikePost, savePost, unsavePost, deletePost};