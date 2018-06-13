const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    course: {
        type: String,
        required: [true, 'Course is required']
    },
    semester: {
        type: Number,
        required: [true, 'Semester is required']
    },
    lecturer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    key: {
        type: String
    }
});

const Subject = mongoose.model('subjects', SubjectSchema);

module.exports = Subject;
