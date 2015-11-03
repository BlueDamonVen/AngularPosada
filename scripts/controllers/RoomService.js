function RoomService ($rootScope, $http, $q,webConstants) {
var hostCallserver =webConstants.hostCallserver;
        return {
            $RoomTypeList: function() {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "RoomType" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response[0]);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            }
        };
 
}


angular
.module('bearpms3App')
.factory('RoomService', RoomService) 
