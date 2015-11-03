'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:CompanyuserCtrl
 * @description
 * # CompanyuserCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('CompanyUserCtrl', function ($uibModal, $scope, $rootScope, $http, DTOptionsBuilder, DTColumnDefBuilder, Upload,webConstants, $translate) {
		var hostCallserver =webConstants.hostCallserver;
  		 //....seting roles
		$scope.rightValue =false;
		$scope.rightValue2=false;
		$scope.rightsValues = $rootScope.globals.fk_rightsResponse;
		if($scope.rightsValues.data[0].Users === 1 )
  			$scope.rightValue=true;
  		else if($scope.rightsValues.data[0].Users === 2 )
  			$scope.rightValue2=true;
  		//....seting roles ends
		
		$scope.users=[];


		$scope.UserAccessTemplateURL="UserAccessPopoverTemplate.html";


		var vm = this;
		vm.users=[];


	    $rootScope.$on('$translateChangeSuccess', function () {
		    $scope.vm();
    	});


		$scope.vm = function()
    { 
	    var trans=[];

    	trans=$translate.instant(['TABLE_SEARCH_PLACEHOLDER','TABLE_EMPTY','TABLE_LOADING','TABLE_PROCESSING','TABLE_ZERO_RECORDS', 'TABLE_COPY', 'TABLE_FIRST', 'TABLE_LAST', 'TABLE_NEXT', 'TABLE_PREVIOUS', 'PDF_MESSAGE']);


	    vm.dtOptions = DTOptionsBuilder.newOptions()
	    .withPaginationType('full_numbers')
	    .withDisplayLength(10)
	    //.withDOM('<"clearfix"f>t<"bottom"rp>') //T<"clearfix"f>t<"bottom"rp>
	    .withDOM('T<"clearfix"f>t<"bottom"rp>')
	    .withTableTools('/swf/copy_csv_xls_pdf.swf')
	    //.withOption('responsive', true)
	    .withOption('sScrollx', "100%")
	    .withOption('bScrollX', true)
	    //must add multilingual options
	    .withLanguage({
	    	'sSearch' : "",
	    	"searchPlaceholder": trans.TABLE_SEARCH_PLACEHOLDER || 'Search...' ,
	    	"sEmptyTable":     trans.TABLE_EMPTY,
	    	"sLoadingRecords": trans.TABLE_LOADING,
            "sProcessing":     trans.TABLE_PROCESSING,
            "sZeroRecords":   trans.TABLE_ZERO_RECORDS,
            "paginate": {
				        "first":      trans.TABLE_FIRST || 'First',
				        "last":       trans.TABLE_LAST || 'Last',
				        "next":       trans.TABLE_NEXT || 'Next',
				        "previous":   trans.TABLE_PREVIOUS || 'Previous'
				    }
	    	})
	    
	    .withTableToolsButtons([
            {
                "sExtends": "copy",
                "sButtonText": trans.TABLE_COPY,
                "mColumns": [1, 4, 5],
            },
            {
                "sExtends": "csv",
                "mColumns": [ 1, 4 , 5 ],
            },
            {
                "sExtends": "xls",
                "mColumns": [ 1,4,5 ],
            }, 
            {
                "sExtends": "pdf",
                "sPdfOrientation": "landscape",
                "mColumns": [ 1,4,5 ],
                "sPdfMessage": trans.PDF_MESSAGE
            }
        ]);
	    
	    
		
	    
	    vm.dtColumnDefs = [
	        DTColumnDefBuilder.newColumnDef(0).notSortable().withOption("bSearchable","false"),
	        DTColumnDefBuilder.newColumnDef(1),
	        DTColumnDefBuilder.newColumnDef(2),
	        DTColumnDefBuilder.newColumnDef(3),
	        DTColumnDefBuilder.newColumnDef(4).notSortable().withOption("bSearchable","false"),
	        DTColumnDefBuilder.newColumnDef(5).notSortable().withOption("bSearchable","false"),
	        DTColumnDefBuilder.newColumnDef(6).notSortable().withOption("bSearchable","false")
	        //DTColumnDefBuilder.newColumnDef(7).notSortable().withOption("bSearchable","false")
	        //DTColumnDefBuilder.newColumnDef(9),
	        //DTColumnDefBuilder.newColumnDef(10).notSortable().withOption("bSearchable","false"),
	        //DTColumnDefBuilder.newColumnDef(11).notSortable().withOption("bSearchable","false")
	    ];
		
		
		//vm.users = $scope.users;
    			
	}		
		
	$scope.vm ();
	 //............vm ends
		
		  $scope.oneAtATime = true;

		    
		  
		  
		  
		  $scope.adduser = function () {
			  
			  //$scope.users.push({
			$scope.users=[{
					"ID": -1,
					"Username": "",
					"Name": "",
					"Email": "",
					"Phone": "",
					"FK_Company": $rootScope.globals.fk_property.fk_company,
					"Rights": [],
					"DeletedOn": "null",
					"Active": true,
					"NewUser": true,
					"isRoot": false,
					"Avatar": "http://storage.googleapis.com/bearcrs/nuevah-logo-bear-black-c-50x50.png?_ts=" + new Date().getTime(),
					"EmailVerified": false,
					"LastTransaction": "",
					"LastIPAccess": ""
			}];
			
			vm.users=$scope.users;
			  
		  }

		  $scope.clickNewValue = function(value,ind)
		  {
		  	console.log(" click new value : ",value,ind);
		  	if(value === "New User")
		  		$scope.users[ind].Name = "";
		  	if(value === "New Email")
		  		$scope.users[ind].Email = ""; 
		  	if(value === "New Phone")
		  		$scope.users[ind].Phone = ""; 
		  	
		  }
		  
		  //http://{{URL}}/bearcrsl?callback&method=List&object=Users&token={{token}}&FK_Property=14&SK_Company=1
		  
		 
		  function isImage(src) {

		    var deferred = $q.defer();

		    var image = new Image();
		    image.onerror = function() {
		        deferred.resolve(false);
		    };
		    image.onload = function() {
		        deferred.resolve(true);
		    };
		    image.src = src;

		    return deferred.promise;
		}
		  
		  
		  $scope.getuserlist = function (specificuser) {
		  	
		  	if(specificuser===undefined)
			  $scope.users=[];

				var stemp = hostCallserver+"&object=Users&method=ListUsersRoles&token="+$rootScope.credentials.currentUser.token+"&FK_Company="+$rootScope.globals.fk_property.fk_company+(specificuser===undefined?"":"&ID="+specificuser);
				callserver(stemp,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
								for (var i in response.data) {
									
									var isRoot=false;
									for (var x in response.data[i].Rights) {
										if(response.data[i].Rights[x].FK_Role=="9999") {
											isRoot=true;
										}
									}
									var compid=response.data[i].FK_Company;
									
									if(compid==null || compid=="null") {
									//if(response.data[i].Rights.length>0) {
									//	compid=response.data[i].Rights[0].FK_Company;
									//} else {
										compid=$rootScope.globals.fk_property.fk_company;
									//}
									}
									

									var r=[];

									if(response.data[i].Rights == "null") {
										response.data[i].Rights = [];
									}

									if(response.data[i].Rights.length>0) {
										response.data[i].Rights.forEach(function(v, i){
											var id = v.FK_Property;
											var propName = $rootScope.globals.fk_propertylist[(findid($rootScope.globals.fk_propertylist,id) || 0)];
											v.propertyName = propName.name;

										});	
									}

									var suidx;
									if(specificuser!==undefined) {
										suidx=findid($scope.users,specificuser);
									
										$scope.users[suidx]={
											"ID": response.data[i].ID,
											"Username": response.data[i].Username,
											"Name": response.data[i].Name,
											"Email": response.data[i].Email,
											"Phone": response.data[i].Phone,
											"FK_Company": response.data[i].FK_Company,
											"Rights": response.data[i].Rights,
											"DeletedOn": response.data[i].DeletedOn,
											"Active": (response.data[i].DeletedOn=="null"?true:false),
											"NewUser": false,
											"isRoot": isRoot,
											"Avatar": "http://storage.googleapis.com/bearcrs/"+compid+"/users/user."+response.data[i].ID+"?_ts=" + new Date().getTime(),
											"EmailVerified": (response.data[i].EmailVerified==1?true:false),
											"LastTransaction": (response.data[i].LastTransaction=="null"?"":response.data[i].LastTransaction),
											"LastIPAccess": (response.data[i].LastIPAccess=="null"?"":response.data[i].LastIPAccess)
									};

									vm.users[findid(vm.users,specificuser)] = $scope.users[suidx];								

									} else {


									$scope.users.push({
											"ID": response.data[i].ID,
											"Username": response.data[i].Username,
											"Name": response.data[i].Name,
											"Email": response.data[i].Email,
											"Phone": response.data[i].Phone,
											"FK_Company": response.data[i].FK_Company,
											"Rights": response.data[i].Rights,
											"DeletedOn": response.data[i].DeletedOn,
											"Active": (response.data[i].DeletedOn=="null"?true:false),
											"NewUser": false,
											"isRoot": isRoot,
											"Avatar": "http://storage.googleapis.com/bearcrs/"+compid+"/users/user."+response.data[i].ID+"?_ts=" + new Date().getTime(),
											"EmailVerified": (response.data[i].EmailVerified==1?true:false),
											"LastTransaction": (response.data[i].LastTransaction=="null"?"":response.data[i].LastTransaction),
											"LastIPAccess": (response.data[i].LastIPAccess=="null"?"":response.data[i].LastIPAccess)
									});

									}
		
								}
								
							}

						} else {
							if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+"</p>","error","growl","slide").log();
							}
						}
						
						if(specificuser===undefined) { 
							vm.users = $scope.users;	
						}
					}
				
				},$http,$scope);   
				
				
			} 
		  
		 
		  $scope.updatedata = function(id, data, idx) {
				//console.log("update data : : : 00",data ,id,idx);
			  var dataString;
				var sqlt="";
				
				if(!data.Email) return;

				if(data.NewUser){
					
					dataString = $.param({
						"Name": data.Name,
						"UserName": data.Name,
						"Phone": data.Phone,
						"Email": data.Email,
						"FK_Company": data.FK_Company
					});
					//console.log("dataString : : ",dataString);
					sqlt=hostCallserver+"&object=Users&method=Insert&token="+$rootScope.credentials.currentUser.token+"&"+dataString;
				} else {
					
					dataString = $.param({
						"Name": data.Name,
						"Phone": data.Phone,
						"Email": data.Email
					});

					
					sqlt=hostCallserver+"&object=Users&method=Update&token="+$rootScope.credentials.currentUser.token+"&ID="+id+"&"+dataString;
				}
				
				callserver(sqlt,function (response) {
					//console.log("response : response : ",response);
					if (response.status == 'OK') {
						
						data.edited = false;
						if(response.data.Status === undefined){
						
						} else {
							if(response.data.Status == "OK") {
									new logger("<p>Data Saved</p>","notice","growl","slide").log();
									
									if(data.NewUser) {
									//$scope.users[idx].ID=response.data.ID;
									//$scope.users[idx].NewUser=false;
									//vm.users[idx].ID=response.data.ID;
									//vm.users[idx].NewUser=false;
									$scope.users=[];
									$scope.getuserlist();
									}
									
									
							} else {
								vm.users.splice(idx,1);
								if(response.data.INTERNALERROR ==="com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException: Duplicate entry 'New Email' for key 'uniqueemails'")
								{
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+"This email already exists"+" </p>","error","growl","slide").log();
						
								}
								else
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
				
				
				};
		  
				$scope.removerow = function (idx) {
					vm.users.splice(idx,1);
					
				};
		  
				$scope.remove = function(idx) {
					
					var itemtodelete = $scope.users[idx];
					var com="";
					
					if($scope.users[idx].Active){
						
						com=hostCallserver+"&object=Users&method=Delete&token="+$rootScope.credentials.currentUser.token+"&ID="+$scope.users[idx].ID;
					
					} else {
						
						com=hostCallserver+"&object=Users&method=Update&token="+$rootScope.credentials.currentUser.token+"&ID="+$scope.users[idx].ID+"&DeletedOn=null";
						
					}
					
					
					
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
					
					//$scope.users.splice(idx,1);
					
					};
		  
		  
		  $scope.getuserlist();
		  
		  
		  		$scope.openmodalupdatepw = function (id) {
		  			var size="";
			    var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: '/views/updatepw.html',
			      controller: 'modalupdatepwCtrl as store',
			      //windowTemplateUrl: '/views/modaltemplate.html',
			      windowClass: 'tiny-modal',
			      size: size,
			      resolve: {
			        id: function () {
			          return id;
			        }
			      }
			    });
		  		}
		  
		  		
				$scope.openmodalupdateuserrolerights = function (id, user) {
		  			var size="";
			    var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: '/views/updateuserrolerights.html',
			      controller: 'modaluserrightsCtrl',
			      //windowTemplateUrl: '/views/modaltemplate.html',
			      windowClass: 'small-modal',
			      size: size,
			      resolve: {
			        id: function () {
			          return id;
			        },
			        user: function () {
			        	return user;
			        }
			      }
			    });
			    
			    modalInstance.result.then(function (userreturned) {
			    	//$scope.getuserlist(id,userreturned);
			    	if(userreturned.Rights.length>0) {
						userreturned.Rights.forEach(function(v, i){
							var id = v.FK_Property;
							var propName = $rootScope.globals.fk_propertylist[(findid($rootScope.globals.fk_propertylist,id) || 0)];
							v.propertyName = propName.name;

						});	
					}


			    	$scope.users[findid($scope.users,userreturned.ID)].Rights=userreturned.Rights;
			    	vm.users[findid(vm.users,userreturned.ID)].Rights=userreturned.Rights;


			      });
			    
			    };
			    
			
				 $scope.viewdeletedusers=true;
				 
				 $scope.onlyActiveUsers = function (element) {
					
					 if(element===undefined) return true;
					
					
					 if(!$scope.viewdeletedusers) return true;
					
					 if(element.Active) {
						return true;
					} else {
						return false;
					}
					 
				 };

				
				 $scope.uploadAvatar = function (files,userID) {
					
					 
					 if(files.length>0) {
					 
					 	var uploadUrl = $rootScope.globals.serverUrl+"/gcs/bearcrsuploadimages?callback=callback&object=Users&method=AddImage&FK_Company="+$rootScope.globals.fk_property.fk_company+"&token="+$rootScope.credentials.currentUser.token+"&FK_User="+userID;

					 	Upload.upload({
		                    url: uploadUrl,
		                    file: files[0]
		                }).success(function(data) {
		                	
		                	var idx=findid($scope.users,userID);	
		                	
		                	var compid=$rootScope.globals.fk_property.fk_company;

		                	$scope.users[idx].Avatar="http://storage.googleapis.com/bearcrs/"+compid+"/users/user."+userID+"?_ts=" + new Date().getTime();
		                	
		                	
		                	
		                	
		                	new logger("<p>Data Saved</p>","notice","growl","slide").log();
		                	
						}).error(function(data) {
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Server Error - Please Refresh Page</p><p>Error: "+data+"</p>","error","growl","slide").log();
							
						});
					    
					 }
					 
				 };
			
		  		
		  
		
    //
  });
