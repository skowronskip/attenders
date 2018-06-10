app.controller('loginCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location, $sessionStorage){
    $scope.login = '';
    $scope.password = 'password';
    $scope.firstName = '';
    $scope.lastName = '';
    $scope.isLecturer = false;
    $scope.validateLogin = false;
    $scope.validatePassword = false;
    $scope.validateFirstname = false;
    $scope.validateLastname = false;

    $scope.isAccActivate = function() {
        const cookie = $cookies.get('accActivated');
        if(cookie) {
            $cookies.remove('accActivated');
            Notification.success({message: 'Your account is now active. Now you can log in!', delay: 5000});
        }
    };
    $scope.isAccActivate();

    $scope.submit = function() {
        if(!$scope.validateLogin && !$scope.validatePassword && !$scope.isLecturer){
            $http.post('/login', {"login": $scope.login, "password": $scope.password}).then(function (response) {
                if(!response.data.course){
                    $sessionStorage.put('courseInfoModal', true);
                }
                $sessionStorage.put('auth', response.data._id);
                Notification.success({message: 'You are logged in', delay: 5000});
                $rootScope.loadUser();
                $location.path('/');
            })
                .catch(function (err) {
                    Notification.error({message: err.data, delay: 5000});
                });
        }
        else if(!$scope.validateFirstname && !$scope.validateLastname && !$scope.validatePassword && $scope.isLecturer){
            $http.post('/login', {"firstName": $scope.firstName, "lastName": $scope.lastName, "password": $scope.password}).then(function (response) {
                $sessionStorage.put('auth', response.data._id);
                Notification.success({message: 'You are logged in', delay: 5000});
                $rootScope.loadUser();
                $location.path('/');
            })
                .catch(function (err) {
                    Notification.error({message: err.data, delay: 5000});
                });
        }
    }
});