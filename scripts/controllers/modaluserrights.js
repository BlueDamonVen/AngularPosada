'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:ModaluserrightsCtrl
 * @description
 * # ModaluserrightsCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('modaluserrightsCtrl', function  ($http, $scope, $modalInstance, $filter, $rootScope, id, user, $q,webConstants) {
		var hostCallserver =webConstants.hostCallserver;
		//$scope.luis=id;
		$scope.user=user;
		$scope.roles=[];
		$scope.edited=false;
		
		$scope.properties=$rootScope.globals.fk_propertylist;
		
		 $scope.ok = function () {
			    $modalInstance.close($scope.user);
		};
		
		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
		  
		$scope.getRoles = function() {
			

				 //get roles
				var stemp=hostCallserver+"&object=Roles&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Company="+$rootScope.globals.fk_property.fk_company;
			  
				callserver(stemp,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
									$scope.roles=response.data;
							}	
						} else {
							if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();

							}
						}
					}
				
				},$http,$scope);   
	
		};
		
		$scope.getRoles();
				
		$scope.showProperty = function(vid) {
		    var selected = $filter('filter')($scope.properties, {id: vid}, true);
		    return (selected.length) ? selected[0].name : $translate.instant('GENERAL_NOT_SET');
		  };
				
		
		  $scope.showRole = function(vid) {
			    var selected = $filter('filter')($scope.roles, {ID: vid},true);
			    return ($scope.roles && selected.length) ? selected[0].Description : $translate.instant('GENERAL_NOT_SET');
			  };
			
		  $scope.addRole = function() {
			  
			  $scope.user.Rights.push({
				  "ID": -1,
				  "FK_Role": 0,
				  "FK_User": $scope.user.ID,
				  "FK_Property": 0,
				  "FK_Company": $rootScope.globals.fk_property.fk_company,
				  "Description": "",
				  "NewRight": true
					  
			  });
			  
			  $scope.edited=true;
			  
		  };
		  
		  $scope.changedRight = function (idx) {
			
			  if($scope.user.Rights[idx].NewRight===undefined) $scope.user.Rights[idx].Edited = true;
			  $scope.edited=true;
			  
		  };
		  
		  $scope.updateRights = function() {
			
			  $scope.user.Rights.forEach(function(rig,i) {

			  	$scope.user.Rights[i].Description=$scope.roles[findid($scope.roles,rig.FK_Role)].Description;


				  var stemp="";
				  
				  //todo udate api calls to update and insert into rights
				
				  var sendmessage=true;
				  
				  if(!(rig.NewRight===undefined)){
					  if(rig.FK_Role!=0 && rig.FK_Property!=0){
						  var stemp=hostCallserver+"&object=Rights&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_Company="+$rootScope.globals.fk_property.fk_company+"&FK_User="+$scope.user.ID+"&FK_Property="+rig.FK_Property+"&FK_Role="+rig.FK_Role;
					  } else {sendmessage=false;}
				  } else {
					  if(!(rig.Edited===undefined)){
						  var stemp=hostCallserver+"&object=Rights&method=Update&token="+$rootScope.credentials.currentUser.token+"&ID="+rig.ID+"&FK_Role="+rig.FK_Role+"&FK_Property="+rig.FK_Property+"&FK_Company="+$rootScope.globals.fk_property.fk_company;
					  } else {
						  sendmessage=false;
					  }
				  }
				  
				  if(sendmessage){
				  callserver(stemp,function (response) {
							if (response.status == 'OK') {
								if(response.data.Status === undefined){
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
								} else {
									if(response.data.Status == "OK") {
										new logger("<p>Data Saved</p>","notice","growl","slide").log();
										//update ok
									} else {
										new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
										//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
										//$scope.cancel();
									}
								}
								
								//vm.users = $scope.users;	
							}
						
						},$http,$scope);   
				  }
			  });
			  
$scope.user

			  $scope.ok();
			  
		  };
		 
		  
		  $scope.removeRole = function (idx, data) {
			
			  if(data.NewRight === undefined){
			  var stemp=hostCallserver+"&object=Rights&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&ID="+data.ID;
				  
					callserver(stemp,function (response) {
						if (response.status == 'OK') {
							if(response.data.Status === undefined){
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
								
							} else {
								if(response.data.Status == "OK") {
									new logger("<p>Data Saved</p>","notice","growl","slide").log();
									
									$scope.user.Rights.splice(idx,1);
									
								} else {
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
								}
							}
							
							//vm.users = $scope.users;	
						}
					
					},$http,$scope);   
			  
			  } else {
				  $scope.user.Rights.splice(idx,1);
			  }
					
		  };

    //
  });
