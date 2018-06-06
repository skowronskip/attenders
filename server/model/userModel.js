const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Login is required']
    },
    lastName: {
        type: String,
        required: [true, 'Login is required']
    },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  indexNumber: {
    type: String
  },
  active: {
    type: Boolean,
    default: false
  },
  activationToken: {
    type: String
  },
    resetToken: {
        type: String
    },
    resetPass: {
        type: Boolean,
        default: false
    },
    creationDate: {
    type: Date
    },
    role: {
        type: String
    }
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
