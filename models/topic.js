const mongoose = require("../config/db");
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    topicName: {
        type: String,
        required: true,
        unique: true
    },

    topicDescription: {
        type: String,
        required: true
    },

    topicPhoto: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2023/03/16/16/38/woods-7857082_1280.jpg"
    },

    topicBanner: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2016/08/03/09/04/universe-1566161_1280.jpg"
    },

    topicCreator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    topicCreated: {
        type: Date,
        default: Date.now
    },

    topicFollowers: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "User"
    },

    topicPosts: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Post"
    }
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
