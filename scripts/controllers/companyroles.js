'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:CompanyrolesCtrl
 * @description
 * # CompanyrolesCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('companyrolesCtrl', function ($scope, $rootScope, $http,webConstants, $translate){
		var hostCallserver =webConstants.hostCallserver;
		   //....seting roles
        $scope.rightValue =false;
        $scope.rightValue2=false;
        $scope.rightsValues = $rootScope.globals.fk_rightsResponse;
        if($scope.rightsValues.data[0].Company === 1 )
            $scope.rightValue=true;
        if($scope.rightsValues.data[0].Company === 2 )
            $scope.rightValue2=true;
        //....seting roles ends
		$scope.openroles = [];
		//$scope.openroles[0]=true;
		$scope.areas=[];

		$rootScope.$on('$translateChangeSuccess', function () {
			$scope.updateRightList();
	    });

		$scope.areas = [];

		$scope.updateRightList = function () {
		var translations=[];
		translations=$translate.instant([
			"COMPANY_USERS_AVAILABILITY",
			"COMPANY_USERS_BOOKING",
			"COMPANY_USERS_COMPANY",
			"COMPANY_USERS_PROPERTY",
			"COMPANY_USERS_CUSTOMER",
			"COMPANY_USERS_PRODUCTS",
			"COMPANY_USERS_FOLIO",
			"COMPANY_USERS_RATEPOLICY",
			"COMPANY_USERS_ROOM",
			"COMPANY_USERS_ROOMTYPE",
			"COMPANY_USERS_TAXES",
			"COMPANY_USERS_USERS",
			"COMPANY_USERS_REFERENCES",
			"COMPANY_USERS_REPORTING"
			]);

		
			$scope.areas = [
				// translations["COMPANY_USERS_AVAILABILITY"],
				// translations["COMPANY_USERS_BOOKING"],
				// translations["COMPANY_USERS_COMPANY"],
				// translations["COMPANY_USERS_PROPERTY"],
				// translations["COMPANY_USERS_CUSTOMER"],
				// translations["COMPANY_USERS_PRODUCTS"],
				// translations["COMPANY_USERS_FOLIO"],
				// translations["COMPANY_USERS_RATEPOLICY"],
				// translations["COMPANY_USERS_ROOM"],
				// translations["COMPANY_USERS_ROOMTYPE"],
				// translations["COMPANY_USERS_TAXES"],
				// translations["COMPANY_USERS_USERS"],
				// translations["COMPANY_USERS_REFERENCES"],
				// translations["COMPANY_USERS_REPORTING"]

				{
				ID:"Availability",
				Name: translations["COMPANY_USERS_AVAILABILITY"]
				},
				{ID:"Booking",Name: translations["COMPANY_USERS_BOOKING"]},
				{ID:"Company",Name:translations["COMPANY_USERS_COMPANY"]},
				{ID:"Property",Name:translations["COMPANY_USERS_PROPERTY"]},
				{ID:"Customer",Name:translations["COMPANY_USERS_CUSTOMER"]},
				{ID:"Products",Name:translations["COMPANY_USERS_PRODUCTS"]},
				{ID:"Folio",Name:translations["COMPANY_USERS_FOLIO"]},
				{ID:"RatePolicy",Name:translations["COMPANY_USERS_RATEPOLICY"]},
				{ID:"Room",Name:translations["COMPANY_USERS_ROOM"]},
				{ID:"RoomType",Name:translations["COMPANY_USERS_ROOMTYPE"]},
				{ID:"Taxes",Name:translations["COMPANY_USERS_TAXES"]},
				{ID:"Users",Name:translations["COMPANY_USERS_USERS"]},
				{ID:"References",Name:translations["COMPANY_USERS_REFERENCES"]},
				{ID:"Reporting",Name:translations["COMPANY_USERS_REPORTING"]}

	            ];
				
		}		
			
			$scope.updateRightList();
		
		  		// 		{"Name":"Availability","Store":"store.Availability"},
						// {"Name":"Booking","Store":"store.Booking"},
						// {"Name":"Company","Store":"store.Company"},
						// {"Name":"Property","Store":"store.Property"},
						// {"Name":"Customer","Store":"store.Customer"},
						// {"Name":"Products","Store":"store.Products"},
						// {"Name":"Folio","Store":"store.Folio"},
						// {"Name":"RatePolicy","Store":"store.RatePolicy"},
						// {"Name":"Room","Store":"store.Room"},
						// {"Name":"RoomType","Store":"store.RoomType"},
						// {"Name":"Taxes","Store":"store.Taxes"},
						// {"Name":"Users","Store":"store.Users"},
						// {"Name":"References","Store":"store.References"},
						// {"Name":"Reporting","Store":"store.Reporting"}

		 
		
		
		
		$scope.getroles = function () {
			
			var stemp=hostCallserver+"&object=Roles&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Company="+$rootScope.globals.fk_property.fk_company;
			 
			callserver(stemp,function (response) {
				if (response.status == 'OK') {
					if(response.data.Status === undefined){
						if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
							$scope.roles=response.data;
							/*
							for (var i in response.data) {
								$scope.roles.push({
										"ID": response.data[i].ID,
										"Description": response.data[i].Description,
										"Availability": response.data[i].Availability
								});
							}
							*/
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
		
		
		
		 $scope.updateroles = function (id, area, value, data) {
			 
			 
			 
			 //var i = data.indexOf("ID");
			 //if(i != -1) {
			 //	data.splice(i, 1);
			 //}
			 
			 // delete data.ID;
			 
			 var dataString = $.param({
				 "FK_Company": $rootScope.globals.fk_property.fk_company,
				 "Description": data.Description,
				 "Availability": data.Availability,
				 "Booking": data.Booking,
				 "Company": data.Company,
				 "Property": data.Property,
				 "Customer": data.Customer,
				 "Products": data.Products,
				 "Folio": data.Folio,
				 "RatePolicy": data.RatePolicy,
				 "Room": data.Room,
				 "RoomType": data.RoomType,
				 "Taxes": data.Taxes,
				 "Users": data.Users,
				 "References": data.References,
				 "Reporting": data.Reporting
			 });
			 var sqlt="";
			 
			 if(id==-1){
				 sqlt = hostCallserver+"&object=Roles&method=Insert&token="+$rootScope.credentials.currentUser.token+"&"+dataString;
			 } else {
				 sqlt = hostCallserver+"&object=Roles&method=Update&token="+$rootScope.credentials.currentUser.token+"&ID="+id +"&"+area+"="+value;
			 }
				
					callserver(sqlt,function (response) {
						if (response.status == 'OK') {
							data.edited = false;
							if(response.data.Status === undefined){
							} else {
								if(response.data.Status == "OK") {
										new logger("<p>Data Saved</p>","notice","growl","slide").log();
										//$scope.users=[];
										//$scope.getuserlist();
										if(id==-1) $scope.getroles();
										
								} else {
									//vm.users.splice(idx,1);
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorMessage+"</p>","error","growl","slide").log();
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//$scope.users.slice(idx,1);
									
									 data.ID=id;
							
								}
							}
								
								
							
							} else {
								if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
								}
							}
							
							
						
					
					},$http,$scope);   
					
					
					
					
					
			} 
		
		$scope.roles = [];
		 $scope.deleteroles = function (id, idx, data) {
			 
			 var sqlt=""
				 var activate=false;
				 if(data.DeletedOn=="null"){
					 sqlt = hostCallserver+"&object=Roles&method=Delete&token="+$rootScope.credentials.currentUser.token+"&ID="+id;
					 activate=false;
				 } else {
					 sqlt = hostCallserver+"&object=Roles&method=Update&token="+$rootScope.credentials.currentUser.token+"&ID="+id+"&DeletedOn=null";
					 activate=true;
				 }
				
					callserver(sqlt,function (response) {
						
						if (response.status == 'OK') {
							
							data.edited = false;
							if(response.data.Status === undefined){
							
							} else {
								if(response.data.Status == "OK") {
										new logger("<p>Data Saved</p>","notice","growl","slide").log();
										
										if(activate) {
											$scope.roles[findid($scope.roles,id)].DeletedOn="null";
										} else {
											$scope.roles[findid($scope.roles,id)].DeletedOn="DELETED";
										}
										//$scope.users=[];
										//$scope.getuserlist();
										
										//$scope.roles.splice(idx,1);
										
								} else {
									//vm.users.splice(idx,1);
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorMessage+"</p>","error","growl","slide").log();
									//$scope.users.slice(idx,1);
							
								}
							}
								
								
							
							} else {
								if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
								}
							}
							
							
						
					
					},$http,$scope);   
					
					
					
					
					
			} 
		
		 
		 $scope.addrole = function () {
			 
			 
			 $scope.roles.push({
				 ID: -1,
				 FK_Company: $rootScope.globals.fk_property.fk_company,
				 Description: "",
				 Availability: 0,
				 Booking: 0,
				 Company: 0,
				 Property: 0,
				 Customer: 0,
				 Products: 0,
				 Folio: 0,
				 RatePolicy: 0,
				 Room: 0,
				 RoomType: 0,
				 Taxes: 0,
				 Users: 0,
				 References: 0,
				 Reporting: 0,
				 DeletedOn: "null"
				 }
			 );
			 
		 }

		 $scope.clickNewValue = function(value,ind)
		  {
		  	console.log(" clicked: ",value,ind,$scope.roles);
		  	if(value === "New Role")
		  	{   
		  		console.log(" click value : ",value,ind);
		  		$scope.roles[$scope.roles.length-1].Description = ""; 
		  	}
		  	
		  }
		
		
		 $scope.viewdeleted=true;
		 
		 $scope.onlyActive = function (element) {
			
			 if(element===undefined) return true;
			
			
			 if(!$scope.viewdeleted) return true;
			
			 if(element.DeletedOn=="null") {
				return true;
			} else {
				return false;
			}
			 
		 };
		 
		
		$scope.getroles();
		

    //
  });
