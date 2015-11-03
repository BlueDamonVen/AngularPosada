'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:PropertydetailsCtrl
 * @description
 * # PropertydetailsCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('propertyNotificationCtrl', function  ($scope, $rootScope, $http,langTransService,webConstants,$location) {
		var hostCallserver =webConstants.hostCallserver;
		 //....setting roles
        $scope.rightValue =false;
        $scope.rightValue2=false;
        $scope.rightsValues = $rootScope.globals.fk_rightsResponse;
        if($scope.rightsValues.data[0].Property === 1 )
            $scope.rightValue=true;
        if($scope.rightsValues.data[0].Property === 2 )
            $scope.rightValue2=true;
        //....seting roles ends
		  
		  $scope.properties=[];
		  $scope.text2 = '<p><i>This is really simple WYSIWYG for AngularJS!</i></p>';
		  
		  $scope.save = function() {
		  		var str = $.param($scope.property);
				callserver(hostCallserver+"&object=Property&method=Update&token="+$rootScope.credentials.currentUser.token+"&"+str,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
						} else {
							if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();

								//$rootScope.globals.fk_propertylist[(findid($rootScope.globals.fk_propertylist,$scope.properties[0].ID) || 0)] = $scope.properties[0];
								//$rootScope.globals.fk_property = $scope.properties[0];
								
								//localStorage.setItem("globals",JSON.stringify($rootScope.globals));
								
								$scope.$broadcast("reloadProperties");
							
							} else {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();								
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
		  
		  $scope.update = function () {
				callserver(hostCallserver+"&object=Property&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
								for (var i in response.data) {
									$scope.properties.push(response.data[i]);
								}
								
								//$scope.property = $scope.properties[0];

								$scope.property = {
										"ID": $scope.properties[0].ID,
										"FK_Company": $scope.properties[0].FK_Company,
										"Name": $scope.properties[0].Name,
										"Address1": $scope.properties[0].Address1,
										"Address2": $scope.properties[0].Address2,
										"City": $scope.properties[0].City,
										"ProvinceState": $scope.properties[0].ProvinceState,
										"Country": $scope.properties[0].Country,
										"PostalCode": $scope.properties[0].PostalCode,
										"Phone": $scope.properties[0].Phone,
										"Phone2": $scope.properties[0].Phone2,
										"Fax": $scope.properties[0].Fax,
										"Mobile": $scope.properties[0].Mobile,
										"Website": $scope.properties[0].Website,
										"Email": $scope.properties[0].Email,
										"VAT_TaxNo": $scope.properties[0].VAT_TaxNo,
										"Logo": $scope.properties[0].Logo,
										"Latitude": $scope.properties[0].Latitude,
										"Longitude": $scope.properties[0].Longitude,
										"AutoSMSBookingClientNotif": (($scope.properties[0].AutoSMSBookingClientNotif=="1") ? true : false),
										"AutoSMSBookingPropertyNotif": ($scope.properties[0].AutoSMSBookingPropertyNotif=="1"?true:false),
										"AutoEmailBookingClientNotif":  ($scope.properties[0].AutoEmailBookingClientNotif=="1"?true:false),
										"AutoEmailBookingPropertyNotif":  ($scope.properties[0].AutoEmailBookingPropertyNotif=="1"?true:false),
										"PropertyNotificationEmail": ($scope.properties[0].PropertyNotificationEmail==null || $scope.properties[0].PropertyNotificationEmail=="null" ? '' : $scope.properties[0].PropertyNotificationEmail),
										"PropertyNotificationMobile": ($scope.properties[0].PropertyNotificationMobile==null || $scope.properties[0].PropertyNotificationMobile=="null" ? '' : $scope.properties[0].PropertyNotificationMobile)
								};
								
									
								
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

		  $scope.update();
		  $scope.desc = [];
		  $scope.getDescriptions = function() {
				callserver(hostCallserver+"&object=Propertydesc&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
								for (var i in response.data) {
									$scope.desc.push(response.data[i]);
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
		  
		  $scope.getDescriptions();
		  
		  $scope.languages=$rootScope.languages;
		  $scope.lang=$rootScope.languages;
		  
		  $scope.addDesc = function(langcode) {
			  var exists=false;
			 
			  $scope.desc.forEach(function(de) {
				  if(de.LangCode== langcode) {
					  exists=true;
					  //return;
				  }
			  });
			  
			if(!exists){
			  	$scope.desc.push({
			  		ID: -1,
			  		LangCode: langcode,
			  		ShortDescription: '',
			  		LongDescription: ''
			  	});
			}
			
		  	$scope.languages = $rootScope.languages;
		  	
		  };
	
		  $scope.deletePropertyDesc = function(id,idx) {
		
			  callserver(hostCallserver+"&object=Propertydesc&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+id,function (response) {
					if (response.status == 'OK') {

						if(response.data.Status === undefined){
							$location.path("/settings/properties_details");
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
						} else {
							if(response.data.Status == "OK") { 
								$scope.desc.splice(idx,1);
								$location.path("/settings/properties_details");
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
							} else {
								$location.path("/settings/properties_details");
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();								
							}
						}

						} else {
							if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
								$location.path("/settings/properties_details");
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
							}
						}
				
				},$http,$scope);

			  
		  };
	
		  $scope.savePropertyDesc = function(data) {
				var lan = data.LangCode;//langTransService.getSelectedLanguage();

			  var tmes="";
			  if(data.ID==-1) {
				  tmes=hostCallserver+"&object=Propertydesc&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&LangCode="+lan+"&ShortDescription="+data.ShortDescription+"&LongDescription="+data.LongDescription;
			  } else {
				  tmes=hostCallserver+"&object=Propertydesc&method=Update&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&ShortDescription="+data.ShortDescription+"&LongDescription="+data.LongDescription+"&LangCode="+lan;
			  }
			  callserver(tmes,function (response) {
					if (response.status == 'OK') {

						if(response.data.Status === undefined){
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
						} else {
							if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
								//$scope.desc.splice(idx,1);
							} else {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();								
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
		  
	
		  
		  $scope.PropertyConfig=[];
		  
		  $scope.getPropertyConfig = function() {
				callserver(hostCallserver+"&object=PropertyConfig&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
									$scope.PropertyConfig=response.data[0];
									
									if($scope.PropertyConfig.SMSClientMessage!==undefined){
										$scope.PropertyConfig.SMSClientMessage=$scope.PropertyConfig.SMSClientMessage.replace(/\\n/g,"\n");
									}
									
									if($scope.PropertyConfig.SMSPropertyMessage!==undefined){
										$scope.PropertyConfig.SMSPropertyMessage=$scope.PropertyConfig.SMSPropertyMessage.replace(/\\n/g,"\n");
									}
									
									if($scope.PropertyConfig.EmailClientMessage!==undefined){
										$scope.PropertyConfig.EmailClientMessage=$scope.PropertyConfig.EmailClientMessage.replace(/\\n/g,"\n");
									}
									
									if($scope.PropertyConfig.EmailPropertyMessage!==undefined){
										$scope.PropertyConfig.EmailPropertyMessage=$scope.PropertyConfig.EmailPropertyMessage.replace(/\\n/g,"\n");
									}
									
									//SMSClientMessage
									//SMSPropertyMessage": "null",
								    //"EmailClientMessage": "null",
								    //"EmailPropertyMessage": "null"
									
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

		  $scope.getPropertyConfig();


		  $scope.savePropertyConfig = function() {
				
			//SMSClientMessage
				//SMSPropertyMessage": "null",
			    //"EmailClientMessage": "null",
			    //"EmailPropertyMessage": "null"
				
			  var vari="&SMSClientMessage="+$scope.PropertyConfig.SMSClientMessage.replace(/\n/g,"\\\\n")
						  +"&SMSPropertyMessage="+$scope.PropertyConfig.SMSPropertyMessage.replace(/\n/g,"\\\\n")
						  +"&EmailClientMessage="+$scope.PropertyConfig.EmailClientMessage.replace(/\n/g,"\\\\n")
						  +"&EmailPropertyMessage="+$scope.PropertyConfig.EmailPropertyMessage.replace(/\n/g,"\\\\n");
			  
			  var tmes="";
			  if($scope.PropertyConfig.ID===undefined) {
				  tmes=hostCallserver+"&object=PropertyConfig&method=Insert&token="+$rootScope.credentials.currentUser.token
				  +"&FK_Property="+$rootScope.globals.fk_property.id
				  +vari;
			  } else {
				  tmes=hostCallserver+"&object=PropertyConfig&method=Update&token="+$rootScope.credentials.currentUser.token
				  +"&FK_Property="+$rootScope.globals.fk_property.id
				  +"&ID="+$scope.PropertyConfig.ID
				  +vari;
			  }
			  
			  callserver(tmes,function (response) {
					if (response.status == 'OK') {

						if(response.data.Status === undefined){
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
						} else {
							if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
								//$scope.desc.splice(idx,1);
							} else {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();								
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

		  $scope.map = {
		  	show: true,
		  	control: {},
		  	bounds: {},
		  	center: {
		  		latitude: 45,
		  		longitude: -73
		  	},
		  	zoom: 8,
		  	clickedMarker: {
		  		id: 0,
		  		options: {}
		  	},
		  	events: {
		  		tilesloaded: function(map, eventName, originalEventArgs) {},
		  		click: function(mapModel, eventName, originalEventArgs) {
		  			var e = originalEventArgs[0];
		  			var lat = e.latLng.lat(),
		  				lng = e.latLng.lng();

		  			$scope.map.clickedMarker = {
		  				id: 0,
		  				options: {
		  					labelContent: 'You clicked here lat: ' + lat + ', lng: ' + lng,
		  					labelClass: "marker-labels",
		  					labelAnchor: "50 0"
		  				},
		  				coords: {
		  					latitude: lat,
		  					longitude: lng
		  				}
		  			};
		  			$scope.$apply();
		  		}
		  	}
		  };

		  
  });
