const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/attenders');
mongoose.Promise = global.Promise;
const promise = require('promise');
const mail = require('./activate');
const rand = require("random-key");
const hostname = 'localhost:3000';
const departments = require('../enums/departmentsEnum');
const courses = require('../enums/coursesEnum');
const Subject = require('../model/subjectModel');

router.get('/allSubjects', function (req, resp) {
    const response = {};
    response.departments = departments;
    response.courses = courses;
    resp.end(JSON.stringify(response));
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
module.exports = router;
