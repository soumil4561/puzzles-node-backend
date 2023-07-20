const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

const addComment = async (comment, postID, userID) =>{
    try{
        const savedcomment = await comment.save();
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
        // Reduce like count by 1
        User.updateOne({_id: userID}, {$pull: {commentsLiked: commentID}});
        const current = await Comment.findOne({_id: commentID}, "commentLikes commentDislikes");
        var updatedLikes = current.commentLikes - 1;
        const body = {commentLikes: updatedLikes, commentDislikes: current.commentDislikes};
        Comment.updateOne({_id: commentID}, body);
        return body;
    }
    // Check if user has already disliked the comment
    if(await User.findOne({_id: userID, commentsDisliked: commentID}) != null){
        User.updateOne({_id: userID}, {$pull: {commentsDisliked: commentID}});
        const current = await Comment.findOne({_id: commentID}, "commentDislikes");
        var updatedDislikes = current.commentDislikes - 1;
        const body = {commentDislikes: updatedDislikes};
        Comment.updateOne({_id: commentID}, body);
    }
    await User.updateOne({_id: userID}, {$push: {commentsLiked: commentID}});
    const current = await Comment.findOne({_id: commentID}, "commentLikes commentDislikes");
    var updatedLikes = current.commentLikes + 1;
    const body = {likes: updatedLikes, dislikes: current.commentDislikes};
    await Comment.updateOne({_id: commentID}, body);
    return body;
}

const dislikeComment = async (commentID, userID) =>{
    // Check if user has already disliked the comment
    if(await User.findOne({_id: userID, commentsDisliked: commentID}) != null){
        // Reduce dislike count by 1
        User.updateOne({_id: userID}, {$pull: {commentsDisliked: commentID}});
        const current = await Comment.findOne({_id: commentID}, "likes dislikes");
        var updatedDislikes = current.dislikes - 1;
        const body = {dislikes: updatedDislikes, likes: current.likes};
        Comment.updateOne({_id: commentID}, body);
        return body;
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