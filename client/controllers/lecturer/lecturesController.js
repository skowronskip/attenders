app.controller('lecturesCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location, subjectsService) {
    if($rootScope.loggedUser.role !== 'LECTURER') {
        $location.path('/');
    }
    $scope.myDate = new Date();
    $scope.currentDate = new Date();
    $scope.isOpen = false;
    $scope.form = {};
    $scope.formError = false;
    $scope.addingLecture = false;
    subjectsService.getAllSubjectsForCurrentLecturer().then(function (response) {
        $scope.mySubjects = response;

        $scope.addLecture = function (valid) {
            if (!valid) {
                $scope.formError = true;
            }
            else {
                var timeStart = new moment($scope.form.startHour);
                var timeEnd = moment($scope.form.startHour).add($scope.form.duration, 'minutes');
                console.log($scope.form);
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
                    lecture.startHour = moment(lecture.startHour).format('LT');
                    lecture.endHour = moment(lecture.endHour).format('LT');
                });
            });
        };
        $scope.loadMyLectures();
    });
});