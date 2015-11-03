'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:SigninCtrl
 * @description
 * # SigninCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('signinCtrl', function ($scope, $http,  $cookieStore, $rootScope, $timeout, $location, $window,webConstants) {
	var original;

	var hostCallserver =webConstants.hostCallserver;
	$scope.login = function () { 
		  
		 //alert("jdaskld");
		callserver(hostCallserver+"&object=Login&method=Login&Email="+$scope.username+"&Password="+$scope.password,function (response) {
		
			if (response.status == 'OK') {
				if (response.data.Status == 'OK') {
					$scope.token = response.data.token;
					//AuthenticationService.SetCredentials($scope.username, $scope.password, $scope.token);
					
					if($rootScope.credentials === undefined) {
						$rootScope.credentials = {};
					}
					//...
					 //......................................./bearcrsl?callback
			        callserver(hostCallserver+"&method=MyRights&object=Users&token="+$rootScope.credentials.currentUser.token,function (response) 
			        {  
			            
			            if (response.status == 'OK') 
			            { 
			              
			                $rootScope.globals.fk_rightsResponse = response;
			                
			                //$rootScope.globals.
			                //localStorage.setItem("globals",JSON.stringify($rootScope.globals));  
			            }       
			        },$http,$scope);

         
					$rootScope.credentials.currentUser = {
								username: $scope.username,
								token: response.data.token
								};
					
					$cookieStore.put('credentials', $rootScope.credentials);
					 
					callserver(hostCallserver+"&object=Property&method=ListNames&token="+$rootScope.credentials.currentUser.token,function (response) {
						
						if (response.status == 'OK') {

							$scope.properties = [];
							//if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
								// get data from rootScope or from actual response
								for (var i = 0; i < response.data.length; i++) {
									if(i==0){
										$scope.mainProperty = {
												"id" : response.data[i].ID,
												"name" : response.data[i].Name,
												"img" : "",
												"fk_company" : response.data[i].FK_Company
											};
									}
									$scope.properties.push({
										"id" : response.data[i].ID,
										"name" : response.data[i].Name,
										"img" : "",
										"fk_company" : response.data[i].FK_Company
									});
									
								}
					
								$rootScope.globals.fk_propertylist = $scope.properties;
								$rootScope.globals.fk_property = $rootScope.globals.fk_propertylist[(findid($rootScope.globals.fk_propertylist,$scope.mainProperty.id) || 0)];
								
								localStorage.setItem("globals",JSON.stringify($rootScope.globals));

								$window.location.href = '/';
								$rootScope.$broadcast('userLoggedIn');
								
								
						}
						
						
					},$http,$scope);
 				
					
					
				} else {
                    new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
                    //new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Email / Password Mismatch</p>","error","growl","slide").log();
				}
			}
			
			
		}
		,$http,$scope);

	}
	
	
    //
  });

