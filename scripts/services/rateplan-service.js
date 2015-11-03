(function() {
    'use strict';
    angular
        .module('bearpms3App')
        .factory('RatePlanServices',RatePlanServices);
        
        RatePlanServices.$inject = ['$rootScope','$http','$q','webConstants','$uibModal','$translate','langTransService'];
        
        function RatePlanServices ($rootScope,$http,$q,webConstants,$uibModal,$translate,langTransService) {
            var service = {
                $listRatePlanConditionsType: $listRatePlanConditionsType,
                $listRatePlanConditions: $listRatePlanConditions,
                $insertRatePlanConditions: $insertRatePlanConditions,
                $deleteRatePlanConditions: $deleteRatePlanConditions,
                $update: $update
            };
            
            return service;
            ///////////////////////////////
            
            
            function $listRatePlanConditionsType() {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditionsType" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&withdescription=" + "1" +
                    "&LangCode="+ langTransService.getSelectedLanguage();
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
            
            function $listRatePlanConditions(rpID) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditions" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&withdescription=" + "1" +
                    "&FK_RatePolicy=" + rpID;
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
                   
            function $insertRatePlanConditions(rp,rpct) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditions" +
                    "&method=" + "Insert" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&FK_RatePolicy=" + rp +
                    "&FK_RatePolicyConditionsType=" + rpct +
                    "&LangCode=" + langTransService.getSelectedLanguage();
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
            
           function  $deleteRatePlanConditions(rp,rpct) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditions" +
                    "&method=" + "Destroy" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&FK_RatePolicy=" + rp +
                    "&FK_RatePolicyConditionsType=" + rpct +
                    "&LangCode=" + langTransService.getSelectedLanguage();
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    console.log(url);
                    console.log(response);
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            }
            
            function $update(todoId, name, status) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
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
            }
            
            /////////////////////////            
        }
})();