const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

const addComment = async (comment, postID, userID) =>{
    console.log("addComment");
    try{
        console.log(comment);
        const savedcomment = await comment.save();
        console.log(savedcomment);
        await Post.updateOne({_id: postID}, {$push: {comments: savedcomment._id}});
        await User.updateOne({_id: userID}, {$push: {commentsCreated: savedcomment._id}});
        return savedcomment;
    }
    catch(err){
        console.log(err);
    }
}

const likeComment = async (commentID, userID) =>{
    // Check if user has already liked the comment
    if(await User.findOne({_id: userID, commentsLiked: commentID}) != null){
        return Comment.findOne({_id: commentID},"likes, dislikes");
    }
    // Check if user has already disliked the comment
    if(await User.findOne({_id: userID, commentsDisliked: commentID}) != null){
        User.updateOne({_id: userID}, {$pull: {commentsDisliked: commentID}});
        const current = await Comment.findOne({_id: commentID}, "dislikes");
        var updatedDislikes = current.dislikes - 1;
        const body = {dislikes: updatedDislikes};
        Comment.updateOne({_id: commentID}, body);
    }
    User.updateOne({_id: userID}, {$push: {commentsLiked: commentID}});
    const current = await Comment.findOne({_id: commentID}, "likes dislikes");
    var updatedLikes = current.likes + 1;
    const body = {likes: updatedLikes};
    Comment.updateOne({_id: commentID}, body);
    return body;
}

const dislikeComment = async (commentID, userID) =>{
    // Check if user has already disliked the comment
    if(await User.findOne({_id: userID, commentsDisliked: commentID}) != null){
        return Comment.findOne({_id: commentID},"likes, dislikes");
    }
    // Check if user has already liked the comment
    if(await User.findOne({_id: userID, commentsLiked: commentID}) != null){
        User.updateOne({_id: userID}, {$pull: {commentsLiked: commentID}});
        const current = await Comment.findOne({_id: commentID}, "likes");
        var updatedLikes = current.likes - 1;
        const body = {likes: updatedLikes};
        Comment.updateOne({_id: commentID}, body);
    }
    User.updateOne({_id: userID}, {$push: {commentsDisliked: commentID}});
    const current = await Comment.findOne({_id: commentID}, "likes dislikes");
    var updatedDislikes = current.dislikes + 1;
    const body = {dislikes: updatedDislikes};
    Comment.updateOne({_id: commentID}, body);
}

const deleteComment = async (commentID, postID, userID) =>{
    // Delete comment from post
    Post.updateOne({_id: postID}, {$pull: {comments: commentID}});
    // Delete comment from user
    User.updateOne({_id: userID}, {$pull: {commentsCreated: commentID}});
    // Delete comment from database
    const comment = Comment.findOne({_id: commentID});
    comment.findOneAndRemove({_id: commentID})
    .then((result) => {
        console.log("Comment deleted");
    });
}

module.exports = {addComment, likeComment, dislikeComment, deleteComment};