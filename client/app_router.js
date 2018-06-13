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
        })
        .when("/profile", {
            templateUrl : "views/profile.html",
            controller: 'profileCtrl'
        })
        .when("/checkin", {
            templateUrl : "views/checkin.html",
            controller: 'checkinCtrl'
        })
        .when("/lecturer/lecture/:key", {
            templateUrl : "views/lecturer/lecture.statistics.html",
            controller: 'statisticsCtrl'
        })
        .when("/lecturer/subject/:key", {
            templateUrl : "views/lecturer/subject.statistics.html",
            controller: 'statisticsSubjectCtrl'
        });
});