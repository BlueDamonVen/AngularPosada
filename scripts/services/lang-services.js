(function() {
    'use strict';
    angular
        .module('bearpms3App')
        .factory('LangServices',LangServices);
        
        LangServices.$inject = ['$rootScope','$http','$q','webConstants','$uibModal','$translate','langTransService'];
        
        function LangServices ($rootScope,$http,$q,webConstants,$uibModal,$translate,langTransService) {
            var langs = [];
            var service = {
                langs: langs,
                $listLang: $listLang,
                $insertLang: $insertLang,
                $deleteLang: $deleteLang,
                $updateLang: $updateLang,
            };
            
            return service;
            ///////////////////////////////
            
            
            function $listLang() {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "Lang" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    for (var i in response) {
                        service.langs.push(response[i].Code);
                    }
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            }
            
            function $insertLang(rp,rpct) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "Lang" +
                    "&method=" + "Insert" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
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
            
           function  $deleteLang(lang) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "Lang" +
                    "&method=" + "Destroy" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
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
            
            function $updateLang(todoId, name, status) {
                var url = $rootScope.globals.serverUrl+webConstants.hostCallserver +
                    "&object=" + "Lang" +
                    "&method=" + "Update" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
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