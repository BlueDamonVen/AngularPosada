
function settingsPropertyImagesCtrl ($scope, $rootScope, $http,webConstants) {
		 var host=webConstants.host;
		  
		  $scope.PropertyImages=[];
		  $scope.uploadUrl = host+"/gcs/bearcrsuploadimages?callback=callback&object=Property&method=AddImage&FK_Company="+$rootScope.globals.fk_property.fk_company+"&FK_Property="+$rootScope.globals.fk_property.id+"&fileextension=.png&token="+$rootScope.credentials.currentUser.token;
		  
		  
		  $scope.savePropertyImage = function() {
		  		var str = $.param($scope.property);
				callserver("/bearcrsl?callback=JSON_CALLBACK&object=Property&method=Update&token="+$rootScope.credentials.currentUser.token+"&"+str,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
						} else {
							if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();

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
		  
		  $scope.reorder = function() {
			  
			  for (var i in $scope.PropertyImages) {
				  $scope.PropertyImages[i].OrderID=i+1;
			  }
			  
			  //call reorder on backend
			  
		  }

		  $scope.getPropertyImages = function () {
				callserver("/bearcrsl?callback=JSON_CALLBACK&object=PropertyImages&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
								$scope.PropertyImages=[];
								for (var i in response.data) {
									$scope.PropertyImages.push(response.data[i]);
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

		  $scope.getPropertyImages();
		  
		  
		  $scope.removePropertyImages = function(idx,data) {
			  
		  		
				callserver("/bearcrsl?callback=JSON_CALLBACK&object=PropertyImages&method=Delete&token="+$rootScope.credentials.currentUser.token+"&ID="+data.ID+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
						} else {
							if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
								
								$scope.PropertyImages.splice(findid($scope.PropertyImages,data.ID),1);
								
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
		  
		  
	}
	

function settingsPropertyRoomTypeCtrl ($scope, $rootScope, $http, $sce) {
	
	$scope.openroomtypes=[];
	$scope.roomtypechanged=false;
	$scope.RoomTypeImages=[];
	$scope.RoomTypeAmenityList=[];
	
	$scope.rtchg = function () {
		$scope.roomtypechanged=true;
	};
	
	$scope.BedTypes=[
	    {"ID":1,"Name":"Single"},
	    {"ID":2,"Name":"Double"},
	    {"ID":3,"Name":"Queen"},
	    {"ID":4,"Name":"King"}
	    ];
	
	
	/*
	var id=findid($rootScope.globals.fk_propertylist,$rootScope.globals.fk_property.id);
	
	
	
	if($rootScope.globals.fk_propertylist[id].roomtypes === undefined ) {
		$rootScope.globals.fk_propertylist[id].roomtypes = [];
	}
	
	$scope.roomtypes=$rootScope.globals.fk_propertylist[id].roomtypes;
	
	for(var i in $scope.roomtypes) {
		$scope.roomtypes[i].RoomTypeDesc=[];
		$scope.roomtypes[i].RoomTypeImages=[];
		$scope.roomtypes[i].RoomTypeAmenityList=[];
		$scope.roomtypes[i].RoomTypeAmenityListS=[];
	} 
*/
		
	$scope.getRoomTypes = function () {
		callserver("/bearcrsl?callback=JSON_CALLBACK&object=RoomType&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&Lang=ENG",function (response) {
			
			if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					//$rootScope.globals.fk_propertylist[id].roomtypes = [];
					//$rootScope.globals.fk_propertylist[id].roomtypes=response.data;
					//$rootScope.globals.fk_property.roomtypes = $rootScope.globals.fk_propertylist[id].roomtypes;
					
					$scope.roomtypes=response.data;

					for(var i in $scope.roomtypes) {
						$scope.roomtypes[i].RoomTypeAmenityList=[];
						$scope.roomtypes[i].RoomTypeAmenityListS=[];
						$scope.roomtypes[i].RoomTypeDesc=[];
						$scope.roomtypes[i].uploadURL = (host+"/gcs/bearcrsuploadimages?callback=callback&object=RoomType&method=AddImage&FK_Company="+$rootScope.globals.fk_property.fk_company+"&FK_Property="+$rootScope.globals.fk_property.id+"&FK_RoomType="+$scope.roomtypes[i].ID+"&fileextension=.png&token="+$rootScope.credentials.currentUser.token);
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

  
	$scope.addRoomType = function () {
		
		$scope.roomtypes.push({
		"ID": -1,
		"OccupancyAdults": "2",
		"OccupancyChildren": "0",
		"RoomSize": 0,
		"BedType": 0,
		"RoomTypeAmenityList": [],
		"RoomTypeAmenityListS": [],
		"RoomTypeDesc": [],
		"uploadURL": ""			
		});
		
	};
	
	
	$scope.saveRoomType = function(data,idx) {
		
		
		var shortd="Lorem ipsum dolor";
		var longd="Duis ac vehicula ante. Praesent nulla risus, fermentum et purus vel, eleifend lobortis libero. Donec suscipit, diam vel consectetur porttitor, ipsum felis tempor elit, posuere pharetra mi nibh sit amet arcu. Proin euismod consequat tellus";
		var langcode="ENG";
		
		if(data.RoomTypeDesc.length){
		if(!(data.RoomTypeDesc[0].LangCode===undefined)) langcode=data.RoomTypeDesc[0].LangCode;
		if(!(data.RoomTypeDesc[0].ShortDescription===undefined)) shortd=data.RoomTypeDesc[0].ShortDescription;
		if(!(data.RoomTypeDesc[0].LongDescription===undefined)) longd=data.RoomTypeDesc[0].LongDescription;
		}
		
		
		  var tmes="";
		  if(data.ID==-1) {
			  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RoomType&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&Lang="+langcode+"&ShortDescription="+shortd+"&LongDescription="+longd+"&OccupancyAdults="+data.OccupancyAdults+"&OccupancyChildren="+data.OccupancyChildren+"&BedType="+data.BedType+"&RoomSize="+data.RoomSize;
		  } else {
			  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RoomType&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&OccupancyAdults="+data.OccupancyAdults+"&OccupancyChildren="+data.OccupancyChildren+"&BedType="+data.BedType+"&RoomSize="+data.RoomSize;
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
							if(data.ID==-1) {
								$scope.roomtypes[idx].ID=response.data.ID;
								$scope.roomtypes[idx].uploadURL = (host+"/gcs/bearcrsuploadimages?callback=callback&object=RoomType&method=AddImage&FK_Company="+$rootScope.globals.fk_property.fk_company+"&FK_Property="+$rootScope.globals.fk_property.id+"&FK_RoomType="+response.data.ID+"&fileextension=.png&token="+$rootScope.credentials.currentUser.token);
								$scope.getrtdesc();
								
							}
							
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
	
	  $scope.deleteRoomType = function(data,idx) {
			if( data.ID<0 ) {
				$scope.roomtypes.splice(idx,1);
			} else {
				  callserver("/bearcrsl?callback=JSON_CALLBACK&object=RoomType&method=Delete&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID,function (response) {
						if (response.status == 'OK') {
		
							if(response.data.Status === undefined){
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
							} else {
								if(response.data.Status == "OK") {
									new logger("<p>Data Saved</p>","notice","growl","slide").log();
									$scope.roomtypes.splice(idx,1);
								} else {
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error:</p><p>"+response.data.ErrorMessage+"</p>","error","growl","slide").log();								
								}
							}
		
							} else {
								if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error:</p><p>"+response.data+"</p>","error","growl","slide").log();
								}
							}
					
					},$http,$scope); 
			}
	  };
	  
	
	$scope.getrtdesc = function () {
		callserver("/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeDesc&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
			
			if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					for (var i in response.data) {
						var id=findid($scope.roomtypes,response.data[i].FK_RoomType);

						if(!(id===undefined)){
							if($scope.roomtypes[id].RoomTypeDesc===undefined) $scope.roomtypes[id].RoomTypeDesc=[];
							$scope.roomtypes[id].RoomTypeDesc.push(response.data[i]);
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

	}; 

	
	$scope.getrtAmeneties = function () {
		callserver("/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeAmenities&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
			
			if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					for (var i in response.data) {
						var id=findid($scope.roomtypes,response.data[i].FK_RoomType);

						if(!(id===undefined)){
							if($scope.roomtypes[id].RoomTypeAmenityList===undefined) $scope.roomtypes[id].RoomTypeAmenityList=[];
							if($scope.roomtypes[id].RoomTypeAmenityListS===undefined) $scope.roomtypes[id].RoomTypeAmenityListS=[];
							
							$scope.roomtypes[id].RoomTypeAmenityList.push(response.data[i]);
							$scope.roomtypes[id].RoomTypeAmenityListS.push({
								"ID": response.data[i].ID,
								"Icon": null,
								"Group": null,
								"Description": response.data[i].Description
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

	}; 

	  $scope.lang=$rootScope.languages;
	  
	  $scope.addDesc = function(langcode, fk_roomtype) {
		  var exists=false;
		 
		  $scope.roomtypes[id].RoomTypeDesc.forEach(function(de) {
			  if(de.LangCode == langcode && de.FK_RoomType == fk_roomtype) {
				  exists=true;
				  //return;
			  }
		  });
		  
		if(!exists){
			
			$scope.roomtypes[findid($scope.roomtypes,fk_roomtype)].RoomTypeDesc.push({
		  		ID: -1,
		  		LangCode: langcode,
		  		FK_RoomType: fk_roomtype,
		  		ShortDescription: '',
		  		LongDescription: ''		  		
		  	});
		}
		
	  	//$scope.languages = $rootScope.languages;
	  	
	  };
	
	  
	  $scope.deleteRoomTypeDesc = function(sentid,idx,fk_roomtype) {
			if( sentid<0 ) {
				$scope.roomtypes[findid($scope.roomtypes,fk_roomtype)].RoomTypeDesc.splice(idx,1);
			} else {
				  callserver("/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeDesc&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+sentid,function (response) {
						if (response.status == 'OK') {
		
							if(response.data.Status === undefined){
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
							} else {
								if(response.data.Status == "OK") {
									new logger("<p>Data Saved</p>","notice","growl","slide").log();
									$scope.roomtypes[findid($scope.roomtypes,fk_roomtype)].RoomTypeDesc.splice(idx,1);
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
	  };

	  $scope.saveRoomTypeDesc = function(data,idx, roomtypeid) {
		
		  if(roomtypeid>0) {
		  var tmes="";
		  if(data.ID==-1) {
			  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeDesc&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&LangCode="+data.LangCode+"&ShortDescription="+data.ShortDescription+"&LongDescription="+data.LongDescription+"&FK_RoomType="+data.FK_RoomType;
		  } else {
			  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeDesc&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&ShortDescription="+data.ShortDescription+"&LongDescription="+data.LongDescription+"&LangCode="+data.LangCode;
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
							if(data.ID==-1) $scope.roomtypes[findid($scope.roomtypes,data.FK_RoomType)].RoomTypeDesc[idx].ID=response.data.ID;
							
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
	  };
	 
	  
	  
	  
	  $scope.getRoomTypeImages = function () {
			callserver("/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeImages&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id,function (response) {
				if (response.status == 'OK') {
					if(response.data.Status === undefined){
						if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
							
							
							
							
							for (var i in response.data) {
								var idt=findid($scope.roomtypes,response.data[i].FK_RoomType);
								
								if($scope.roomtypes[idt].RoomTypeImages=== undefined){
									$scope.roomtypes[idt].RoomTypeImages=[];
								}
								
								$scope.roomtypes[idt].RoomTypeImages.push(response.data[i]);
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
	  
	  
	  $scope.removeRoomTypeImages = function(idx,data) {
		  
	  		
			callserver("/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeImages&method=Delete&token="+$rootScope.credentials.currentUser.token+"&ID="+data.ID+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
				if (response.status == 'OK') {
					if(response.data.Status === undefined){
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
					} else {
						if(response.data.Status == "OK") {
							new logger("<p>Data Saved</p>","notice","growl","slide").log();
							
							var idt=findid($scope.roomtypes,data.FK_RoomType);
							
							$scope.roomtypes[idt].RoomTypeImages.splice(findid($scope.roomtypes[idt].RoomTypeImages,data.ID),1);
							
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

	  
	  
	  $scope.uploadFileToUrl = function(file, uploadUrl){
	        var fd = new FormData();
	        fd.append('file', $scope.myfile);
	        $http.post(uploadUrl, fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(data){
	        	alert("luis "+data);
	        })
	        .error(function(data){
	        	alert("errir");
	        });
		  };
	  
		  
		  $scope.getRoomTypeAmenityType = function() {

					callserver("/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeAmenityType&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
						if (response.status == 'OK') {
							if(response.data.Status === undefined){
								if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
									
									$scope.RoomTypeAmenityType=response.data;
									
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

		  
		  
		  
		  
		  $scope.addRTAmenetiy = function (rt,item) {

			  /*
			  var none=true;
			  var calls=[];
			  
			  for (var i in rt.RoomTypeAmenityList) {
				  
				  none=false;
				  
				  for(var x in rt.RoomTypeAmenityListS) {
					
					  if(rt.RoomTypeAmenityList[i].FK_RoomTypeAmenityType==rt.RoomTypeAmenityListS[x].ID) {
						  //rt.RoomTypeAmenityList[i].FK_RoomTypeAmenityType.Status="OK";
					  } else {
						  //rt.RoomTypeAmenityList[i].FK_RoomTypeAmenityType.Status="DELETE";
						  
						  calls.push({
							  "call": "/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeAmenities&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&ID="+rt.RoomTypeAmenityList[i].ID+"&SK_Property="+$rootScope.globals.fk_property.id
						  });
						  
					  }
					  
					  
					  var exists = false;
					  
					  for (var z in rt.RoomTypeAmenityList) {
						  
						  if(rt.RoomTypeAmenityList[z].FK_RoomTypeAmenityType==rt.RoomTypeAmenityListS[x].ID) {
							  exists=true;
							  break;
						  }
						  
					  }
					  
					  
					  if(!exists) {
						  
						  calls.push({
							  "call": "/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeAmenities&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_RoomTypeAmenityType="+rt.RoomTypeAmenityListS[x].ID+"&FK_RoomType="+rt.ID+"&SK_Property="+$rootScope.globals.fk_property.id
						  });
						  
					  }
					  
				  }
				  
				  
			  }
			  
			  

			  
			  
			  if(none) {
				  for(var x in rt.RoomTypeAmenityListS) {
					  
					  calls.push({
						  "call": "/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeAmenities&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_RoomTypeAmenityType="+rt.RoomTypeAmenityListS[x].ID+"&FK_RoomType="+rt.ID+"&SK_Property="+$rootScope.globals.fk_property.id
					  });
					  //call="/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeAmenities&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_RoomTypeAmenityType="+rt.RoomTypeAmenityListS[x].ID+"&FK_RoomType="+rt.ID+"&SK_Property="+$rootScope.globals.fk_property.id;
				  }
				  
			  }
			
			*/

			  
			  var call="/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeAmenities&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_RoomTypeAmenityType="+item.ID+"&FK_RoomType="+rt.ID+"&SK_Property="+$rootScope.globals.fk_property.id;
			  
			  callserver(call,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
						} else {
							if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
								
								//var idt=findid($scope.roomtypes,data.FK_RoomType);
								
								//$scope.roomtypes[idt].RoomTypeImages.splice(findid($scope.roomtypes[idt].RoomTypeImages,data.ID),1);
								
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
	
		  
		  $scope.deleteRTAmenetiy = function (rt,item) {

			  var found=false;
			  var idt=0;
			  for (var i in rt.RoomTypeAmenityList) {
				  if(rt.RoomTypeAmenityList[i].ID==item.ID) {
					  found=true;
					  idt=rt.RoomTypeAmenityList[i].ID;
					  break;
				  }
			  }
			  
			  
			  if(!found) return;
			  
			  var call="/bearcrsl?callback=JSON_CALLBACK&object=RoomTypeAmenities&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&ID="+idt+"&SK_Property="+$rootScope.globals.fk_property.id;
			  
			  callserver(call,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
						} else {
							if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
								
								//var idt=findid($scope.roomtypes,data.FK_RoomType);
								
								//$scope.roomtypes[idt].RoomTypeImages.splice(findid($scope.roomtypes[idt].RoomTypeImages,data.ID),1);
								
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

		  
			$scope.getRoomTypes();

			$scope.getrtAmeneties();
			$scope.getrtdesc();
			$scope.getRoomTypeImages();
			$scope.getRoomTypeAmenityType();

		  
		  
		  
		  
}

function settingsPropertyRoomListCtrl ($scope, $rootScope, $http, ngTableParams, $filter) {
	
	
	$scope.roomlist=[];
	$scope.roomtypes=[];
	var data=$scope.roomlist;
	
	 $scope.roomtypestatuses = [
	                    {value: 1, text: 'Active'},
	                    {value: 2, text: 'Out of Order'}
	                  ]; 
	
	
	$scope.getRoomlist = function () {
		callserver("/bearcrsl?callback=JSON_CALLBACK&object=Room&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
			
			if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					$scope.roomlist=response.data;
					data=response.data;
				} else {
					if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
					}
				}
				
				
			}
		
		},$http,$scope);

	} 
	
	
	$scope.getRoomTypes = function () {
		return $scope.roomtypes.length ? null : 
		callserver("/bearcrsl?callback=JSON_CALLBACK&object=RoomType&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&Lang=ENG",function (response) {
			
			if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					$scope.roomtypes=response.data;
				} else {
					if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
					}
				}
				
				
			}
		
		},$http,$scope);

	} 
	
	
	
	$scope.getroomtypedesc = function (id) {
		//var idt=(findid($scope.roomtypes,id) | 0);
		var selected = $filter('filter')($scope.roomtypes, {ID: id});
		//return ($scope.roomtypes[idt].ShortDescription || 'not set');
		return ($scope.roomtypes && selected.length) ? selected[0].ShortDescription : 'Not set';
	};
	
	
	$scope.getRoomlist();
	$scope.getRoomTypes();
	
	
	
	$scope.showRoomTypeStatus = function(id) {
		//var idt=(findid($scope.roomlist,id) | 0);
	    var selected = $filter('filter')($scope.roomtypestatuses, {value: id});
	    return ($scope.roomtypestatuses && selected.length) ? selected[0].text : 'Not set';
	  };
	
	
	  $scope.addRoom = function () {
		  $scope.roomlist.push({
			  "ID": -1,
			  "FK_Property": $rootScope.globals.fk_property.id,
			  "FK_RoomType": null,
			  "FK_RoomStatusType": null,
			  "Number": null,
			  "Floor": null,
			  "Comment": null
		  });
		  
		  $scope.tableParams.sorting({ID: 'asc'});
	  }
	  
	
	var currentPage = null;
	
	$scope.$watch("filter.$", function () {
        $scope.tableParams.reload();
        
        if(!($scope.filter===undefined)){
        if ($scope.filter.$.length > 0) {
            if (currentPage === null) {
                currentPage = $scope.tableParams.$params.page;
            }
            $scope.tableParams.page(1);
        } else {
            $scope.tableParams.page(currentPage);
            currentPage = null;
        }
        }
    });
	
	$scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,           // count per page
        filter: {
            afilt: ''       // initial filter
        },
        sorting: {
            Number: 'asc'     // initial sorting
        }
	}, {
		counts: [],
    	filterSwitch: true,
        total: 0, // length of data
        getData: function ($defer, params) {
        	
        	var filteredData = $filter('filter')(data, $scope.filter);
        	
        	var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    	filteredData;
                    
        	$scope.roomlist = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        	// following 2 lines fixed "paging controls not showing up issue" for me
        	params.total(orderedData.length); // set total for recalc pagination
        	
        	$defer.resolve($scope.roomlist);
        }
    });
	
	
	 $scope.saveRoom = function(data,idx) {
			
		  var tmes="";
		  if(data.ID==-1) {
			  tmes="/bearcrsl?callback=JSON_CALLBACK&object=Room&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&FK_RoomType="+data.FK_RoomType+"&FK_RoomStatusType="+data.FK_RoomStatusType+"&Number="+data.Number+"&Floor="+data.Floor+"&Comment="+data.Comment;
		  } else {
			  tmes="/bearcrsl?callback=JSON_CALLBACK&object=Room&method=Update&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&FK_RoomType="+data.FK_RoomType+"&FK_RoomStatusType="+data.FK_RoomStatusType+"&Number="+data.Number+"&Floor="+data.Floor+"&Comment="+data.Comment+"&ID="+data.ID;
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
							if(data.ID==-1) $scope.roomlist[idx].ID=response.data.ID;
							
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
	
	  $scope.removeRoom = function(data,idx) {
			
		  var tmes="";
		  
		  tmes="/bearcrsl?callback=JSON_CALLBACK&object=Room&method=Delete&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID;
		  
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {

					if(response.data.Status === undefined){
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
					} else {
						if(response.data.Status == "OK") {
							new logger("<p>Data Saved</p>","notice","growl","slide").log();
							//$scope.desc.splice(idx,1);
							//if(data.ID==-1) $scope.roomlist[idx].ID=response.data.ID;
							$scope.roomlist.splice(idx,1);
							
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
}

	
function settingsPropertyRatePlanCtrl ($scope, $rootScope, $http, $filter) {


	$scope.ratepolicychanged=[];
	$scope.ratechanged=[];

	$scope.lang=$rootScope.languages;

	$scope.RatePolicy=[];
	$scope.Currencies = [];
	$scope.RoomTypes = [];
	$scope.RatePolicyConditionsTypes = [];

	$scope.getCurrencies = function() {
    return $scope.Currencies.length ? null : $http.jsonp($rootScope.globals.serverUrl+"/bearcrsl?callback=JSON_CALLBACK&object=Reference&method=ListAll&table=Currencies&token="+$rootScope.credentials.currentUser.token).success(function(data) {
      $scope.Currencies = data;
    });
  	};

  	
  	
  	$scope.getRoomTypes = function() {
  	    return $scope.RoomTypes.length ? null : $http.jsonp($rootScope.globals.serverUrl+"/bearcrsl?callback=JSON_CALLBACK&object=RoomType&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&Lang=ENG").success(function(data) {
  	    	$scope.RoomTypes = data;
  	    });
  	};
  	
  	$scope.getRoomTypes();

  	
  	$scope.getRatePlanConditionsTypes = function() {
  	    return $scope.RatePolicyConditionsTypes.length ? null : $http.jsonp($rootScope.globals.serverUrl+"/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyConditions&method=List&withdescription=1&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&LangCode=ENG").success(function(data) {
  	      $scope.RatePolicyConditionsTypes = data;
  	    });
  	};
  	
  	$scope.getRatePlanConditionsTypes();

  	
  	
  	
  	  	
  	 $scope.getRoomTypeName = function (fk_roomtype) {
  		
  		
  		 
  		 if(!$scope.RoomTypes.length) {
  			 return fk_roomtype;
  		 } else {
  			var id=findid($scope.RoomTypes,fk_roomtype);
  			if(id===undefined) {
  				return fk_roomtype;
  			} else {
  				return $scope.RoomTypes[id].ShortDescription;
  			}
  			 
  		 }
  		 
  	 };
  	
  	$scope.DOW=[
    {value: "2", text: 'Monday'},
    {value: "3", text: 'Tuesday'},
    {value: "4", text: 'Wednesday'},
    {value: "5", text: 'Thursday'},
    {value: "6", text: 'Friday'},
    {value: "7", text: 'Saturday'},
    {value: "1", text: 'Sunday'}
  ]; 
  	

  	$scope.showDOW = function(dowlist) {
    var selected = [];
    angular.forEach($scope.DOW, function(s) { 
      if (dowlist.indexOf(s.value) >= 0) {
        selected.push(s.text);
      }
    });
    return selected.length ? selected.join(', ') : 'Not set';
  	};

  	$scope.ppp = [
    {value: 0, text: 'Price Per Room'},
    {value: 1, text: 'Price Per Person'}
  	]; 

  	$scope.showppp = function(pricetype) {
    var selected = $filter('filter')($scope.ppp, {value: pricetype});
    return (selected.length) ? selected[0].text : 'Not set';
  	};

	// RatePlanService.List(
	// 		function(data){
	// 			$scope.RatePolicy=data;

	// 			for(var i in $scope.RatePolicy){
	// 				$scope.RatePolicy[i].RatePolicyDesc = [];
	// 				$scope.RatePolicy[i].RatePolicyRates = [];
	// 				$scope.RatePolicy[i].RatePolicyTaxes = [];
	// 			}

	// 		},function(data) {
				
	// 		});
	
	$scope.getRatePolicy = function() {

		tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicy&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id;
		  
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					
					$scope.RatePolicy=response.data;
					
					for(var i in $scope.RatePolicy){

						$scope.RatePolicy[i].RatePolicyDesc = [];
						$scope.RatePolicy[i].RatePolicyRates = [];
						$scope.RatePolicy[i].RatePolicyTaxes = [];
						$scope.RatePolicy[i].RatePolicyConditions = [];

						if($scope.RatePolicy[i].CheckInDOW!=null) {

							var tem = $scope.RatePolicy[i].CheckInDOW.split(";");
							$scope.RatePolicy[i].CheckInDOW=[];

							if(tem!="null") {
								$scope.RatePolicy[i].CheckInDOW=tem;
							}
						} else {
							$scope.RatePolicy[i].CheckInDOW=[];
						}

						
						if($scope.RatePolicy[i].CheckOutDOW!=null) {

							var tem = $scope.RatePolicy[i].CheckOutDOW.split(";");
							$scope.RatePolicy[i].CheckOutDOW=[];

							if(tem!="null") {
								$scope.RatePolicy[i].CheckOutDOW=tem;
							}
						} else {
							$scope.RatePolicy[i].CheckOutDOW=[];
						}

					}
					
					
					$scope.getRatePolicyDesc();
					$scope.getRatePolicyTaxes();
					$scope.getRatePolicyRates();
					$scope.getRatePolicyConditions();
					
				} else {
					if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
					}
				}
				
				
				}
			
			},$http,$scope); 

	};



	$scope.getRatePolicyDesc = function() {

		tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyDesc&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id;
		  
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					for (var i in response.data) {
						var id=findid($scope.RatePolicy,response.data[i].FK_RatePolicy);

						if(id!==undefined){
							if($scope.RatePolicy[id].RatePolicyDesc===undefined) $scope.RatePolicy[id].RatePolicyDesc=[];
							$scope.RatePolicy[id].RatePolicyDesc.push(response.data[i]);
							
							if($scope.RatePolicy[id].SD === undefined) $scope.RatePolicy[id].SD="";
							
							if(response.data[i].LangCode=="ENG") { //$scope.selectedLanguage
								$scope.RatePolicy[id].SD=response.data[i].Description;
							}
							
						} else {
							//alert("luis " + response.data[i].FK_RatePolicy );
							
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

	};

	$scope.getRatePolicyTaxes = function() {

		tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyTaxes&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id;
		  
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					for (var i in response.data) {
						var id=findid($scope.RatePolicy,response.data[i].FK_RatePolicy);

						if(!(id===undefined)){
							if($scope.RatePolicy[id].RatePolicyTaxes===undefined) $scope.RatePolicy[id].RatePolicyTaxes=[];
							$scope.RatePolicy[id].RatePolicyTaxes.push(response.data[i]);
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

	};

	
	$scope.getRatePolicyRates = function() {

		tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyRates&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id;
		  
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					for (var i in response.data) {
						var id=findid($scope.RatePolicy,response.data[i].FK_RatePolicy);

						if(!(id===undefined)){
							if($scope.RatePolicy[id].RatePolicyRates===undefined) $scope.RatePolicy[id].RatePolicyRates=[];
							$scope.RatePolicy[id].RatePolicyRates.push(response.data[i]);
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

	};

	
	
	$scope.getRatePolicyConditions = function() {

		tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyConditions&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id;
		  
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					for (var i in response.data) {
						var id=findid($scope.RatePolicy,response.data[i].FK_RatePolicy);

						if(id!==undefined){

							if($scope.RatePolicy[id].RatePolicyConditions===undefined) $scope.RatePolicy[id].RatePolicyConditions=[];
							
							$scope.RatePolicy[id].RatePolicyConditions.push(response.data[i]);
							
						} else {
							//alert("luis " + response.data[i].FK_RatePolicy );
							
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

	};
	
	
	
$scope.getRatePolicy();


//RatePolicy Desc
$scope.addDesc = function(langcode, fk_ratepolicy) {
		  var exists=false;
		 
		  $scope.RatePolicy[findid($scope.RatePolicy,fk_ratepolicy)].RatePolicyDesc.forEach(function(de) {
			  if(de.LangCode == langcode && de.FK_RatePolicy == fk_ratepolicy) {
				  exists=true;
				  //return;
			  }
		  });
		  
		if(!exists){
			
			$scope.RatePolicy[findid($scope.RatePolicy,fk_ratepolicy)].RatePolicyDesc.push({
		  		ID: -1,
		  		LangCode: langcode,
		  		FK_RatePolicy: fk_ratepolicy,
		  		Description: '',
		  		PromotionDescription: ''		  		
		  	});
		}
		
	  	//$scope.languages = $rootScope.languages;
	  	
	  };
	
	  
	  $scope.deleteRatePolicyDesc = function(sentid,idx,fk_ratepolicy) {
			if( sentid<0 ) {
				$scope.RatePolicy[findid($scope.RatePolicy,fk_ratepolicy)].RatePolicyDesc.splice(idx,1);
			} else {
				  callserver("/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyDesc&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+sentid,function (response) {
						if (response.status == 'OK') {
		
							if(response.data.Status === undefined){
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
							} else {
								if(response.data.Status == "OK") {
									new logger("<p>Data Saved</p>","notice","growl","slide").log();
									$scope.RatePolicy[findid($scope.RatePolicy,fk_ratepolicy)].RatePolicyDesc.splice(idx,1);
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
	  };

	  $scope.saveRatePolicyDesc = function(data,idx, ratepolicyid) {
		
		  if(ratepolicyid>0) {
		  var tmes="";
		  if(data.ID==-1) {
			  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyDesc&method=Insert&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&LangCode="+data.LangCode+"&Description="+data.Description+"&PromotionDescription="+data.PromotionDescription+"&FK_RatePolicy="+data.FK_RatePolicy;
		  } else {
			  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyDesc&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&Description="+data.Description+"&PromotionDescription="+data.PromotionDescription+"&LangCode="+data.LangCode;
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
							if(data.ID==-1) $scope.RatePolicy[findid($scope.RatePolicy,data.FK_RatePolicy)].RatePolicyDesc[idx].ID=response.data.ID;
							
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
	  };



	  $scope.saveRatePolicy = function(data,idx) {
		
		
		var descrip="Lorem ipsum dolor";
		var pdescrip="Duis ac";
		var langcode="ENG";
		
		if(data.RatePolicyDesc.length){
		if(!(data.RatePolicyDesc[0].LangCode===undefined)) langcode=data.RatePolicyDesc[0].LangCode;
		if(!(data.RatePolicyDesc[0].Description===undefined)) descrip=data.RatePolicyDesc[0].Description;
		if(!(data.RatePolicyDesc[0].PromotionDescription===undefined)) pdescrip=data.RatePolicyDesc[0].PromotionDescription;
		}
		
		
		  var tmes="";
		  if(data.ID==-1) {

			  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicy&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&FK_Currency="+data.FK_Currency+"&Taxes_Included="+data.Taxes_Included+"&MaxOccupancy="+data.MaxOccupancy+"&CheckInDOW="+data.CheckInDOW.join(";")+"&CheckOutDOW="+data.CheckOutDOW.join(";")+"&BookingPrior="+data.BookingPrior+"&BookingDateFrom="+data.BookingDateFrom+"&BookingDateTo="+data.BookingDateTo+"&ValidCheckIn="+data.ValidCheckIn+"&ValidCheckOut="+data.ValidCheckOut+"&PricePerPerson="+data.PricePerPerson;

		  } else {
			  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicy&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&FK_Currency="+data.FK_Currency+"&Taxes_Included="+data.Taxes_Included+"&MaxOccupancy="+data.MaxOccupancy+"&CheckInDOW="+data.CheckInDOW.join(";")+"&CheckOutDOW="+data.CheckOutDOW.join(";")+"&BookingPrior="+data.BookingPrior+"&BookingDateFrom="+data.BookingDateFrom+"&BookingDateTo="+data.BookingDateTo+"&ValidCheckIn="+data.ValidCheckIn+"&ValidCheckOut="+data.ValidCheckOut+"&PricePerPerson="+data.PricePerPerson;
			  //tmes="/bearcrsl?callback=JSON_CALLBACK&object=RoomType&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&OccupancyAdults="+data.OccupancyAdults+"&OccupancyChildren="+data.OccupancyChildren+"&BedType="+data.BedType+"&RoomSize="+data.RoomSize;
		  }
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {

					if(response.data.Status === undefined){
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
					} else {
						if(response.data.Status == "OK") {
							new logger("<p>Data Saved</p>","notice","growl","slide").log();
							
							if(data.ID==-1) {
//								$scope.RatePolicy[idx].ID=response.data.ID;
								
								$scope.getRatePolicy();

								$scope.getRatePolicyDesc();
								$scope.getRatePolicyTaxes();
								$scope.getRatePolicyRates();
								
							}
							
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
	
	  $scope.deleteRatePolicy = function(data,idx) {
			if( data.ID<0 ) {
				$scope.RatePolicy.splice(idx,1);
			} else {
				  callserver("/bearcrsl?callback=JSON_CALLBACK&object=RatePolicy&method=Delete&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID,function (response) {
						if (response.status == 'OK') {
		
							if(response.data.Status === undefined){
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
							} else {
								if(response.data.Status == "OK") {
									new logger("<p>Data Saved</p>","notice","growl","slide").log();
									
									$scope.RatePolicy.splice(idx,1);
									
								} else {
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error:</p><p>"+response.data.ErrorMessage+"</p>","error","growl","slide").log();								
								}
							}
		
							} else {
								if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error:</p><p>"+response.data+"</p>","error","growl","slide").log();
								}
							}
					
					},$http,$scope); 
			}
	  };
	 
	  $scope.addRatePolicy = function() {
			 
//			
//			$scope.RatePolicy.push({
//		  		ID: -1,
//		  		FK_Property: $rootScope.globals.fk_property.id,
//		  	    Description: "null",
//		  	    FK_Currency: null,
//		  	    Taxes_Included: null,
//		  	    MaxOccupancy: null,
//		  	    CheckInDOW: "",
//		  	    CheckOutDOW: "",
//		  	    BookingPrior: null,
//		  	    BookingDateFrom: null,
//		  	    BookingDateTo: null,
//		  	    ValidCheckIn: null,
//		  	    ValidCheckOut: null,
//		  	    PricePerPerson: 0,
//		  	    RatePolicyDesc: [],
//		  	    RatePolicyRates: [],
//		  	    RatePolicyTaxes: []
//		  	    
//		  	});
		
			$scope.saveRatePolicy({
		  		ID: -1,
		  		FK_Property: $rootScope.globals.fk_property.id,
		  	    Description: "null",
		  	    FK_Currency: null,
		  	    Taxes_Included: null,
		  	    MaxOccupancy: null,
		  	    CheckInDOW: [],
		  	    CheckOutDOW: [],
		  	    BookingPrior: null,
		  	    BookingDateFrom: null,
		  	    BookingDateTo: null,
		  	    ValidCheckIn: null,
		  	    ValidCheckOut: null,
		  	    PricePerPerson: 0,
		  	    RatePolicyDesc: [],
		  	    RatePolicyRates: [],
		  	    RatePolicyTaxes: []
		  	    
		  	},
		  	0
			);
			
		//	$scope.RatePolicy=[];
			
		
		
	  	//$scope.languages = $rootScope.languages;
	  	
	  };
	  
	  
	  // End Rate Policy
	  
	//Rate Policy Rates
	
	  
	  $scope.RatePlanRatesAvailableRoomType = function (fk_ratepolicy, fk_roomtype) {
			
	  var id=findid($scope.RatePolicy,fk_ratepolicy);

		if(id!==undefined){
		
		  for(var i=0; i<$scope.RatePolicy[id].RatePolicyRates.length;i++){
			  if($scope.RatePolicy[id].RatePolicyRates[i].FK_RoomType==fk_roomtype) {
				return "RoomType Already has a Rate!";
			}
		  }
				
				
		} else {
			return "Rate Policy Does not Exist!";
		}

		  
		  
	  };
	  
	  
	  
	  
	  
	  $scope.addRatePolicyRate = function(fk_ratepolicy) {
		  var exists=true;
		 
		  var id=findid($scope.RatePolicy,fk_ratepolicy);
		  
			  if(id===undefined) {
				  exists=false;
			  }
		  
		
			  
		if(exists){
			
			$scope.RatePolicy[id].RatePolicyRates.push({
		  		ID: -1,
		  		FK_RatePolicy: fk_ratepolicy,
		  		FK_RoomType: null,
		  	    Rate: null,
		  	    RateAdditionalPerson: null,
		  	    RateChildren: null	
		  	});
		}
		
	  	//$scope.languages = $rootScope.languages;
	  	
	  };
	  
	  
	  $scope.saveRatePolicyRates = function(data,idx) {
			
			
			
			
			  if(data.ID==-1) {

				  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyRates&method=Insert&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&FK_RatePolicy="+data.FK_RatePolicy+"&FK_RoomType="+data.FK_RoomType+"&Rate="+data.Rate+"&RateAdditionalPerson="+data.RateAdditionalPerson+"&RateChildren="+data.RateChildren;

			  } else {
				  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyRates&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&FK_RatePolicy="+data.FK_RatePolicy+"&FK_RoomType="+data.FK_RoomType+"&Rate="+data.Rate+"&RateAdditionalPerson="+data.RateAdditionalPerson+"&RateChildren="+data.RateChildren;
				  //tmes="/bearcrsl?callback=JSON_CALLBACK&object=RoomType&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&OccupancyAdults="+data.OccupancyAdults+"&OccupancyChildren="+data.OccupancyChildren+"&BedType="+data.BedType+"&RoomSize="+data.RoomSize;
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
								if(data.ID==-1) {
									var id=findid($scope.RatePolicy,data.FK_RatePolicy);
									if(id!==undefined) $scope.RatePolicy[id].RatePolicyRates[idx].ID=response.data.ID;
								}
								
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
	  
		  
		  $scope.deleteRatePolicyRates = function(data,idx) {
			  var id=findid($scope.RatePolicy,data.FK_RatePolicy);
			  
			  	if( data.ID<0 ) {
					$scope.RatePolicy[id].RatePolicyRates.splice(idx,1);
				} else {
					  callserver("/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyRates&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID,function (response) {
							if (response.status == 'OK') {
			
								if(response.data.Status === undefined){
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
								} else {
									if(response.data.Status == "OK") {
										new logger("<p>Data Saved</p>","notice","growl","slide").log();
										
										$scope.RatePolicy[id].RatePolicyRates.splice(idx,1);
										
									} else {
										new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
										//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error:</p><p>"+response.data.ErrorMessage+"</p>","error","growl","slide").log();								
									}
								}
			
								} else {
									if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
										new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
										//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error:</p><p>"+response.data+"</p>","error","growl","slide").log();
									}
								}
						
						},$http,$scope); 
				}
		  };
	  
	  //End Rate Polic Rates
		  
		  //Rate Plicy Taxes Start
		  
		  
		  $scope.taxtypes = [
             {value: 1, text: 'Per Stay / Room'},
             {value: 2, text: 'Per Stay / Person'},
             {value: 3, text: 'Per Day / Room'},
             {value: 4, text: 'Per Day / Person'}
           ]; 
		  
		  $scope.showTaxes = function(val) {
			    var selected = $filter('filter')($scope.taxtypes, {value: val});
			    return (val && selected.length) ? selected[0].text : 'Not set';
			  };
		  
			  
		  $scope.taxpercentage = [
		                     {value: 0, text: 'No'},
		                     {value: 1, text: 'Yes'}
		                   ]; 

           $scope.showTaxPercentage = function(val) {
        	   var selected = $filter('filter')($scope.taxpercentage, {value: val});
        	   return (val && selected.length) ? selected[0].text : 'Not set';
           };
           
           $scope.addRatePolicyTax = function(fk_ratepolicy) {
     		  var exists=true;
     		 
     		  var id=findid($scope.RatePolicy,fk_ratepolicy);
     		  
     			  if(id===undefined) {
     				  exists=false;
     			  }
     		  
     		
     			  
     		if(exists){
     			
     			$scope.RatePolicy[id].RatePolicyTaxes.push({
     		  		ID: -1,
     		  		FK_RatePolicy: fk_ratepolicy,
     		  		Description: null,
     		  	    Type: null,
     		  	    Percentage: null,
     		  	    Amount: null
     		  	});
     		}
     		
     	  	//$scope.languages = $rootScope.languages;
     	  	
     	  };
     	  
           
     	  
     	  
     	 $scope.saveRatePolicyTaxes = function(data,idx) {
 			
			  if(data.ID==-1) {

				  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyTaxes&method=Insert&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&FK_RatePolicy="+data.FK_RatePolicy+"&Description="+data.Description+"&Type="+data.Type+"&Percentage="+data.Percentage+"&Amount="+data.Amount;

			  } else {
				  tmes="/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyTaxes&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&FK_RatePolicy="+data.FK_RatePolicy+"&Description="+data.Description+"&Type="+data.Type+"&Percentage="+data.Percentage+"&Amount="+data.Amount;
				  //tmes="/bearcrsl?callback=JSON_CALLBACK&object=RoomType&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&OccupancyAdults="+data.OccupancyAdults+"&OccupancyChildren="+data.OccupancyChildren+"&BedType="+data.BedType+"&RoomSize="+data.RoomSize;
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
								if(data.ID==-1) {
									var id=findid($scope.RatePolicy,data.FK_RatePolicy);
									if(id!==undefined) $scope.RatePolicy[id].RatePolicyTaxes[idx].ID=response.data.ID;
								}
								
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
     	  
		  
		  
		  $scope.deleteRatePolicyTaxes = function(data,idx) {
			  var id=findid($scope.RatePolicy,data.FK_RatePolicy);
			  
			  	if( data.ID<0 ) {
					$scope.RatePolicy[id].RatePolicyTaxes.splice(idx,1);
				} else {
					  callserver("/bearcrsl?callback=JSON_CALLBACK&object=RatePolicyTaxes&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID,function (response) {
							if (response.status == 'OK') {
			
								if(response.data.Status === undefined){
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
									//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
								} else {
									if(response.data.Status == "OK") {
										new logger("<p>Data Saved</p>","notice","growl","slide").log();
										
										$scope.RatePolicy[id].RatePolicyTaxes.splice(idx,1);
										
									} else {
										new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
										//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error:</p><p>"+response.data.ErrorMessage+"</p>","error","growl","slide").log();								
									}
								}
			
								} else {
									if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
										new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
										//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error:</p><p>"+response.data+"</p>","error","growl","slide").log();
									}
								}
						
						},$http,$scope); 
				}
		  };
		  
		  //Rate Plicy Taxes End


}



angular
	.module('bearpms3App')
	.controller('settingsPropertyImagesCtrl', settingsPropertyImagesCtrl)
	.controller('settingsPropertyRoomTypeCtrl', settingsPropertyRoomTypeCtrl)
	.controller('settingsPropertyRoomListCtrl', settingsPropertyRoomListCtrl)
	.controller('settingsPropertyRatePlanCtrl', settingsPropertyRatePlanCtrl)