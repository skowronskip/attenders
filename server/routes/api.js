const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/attenders');
mongoose.connect('mongodb://attendersuser:attenders1@ds255260.mlab.com:55260/attenders');
mongoose.Promise = global.Promise;
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const promise = require('promise');
const mail = require('./activate');
const rand = require("random-key");
const hostname = 'localhost:3000';

addUser = function (content) {
  return new promise(function(res, rej){
    User.findOne({indexNumber: content.indexNumber}, function(err,obj){
      if(err) throw err;
      if(obj){
          if(obj.indexNumber){
              res({message: "This index number is already registered."});

          }
      }
      else{
        content.password = bcrypt.hashSync(content.password, salt);
        content.activationToken = rand.generate(24);
        if(content.indexNumber){
            content.role = 'STUDENT';
            content.mail = content.indexNumber + '@edu.p.lodz.pl';
        }
        else {
            content.role = 'LECTURER';
            content.mail = content.firstName + '.' + content.lastName + '@edu.p.lodz.pl';
            content.mail = content.mail.toLowerCase();
            content.mail = content.mail.replace(/ą/g, "a");
            content.mail = content.mail.replace(/ę/g, "e");
            content.mail = content.mail.replace(/ć/g, "c");
            content.mail = content.mail.replace(/ń/g, "n");
            content.mail = content.mail.replace(/ł/g, "l");
            content.mail = content.mail.replace(/ó/g, "o");
            content.mail = content.mail.replace(/ż/g, "z");
            content.mail = content.mail.replace(/ź/g, "z");
            content.mail = content.mail.replace(/ś/g, "s");
        }
        User.create(content).then(function(user){
          res(user);
        });
      }
    });
  });
};

findUser = function (content) {
  return new promise(function (res, rej) {
      if(content.login){
          User.findOne({indexNumber: content.login}, function(err,obj){
              if(err) throw err;
              if(obj) {
                  bcrypt.compare(content.password, obj.password, function (err, resp) {
                      if(err) throw err;
                      if(resp) {
                          if(obj.active === true && obj.resetPass === false){
                              res(obj);
                          }
                          else if(obj.active === false) {
                              res({message: "Active your account first."});
                          }
                          else if(obj.resetPass === true){
                              res({message: "End your process of reseting password first."});
                          }
                      }
                      else {
                          res({message: "Your password is incorrect."});
                      }
                  });
              }
              else {
                  res({message: "There is no user with this index number."});
              }
          });
      }
      else {
          User.findOne({firstName: content.firstName, lastName: content.lastName}, function(err,obj){
              if(err) throw err;
              if(obj) {
                  bcrypt.compare(content.password, obj.password, function (err, resp) {
                      if(err) throw err;
                      if(resp) {
                          if(obj.active === true && obj.resetPass === false){
                              res(obj);
                          }
                          else if(obj.active === false) {
                              res({message: "Active your account first."});
                          }
                          else if(obj.resetPass === true){
                              res({message: "End your process of reseting password first."});
                          }
                      }
                      else {
                          res({message: "Your password is incorrect."});
                      }
                  });
              }
              else {
                  res({message: "There is no user with this index number."});
              }
          });
      }

  });
};

router.post('/login', function(req, resp){
  session = req.session;
  //if(!session.uniqueID){
    findUser(req.body).then(function (response) {
      if(response.message){
        resp.status(409).send(response.message);
        //resp.end(JSON.stringify(response.message));
      }
      else {
        session.uniqueID = req.body.login;
        resp.end(JSON.stringify(response));
      }
    });
});

router.post('/logout', function (req, resp) {
  req.session.destroy();
});

router.post('/register', function(req, resp){
  addUser(req.body).then(function(newUser){
    if(newUser.message){
        resp.status(409).send(newUser.message);
    }
    else if(newUser.role === 'STUDENT'){
        mail.sendMail({
            from: 'ntife17@gmail.com',
            to: newUser.indexNumber + '@edu.p.lodz.pl',
            subject: 'Active your account [Attenders]',
            text: 'Click in the link in order to active your account: http://' + hostname + '/activate/' + newUser.activationToken
        }, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        resp.end(JSON.stringify(newUser));
    }
    else {
        mail.sendMail({
            from: 'ntife17@gmail.com',
            to: newUser.firstName + '.' + newUser.lastName + '@edu.p.lodz.pl',
            subject: 'Active your account [Attenders]',
            text: 'Click in the link in order to active your account: http://' + hostname + '/activate/' + newUser.activationToken
        }, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        resp.end(JSON.stringify(newUser));
    }
  });
});

router.post('/forgotPass', function (req, resp) {
    const token = rand.generate(24);
    User.findOne({indexNumber: req.body.indexNumber}, function(err,user){
        if(err) throw err;
        if(user) {
            if(!user.active){
                resp.status(409).end("Account is not active");
            }
            else if(!user.resetPass){
                User.updateOne({ mail: req.body.mail},{ $set: {resetPass: true, resetToken: token}}, function (err, obj) {
                    if(err) throw err;
                        mail.sendMail({
                            from: 'ntife17@gmail.com',
                            to: req.body.indexNumber + '@edu.p.lodz.pl',
                            subject: 'Reset password [Attenders]',
                            text: 'Click the link in order to reset your password: http://' + hostname + '/resetPass/' + token
                        }, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        resp.end();
                    });
            }
            else {
                resp.status(409).end("End your last process of reseting password.");
            }
        }
        else {
            resp.status(409).end("There is no user with this index number.");
        }
    });
});

router.post('/findUser', function (req, resp) {
    User.findOne({_id: req.body._id}, function (err, obj) {
        if(err) throw err;
        if(obj){
            resp.end(JSON.stringify(obj));
        }
    });
});

router.get('/activate/:token', function(req, resp){
    User.updateOne({activationToken: req.params.token},{ $set: {active: true, activationToken: ''}}, function (err, obj) {
        if(err) throw err;
        if(obj.n === 1) {
            resp.cookie('accActivated', true);
            resp.redirect('/login');
        }
        else {
            resp.cookie('wrongAccToken', true);
            resp.redirect('/');
        }
    });
});

router.get('/resetPass/:token', function(req, resp){
    User.findOne({resetToken: req.params.token}, function (err, obj) {
        if(err) throw err;
        if(obj){
            resp.cookie('resetPassToken', req.params.token);
            resp.redirect('/reset');
        }
        else {
            resp.cookie('wrongResetToken', false);
            resp.redirect('/');
        }
    });
});

router.post('/resetPass', function (req, resp) {
    const newPassword = bcrypt.hashSync(req.body.password, salt);
    User.updateOne({resetToken: req.body.token},{ $set: {resetPass: false, resetToken: '', password: newPassword}}, function (err, obj) {
        if(err) throw err;
        if(obj.n === 1) {
            resp.end();
        }
        else {
            resp.status(409).end('Incorrect reset token.');
        }
    });
});
module.exports = router;
