/**
 * Cube - Bootstrap Admin Theme
 * Copyright 2014 Phoonio
 */




function signinCtrl($scope, $http,  $cookieStore, $rootScope, $timeout, $location, $window,langTransService,webConstants) {
	var original;
	var hostCallserver =webConstants.hostCallserver;

	
	$scope.login = function () {
		//$scope.dataLoading = false;
		// $scope.error = false;
		 
		callserver(hostCallserver+"&object=Login&method=Login&Email="+$scope.username+"&Password="+$scope.password,function (response) {
		
			if (response.status == 'OK') {
				if (response.data.Status == 'OK') {
					$scope.token = response.data.token;
					//AuthenticationService.SetCredentials($scope.username, $scope.password, $scope.token);
					
					if($rootScope.credentials === undefined) {
						$rootScope.credentials = {};
					}
					
					$rootScope.credentials.currentUser = {
								username: $scope.username,
								token: response.data.token
								};
					
					$cookieStore.put('credentials', $rootScope.credentials);
		
		//.......................................
                    callserver(hostCallserver+"&method=MyRights&object=Users&token="+$rootScope.credentials.currentUser.token,function (response) 
                    {   
                        if (response.status == 'OK') 
                        {  
                        	 
                            $rootScope.globals.fk_rightsResponse = response;  

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


                        }       
                    },$http,$scope);
 
        //....................................
					
					
				} else {
                   new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
                   // new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Email / Password Mismatch</p>","error","growl","slide").log();
				}
			}
			
			
		}
		,$http,$scope);

	}
	
	}

//.........sign in  ctrl ends
function logger(message, severity, type, effect) {
	
	if(type==='undefined' || type=="") { 
		this.type = "bar" 
	} else {
		this.type=type;
	}
	
	this.message=message;
	
	if(severity==='undefined' || severity=="") {
		this.severity = "error";
	} else {
		this.severity = severity;
	}
	
	if(effect==='undefined' || effect=="") {
		this.effect="slidetop";
	} else {
		this.effect = effect;
	}
	this.log = function () {
		
		
			// create the notification
		//'<span class="icon fa fa-bullhorn fa-2x"></span><p>You have some interesting news in your inbox. Go <a href="">check it out</a> now.</p>'	
		var notification = new NotificationFx({
				message : this.message,
				layout : this.type, //bar, attached, growl
				effect : this.effect, //scale, jelly, slide, 'slidetop'
				type : this.severity, // notice, warning or error
				onClose : function() {}
			});

			// show the notification
			notification.show();
			
		
		
	};
}

function errorLogger(message) {
    this.severity = "error";
    this.type = "growl";
    this.effect = "slide";
    this.message = "<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>" + message + "</p>";
    this.log = function() {
        var notification = new NotificationFx({
            message: this.message,
            layout: this.type,
            effect: this.effect,
            type: this.severity,
            onClose: function() {
            }
        });
        notification.show();
    };
}

 function signoutCtrl ($http, $cookieStore, $scope, $rootScope, $location, $window) {
	$scope.signout = function () {
		$rootScope.globals = {};
		$cookieStore.remove('credentials');
		localStorage.removeItem('globals'); // TODO add remove languages & countries??
		$http.defaults.headers.common.Authorization = 'Basic ';
		
		//$location.path('/pages/signin');
		$window.location.href = '/signin.html';
	}
 }
 
function callserver(message, callback, $http, $rootScope) {
		

		var url = $rootScope.globals.serverUrl+message;

		///bearcrsl?callback=JSON_CALLBACK&object=Login&method=Login&Email="+username+"&Password="+password;
		
		var response = {};
		

		return $http.jsonp(url)
			.then(function(data) {
				response.status = "OK";
				response.data=data.data;
				callback(response);
			}, function(data) {
				//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Server Error - Please Refresh Page</p><p>Error: "+data.data+"</p>","error","growl","slide").log();
				
				new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
				response.status = "ERROR";
				response.data=data.data;
				callback(response);
			});
	

/*		return $http.jsonp(url)
			.success(function(data) { 
				response.status = "OK";
				response.data=data;
				callback(response);
			}).error(function(data) {  
				new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Server Error - Please Refresh Page</p><p>Error: "+data+"</p>","error","growl","slide").log();
				response.status = "ERROR";
				response.data=data; 
				callback(response);
			});
*/	
}

