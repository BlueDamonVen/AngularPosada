function RatePlanService ($rootScope, $http, $q) {

        return {
            List: function(onSuccess,onFailure) {
                var url = $rootScope.globals.serverUrl+"/bearcrsl?callback=JSON_CALLBACK" +
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
