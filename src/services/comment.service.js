const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Comment, Post } = require('../models');

const createComment = async (userID, commentBody) => {
    const post = await Post.findOne({ _id: commentBody.commentPost });
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    // eslint-disable-next-line no-param-reassign
    commentBody.commentCreatorID = userID;
    const comment = await Comment.create(commentBody);
    // Add comment to post
    post.comments.push(comment._id);
    await post.save();
    return comment;
}

const likeComment = async (commentID, userID) => {
    const comment = await Comment.findOne({ _id: commentID });
    if (!comment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
    }
    if(comment.commentDislikes.includes(userID)){
        await comment.updateOne({ $pull: { commentDislikes: userID } });
    }
    if (comment.commentLikes.includes(userID)) {
        // pull the user from the likes array
        await comment.updateOne({ $pull: { commentLikes: userID } });
    } else {
        // push the user to the likes array
        await comment.updateOne({ $push: { commentLikes: userID } });
    }
}

const dislikeComment = async (commentID, userID) => {
    const comment = await Comment.findOne({ _id: commentID });
    if (!comment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
    }
    if(comment.commentLikes.includes(userID)){
        await comment.updateOne({ $pull: { commentLikes: userID } });
    }
    if (comment.commentDislikes.includes(userID)) {
        // pull the user from the dislikes array
        await comment.updateOne({ $pull: { commentDislikes: userID } });
    } else {
        // push the user to the dislikes array
        await comment.updateOne({ $push: { commentDislikes: userID } });
    }
}

const deleteComment = async (userID, commentID) => {
    const comment = await Comment.findOne({ _id: commentID });
    if (!comment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
    }
    if (!comment.commentCreatorID.equals(userID)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    // Remove comment from post
    await Post.updateOne({ _id: comment.commentPost }, { $pull: { comments: commentID } })
    await comment.remove();
}

module.exports = {
    createComment,
    likeComment,
    dislikeComment,
    deleteComment
};
