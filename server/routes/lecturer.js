const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/attenders');
mongoose.Promise = global.Promise;
const departments = require('../enums/departmentsEnum');
const courses = require('../enums/coursesEnum');
const Subject = require('../model/subjectModel');
const Lecture = require('../model/lectureModel');
const rand = require("random-key");

router.get('/allSubjects', function (req, resp) {
    const response = {};
    response.departments = departments;
    response.courses = courses;
    resp.end(JSON.stringify(response));
});

router.put('/openLecture', function (req,resp) {
    Lecture.findOne({_id: req.body.id}, function (err, obj) {
        if (err) throw err;
        if(obj){
            Lecture.updateOne({_id: req.body.id}, {$set: {isOpen: true, pin: req.body.pin}}, function (err, obj) {
                if (err) throw err;
                resp.end();
            });
        }
        else {
            resp.status(409).end("Lecture not found");
        }
    });
});

router.put('/closeLecture', function (req,resp) {
    Lecture.findOne({_id: req.body.id}, function (err, obj) {
        if (err) throw err;
        if(obj){
            Lecture.updateOne({_id: req.body.id}, {$set: {isOpen: false, checked: true}}, function (err, obj) {
                if (err) throw err;
                resp.end();
            });
        }
        else {
            resp.status(409).end("Lecture not found");
        }
    });
});

router.post('/lecturersSubjects', function (req, resp) {
    Subject.find({lecturer: req.body.lecturer}, function (err, subjects) {
        resp.end(JSON.stringify(subjects));
    });
});

router.post('/addSubject', function (req, resp) {
    Subject.findOne({$and: [{name: req.body.name}, {department: req.body.department}, {course: req.body.course}, {semester: req.body.semester}, {lecturer: req.body.lecturer}]}, function (err, obj) {
        if (err) throw err;
        if(obj){
            resp.status(409).end("Such a subject was already created");
        }
        else {
            Subject.create(req.body).then(function(subject){
                resp.end(JSON.stringify(subject));
            });
        }
    })
});

router.post('/addLecture', function (req, resp) {
    Lecture.findOne({$and: [{topic: req.body.topic}, {subject: req.body.subject}, {date: req.body.date}, {startHour: req.body.startHour}, {endHour: req.body.endHour}, {lecturer: req.body.lecturer}]}, function (err, obj) {
        if (err) throw err;
        if(obj){
            resp.status(409).end("Such a lecture was already created");
        }
        else {
            req.body.key = rand.generate(8);
            Lecture.create(req.body).then(function(lecture){
                resp.end(JSON.stringify(lecture));
            });
        }
    })
});

router.post('/lecturersLectures', function (req, resp) {
    Lecture.find({lecturer: req.body.lecturer}, function (err, lectures) {
        resp.end(JSON.stringify(lectures));
    });
});
module.exports = router;
