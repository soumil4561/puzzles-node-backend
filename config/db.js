const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_HOST)
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...'));

module.exports = mongoose;
