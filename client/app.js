var app = angular.module('Attenders', ['ngRoute', 'ui-notification', 'ngCookies', 'ngSessionStorage', 'ngMessages', 'ngMaterial']);
app.run(function ($rootScope, $cookies, $location, Notification, $http, $sessionStorage, $interval) {
    moment.locale('gb');
    $rootScope.testvariable = 'No witam Cie z rootscope';
    $rootScope.loggedUser = {};
    $rootScope.hostname = 'typerms.atthost24.pl';
    $rootScope.isLogged = function () {
        const logged = $sessionStorage.get('auth');
        if (logged) {
            if ($location.url() === '/login' || $location.url() === '/register' || $location.url() === '/forgot') {
                $location.path('/');
            }
            return true;
        }
        else if($location.url() === '/createPredictions'){
            $location.path('/');
        }
        return false;
    };

    $rootScope.loadUser = function () {
        const logged = $sessionStorage.get('auth');
        if (logged) {
            $http.post('/findUser', {_id: logged}).then(function (response) {
                $rootScope.loggedUser = response.data;
                return true;
            });
        }
        return false;
    };

    if ($sessionStorage.get('auth')) {
        $rootScope.loadUser();
    }

    $rootScope.logout = function () {
        const logged = $sessionStorage.get('auth');
        if (logged) {
            $sessionStorage.remove('auth');
            $rootScope.loggedUser = {};
            $location.path('/');
            Notification.success({message: 'You are logged out', delay: 5000});
        }
    };

    $rootScope.timeNow = function() {
        return new moment().format("dddd, DD/MMMM/YYYY, LTS");
    };

    var stopTime = $interval($rootScope.timeNow, 1000);

});

app.constant("moment", moment);