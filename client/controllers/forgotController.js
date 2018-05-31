app.controller('forgotCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location){
    $scope.inumber = '';
    $scope.validateInumber = false;

    $scope.submit = function() {
        if(!$scope.validateInumber){
            $http.post('/forgotPass', {"indexNumber": $scope.inumber}).then(function (response) {
                Notification.success({message: 'Link which allows you to reset your password is sent to your University email', delay: 5000});
                $location.path('/');
            })
                .catch(function (err) {

                    Notification.error({message: err.data, delay: 5000});
                });
        }
    }
});