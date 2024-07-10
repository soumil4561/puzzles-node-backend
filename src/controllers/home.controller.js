const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { homeService } = require('../services');

const getHome = catchAsync(async (req, res) => {
    const result = await homeService.getHome(req.user.id);
    res.status(httpStatus.OK).send(result);
});

const getMorePosts = catchAsync(async (req, res) => {
    const result = await homeService.getMorePosts(req.user.id, req.body.page, req.body.limit);
    res.status(httpStatus.OK).send(result);
});

const getAbout = catchAsync(async (req, res) => {
    const result = await homeService.getAbout(req.user.id);
    res.status(httpStatus.OK).send(result);
});

module.exports = {
    getHome,
    getMorePosts,
    getAbout,
};