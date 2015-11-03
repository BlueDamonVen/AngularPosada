'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:CompanyCtrl
 * @description
 * # CompanyCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('companyCtrl', function ($scope, $rootScope, $http,webConstants) {
		
var hostCallserver =webConstants.hostCallserver;
var host = webConstants.host;
		     //....seting roles
        $scope.rightValue =false;
        $scope.rightValue2=false;
        $scope.rightsValues = $rootScope.globals.fk_rightsResponse;
        if($scope.rightsValues.data[0].Company === 1 )
            $scope.rightValue=true;
        if($scope.rightsValues.data[0].Company === 2 )
            $scope.rightValue2=true;
        //....seting roles ends
		
		  $scope.companies=[];
		  $scope.countries = $rootScope.countries;
		  $scope.uploadUrl = host+"/gcs/bearcrsuploadimages?callback=callback&object=Company&method=AddImage&FK_Company="+$rootScope.globals.fk_property.fk_company+"&fileextension=.png&token="+$rootScope.credentials.currentUser.token;
		  
		  
		  
		  $scope.save = function() {
		  		var str = $.param($scope.company);
				callserver(hostCallserver+"&object=Company&method=Update&token="+$rootScope.credentials.currentUser.token+"&"+str,function (response) {
					if (response.status == 'OK') {
						new logger("<p>Data Saved</p>","notice","growl","slide").log();
						if(response.data.Status === undefined){

						} else {
							if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
							}
						}
						
						
					}
				
				},$http,$scope);
		  }
		  
		  $scope.getCompanyData = function () {
				callserver(hostCallserver+"&object=Company&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Company="+$rootScope.globals.fk_property.fk_company,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
								for (var i in response.data) {
									$scope.companies.push(response.data[i]);
								}
								$scope.company = $scope.companies[0];
								$scope.company.Logo += "?_ts="+ new Date().getTime();
							}

						} else {
							if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
							}
						}
						
						
					}
				
				},$http,$scope);   
			} 

		  $scope.getCompanyData();

	
	//
  });
