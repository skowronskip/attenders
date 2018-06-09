app.controller('lecturesCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location) {
    console.log($rootScope.loggedUser);
    if($rootScope.loggedUser.role !== 'LECTURER') {
        $location.path('/');
    }
    $scope.myDate = new moment();
    $scope.isOpen = false;
});