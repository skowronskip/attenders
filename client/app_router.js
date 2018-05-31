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
        .when("/predictions", {
            templateUrl : "views/predictions.html",
            controller: 'predictionsCtrl'
        })
        .when("/createPredictions", {
            templateUrl : "views/createpredictions.html",
            controller: 'createPredictionsCtrl'
        })
        .when("/myPredictions", {
            templateUrl : "views/mypredictions.html",
            controller: 'myPredictionsCtrl'
        })
        .when("/user/:login", {
            templateUrl : "views/userpredictions.html",
            controller: 'userPredictionsCtrl'
        })
        .when("/privacy", {
            templateUrl : "views/privacypolicy.html"
        })
        .when("/allPredictions", {
            templateUrl : "views/allpredictions.html",
            controller: 'allPredictionsCtrl'
        });
});