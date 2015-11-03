angular
	.module('bearpms3App')
    .factory('ProductService', function($rootScope, $http, $q,webConstants) {
        var hostCallserver =webConstants.hostCallserver;
        return {
            $list: function() {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Product" +
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
            }
        };
    });
