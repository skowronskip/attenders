app.config(function($routeProvider, $locationProvider, $rootScopeProvider) {
    $rootScopeProvider.digestTtl(15);
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/", {
            templateUrl : "views/main.html",
            controller: 'mainCtrl'
        })
        .when("/login", {
            templateUrl : "views/login.html",
            controller: 'loginCtrl'
        })
        .when("/register", {
            templateUrl : "views/register.html",
            controller: 'registerCtrl'
        })
        .when("/forgot", {
            templateUrl : "views/forgot.html",
            controller: 'forgotCtrl'
        })
        .when("/reset", {
            templateUrl : "views/reset.html",
            controller: 'resetCtrl'
        })
        .when("/privacy", {
            templateUrl : "views/privacypolicy.html"
        })
        .when("/lectures", {
            templateUrl : "views/lecturer/lectures.html",
            controller: 'lecturesCtrl'
        })
        .when("/lecturer/subjects", {
            templateUrl : "views/lecturer/subjects.html",
            controller: 'subjectsCtrl'
        });
});