function userCtrl($scope, $rootScope, $http, $cookieStore,webConstants, $window) {
	var hostCallserver =webConstants.hostCallserver;
	$scope.currentUser={};
	$scope.currentUser.name="";
	
	//$scope.userCompany=$rootScope.globals.fk_property.fk_company;
	
	$scope.avatarlink="";
	
	if($rootScope.credentials.currentUser.id === undefined){
	callserver(hostCallserver+"&method=WhoAmI&object=Users&token="+$rootScope.credentials.currentUser.token,function (response) {
		
		if (response.status == 'OK') {
			
			$rootScope.credentials.currentUser.id = response.data[0].ID;
			$rootScope.credentials.currentUser.username = response.data[0].Username;
			$rootScope.credentials.currentUser.name = response.data[0].Name;
			$rootScope.credentials.currentUser.email = response.data[0].Email;
			$rootScope.credentials.currentUser.phone = response.data[0].Phone;
		
			$cookieStore.put('credentials', $rootScope.credentials);
			
		}
		
		
		$scope.currentUser = $rootScope.credentials.currentUser;
		$scope.avatarlink="http://storage.googleapis.com/bearcrs/"+$rootScope.globals.fk_property.fk_company+"/users/user."+$scope.currentUser.id+"?_ts=" + new Date().getTime();
		
	},$http,$scope);
	
	} else {
		$scope.currentUser = $rootScope.credentials.currentUser;
		$scope.avatarlink="http://storage.googleapis.com/bearcrs/"+$rootScope.globals.fk_property.fk_company+"/users/user."+$scope.currentUser.id+"?_ts=" + new Date().getTime();
	}

	
	
	
	if ($rootScope.countries === null) {
		callserver(hostCallserver+"&object=Reference&method=ListAll&table=Country&token="+$rootScope.credentials.currentUser.token,function (response) {
				if(response.data.Status === undefined){
					if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
						$rootScope.countries = response.data;
						localStorage.setItem("countries",JSON.stringify($rootScope.countries));
					}

				} else {
					if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
					}
				}

		
		},$http,$scope);
	}
	
	
	if ($rootScope.languages === null) {
		callserver(hostCallserver+"&object=Lang&method=List&token="+$rootScope.credentials.currentUser.token,function (response) {
				if(response.data.Status === undefined){
					if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
						$rootScope.languages = response.data;
						localStorage.setItem("languages",JSON.stringify($rootScope.languages));
					}

				} else {
					if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
					}
				}

		
		},$http,$scope);
	}

//$rootScope.$on('$includeContentLoaded', function() {
    //do your will
	
angular.element($window).bind('load', function() {
  // here not only the page is loaded, 
  // but also all asynchronous requests are completed
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();

if($window.Tawk_API===undefined) $window.Tawk_API = {};

$window.Tawk_API.visitor = {
      name  : $scope.currentUser.name,
      email : $scope.currentUser.email
    };


  (function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/5636388d058f638305223830/default';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
  })();


// Tawk_API.onBeforeLoad = function(){
//   //place your code here

  //var scope = angular.element($("#usercontrol")).scope();
  //var uname= scope.currentUser.name;

  
 
});


}


