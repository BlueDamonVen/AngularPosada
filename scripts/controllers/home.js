'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('HomeCtrl', function ($scope,$rootScope,$location) {
   
  	$scope.isCollapsed = false;
  	$scope.support = "";
  	$scope.about = "";
  	$scope.Customers = "";
  	$scope.Invoices = "";

  	$scope.reporting = "";
  	$scope.dashboard  = "";
    $scope.selectedLanguage="en";

  	$scope.safeApply = function(fn) {
	  var phase = this.$root.$$phase;
	  if(phase == '$apply' || phase == '$digest') {
	    if(fn && (typeof(fn) === 'function')) {
	      fn();
	    }
	  } else {
	    this.$apply(fn);
	  }
	};
  	$scope.toggleSideBar = function()
  	{
  		if ($scope.isCollapsed===false)
  		{
  			$scope.isCollapsed=true;
  			$scope.support = "Support";
  			$scope.about = "About";
  			$scope.Customers = "Customers";
  			$scope.Invoices = "Invoices";
  			$scope.reporting = "Reporting";
  			$scope.dashboard  = "Dashboard";
  		}
  		else
  		{
  			$scope.isCollapsed= false;
  			$scope.support = "";
  			$scope.about = "";
  			$scope.Customers = "";
  			$scope.Invoices="";
  			$scope.reporting = "";
  			$scope.dashboard  = "";
  		}
 
  		$scope.safeApply();
  	}
    $scope.searchTerm;
    $scope.updateCall = function(onEvent, keypressEvent)
      {
         
        if(keypressEvent.keyCode===13)
        {   console.log("enter enter enter enter: ");
          var b=""; 
          $location.path("/bookings/booking_list"); 
          $rootScope.$broadcast('updateSearchResult',$scope.searchTerm); 
        }
      }
    //....seting roles
    $scope.rightCustomer =false;
    $scope.rightFolio =false;
    $scope.rightBooking =false;
    $scope.rightCompany =false;
    $scope.rightProperty =false;
      $scope.rightUser =false;
        $scope.rightRoomType =false;
          $scope.rightRatePolicy =false;

    $scope.rightsValues = $rootScope.globals.fk_rightsResponse;
 
    if($scope.rightsValues.data[0].Folio === 0 )
        $scope.rightFolio=true;

     if($scope.rightsValues.data[0].Customer === 0 )
        $scope.rightCustomer=true;

     if($scope.rightsValues.data[0].Booking === 0 )
        $scope.rightBooking =true;
    if($scope.rightsValues.data[0].Company === 0 || $scope.rightsValues.data[0].Company === 1)
        $scope.rightCompany =true;
      if($scope.rightsValues.data[0].Property === 0 )
        $scope.rightProperty =true;
       if($scope.rightsValues.data[0].Users === 0)
        $scope.rightUser =true;

 if($scope.rightsValues.data[0].RoomType === 0 )
        $scope.rightRoomType =true;
         
       if($scope.rightsValues.data[0].RatePolicy === 0)
        $scope.rightRatePolicy =true;
      
      //....seting roles ends

  });
