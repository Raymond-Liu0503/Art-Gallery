const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workshopSchema = new Schema({
    Title: String,
    Artist: String,
    Description: String,
    enrollments: Array,
});

const Workshop = mongoose.model('Workshop', workshopSchema, 'Workshops');

module.exports = Workshop;