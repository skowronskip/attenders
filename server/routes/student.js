const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/attenders');
mongoose.Promise = global.Promise;
const User = require('../model/userModel');
const Lecture = require('../model/lectureModel');
const Attendance = require('../model/attendanceModel');

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

router.post('/checkAttendance', function (req, resp) {
    Lecture.findOne({$and: [{isOpen: true}, {pin: req.body.pin}]}, function (err, obj) {
        if (err) throw err;
        if(obj){
            var attentance = {};
            attentance.lecture = obj._id;
            attentance.student = req.body.id;
            attentance.creationDate = req.body.moment;
            attentance.rate = req.body.rate;
            Attendance.findOne({$and: [{lecture: attentance.lecture, student: attentance.student}]}, function (err, obj) {
                if (err) throw err;
                if(obj) {
                    resp.status(409).end("You have already checked in for this lecture");
                }
                else {
                    Attendance.create(attentance).then(function (response) {
                        resp.end(JSON.stringify(response));
                    });
                }
            });
        }
        else {
            resp.status(409).end("Wrong PIN. Try again!");
        }
    });
});

router.put('/rateAttendance', function (req, resp) {
    Attendance.findOne({_id: req.body.id}, function (err, obj) {
        if (err) throw err;
        if(obj) {
            Attendance.updateOne({_id: req.body.id}, {$set: {rate: req.body.rate}}, function (err, obj) {
                if (err) throw err;
                resp.end();
            });
        }
        else {
            resp.status(409).end("Some error occured.");
        }
    });
});

module.exports = router;
