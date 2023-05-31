const mongoose = require('../config/db');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new Schema({
    username:{
        type: String,
        //required: true,
        unique: true
    },
    
    password:{
        type: String,
        //required: false
    },
    
    email:{
        type: String,
        //required: true,
        unique: true,
        matches: [/.+@.+\..+/, "Please enter a valid e-mail address"]
    },

    profilePhoto: {
        type: String,
        default: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
    },

    googleID:{
        type: String
    },
    
    userCreated:{
        type: Date,
        default: Date.now
    },
    
    topicsFollowed:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Topic"
    },
    
    topicsCreated:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Topic"
    },
    
    commentsCreated:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Comment"
    },
    
    savedPosts: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Post"
    },
    
    commentsLiked:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Comment"
    },
    
    postsLiked:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Post"
    },
    
    postsDisliked:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Post"
    },
    
    commentsDisliked:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Comment"
    },
    
    postsCreated:{
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "Post"
    }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;

