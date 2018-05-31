app.controller('resetCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location){
    $scope.password = '';
    $scope.rpassword = '';
    $scope.validatePassword = false;
    $scope.validatePassword2 = false;
    $scope.validateRpassword = false;


    $scope.loadToken = function() {
        $scope.token = $cookies.get('resetPassToken');
    };

    $scope.samePassword = function () {
        return $scope.password !== $scope.rpassword;
    };
    $scope.checkIsReseted = function() {
        const cookie = $cookies.get('resetPassToken');
        if(!cookie) {
            $location.path('/');
        }
    };
    $scope.loadToken();
    $scope.checkIsReseted();

    $scope.submit = function() {
        if(!$scope.samePassword() && !$scope.validatePassword && !$scope.validatePassword2 &&  !$scope.validateRpassword){
            $http.post('/resetPass', {"password": $scope.password, "token": $scope.token}).then(function (response) {
                $location.path('/login');
                $cookies.remove('resetPassToken');
                Notification.success({message: 'Password is set. Now you can use your new password to log in', delay: 5000});
            })
                .catch(function (err) {

                    Notification.error({message: err.data, delay: 5000});
                });
        }
    }
});