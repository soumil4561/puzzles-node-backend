const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    sessionID:{
        type: String,
        required: true
    },

    userID:{
        type: String,
        required: true
    },

    sessionCreated:{
        type: Date,
        default: Date.now,
        required: true
    }
});

const session = mongoose.model('session', sessionSchema);

module.exports = session;