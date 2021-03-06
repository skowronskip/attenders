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
        },
        getAllLecturesForCurrentLecturer : function () {
            var lecturer = $sessionStorage.get('auth');
            return $http.post('/lecturer/lecturersLectures', {lecturer: lecturer}).then(function (response) {
                return response.data;
            });
        },
        getStatistics : function (key) {
            return $http.post('/lecturer/statisticsLecture', {key: key}).then(function (response) {
                return response.data;
            });
        },
        getSubjectStatistics : function (key) {
            return $http.post('/lecturer/statisticsSubject', {key: key}).then(function (response) {
                return response.data;
            }).catch(function (err) {
               return err;
            });
        }
    }
});