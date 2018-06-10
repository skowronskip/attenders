const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LectureSchema = new Schema({
    topic: {
        type: String,
        required: [true, 'Topic is required']
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'subjects'
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    startHour: {
        type: Date,
        required: [true, 'Start Hour is required']
    },
    endHour: {
        type: Date,
        required: [true, 'End Hour is required']
    },
    lecturer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    key: {
        type: String
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    pin: {
        type: Number
    },
    checked: {
        type: Boolean,
        default: false
    }
});

const Lecture = mongoose.model('lectures', LectureSchema);

module.exports = Lecture;
