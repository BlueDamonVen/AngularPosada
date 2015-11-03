'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:CustomersCtrl
 * @description
 * # CustomersCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('customersCtrl', function ($scope, $rootScope, $http,webConstants, $translate, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $uibModal) {
   //
		var hostCallserver =webConstants.hostCallserver;
		$scope.customers=[];
		$scope.countries = $rootScope.countries;
		 
		 //...value
		 $scope.orderByField = 'LastName';
  		 $scope.reverseSort = false;
		 //....seting roles
		$scope.rightValue =false;
		$scope.rightValue2=false;
		$scope.rightsValues = $rootScope.globals.fk_rightsResponse;
		if($scope.rightsValues.data[0].Customer === 1 )
  			$scope.rightValue=true;
  		if($scope.rightsValues.data[0].Customer === 2 )
  			$scope.rightValue2=true;
  		//....seting roles ends


		$scope.deletedOn=0;


		$scope.getcustomerlist = function () {
			
			callserver(hostCallserver+"&object=Customer&method=List&withstays=1&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&withDeleted="+$scope.deletedOn,function (response) {
				if (response.status == 'OK') {
					if(response.data.Status === undefined){
						if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
							$scope.customers=[];
							for (var i in response.data) {
								$scope.customers.push({
										"ID": response.data[i].ID,
										"Prefx": response.data[i].Prefx,
										"FirstName": response.data[i].FirstName,
										"LastName": response.data[i].LastName,
										"Address1": response.data[i].Address1,
										"Address2": response.data[i].Address2,
										"City": response.data[i].City,
										"ProvinceState": response.data[i].ProvinceState,
										"Country": response.data[i].Country,
										"PostalCode": response.data[i].PostalCode,
										"Phone": response.data[i].Phone,
										"Mobile": response.data[i].Mobile,
										"Email": response.data[i].Email,
										"BookingCount": response.data[i].BookingCount
								});
							}

							
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
		
		$scope.getcustomerlist();

		function getCountry(cr) {
			var res;
			$scope.countries.forEach(function(val, i) {
				if (cr === val.ISO2) {
					res =  $scope.countries[i];
				}
			});
			return res;
		};
		
		$scope.updatedata = function(id, data) {
			
			var dataString = $.param({
				"FirstName": data.FirstName,
				"LastName": data.LastName,
				"Address1": data.Address1,
				"Address2": data.Address2,
				"City": data.City,
				"ProvinceState": data.ProvinceState,
				"Country": data.Country,
				"PostalCode": data.PostalCode,
				"Phone": data.Phone,
				"Mobile": data.Mobile,
				"Email": data.Email,
			});
			callserver(hostCallserver+"&object=Customer&method=Update&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+id+"&"+dataString,function (response) {
				
				if (response.status == 'OK') {
					
					data.edited = false;
					if(response.data.Status === undefined){
					
					} else {
						if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
						}
					}
						
						
					
					} else {
						if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
						}
					}
					
					
				
			
			},$http,$scope);   
			
			
			};




		$scope.deletecustomer = function(id,idx) {
			

			// $('#deletePopup')
   //      	.modal({ backdrop: 'static', keyboard: false })
   //      	.one('click', '#ok', function(e) {		

				// callserver(hostCallserver+"&object=Customer&method=Delete&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+id,function (response) {
					
				// 	if (response.status == 'OK') {
						
				// 		data.edited = false;
				// 		if(response.data.Status === undefined){
						
				// 		} else {
				// 			if(response.data.Status == "OK") {
				// 					new logger("<p>Data Saved</p>","notice","growl","slide").log();
				// 					$scope.customers.splice(idx,1);
				// 			}
				// 		}
						
				// 		} else {
				// 			if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
				// 				new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
				// 			}
				// 		}
				// },$http,$scope);   
		
			
   //      	});


				$uibModal.open({
					templateUrl: "views/confirmationModal.html",
					controller: function($scope, $modalInstance) {
							$scope.cancel = function() {
								$modalInstance.dismiss('cancel');
							};

							$scope.ok = function() {

								callserver(hostCallserver+"&object=Customer&method=Delete&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+id,function (response) {
												
												if (response.status == 'OK') {
													
													data.edited = false;
													if(response.data.Status === undefined){
													
													} else {
														if(response.data.Status == "OK") {
																new logger("<p>Data Saved</p>","notice","growl","slide").log();
																$scope.customers.splice(idx,1);
														}
													}
													
													} else {
														if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
															new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
														}
													}
											},$http,$scope);   

								
								$modalInstance.close();
							};

						var trans=$translate.instant(['CUSTOMERS_DELETE_MODAL_TITLE','CUSTOMERS_DELETE_MODAL_TEXT']);
						$scope.confirmationtext=trans.CUSTOMERS_DELETE_MODAL_TEXT;
						$scope.headertext=trans.CUSTOMERS_DELETE_MODAL_TITLE;
					}
					
				});


		};

  });
