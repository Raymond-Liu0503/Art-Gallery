const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artSchema = new Schema({
    Title: String,
    Artist: String,
    Description: String,
    Year: Number,
    Category: String,
    Medium: String,
    Poster: String,
    Likes: Array,
    reviews: Array,
});

const Art = mongoose.model('Art', artSchema, 'Gallery');

module.exports = Art;
