const db = require('../config/db');
const Schema = db.Schema;

const commentSchema = new db.Schema({
    commentContent: {
        type: String,
        required: true
    },
    commentCreatorID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    commentCreated: {
        type: Date,
        default: Date.now
    },

    commentCreatorName: {
        type: String
    },

    commentLikes: {
        type: Number,
        default: 0
    },

    commentDislikes: {
        type: Number,
        default: 0
    },

    commentReplies: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Comment"
    },

    commentParent: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },

    commentPost: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
});

const Comment = db.model('Comment', commentSchema);

module.exports = Comment;