function RatePlanService ($rootScope, $http, $q,webConstants) {
var hostCallserver =webConstants.hostCallserver;
        return {
            List: function(onSuccess,onFailure) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "RatePolicy" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(onSuccess)
                .error(onFailure);
                //return deferred.promise;
            }
        };
 
}


angular
.module('bearpms3App')
.factory('RatePlanService', RatePlanService) 
