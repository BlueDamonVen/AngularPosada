angular
	.module('bearpms3App')
    .factory('TodoService', function($rootScope, $http, $q,webConstants) {
    var hostCallserver =webConstants.hostCallserver;
        function formatDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
	       var d = new Date(inputFormat);
	       return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
        };
    
        return {
            $list: function() {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "TodoList" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $insert: function(name) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "TodoList" +
                    "&method=" + "Insert" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&Item=" + name;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $update: function(todoId, name, status) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "TodoList" +
                    "&method=" + "Update" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&ID=" + todoId + 
                    "&Item=" + name +
                    "&Status=" + status;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $delete: function(todoId) {
                var url = $rootScope.globals.serverUrl+ hostCallserver +
                    "&object=" + "TodoList" +
                    "&method=" + "Delete" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&ID=" + todoId;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            }
        };
    });
