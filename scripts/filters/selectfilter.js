'use strict';

/**
 * @ngdoc filter
 * @name bearpms3App.filter:selectFilter
 * @function
 * @description
 * # selectFilter
 * Filter in the bearpms3App.
 */
angular.module('bearpms3App')
  .filter('selectFilter', function () {

     /* return function (input,value) {
      	var out = [{}];
      	    console.log("out arrayvalue : ",input,value);
      //return 'selectFilter filter: ' + input;

    };*/
     return function (incItems, value) {
            if(incItems)
            {
            
        };
    }
    //

  });

angular.module('bearpms3App')
  .filter('replaceNull', function () {
    return function (text) {
      if (text==='null'){
        return 'GENERAL_NOT_SET';
      }else{
        return text;
      }
    };
})
