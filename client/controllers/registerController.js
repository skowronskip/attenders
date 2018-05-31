app.controller('registerCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location){
    $scope.firstname = '';
    $scope.surname = '';
    $scope.inumber = '';
    $scope.login = '';
    $scope.password = '';
    $scope.rpassword = '';
    $scope.policy = false;
    $scope.validateFirstname = false;
    $scope.validateSurname = false;
    $scope.validatePassword = false;
    $scope.validatePassword2 = false;
    $scope.validateRpassword = false;
    $scope.validateInumber = false;
    $scope.validateInumber2 = false;
    $scope.validateLogin = false;

    $scope.samePassword = function () {
        return $scope.password !== $scope.rpassword;
    };

    $scope.submit = function() {
        if(!$scope.samePassword()  && !$scope.validateFirstname && !$scope.validateSurname && !$scope.validatePassword && !$scope.validatePassword2 && !$scope.validateInumber  && !$scope.validateInumber2 && !$scope.validateRpassword && $scope.policy){
            $http.post('/register', {"password": $scope.password,
                                        "firstName": $scope.firstname,
                                        "lastName": $scope.surname,
                                        "indexNumber": $scope.inumber,
            "creationDate": moment().toDate()}).then(function (response) {
                $location.path('/');
                Notification.success({message: 'You have recived an activation link on your Univeristy e-mail. Active your account and log in our system!', delay: 5000});
            })
                .catch(function (err) {
                    Notification.error({message: err.data, delay: 5000});
                });
        }

    }
});