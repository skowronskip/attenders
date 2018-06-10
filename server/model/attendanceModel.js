const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    creationDate: {
        type: Date
    },
    lecture: {
        type: Schema.Types.ObjectId,
        ref: 'lectures'
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'students'
    },
    rate: {
        type: Number
    }
});

const Attendance = mongoose.model('attendances', AttendanceSchema);

module.exports = Attendance;
