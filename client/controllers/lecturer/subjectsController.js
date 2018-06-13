app.controller('subjectsCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location, subjectsService) {
    if($rootScope.loggedUser.role !== 'LECTURER') {
        $location.path('/');
    }

    $scope.addingSubject = false;
    subjectsService.getAllSubjects().then(function (response) {
        $scope.departments = response.departments;
        $scope.courses = response.courses;
        $scope.currentCourses = [];
        //$scope.currentDepartment = undefined;
        $scope.form = {};
        $scope.formError = false;

        $scope.updateCourses = function() {
            var tempCourses = [];
            angular.forEach($scope.courses, function (value) {
                if(value.departmentCode === $scope.form.currentDepartment.code){
                    tempCourses.push(value);
                }
            });
            $scope.currentCourses = tempCourses;
        };

        $scope.addSubject = function (valid) {
            if(!valid){
                $scope.formError = true;
            }
            else {
                $http.post('/lecturer/addSubject', {"name": $scope.form.name, "department": $scope.form.currentDepartment.name, "course": $scope.form.course.name, "semester": $scope.form.semester, "lecturer": $rootScope.loggedUser._id}).then(function (response) {
                    Notification.success({message: "The new subject has been added", delay: 5000});
                    $scope.addingSubject = false;
                    $scope.loadMySubjects();
                    $scope.form = {};
                    $scope.formError = false;
                }).catch(function (err) {
                    Notification.error({message: err.data, delay: 5000});
                });
            }
        };
    });
    $scope.loadMySubjects = function () {
        subjectsService.getAllSubjectsForCurrentLecturer().then(function (response) {
            $scope.mySubjects = response;
        });
    };
    $scope.loadMySubjects();

    $scope.openStatistics = function (subject) {
        $rootScope.subjectForStatistics = subject;
        $location.path('/lecturer/subject/' + subject.key);
    };
});