app.controller('mainCtrl', function($rootScope, $scope, $http, Notification, $cookies, subjectsService, $sessionStorage){
    if($sessionStorage.get('courseInfoModal')) {
        subjectsService.getAllSubjects().then(function (response) {
            $scope.departments = response.departments;
            $scope.courses = response.courses;
            $scope.form = {};
            $scope.formError = false;

            $('#courseInfoModal').modal({
                keyboard: false,
                backdrop: 'static'
            });

            $scope.updateCourses = function() {
                var tempCourses = [];
                angular.forEach($scope.courses, function (value) {
                    if(value.departmentCode === $scope.form.currentDepartment.code){
                        tempCourses.push(value);
                    }
                });
                $scope.currentCourses = tempCourses;
            };

            $scope.updateInfo = function (valid) {
                if(!valid) {
                    $scope.formError = true;
                }
                $http.put('/student/updateUser', {"id": $sessionStorage.get('auth'), "course": $scope.form.course, "semester": $scope.form.semester}).then(function (response) {
                    $('#courseInfoModal').modal('hide');
                    $rootScope.loadUser();
                    Notification.success({message: 'Your info has been updated', delay: 5000});
                    $sessionStorage.remove('courseInfoModal');
                }).catch(function (err) {
                    Notification.error({message: err.data, delay: 5000});
                });
            }
        });
    }

    $scope.wrongActivateToken = function() {
        const cookie = $cookies.get('wrongAccToken');
        if(cookie) {
            $cookies.remove('wrongAccToken');
            Notification.error({message: 'Incorrect activation token', delay: 5000});
        }
    };
    $scope.wrongResetToken = function() {
        const cookie = $cookies.get('wrongResetToken');
        if(cookie) {
            $cookies.remove('wrongResetToken');
            Notification.error({message: 'Incorrect link reseting password', delay: 5000});
        }
    };

    $scope.wrongActivateToken();
    $scope.wrongResetToken();

});