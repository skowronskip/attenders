const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/attenders');
mongoose.connect('mongodb://attendersuser:attenders1@ds255260.mlab.com:55260/attenders');
mongoose.Promise = global.Promise;
const departments = require('../enums/departmentsEnum');
const courses = require('../enums/coursesEnum');
const Subject = require('../model/subjectModel');
const Lecture = require('../model/lectureModel');
const Attendance = require('../model/attendanceModel');
const User = require('../model/userModel');
const rand = require("random-key");
const sleep = require('system-sleep');

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
            req.body.key = rand.generate(8);
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

router.post('/statisticsLecture', function (req, resp) {
    Lecture.findOne({key: req.body.key}, function (err, obj) {
        if (err) throw err;
        if(obj) {
            if(obj.checked){
                calculateStatistics(obj._id, function (response) {
                   resp.end(JSON.stringify(response));
                });
            }
            else {
                resp.status(409).end("The attendance is not checked for this lecture");
            }

        }
        else {
            resp.status(409).end("There is no such lecture");
        }
    });
});

router.post('/statisticsSubject', function (req, resp) {
    Subject.findOne({key: req.body.key}, function (err, obj) {
       if (err) throw err;
       if(obj) {
           Lecture.find({subject: obj._id}, function (err, lectures) {
               if (err) throw err;
               if(lectures.length !== 0){
                  var checkedLectures = [];
                  for(var i=0;i<lectures.length;i++){
                      if(lectures[i].checked){
                          checkedLectures.push(lectures[i]);
                      }
                  }
                  statisticsForSubject(checkedLectures, function (response) {
                     resp.end(JSON.stringify(calculateStatisticsForSubject(response)));
                  });
               }
               else {
                   resp.status(409).end("The subject hasn't got any lecture yet.");
               }
           });
       }
    });
});

function calculateStatisticsForSubject (array) {
    var response = {};
    response.allPresences = 0;
    response.minPresences = array[0].count;
    response.maxPresences = array[0].count;
    response.rates = [0,0,0,0,0];
    response.numberOfLectures = array.length;
    response.courses = [];
    var courses = [];
    for(var i=0;i<array.length;i++){
        response.allPresences += array[i].count;
        if(array[i].count < response.minPresences) {
            response.minPresences = array[i].count
        }
        if(array[i].count > response.maxPresences) {
            response.maxPresences = array[i].count
        }
        response.rates[0] += array[i].rating.rates[0];
        response.rates[1] += array[i].rating.rates[1];
        response.rates[2] += array[i].rating.rates[2];
        response.rates[3] += array[i].rating.rates[3];
        response.rates[4] += array[i].rating.rates[4];
        courses=array[i].courses;
        for(var j=0;j<courses.length;j++){
            var found = false;
            for(var k=0;k<response.courses.length;k++){
                if(courses[j].course.departmentCode === response.courses[k].course.departmentCode && courses[j].course.name === response.courses[k].course.name && courses[j].semester === response.courses[k].semester) {
                    found = true;
                    response.courses[k].occurences += courses[j].occurences;
                }
            }
            if(!found) {
                response.courses.push(courses[j]);
            }
        }

    }
    return response;
}

function statisticsForSubject (array, callback) {
    var results = [];
    for(var i=0;i<array.length;i++){
        if(array[i].checked){
            calculateStatistics(array[i]._id, function (response) {
                results.push(response);
                if(results.length === array.length) {
                    callback(results);
                }
            });
        }
    }
}

function calculateStatistics(id, callback) {
    var response = {};
  Attendance.find({lecture: id}, function (err, obj) {
      if (err) throw err;
      if(obj) {
          response.count = obj.length;
          response.rating = calculateRate(obj);
          checkCoursesAttended(obj, function (result) {
              response.courses = countCourses(result);
              callback(response);
          });
      }
  });
}

function calculateRate(array) {
    var rating = {};
    rating.rates = [0, 0, 0, 0, 0];
    rating.average = 0;
  for(var i = 0; i < array.length; i++){
      rating.rates[array[i].rate-1]++;
      rating.average += array[i].rate;
  }
  rating.average /= array.length;
  return rating;
}

function checkCoursesAttended(array, callback) {
    var courses = [];
    for(var i = 0; i < array.length; i++){
        User.findOne({_id: array[i].student}, function (err, obj) {
            if (err) throw err;
            if (obj) {
                var value = {};
                value.course = obj.course;
                value.semester = obj.semester;
                courses.push(value);
                if(courses.length === array.length){
                    callback(courses);
                }
            }
        });
    }
}

function countCourses(array) {
    var counted = [];
    for(var i = 0; i<array.length;i++){
        var found = false;
        for(var j=0;j<counted.length;j++){
            if(array[i].course.departmentCode === counted[j].course.departmentCode && array[i].course.name === counted[j].course.name && array[i].semester === counted[j].semester){
                found = true;
                counted[j].occurences++;
            }
        }
        if(!found){
            array[i].occurences = 1;
            counted.push(array[i]);
        }
    }
    return counted;
}


module.exports = router;
