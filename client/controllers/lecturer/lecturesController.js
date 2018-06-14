app.controller('lecturesCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location, subjectsService, $interval, $route) {
    if($rootScope.loggedUser.role !== 'LECTURER') {
        $location.path('/');
    }
    $scope.myDate = new Date();
    $scope.currentDate = new Date();
    $scope.isOpen = false;
    $scope.form = {};
    $scope.formError = false;
    $scope.addingLecture = false;
    $scope.currentModalLecture = undefined;
    subjectsService.getAllSubjectsForCurrentLecturer().then(function (response) {
        $scope.mySubjects = response;

        $scope.addLecture = function (valid) {
            if (!valid) {
                $scope.formError = true;
            }
            else {
                var timeStart = new moment($scope.form.startHour);
                var timeEnd = moment($scope.form.startHour).add($scope.form.duration, 'minutes');
               $http.post('/lecturer/addLecture', {"topic": $scope.form.name, "subject": $scope.form.subject._id, "date": $scope.form.myDate, "startHour": timeStart, "endHour": timeEnd, "lecturer": $rootScope.loggedUser._id}).then(function (response) {
                    Notification.success({message: "The new lecture has been added", delay: 5000});
                    $scope.addingLecture = false;
                    $scope.form = {};
                    $scope.formError = false;
                    $scope.loadMyLectures();
                }).catch(function (err) {
                    Notification.error({message: err.data, delay: 5000});
                });
            }
        };

        $scope.loadMyLectures = function () {
            subjectsService.getAllLecturesForCurrentLecturer().then(function (response) {
                $scope.myLectures = response;
                angular.forEach($scope.myLectures, function (lecture) {
                    angular.forEach($scope.mySubjects, function (subject) {
                        if(lecture.subject === subject._id){
                            lecture.subjectName = subject.name;
                        }
                    });
                    lecture.date = moment(lecture.date).format('L');
                    lecture.startHour = moment(lecture.startHour).format('HH:mm');
                    lecture.endHour = moment(lecture.endHour).format('HH:mm');

                    if(!lecture.checked && lecture.date === moment().format('L') && lecture.startHour <= moment().format('HH:mm a') && lecture.endHour >= moment().format('HH:mm')){
                        lecture.canBeOpen = true;
                    }
                });
            });
        };
        $scope.loadMyLectures();

        $scope.openRegistration = function() {
            $scope.isChecking = true;
            $scope.checked = false;
            $scope.randomPin = Math.floor(Math.random()*899999)+100000;
            $scope.counter = 10;
            $scope.openCounter = 60;
            $http.put('/lecturer/openLecture', {"id": $scope.currentModalLecture._id, "pin": $scope.randomPin});
            $scope.randomPinGenerate = function () {
                $scope.randomPin = Math.floor(Math.random()*899999)+100000;
                $http.put('/lecturer/openLecture', {"id": $scope.currentModalLecture._id, "pin": $scope.randomPin});
                $scope.counter = 11;
            };
            $scope.countdown = function () {
                $scope.counter--;
            };

            $scope.openCountdown = function () {
                $scope.openCounter--;
                if($scope.openCounter === 0) {
                    $interval.cancel(pinInterval);
                    $interval.cancel(countdownInterval);
                    $interval.cancel(openInterval);
                    $http.put('/lecturer/closeLecture', {"id": $scope.currentModalLecture._id});
                    $scope.isChecking = false;
                    $scope.checked = true;
                }
            };

            var pinInterval = $interval($scope.randomPinGenerate, 10000);
            var countdownInterval = $interval($scope.countdown, 1000);
            var openInterval = $interval($scope.openCountdown, 1000);
        };

        $scope.modalLecture = function (lecture) {
            $scope.currentModalLecture = lecture;
            $('#openLecture').modal({
                keyboard: false,
                backdrop: 'static'
            });
        };

        $scope.hideModal = function () {
            $('#openLecture').modal('hide');
            $route.reload();
        };

        $scope.openStatistics = function (lecture) {
            $rootScope.lectureForStatistics = lecture;
          $location.path('/lecturer/lecture/' + lecture.key);
        };
    });
});