app.controller('profileCtrl', function($rootScope, $scope, $http, Notification, $cookies, subjectsService, $sessionStorage){
    subjectsService.getAllSubjects().then(function (response) {
        $scope.departments = response.departments;
        $scope.courses = response.courses;
        angular.forEach($scope.departments, function (value) {
            if(value.code = $rootScope.loggedUser.course.departmentCode){
                $scope.myDepartmentName = value.name;
            }
        });
    });
});