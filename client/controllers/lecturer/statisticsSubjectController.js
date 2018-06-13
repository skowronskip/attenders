app.controller('statisticsSubjectCtrl', function($rootScope, $scope, $http, Notification, $cookies, $location, subjectsService, $interval, $routeParams) {
    $scope.key = $routeParams.key;
    subjectsService.getSubjectStatistics($scope.key).then(function (statistics) {
        $scope.statistics = statistics;
        if(statistics.status === 409) {
            Notification.error({message: statistics.data, delay: 5000});
            $location.path('/lecturer/subjects');
        }
        else {
            subjectsService.getAllSubjects().then(function (response) {
                $scope.departments = response.departments;
                $scope.courses = response.courses;
                $scope.pieValues = [];
                angular.forEach($scope.statistics.courses, function (value) {
                    console.log(value);
                    angular.forEach($scope.departments, function (department) {
                        if(value.course.departmentCode === department.code) {
                            value.course.departmentName = department.name;
                        }
                    });
                    var temp = {};
                    temp.key = value.course.departmentName + ', ' + value.course.name + ', semester: ' + value.semester;
                    temp.y = value.occurences/$scope.statistics.numberOfLectures;
                    $scope.pieValues.push(temp);
                });
                $scope.statistics.rating = {};
                $scope.ratingCalculation = function() {
                    $scope.ratingAmount = $scope.statistics.rates[0] + $scope.statistics.rates[1] + $scope.statistics.rates[2] + $scope.statistics.rates[3] + $scope.statistics.rates[4];
                    $scope.ratingValue = $scope.statistics.rates[0] + 2*$scope.statistics.rates[1] + 3*$scope.statistics.rates[2] + 4*$scope.statistics.rates[3] + 5*$scope.statistics.rates[4];
                    $scope.statistics.rating.average = $scope.ratingValue/$scope.ratingAmount;
                };
                $scope.ratingCalculation();
                $scope.labels = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'];
                $scope.iterator = 0;
                $scope.data = [
                    {
                        "key": "Star ratings",
                        "color": "#128545",
                        "values": []
                    }
                ];
                angular.forEach($scope.statistics.rates, function (value) {
                    var temp = {};
                    temp.value = value;
                    temp.label = $scope.labels[$scope.iterator];
                    $scope.data[0].values.push(temp);
                    $scope.iterator++;
                });

                $scope.options = {
                    chart: {
                        type: 'multiBarHorizontalChart',
                        height: 250,
                        x: function(d){return d.label;},
                        y: function(d){return d.value;},
                        showControls: true,
                        showValues: true,
                        duration: 300,
                        xAxis: {
                            showMaxMin: false
                        },
                        yAxis: {
                            axisLabel: 'Stars'
                        }
                    }
                };

                $scope.pieOptions = {
                    chart: {
                        type: 'pieChart',
                        height: 500,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        showLabels: false,
                        duration: 500,
                        labelThreshold: 0.01,
                        labelSunbeamLayout: false,
                        legend: {
                            margin: {
                                top: 5,
                                right: 35,
                                bottom: 5,
                                left: 0
                            }
                        }
                    }
                };
            });
        }
    });
});