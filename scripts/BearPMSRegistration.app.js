'use strict';



var app = angular.module('BearPMSRegistration', [
  'ngRoute',
  'ngCookies',
  'pascalprecht.translate'
]);

app.config(['$translateProvider' , function ($translateProvider ) {
  
  $translateProvider.useStaticFilesLoader({
      prefix: '/i18n/resources-locale_',
      suffix: '.js'
  });
  $translateProvider.preferredLanguage('en');
    // remember language
  $translateProvider.useLocalStorage();

}]);
