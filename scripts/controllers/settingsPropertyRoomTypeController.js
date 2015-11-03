function settingsPropertyRoomTypeCtrl ($scope, $rootScope, $http, $sce,webConstants,langTransService, $anchorScroll, $location, $translate) {

 var hostCallserver =webConstants.hostCallserver;
 var host  =webConstants.host ;
	 //....seting roles
		$scope.rightValue =false;
		$scope.rightValue2=false;
		$scope.rightsValues = $rootScope.globals.fk_rightsResponse;
		if($scope.rightsValues.data[0].RoomType === 1 )
  			$scope.rightValue=true;
  		if($scope.rightsValues.data[0].RoomType === 2 )
  			$scope.rightValue2=true;
  		//....seting roles ends


	$scope.openroomtypes=[];
	$scope.roomtypechanged=false;
	$scope.RoomTypeImages=[];
	$scope.RoomTypeAmenityList=[];
	
	$scope.rtchg = function () {
		$scope.roomtypechanged=true;
	};
	
	var trans=[];
	$scope.BedTypes=[];

	$scope.translateBedTypes = function () {

	    trans=$translate.instant(['PROPERTY_ROOMTYPE_BED_SINGE', 'PROPERTY_ROOMTYPE_BED_DOUBLE']);
		
		$scope.BedTypes=[
		    {"ID":1,"Name": trans.PROPERTY_ROOMTYPE_BED_SINGE},
		    {"ID":2,"Name": trans.PROPERTY_ROOMTYPE_BED_DOUBLE},
		    {"ID":3,"Name":"Queen"},
		    {"ID":4,"Name":"King"}
		    ];
	}

	$scope.translateBedTypes();

	$rootScope.$on('$translateChangeSuccess', function () {
		$scope.getRoomTypes(); 
		$scope.translateBedTypes();
    });

		// $scope.$watch(function() {
		//   return $rootScope.globals.selectedLanguage;
		// }, function() {
		

		// $scope.getRoomTypes(); 
		// });

	$scope.getRoomTypes = function () {
		 var lan = langTransService.getSelectedLanguage();
		callserver(hostCallserver+"&object=RoomType&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&Lang="+lan,function (response) {
			
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
				
				if(response.data.length) {
					$scope.getrtAmeneties();
					$scope.getrtdesc();
					$scope.getRoomTypeImages();
					$scope.getRoomTypeAmenityType();
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
	$scope.getRoomTypes(); 
  
	$scope.addRoomType = function () {
		
		var newroom={
		"ID": -1,
		"OccupancyAdults": "2",
		"OccupancyChildren": "0",
		"RoomSize": 0,
		"BedType": 0,
		"RoomTypeAmenityList": [],
		"RoomTypeAmenityListS": [],
		"RoomTypeDesc": [],
		"uploadURL": ""			
		};

		var total = $scope.roomtypes.push(newroom);

		$scope.saveRoomType(newroom,total-1);

		for(y =0; y < total -1; y++) {
			$scope.openroomtypes[y]=false;
		}
		
		$scope.openroomtypes[total-1]=true;

		/*var newHash = 'anchor' + (total-1);
        if ($location.hash() !== newHash) {
          // set the $location.hash to `newHash` and
          // $anchorScroll will automatically scroll to it
          $location.hash('anchor' + (total-1));
        } else {
          // call $anchorScroll() explicitly,
          // since $location.hash hasn't changed
          $anchorScroll();
        }*/

	};
	
	
	$scope.saveRoomType = function(data,idx) {
		
		
		//var shortd="Lorem ipsum dolor";
		//var longd="Duis ac vehicula ante. Praesent nulla risus, fermentum et purus vel, eleifend lobortis libero. Donec suscipit, diam vel consectetur porttitor, ipsum felis tempor elit, posuere pharetra mi nibh sit amet arcu. Proin euismod consequat tellus";
		var shortd="";
		var longd="";

		var langcode="ENG";
		
		if(data.RoomTypeDesc.length){
		if(!(data.RoomTypeDesc[0].LangCode===undefined)) langcode=data.RoomTypeDesc[0].LangCode;
		if(!(data.RoomTypeDesc[0].ShortDescription===undefined)) shortd=data.RoomTypeDesc[0].ShortDescription;
		if(!(data.RoomTypeDesc[0].LongDescription===undefined)) longd=data.RoomTypeDesc[0].LongDescription;
		}
		
		
		  var tmes="";
		  if(data.ID==-1) {
			  tmes=hostCallserver+"&object=RoomType&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&Lang="+langcode+"&ShortDescription="+shortd+"&LongDescription="+longd+"&OccupancyAdults="+data.OccupancyAdults+"&OccupancyChildren="+data.OccupancyChildren+"&BedType="+data.BedType+"&RoomSize="+data.RoomSize;
		  } else {
			  tmes=hostCallserver+"&object=RoomType&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&OccupancyAdults="+data.OccupancyAdults+"&OccupancyChildren="+data.OccupancyChildren+"&BedType="+data.BedType+"&RoomSize="+data.RoomSize;
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
				  callserver(hostCallserver+"&object=RoomType&method=Delete&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID,function (response) {
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
		callserver(hostCallserver+"&object=RoomTypeDesc&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
			
			if (response.status == 'OK') {
				
				if(response.data.Status === undefined){

					for(var x in $scope.roomtypes) {
						$scope.roomtypes[x].RoomTypeDesc=[];
					}

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
		callserver(hostCallserver+"&object=RoomTypeAmenities&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
			
			if (response.status == 'OK') {
				
				if(response.data.Status === undefined){

					for(var x in $scope.roomtypes) {
						$scope.roomtypes[x].RoomTypeAmenityList=[];
						$scope.roomtypes[x].RoomTypeAmenityListS=[];
						}

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
	  
	  $scope.addDesc = function(langcode, fk_roomtype,rt) {
		  var exists=false;
		 // var id= fk_roomtype;
		// var id=findid($scope.roomtypes,response.data[i].FK_RoomType);
		  console.log("jflajljdfa : ",fk_roomtype,$scope.roomtypes,langcode,rt);
		  rt.RoomTypeDesc.forEach(function(de) {
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
				  callserver(hostCallserver+"&object=RoomTypeDesc&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+sentid,function (response) {
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
			  tmes=hostCallserver+"&object=RoomTypeDesc&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&LangCode="+data.LangCode+"&ShortDescription="+data.ShortDescription+"&LongDescription="+data.LongDescription+"&FK_RoomType="+data.FK_RoomType;
		  } else {
			  tmes=hostCallserver+"&object=RoomTypeDesc&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&ShortDescription="+data.ShortDescription+"&LongDescription="+data.LongDescription+"&LangCode="+data.LangCode;
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
							
							$scope.roomtypes[findid($scope.roomtypes,data.FK_RoomType)].RoomTypeDesc[idx].ShortDescription=data.ShortDescription;
							$scope.roomtypes[findid($scope.roomtypes,data.FK_RoomType)].RoomTypeDesc[idx].LongDescription=data.LongDescription;

							$scope.roomtypes[findid($scope.roomtypes,data.FK_RoomType)].ShortDescription=data.ShortDescription;
							$scope.roomtypes[findid($scope.roomtypes,data.FK_RoomType)].LongDescription=data.LongDescription;
							
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
			callserver(hostCallserver+"&object=RoomTypeImages&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id,function (response) {
				if (response.status == 'OK') {
					if(response.data.Status === undefined){
						if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
							
							for(var x in $scope.roomtypes) {
								$scope.roomtypes[x].RoomTypeImages=[];
							}
							
							
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
		  
	  		
			callserver(hostCallserver+"&object=RoomTypeImages&method=Delete&token="+$rootScope.credentials.currentUser.token+"&ID="+data.ID+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
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

					callserver(hostCallserver+"&object=RoomTypeAmenityType&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
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

			  var call=hostCallserver+"&object=RoomTypeAmenities&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_RoomTypeAmenityType="+item.ID+"&FK_RoomType="+rt.ID+"&SK_Property="+$rootScope.globals.fk_property.id;
			  
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
			  
			  var call=hostCallserver+"&object=RoomTypeAmenities&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&ID="+idt+"&SK_Property="+$rootScope.globals.fk_property.id;
			  
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

		  
			//$scope.getRoomTypes();

//			$scope.getrtAmeneties();
//			$scope.getrtdesc();
//			$scope.getRoomTypeImages();
//			$scope.getRoomTypeAmenityType();

		  
		  
		  
		  
}


angular
	.module('bearpms3App')
	.controller('settingsPropertyRoomTypeCtrl', settingsPropertyRoomTypeCtrl);