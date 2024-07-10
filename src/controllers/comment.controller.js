const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');

const createComment = catchAsync(async (req, res) => {
    const comment = await commentService.createComment(req.user.id, req.body);
    res.status(httpStatus.CREATED).send(comment);
    }
);

const likeComment = catchAsync(async (req, res) => {
    await commentService.likeComment(req.params.commentID, req.user.id);
    res.status(httpStatus.OK).send();
    }
);

const dislikeComment = catchAsync(async (req, res) => {
    await commentService.dislikeComment(req.params.commentID, req.user.id);
    res.status(httpStatus.OK).send();
    }
);

const deleteComment = catchAsync(async (req, res) => {
    await commentService.deleteComment(req.params.commentID);
    res.status(httpStatus.OK).send();
    }
);

module.exports = {
    createComment,
    likeComment,
    dislikeComment,
    deleteComment
};