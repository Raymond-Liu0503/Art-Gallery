const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    accountType: String,
    liked: Array,
    reviews: Array,
    notifications: Array,
    following: Array,
    followers: Array,
    artworks: Array,
    joinedWorkshops: Array,
    createdWorkshops: Array,
});

module.exports = mongoose.model('User', userSchema, 'Users');