function propertyCtrl($scope, $rootScope, $http,$cookieStore, $route,langTransService,webConstants) {
	
	//var vm = this;
	var hostCallserver =webConstants.hostCallserver;
	$scope.loading = true;
	
	$scope.mainProperty = {
			"id" : "",
			"name" : "",
			"img" : "/img/header__sub__logo.png",
			"fk_company" : ""
		}
		
		$scope.getProperties = function (mainPropertyId) {

			if($rootScope.globals.fk_propertylist === undefined) {
				//var token = $rootScope.credentials.currentUser.token;
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
							
					
							
								// update rootScope
								//$rootScope.globals.fk_property = $scope.mainProperty;
								$rootScope.globals.fk_propertylist = $scope.properties;
							 
								$rootScope.globals.fk_property = $rootScope.globals.fk_propertylist[(findid($rootScope.globals.fk_propertylist,$scope.mainProperty.id) || 0)];
								
								$scope.updatepropertyinfo($scope.mainProperty.id);
								
								//$cookieStore.put('globals', $rootScope.globals); 
								localStorage.setItem("globals",JSON.stringify($rootScope.globals));
								//localStorage.setItem("fk_propertylist",JSON.stringify($rootScope.globals.fk_propertylist));
						}
						
						
					},$http,$scope);
				
			} else {
				$scope.properties=$rootScope.globals.fk_propertylist;
				
				$rootScope.globals.fk_property = $rootScope.globals.fk_propertylist[(findid($rootScope.globals.fk_propertylist,mainPropertyId) || 0)];
				$scope.mainProperty = $rootScope.globals.fk_property;
				$scope.updatepropertyinfo($rootScope.globals.fk_property.id);

				localStorage.setItem("globals",JSON.stringify($rootScope.globals));
				
				
				
				$route.reload();
			}
		};
	
	
		$scope.updatepropertyinfo =function(propertyid) {
			
			this.propertyid=propertyid;
			//get property information
			//get roomtypes
			 var lan = langTransService.getSelectedLanguage();
			var id=findid($rootScope.globals.fk_propertylist,propertyid);
			
			
			if($rootScope.globals.fk_propertylist[id].roomtypes === undefined ) {
				$rootScope.globals.fk_propertylist[id].roomtypes = [];
			}
				if($rootScope.globals.fk_propertylist[id].roomtypes.length==0) {
					callserver(hostCallserver+"&object=RoomType&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_propertylist[id].id+"&Lang="+lan,function (response) {
						
						if (response.status == 'OK') {
							
							if(response.data.Status === undefined){
							/*
								for (var i in response.data) {
								$rootScope.globals.fk_propertylist[id].roomtypes.push({
									"id": response.data[i].ID,
									"langcode": response.data[i].LangCode,
									"shortdescription": response.data[i].ShortDescription,
									"longdescription": response.data[i].LongDescription,
									"occupancyadults": response.data[i].OccupancyAdults,
									"occupancychildren": response.data[i].OccupancyChildren
								});
							}
							*/
								
							$rootScope.globals.fk_propertylist[id].roomtypes=response.data;
							
							if($rootScope.globals.fk_property.id==propertyid) {
								$rootScope.globals.fk_property=$rootScope.globals.fk_propertylist[id];
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
				
			//get rooms
			if($rootScope.globals.fk_propertylist[id].roomlist === undefined ) {
				$rootScope.globals.fk_propertylist[id].roomlist = [];
			}
				if(Object.keys($rootScope.globals.fk_propertylist[id].roomlist)<=0) {
				
					callserver(hostCallserver+"&object=Room&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_propertylist[id].id,function (response) {
						
						if (response.status == 'OK') {
							
							
							if(response.data.Status === undefined){
								if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
									for (var i in response.data) {
										//$scope.roomList[data[i].ID] = data[i].Number;
										$rootScope.globals.fk_propertylist[id].roomlist.push({
												"id": response.data[i].ID,
												"fk_roomtype": response.data[i].FK_RoomType,
												"fk_roomstatustype": response.data[i].FK_RoomStatusType,
												"number": response.data[i].Number,
												"floor": response.data[i].Floor,
												"comment": response.data[i].Comment
										});
									}
								}
								
								if($rootScope.globals.fk_property.id==propertyid) {
									$rootScope.globals.fk_property=$rootScope.globals.fk_propertylist[id];
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
				
			//$cookieStore.put('globals', $rootScope.globals);
			localStorage.setItem("globals",JSON.stringify($rootScope.globals));
			
		}
	
		
		$scope.getProperties();
		
		$scope.$on("reloadProperties", function () {
				$scope.getProperties();
			});
		
		$scope.loading = false;
		
}

function findid (where, what){
	
	var ret;
	if(what === undefined || where === undefined) {
		return ret;
	}
	if(where.constructor.toString().indexOf("Array") > -1) {
		var i;
		where.some(function(entry, index) {
			if (entry.id === what || entry.ID === what) {
				i = index;
				return true; // Stops loop
			}
		});
		
		if (typeof i !== "undefined") {
			ret=i;
		}
		
	}
	
	return ret;
	
}

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
	var d = new Date(inputFormat);
	return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
}

function convertDateToDash(inputFormat) {
	function pad(s) { return (s < 10) ? '0' + s : s; }
	var d = new Date(inputFormat);
	return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

/*function emailCtrl($scope) {
	if (!$('#page-wrapper').hasClass('nav-small')) {
		$('#page-wrapper').addClass('nav-small');
	}
}*/





	
	
	
	
	
	

	
	
	
	
	
	
	
	function modalupdatepwCtrl ($http, $scope, $modalInstance, $rootScope, id,webConstants) {
			var hostCallserver =webConstants.hostCallserver;
		  $scope.id = id;
		  $scope.edited=false;
		  $scope.luis="luis";
		  
		  $scope.ok = function () {
		    $modalInstance.close($scope.selected.item);
		  };

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
		  
		  
		  $scope.updatepw = function (id, pw) {
			  
			  var com="";

			  if(!(pw === undefined)) {
				  if(pw.length>0){
			  com=hostCallserver+"&object=Users&method=Update&token="+$rootScope.credentials.currentUser.token+"&ID="+id+"&PasswordHash="+pw;
			  
			  callserver(com,function (response) {
					
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
			  }
			  }
			  $scope.cancel();
			  
			  
		  };
		  
	}
	
	

	
	

	function settingscompanyCtrl ($scope, $rootScope, $http) {
	
		$scope.status = [];
		$scope.status.openusers = false;
		
	}
	
	

	
		
angular
	.module('bearpms3App')
	.controller('propertyCtrl', propertyCtrl)
	.controller('userCtrl',userCtrl)
	.controller('signoutCtrl',signoutCtrl)
	.controller('settingscompanyCtrl',settingscompanyCtrl)
	.controller('modalupdatepwCtrl',modalupdatepwCtrl);

	//.controller('mainCtrl', mainCtrl)*/
	//.controller('emailCtrl', emailCtrl)
	//.controller('easyChartCtrl', easyChartCtrl)//
	//.controller('dashboardFlotCtrl', dashboardFlotCtrl)
	//.controller('translationCtrl', translationCtrl)
	//.controller('bookingListTableCtrl', bookingListTableCtrl)
	//.controller('customersCtrl', customersCtrl)
	//.controller('invoicesCtrl', invoicesCtrl)//
   // .controller('reportingCtrl', reportingCtrl)//
	//.controller('ModalInstanceCtrl', ModalInstanceCtrl)//
	//.controller('createBookingCtrl', createBookingCtrl)//
	//.controller('bookingModalCtrl', bookingModalCtrl)//
	//.controller('editBookingModalCtrl', editBookingModalCtrl)//
	//.controller('CompanyUserCtrl', CompanyUserCtrl)//
	//.controller('companyCtrl', companyCtrl)//
	//.controller('propertyDetailsCtrl', propertyDetailsCtrl)//
	//.controller('calendarCtrl', calendarCtrl)//
	//.controller('companyrolesCtrl', companyrolesCtrl)//
	//.controller('modaluserrightsCtrl', modaluserrightsCtrl)//
