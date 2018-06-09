app.factory('subjectsService', function($http, $sessionStorage, Notification, $location) {
    return {
        getAllSubjects : function () {
            return $http.get('/lecturer/allSubjects', {}).then(function (response) {
                return response.data;
            });
        },
        getAllSubjectsForCurrentLecturer : function () {
            var lecturer = $sessionStorage.get('auth');
            return $http.post('/lecturer/lecturersSubjects', {lecturer: lecturer}).then(function (response) {
                return response.data;
            });
        }
    }
});