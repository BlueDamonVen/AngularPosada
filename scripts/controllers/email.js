'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:EmailCtrl
 * @description
 * # EmailCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('emailCtrl', function ($scope) {
    
  	if (!$('#page-wrapper').hasClass('nav-small')) {
		$('#page-wrapper').addClass('nav-small');
	}

  });


