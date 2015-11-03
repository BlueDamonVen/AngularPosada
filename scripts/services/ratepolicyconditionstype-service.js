(function() {
    'use strict';
    angular
        .module('bearpms3App')
        .factory('RatePlanConditionsTypeServices',RatePlanConditionsTypeServices) 
        
        RatePlanConditionsTypeServices.$inject =  ["$rootScope","$http","$q","webConstants","$translate","langTransService"];
        
        function RatePlanConditionsTypeServices($rootScope,$http,$q,webConstants,$translate,langTransService) {
            var service = {
                $listRatePlanConditionsType: $listRatePlanConditionsType,
                $deleteRatePlanConditionsType: $deleteRatePlanConditionsType,
                $InsertRatePlanConditionsType: $InsertRatePlanConditionsType,
                $updateRatePlanConditionsType: $updateRatePlanConditionsType,                
                $listRatePlanConditionsDescription: $listRatePlanConditionsDescription,
                $deleteRatePlanConditionsDescription: $deleteRatePlanConditionsDescription,
                $InsertRatePlanConditionsDescription: $InsertRatePlanConditionsDescription,
                $updateRatePlanConditionsDescription: $updateRatePlanConditionsDescription
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
            
            function $deleteRatePlanConditionsType(id) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditionsType" +
                    "&method=" + "Destroy" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&ID=" + id;
                var deferred = $q.defer();
                console.log(url);
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            }
            
            function $InsertRatePlanConditionsType(description, lang, group, icon) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditionsType" +
                    "&method=" + "Insert" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&Description=" + description +
                    "&Group=" + group +
                    "&LangCode=" + lang;
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
            
            function $updateRatePlanConditionsType(id, description, lang) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditionsType" +
                    "&method=" + "Update" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&ID=" + id + 
                    "&Description=" + description +
                    "&LangCode=" + lang;
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
            
            function $listRatePlanConditionsDescription(id) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditionsTypeDesc" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&FK_RatePolicyConditionsType="+ id;
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
            
            function $deleteRatePlanConditionsDescription(id) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditionsTypeDesc" +
                    "&method=" + "Destroy" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&ID=" + id;
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
            
            function $InsertRatePlanConditionsDescription(description, lang, rpct) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditionsTypeDesc" +
                    "&method=" + "Insert" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&FK_RatePolicyConditionsType=" + rpct +                     
                    "&Description=" + description +
                    "&LangCode=" + lang;
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
            
            function $updateRatePlanConditionsDescription(id, description, lang) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "RatePolicyConditionsTypeDesc" +
                    "&method=" + "Update" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&ID=" + id + 
                    "&Description=" + description +
                    "&LangCode=" + lang;
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
