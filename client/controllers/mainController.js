app.controller('mainCtrl', function($rootScope, $scope, $http, Notification, $cookies, moment){
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