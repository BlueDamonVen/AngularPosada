'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:EasychartCtrl
 * @description
 * # EasychartCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('easyChartCtrl', function ($scope) {
    //
	$scope.percent = 1;
	$scope.options = {
		barColor: '#03a9f4',
		trackColor: '#f2f2f2',
		scaleColor: false,
		lineWidth: 3,
		size: 125,
		animate: 1500,
		onStep: function(from, to, percent) {
			$(this.el).find('.percent').text(Math.round(percent));
		},
	};

	$scope.optionsGreen = angular.copy($scope.options);
	$scope.optionsGreen.barColor = '#8bc34a';
	
	$scope.optionsRed = angular.copy($scope.options);
	$scope.optionsRed.barColor = '#e84e40';
	
	$scope.optionsYellow = angular.copy($scope.options);
	$scope.optionsYellow.barColor = '#ffc107';
	
	$scope.optionsPurple = angular.copy($scope.options);
	$scope.optionsPurple.barColor = '#9c27b0';
	
	$scope.optionsGray = angular.copy($scope.options);
	$scope.optionsGray.barColor = '#90a4ae';
    //
  });
