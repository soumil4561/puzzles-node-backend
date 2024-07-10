const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Comment, Post } = require('../models');

const createComment = async (userID, commentBody) => {
    // eslint-disable-next-line no-param-reassign
    commentBody.commentCreatorID = userID;
    const comment = await Comment.create(commentBody);
    // Add comment to post
    const post = await Post.findOne({ _id: commentBody.commentPost });
    post.postComments.push(comment._id);
    await post.save();
    return comment;
}

const likeComment = async (commentID, userID) => {
    const comment = await Comment.findOne({ _id: commentID });
    if (!comment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
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
    if (comment.commentDislikes.includes(userID)) {
        // pull the user from the dislikes array
        await comment.updateOne({ $pull: { commentDislikes: userID } });
    } else {
        // push the user to the dislikes array
        await comment.updateOne({ $push: { commentDislikes: userID } });
    }
}

const deleteComment = async (commentID, userID) => {
    const comment = await Comment.findOne({ _id: commentID });
    if (!comment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
    }
    if (comment.commentCreatorID !== userID) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    // Remove comment from post
    const post = await Post.findOne({ _id: comment.commentPost });
    post.postComments.pull(comment._id);
    await post.save();
    await comment.remove();
}

module.exports = {
    createComment,
    likeComment,
    dislikeComment,
    deleteComment
};
