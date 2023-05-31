//jshint esversion:6
const mongoose = require('mongoose');

const createnewPost = function(postObject) {

    mongoose.connect('mongodb://127.0.0.1:27017/test1');

    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', () => {
    console.log('Database connected');
    });

    const postSchema = new mongoose.Schema({
        name: String,
        description: String,
        creator: {
            id: String,
            name: String
        },
        image: String,
        topic: String,
        date: Date,
        comments: [String]
    });

    const Post = mongoose.model('Post', postSchema);
    const post = new Post({
        name: postObject.name,
        description: postObject.description,
        creator: {
            id: postObject.creator.id,
            name: postObject.creator.name
        },
        image: postObject.image,
        topic: postObject.topic,
        date: postObject.date,
        comments: postObject.comments
    });
    post.save().then(() => {console.log("Successfully Saved")}).catch((err) => {console.log(err)});
}

const getUserPosts = function(topics) {
    mongoose.connect('mongodb://localhost:27017/test1');

    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', () => {
    console.log('Database connected');
    });

    const postSchema = new mongoose.Schema({
        name: String,
        description: String,
        creator: {
            id: String,
            name: String
        },
        image: String,
        topic: String,
        date: Date,
        comments: [String]
    });

    const Post = mongoose.model('Post', postSchema);
    let posts = [];
    for(let i = 0; i < topics.length; i++) {
        Post.find({topic: topics[i].name}, (err, foundPosts) => {
            if(err) {
                console.log(err);
            }
            else {
                posts.push(foundPosts);
            }
        });
    }
    return posts;
}

const getUserPostTest = function(){
    
    let post = [];
    unaryPost = {
        name: "Test Post",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        creator: {
            id: "123",
            name: "Test User"
        },
        image: "https://wallpapercave.com/wp/wp2848189.jpg",
        topic: "Test Topic",
        date: new Date(),
        comments: [{
            name: "Test Comment",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            creator: {
                id: "123",
                name: "Test User"
            },
            date: new Date().toLocaleString()
        }]
    }
    for(let i = 0; i < 5; i++) {
        post.push(unaryPost);
    }
    return post;
}
module.exports = {createnewPost, getUserPosts, getUserPostTest};