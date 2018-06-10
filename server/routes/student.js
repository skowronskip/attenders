const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/attenders');
mongoose.Promise = global.Promise;
const User = require('../model/userModel');

router.put('/updateUser', function (req, resp) {
    User.findOne({_id: req.body.id}, function (err, student) {
        if (err) throw err;
        if(student){
            if(student.role !== 'STUDENT') {
                resp.status(409).end("You are not the student!");
            }
            else {
                User.updateOne({_id: req.body.id}, {$set: {course: req.body.course, semester: req.body.semester}}, function (err, obj) {
                    if (err) throw err;
                    resp.end();
                });
            }
        }
        else {
            resp.status(409).end("User not found");
        }
    });
});

module.exports = router;
