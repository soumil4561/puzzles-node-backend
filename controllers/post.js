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
        //reduce the number of likes by 1
        await User.updateOne({_id: userID}, {$pull: {postsLiked: postID}});
        const current = await Post.findOne({_id: postID}, "likes");
        var updatedLikes = current.likes - 1;
        const body = {likes: updatedLikes};
        await Post.updateOne({_id: postID}, body);
        return body;
    }
    //check if user has already disliked the post
    if(await User.findOne({_id: userID, postsDisliked: postID}) != null) {
        console.log("disliked");
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
        //reduce the number of dislikes by 1
        await User.updateOne({_id: userID}, {$pull: {postsDisliked: postID}});
        const current = await Post.findOne({_id: postID}, "dislikes");
        var updatedDislikes = current.dislikes - 1;
        const body = {dislikes: updatedDislikes};
        await Post.updateOne({_id: postID}, body);
        return body;
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
    //check if user has already saved the post
    if(await User.findOne({_id: userID, savedPosts: postID}) != null) {
        try{
            await User.updateOne({_id: userID}, {$pull: {savedPosts: postID}});
            return { saved: false, message: "Post unsaved"};
        }
        catch(err){
            console.log(err);
            return { saved: true, message: "Post could not be unsaved"};
        }
    }
    try{
        await User.updateOne({_id: userID}, {$push: {savedPosts: postID}});
        return { saved: true, message: "Post saved"};
    }
    catch(err){
        console.log(err);
        return { saved: false, message: "Post could not be saved"};
    }
}

const getUserPostInfo = async (postID, userID) => {
    const body = { liked: false, disliked: false, saved: false };
    try{
        if(await User.findOne({_id: userID, postsDisliked: postID}) != null) {
            body.disliked = true;
        }
    }
    catch(err){
        console.log(err);
    }
    return body;
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


module.exports = {createPost, likePost, dislikePost, savePost, getUserPostInfo, deletePost};