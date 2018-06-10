app.controller('checkinCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location) {
    $scope.givenPin = undefined;
    $scope.rate = 0;
    $scope.isRating = false;

    $scope.checkIn = function () {
        $http.post('/student/checkAttendance', {"id" : $rootScope.loggedUser._id, "pin": $scope.givenPin, "rate": $scope.rate, "moment": moment()}).then(function (response) {
            $scope.attendanceId = response.data._id;
            $scope.isRating = true;
        }).catch(function (err) {
            Notification.error({message: err.data, delay: 5000});
        });
    };

    $scope.rateAttendance = function () {
        $http.put('/student/rateAttendance', {"id" : $scope.attendanceId, "rate": $scope.rate}).then(function (response) {
            Notification.success({message: 'Your attendance and rate for the lecture are saved!', delay: 5000});
            $location.path('/');
        }).catch(function (err) {
            Notification.error({message: err.data, delay: 5000});
        });
    }
});