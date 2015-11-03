'use strict';

/**
 * @ngdoc service
 * @name bearpms3App.webConstants
 * @description
 * # webConstants
 * Service in the bearpms3App.
 */
angular.module('bearpms3App')
  /*.service('webConstants', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
  });*/
 .constant('webConstants',
    {//.... sign in ctrl ... 2nd
     
    // app.js line 312 its config cannot be linked to service so host is not added there
    // fullCalendar line 18 host is not added
    //prod server https://bearcrs.nuevah.com
    //test server http://dev-bearcrsl.appspot.com
    	host : 'https://bearcrs.nuevah.com',
    	hostCallserver : '/bearcrsl?callback=JSON_CALLBACK'
       
    });

