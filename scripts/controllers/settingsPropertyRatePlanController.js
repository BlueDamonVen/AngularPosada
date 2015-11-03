angular.module('bearpms3App')
  .controller('settingsPropertyRatePlanCtrl',function ($scope, $rootScope, $http, $filter,webConstants,DTOptionsBuilder, DTColumnDefBuilder, langTransService, RatePlanServices,RatePlanConditionsTypeServices, LangServices,$translate, $uibModal, $location, $window) {
		 
	 var hostCallserver =webConstants.hostCallserver;
	  var host =webConstants.host;
	 
  //....seting roles
    $scope.rightValue =false;
    $scope.rightValue2=false;
    $scope.rightsValues = $rootScope.globals.fk_rightsResponse;
    if($scope.rightsValues.data[0].Company === 1 )
        $scope.rightValue=true;
    if($scope.rightsValues.data[0].Company === 2 )
        $scope.rightValue2=true;
    //....seting roles ends

	$scope.ratepolicychanged=[];
	$scope.ratechanged=[];

	//$scope.lang=$rootScope.languages;
	$scope.lang = $rootScope.globals.selectedLanguage;
	
	$scope.languages=$rootScope.languages;

	$scope.RatePolicy=[];
	$scope.Currencies = [];
	$scope.RoomTypes = [];

	//....vm space
	 // var vm = this;
	
 	 $rootScope.$on('$translateChangeSuccess', function () {
 	 	$scope.lang = $rootScope.globals.selectedLanguage;
		$scope.vm();
		$scope.vmtaxes();
		$scope.getRatePolicyDesc();
		$scope.getRatePolicyConditions1();
		$scope.getRatePolicy();
		$scope.getDOW();
		$scope.getRoomTypes();
		$scope.updatetaxconstants();
    });
   
    //.................vm 
    $scope.vm = function()
    {     		
	    var trans=[];
    	trans=$translate.instant(['TABLE_SEARCH_PLACEHOLDER','TABLE_EMPTY','TABLE_LOADING','TABLE_PROCESSING','TABLE_ZERO_RECORDS', 'TABLE_COPY', 'TABLE_FIRST', 'TABLE_LAST', 'TABLE_NEXT', 'TABLE_PREVIOUS', 'PDF_MESSAGE']);

	    $scope.dtOptions = DTOptionsBuilder.newOptions()
	    .withPaginationType('full_numbers')
	    .withDisplayLength(10)
	    .withDOM('T<"clearfix"f>t<"bottom"rp>')
	    .withTableTools('/swf/copy_csv_xls_pdf.swf')
	    //must add multilingual options
	    .withLanguage({
			    	'sSearch' : "",
			    	"searchPlaceholder": trans.TABLE_SEARCH_PLACEHOLDER,
			    	"sEmptyTable":     trans.TABLE_EMPTY,
			    	"sLoadingRecords": trans.TABLE_LOADING,
		            "sProcessing":     trans.TABLE_PROCESSING,
		            "sZeroRecords":   trans.TABLE_ZERO_RECORDS,
		            "paginate": {
					        "first":      trans.TABLE_FIRST,
					        "last":       trans.TABLE_LAST,
					        "next":       trans.TABLE_NEXT,
					        "previous":   trans.TABLE_PREVIOUS 
					    }
		    		})
	    
	    .withTableToolsButtons([
            {
                "sExtends": "copy",
                "mColumns": [ 0, 1, 2, 3],
                "sButtonText": trans.TABLE_COPY
            },
            'csv',
            {
                "sExtends": "xls",
                "mColumns": [ 0, 1, 2, 3],
            }, 
            {
                "sExtends": "pdf",
                "sPdfOrientation": "landscape",
                "mColumns": [ 0, 1, 2, 3],
                "sPdfMessage": trans.PDF_MESSAGE
            }
        ]);
	    
	    
			
	    
	    $scope.dtColumnDefs = [
	        DTColumnDefBuilder.newColumnDef(0),
	        DTColumnDefBuilder.newColumnDef(1),
	        DTColumnDefBuilder.newColumnDef(2),
	        DTColumnDefBuilder.newColumnDef(3),
	        DTColumnDefBuilder.newColumnDef(4).notSortable()
	    ];
		
}



$scope.vmtaxes = function()
    {     		
	    var trans=[];
    	trans=$translate.instant(['TABLE_SEARCH_PLACEHOLDER','TABLE_EMPTY','TABLE_LOADING','TABLE_PROCESSING','TABLE_ZERO_RECORDS', 'TABLE_COPY', 'TABLE_FIRST', 'TABLE_LAST', 'TABLE_NEXT', 'TABLE_PREVIOUS', 'PDF_MESSAGE']);

	    $scope.dtOptionsTaxes = DTOptionsBuilder.newOptions()
	    .withPaginationType('full_numbers')
	    .withDisplayLength(10)
	    .withDOM('T<"clearfix"f>t<"bottom"rp>')
	    .withTableTools('/swf/copy_csv_xls_pdf.swf')
	    //must add multilingual options
	    .withLanguage({
			    	'sSearch' : "",
			    	"searchPlaceholder": trans.TABLE_SEARCH_PLACEHOLDER,
			    	"sEmptyTable":     trans.TABLE_EMPTY,
			    	"sLoadingRecords": trans.TABLE_LOADING,
		            "sProcessing":     trans.TABLE_PROCESSING,
		            "sZeroRecords":   trans.TABLE_ZERO_RECORDS,
		            "paginate": {
					        "first":      trans.TABLE_FIRST,
					        "last":       trans.TABLE_LAST,
					        "next":       trans.TABLE_NEXT,
					        "previous":   trans.TABLE_PREVIOUS 
					    }
		    		})
	    
	    .withTableToolsButtons([
            {
                "sExtends": "copy",
                "mColumns": [ 0, 1, 2, 3],
                "sButtonText": trans.TABLE_COPY
            },
            'csv',
            {
                "sExtends": "xls",
                "mColumns": [ 0, 1, 2, 3],
            }, 
            {
                "sExtends": "pdf",
                "sPdfOrientation": "landscape",
                "mColumns": [ 0, 1, 2, 3],
                "sPdfMessage": trans.PDF_MESSAGE
            }
        ]);
	    
	    
			
	    
	    $scope.dtColumnDefsTaxes = [
	        DTColumnDefBuilder.newColumnDef(0),
	        DTColumnDefBuilder.newColumnDef(1),
	        DTColumnDefBuilder.newColumnDef(2),
	        DTColumnDefBuilder.newColumnDef(3),
	        DTColumnDefBuilder.newColumnDef(4).notSortable()
	    ];
		
}


$scope.vm ();
$scope.vmtaxes ();


	$scope.getCurrencies = function() {
    return $scope.Currencies.length ? null : $http.jsonp($rootScope.globals.serverUrl+hostCallserver+"&object=Reference&method=ListAll&table=Currencies&token="+$rootScope.credentials.currentUser.token).success(function(data) {
      $scope.Currencies = data;
    });
  	};

  	
  	
  	$scope.getRoomTypes = function() {
  	    return $http.jsonp($rootScope.globals.serverUrl+hostCallserver+"&object=RoomType&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&Lang="+langTransService.getSelectedLanguage()).success(function(data) {
  	    	$scope.RoomTypes = data;
  	    });
  	};
  	
  	$scope.getRoomTypes();

  	
  	$scope.getRatePlanConditionsTypes = function() {
  		RatePlanServices.$listRatePlanConditionsType()
			.then(function(response) {
				if(response) {
					$scope.RatePolicyConditionsTypes = response;
				}
			}, function(error) {
				console.log(error);
			});
  	};
  	
  	$scope.getRatePlanConditionsTypes();

	$scope.addRatePlanConditionsTypes = function(data) {
  		RatePlanServices.$listRatePlanConditionsType()
			.then(function(response) {
				if(response) {
					data.options = response;
					$scope.addCheckConditionsTypes(data)					
				}
			}, function(error) {
				console.log(error);
			});
  	};

  	$scope.changeOptions = function (rp,rpct,status) {
  		if (status==true){
	  		RatePlanServices.$insertRatePlanConditions(rp,rpct)
				.then(function(response) {
					if(response) {
						if (response.ErrorNumber!==undefined) {
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
						}else{
							new logger("<p>Data Saved</p>","notice","growl","slide").log();
						}
					}
				}, function(error) {
					console.log(error);
				});
  		}else{
	  		RatePlanServices.$deleteRatePlanConditions(rp,rpct)
				.then(function(response) {
					if(response) {
						if (response.ErrorNumber!==undefined) {
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
						}else{
							new logger("<p>Data Saved</p>","notice","growl","slide").log();
						}
					}
				}, function(error) {
					console.log(error);
				});
  		}
  	}

  	$scope.addCheckConditionsTypes = function(data) {
  		var selected = [];
  		RatePlanServices.$listRatePlanConditions(data.ID)
			.then(function(response) {
				if(response) {
					selected = response;
					if(selected.length > 0){
						angular.forEach(data.options, function(option, index) {
							var i;
							selected.some(function(entry, index) {
							if (entry.FK_RatePolicyConditionsType === option.ID) {
								i = index;
								return true; // Stops loop
								}
							});
							if(i!==undefined) {
  								data.options[index].check = true;
  							} else {
  								data.options[index].check = false;
  							}
						});
					}  	
				}
			}, function(error) {
				console.log(error);
			});
  	}
	
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

	$scope.DOW=[];
  	$scope.getDOW = function(){
		var trans=[];
    	trans=$translate.instant(['PROPERTY_RATEPLAN_MONDAY','PROPERTY_RATEPLAN_TUESDAY','PROPERTY_RATEPLAN_WEDNESDAY','PROPERTY_RATEPLAN_THURSDAY','PROPERTY_RATEPLAN_FRIDAY', 'PROPERTY_RATEPLAN_SATURDAY', 'PROPERTY_RATEPLAN_SUNDAY']);
		$scope.DOW=[
    		{value: "2", text: trans.PROPERTY_RATEPLAN_MONDAY},
    		{value: "3", text: trans.PROPERTY_RATEPLAN_TUESDAY},
    		{value: "4", text: trans.PROPERTY_RATEPLAN_WEDNESDAY},
    		{value: "5", text: trans.PROPERTY_RATEPLAN_THURSDAY},
    		{value: "6", text: trans.PROPERTY_RATEPLAN_FRIDAY},
    		{value: "7", text: trans.PROPERTY_RATEPLAN_SATURDAY},
    		{value: "1", text: trans.PROPERTY_RATEPLAN_SUNDAY}
 		 ];
  	}

  	$scope.getDOW();
  	

  	$scope.showDOW = function(dowlist) {
    var selected = [];
    angular.forEach($scope.DOW, function(s) { 
      if (dowlist.indexOf(s.value) >= 0) {
        selected.push(s.text);
      }
    });
    return selected.length ? selected.join(', ') : 'GENERAL_NOT_SET';
  	};

  	$scope.ppp = [
    {value: 0, text: 'Price Per Room'},
    {value: 1, text: 'Price Per Person'}
  	]; 

  	$scope.showppp = function(pricetype) {
    var selected = $filter('filter')($scope.ppp, {value: pricetype});
    return (selected.length) ? selected[0].text : 'GENERAL_NOT_SET';
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

		tmes=hostCallserver+"&object=RatePolicy&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id;
		  
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					$scope.RatePolicy=response.data;
					
					for(var i in $scope.RatePolicy){
						$scope.RatePolicy[i].RatePolicyDesc = [];
						$scope.RatePolicy[i].RatePolicyRates = [];
						$scope.RatePolicy[i].RatePolicyTaxes = [];
						$scope.RatePolicy[i].RatePolicyConditions = [];
						$scope.RatePolicy[i].options = [];
						$scope.addRatePlanConditionsTypes($scope.RatePolicy[i]);
						// console.log($scope.RatePolicy[i]);

						if($scope.RatePolicy[i].CheckInDOW!=null) {

							var tem = $scope.RatePolicy[i].CheckInDOW.split(";");
							if (tem[0]=="" && tem.length == 1){
								$scope.RatePolicy[i].arrivalDayCheck = false;
							}else{
								$scope.RatePolicy[i].arrivalDayCheck = true;
							}

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
							if (tem[0]=="" && tem.length == 1){
								$scope.RatePolicy[i].departurelDayCheck = false;
							}else{
								$scope.RatePolicy[i].departurelDayCheck = true;
							}
							if(tem!="null") {
								$scope.RatePolicy[i].CheckOutDOW=tem;
							}
						} else {
							$scope.RatePolicy[i].CheckOutDOW=[];
						}
						$scope.RatePolicy[i].MaxOccupancyCheck = ($scope.RatePolicy[i].MaxOccupancy !== "null" && $scope.RatePolicy[i].MaxOccupancy !== "0")?true:false;
						$scope.RatePolicy[i].currencyCheck =  $scope.RatePolicy[i].FK_Currency !== 'null'?true:false;
						$scope.RatePolicy[i].bookingPriorCheck = $scope.RatePolicy[i].BookingPrior !== "null" &&$scope.RatePolicy[i].BookingPrior !== "0"?true:false;
						$scope.RatePolicy[i].bookingDateFromCheck = $scope.RatePolicy[i].BookingDateFrom !== 'null'?true:false;
						$scope.RatePolicy[i].bookingDateToCheck = $scope.RatePolicy[i].BookingDateTo !== 'null'?true:false;
						$scope.RatePolicy[i].validCheckInCheck = $scope.RatePolicy[i].ValidCheckIn !== 'null'?true:false;
						$scope.RatePolicy[i].validCheckOutCheck = $scope.RatePolicy[i].ValidCheckOut !== 'null'?true:false;
						
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

		tmes=hostCallserver+"&object=RatePolicyDesc&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id;
		  
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {
				if(response.data.Status === undefined){
					for (var i in $scope.RatePolicy) {
						$scope.RatePolicy[i].RatePolicyDesc=[];
					}					
					for (var i in response.data) {
						var id=findid($scope.RatePolicy,response.data[i].FK_RatePolicy);
						if(id!==undefined){
							$scope.RatePolicy[id].RatePolicyDesc.push(response.data[i]);
							if($scope.RatePolicy[id].SD === undefined) $scope.RatePolicy[id].SD="";
							if(response.data[i].LangCode==langTransService.getSelectedLanguage()) { //$scope.selectedLanguage
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
//.................taxes test

	$scope.getRatePolicyTaxes = function() {

		tmes=hostCallserver+"&object=RatePolicyTaxes&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id;
		  
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {
			//	  vm.mData= response.data;
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

		tmes=hostCallserver+"&object=RatePolicyRates&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id;
		  
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

	

	$scope.getRatePolicyConditions1 = function() {
		var lan= langTransService.getSelectedLanguage();
		tmes=hostCallserver+"&object=RatePolicyConditions&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&withdescription="+1+"&LangCode="+lan;
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
				$scope.RatePolicyDescription = response.data;

				 	
				/*	for (var i in response.data) {
						var id=findid($scope.RatePolicy,response.data[i].FK_RatePolicy);
						$scope.RatePolicyDescription
						if(id!==undefined){

							if($scope.RatePolicyDescription[id].RatePolicyConditions===undefined) $scope.RatePolicy[id].RatePolicyConditions=[];
							
							$scope.RatePolicy[id].RatePolicyConditions.push(response.data[i]);
							
						} else {
							//alert("luis " + response.data[i].FK_RatePolicy );
							
						}

					}*/
				} else {
					if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
					}
				}
				
				
				}
			
			},$http,$scope); 

	};
	
	$scope.RatePolicyDescription =[];
	
$scope.getRatePolicyConditions1();
  $scope.deleteRatePolicyConditions = function(rp,item) {
				  callserver(hostCallserver+"&object=RatePolicyConditions&method=Delete&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+item.ID,function (response) {
						if (response.status == 'OK') {
							
							if(response.data.Status === undefined){
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
							} else {
								if(response.data.Status == "OK") {
									new logger("<p>Data Saved</p>","notice","growl","slide").log();
									
									// $scope.RatePolicyDescription.splice(idx,1);
									
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
	  };
	  $scope.addRatePolicyConditions = function (rp,group) {
		  rp.options.push({
			Description: "Edit",
			Group: group,
			ID: -1,
			Icon: "null",
			check: false
		  })
		  $scope.editRatePolicyCondition(rp.options[rp.options.length-1]);
	};
		
	 $scope.saveRatePolicyConditions = function(rp,item) {
			
		  var tmes=""; 
		  var lan= langTransService.getSelectedLanguage();
		  // var rpc = $scope.RatePolicyDescription[ $scope.RatePolicyDescription.length - 1 ];
		  // for(var i=0; i<  $scope.RatePolicyDescription.length ;i++)
		  // {
		  // 	if($scope.RatePolicyDescription[i].Description=== rpc.Description)
		  // 	{
		  // 		rpc =$scope.RatePolicyDescription[i].FK_RatePolicyConditionsType;
		  // 	}
		  // }
		   
		 tmes=hostCallserver+"&object=RatePolicyConditions&method=Insert&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&FK_RatePolicyConditionsType="+item.FK_RatePolicyConditionsType+"&FK_RatePolicy="+rp.ID+"&LangCode="+lan;
		  
		  callserver(tmes,function (response) {

				if (response.status == 'OK') {

					if(response.data.Status === undefined){
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
					} else {
						if(response.data.Status == "OK") {
							new logger("<p>Data Saved</p>","notice","growl","slide").log();
							//$scope.desc.splice(idx,1);
							// if(data.ID==-1) $scope.roomlist[idx].ID=response.data.ID;
							
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
			$scope.getRatePolicyConditions1();
			},$http,$scope); 
		   
	  };		 
 


	//......rate policy description ends


	$scope.getRatePolicyConditions = function() {

		tmes=hostCallserver+"&object=RatePolicyConditions&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id;
		  
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
		$scope.addDesc = function(langcode,fk_ratepolicy) {
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
		};
	
	  
	  $scope.deleteRatePolicyDesc = function(sentid,idx,fk_ratepolicy) {
			if( sentid<0 ) {
				$scope.RatePolicy[findid($scope.RatePolicy,fk_ratepolicy)].RatePolicyDesc.splice(idx,1);
			} else {
				  callserver(hostCallserver+"&object=RatePolicyDesc&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+sentid,function (response) {
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
			  tmes=hostCallserver+"&object=RatePolicyDesc&method=Insert&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&LangCode="+data.LangCode+"&Description="+data.Description+"&PromotionDescription="+data.PromotionDescription+"&FK_RatePolicy="+data.FK_RatePolicy;
		  } else {
			  tmes=hostCallserver+"&object=RatePolicyDesc&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&Description="+data.Description+"&PromotionDescription="+data.PromotionDescription+"&LangCode="+data.LangCode;
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
							var id=findid($scope.RatePolicy,data.FK_RatePolicy);

							if(data.ID==-1) $scope.RatePolicy[id].RatePolicyDesc[idx].ID=response.data.ID;


							$scope.RatePolicy[id].RatePolicyDesc[idx].Description=data.Description;
							$scope.RatePolicy[id].RatePolicyDesc[idx].PromotionDescription=data.PromotionDescription;

							if(data.LangCode==langTransService.getSelectedLanguage()) { //$scope.selectedLanguage
								$scope.RatePolicy[id].SD=data.Description;
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
		  } 
	  };



	  $scope.saveRatePolicy = function(data,idx) {

	  	var emptyArray = []
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
			  tmes=hostCallserver+"&object=RatePolicy&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&FK_Currency="+data.FK_Currency+"&Taxes_Included="+data.Taxes_Included+"&MaxOccupancy="+data.MaxOccupancy+"&CheckInDOW="+data.CheckInDOW.join(";")+"&CheckOutDOW="+data.CheckOutDOW.join(";")+"&BookingPrior="+data.BookingPrior+"&BookingDateFrom="+data.BookingDateFrom+"&BookingDateTo="+data.BookingDateTo+"&ValidCheckIn="+data.ValidCheckIn+"&ValidCheckOut="+data.ValidCheckOut+"&PricePerPerson="+data.PricePerPerson+"&Active="+data.Active;
		  }else{
			data.CheckInDOW = data.arrivalDayCheck !== false ? data.CheckInDOW : emptyArray;
			data.CheckOutDOW = data.departurelDayCheck !== false ? data.CheckOutDOW : emptyArray;
			data.MaxOccupancy = data.MaxOccupancyCheck!== false ? data.MaxOccupancy : "0";
			data.FK_Currency = data.currencyCheck!== false ? data.FK_Currency : "null";
			data.BookingPrior = data.bookingPriorCheck!== false ? data.BookingPrior : "0";
			data.BookingDateFrom = data.bookingDateFromCheck!== false && data.BookingDateFrom!== 'null'? moment(data.BookingDateFrom).format("YYYY-MM-DD") : "null";
			data.BookingDateTo = data.bookingDateToCheck!== false && data.BookingDateTo!== 'null'? moment(data.BookingDateTo).format("YYYY-MM-DD") : "null";
			data.ValidCheckIn = data.validCheckInCheck!== false && data.ValidCheckIn!== 'null'? moment(data.ValidCheckIn).format("YYYY-MM-DD") : "null";
			data.ValidCheckOut = data.validCheckOutCheck!== false && data.ValidCheckOut!== 'null'? moment(data.ValidCheckOut).format("YYYY-MM-DD") : "null";		  	
			tmes=hostCallserver+"&object=RatePolicy&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&FK_Currency="+data.FK_Currency+"&Taxes_Included="+data.Taxes_Included+"&MaxOccupancy="+data.MaxOccupancy+"&CheckInDOW="+data.CheckInDOW.join(";")+"&CheckOutDOW="+data.CheckOutDOW.join(";")+"&BookingPrior="+data.BookingPrior+"&BookingDateFrom="+data.BookingDateFrom+"&BookingDateTo="+data.BookingDateTo+"&ValidCheckIn="+data.ValidCheckIn+"&ValidCheckOut="+data.ValidCheckOut+"&PricePerPerson="+data.PricePerPerson+"&Active="+data.Active;
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
				  callserver(hostCallserver+"&object=RatePolicy&method=Delete&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID,function (response) {
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
		  	    RatePolicyTaxes: [],
		  	    Active: 0
		  	    
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
	  
	  
	  
	  
	  
	$scope.addRatePolicyRate = function(fk_ratepolicy){
		var exists=true;
		var id=findid($scope.RatePolicy,fk_ratepolicy);
		if(id===undefined){
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

	};
	  
	  
	  $scope.saveRatePolicyRates = function(data,idx) {
			
			
			
			
			  if(data.ID==-1) {

				  tmes=hostCallserver+"&object=RatePolicyRates&method=Insert&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&FK_RatePolicy="+data.FK_RatePolicy+"&FK_RoomType="+data.FK_RoomType+"&Rate="+data.Rate+"&RateAdditionalPerson="+data.RateAdditionalPerson+"&RateChildren="+data.RateChildren;

			  } else {
				  tmes=hostCallserver+"&object=RatePolicyRates&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&FK_RatePolicy="+data.FK_RatePolicy+"&FK_RoomType="+data.FK_RoomType+"&Rate="+data.Rate+"&RateAdditionalPerson="+data.RateAdditionalPerson+"&RateChildren="+data.RateChildren;
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
	  
		  
		$scope.editRatePolicyCondition = function(data) {
			$uibModal.open({
				templateUrl: "views/ratePolicyOptions-modal.html",
				scope: $scope,
				controller: 'rateplanOptionsModal',
				controllerAs: 'vm',
				resolve: {
					data: function () {return data;},
					langs: function(LangServices) {
                    	return LangServices.$listLang();
                	}
				}
        	});
		  };
		  
		  $scope.deleteRatePolicyDescriptionsType = function(rp,dt){
		  	        $uibModal.open({
            			templateUrl: "views/confirmationModal.html",
            			scope: $scope,
            			controller: function($rootScope, $scope, $http, $modalInstance, rp, dt) {
                    		$scope.cancel = function() {
                        		$modalInstance.dismiss('cancel');
                    		};
							$scope.ok = function() {
							RatePlanConditionsTypeServices.$deleteRatePlanConditionsType(dt.ID)
								.then(function(response) {
									if(response) {
										if (response.Status == 'OK') {
											new logger("<p>Data Saved</p>","notice","growl","slide").log();
											var id=findid(rp.options,dt.ID);
											rp.options.splice(id,1);
										}else{
											if(typeof(response.ErrorNumber) != "undefined" && response.ErrorNumber != "1010" ) {
												new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
											}
										}									
									}
								}, 
								function(error) {
									console.log(error);
								});	
								$modalInstance.close();
							};
                			var trans=$translate.instant(['PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_TITLE','PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_TEXT']);
                			$scope.confirmationtext=trans.PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_TEXT;
                			$scope.headertext=trans.PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_TITLE;
						},
            			resolve: {
                			rp: function () { return rp; },
                			dt: function () { return dt; }
            			}
        		});			  
		  }
		  
		  $scope.deleteRatePolicyRates = function(data,idx) {
		  	        $uibModal.open({
            			templateUrl: "views/confirmationModal.html",
            			scope: $scope,
            			controller: function($rootScope, $scope, $http, $modalInstance, data, idx) {
                    		$scope.cancel = function() {
                        		$modalInstance.dismiss('cancel');
                    		};
							$scope.ok = function() {
								var id=findid($scope.RatePolicy,data.FK_RatePolicy);
							  	if( data.ID<0 ) {
									$scope.RatePolicy[id].RatePolicyRates.splice(idx,1);
								} else {
									  callserver(hostCallserver+"&object=RatePolicyRates&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID,function (response) {
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
										
										},$http,$rootScope); 
								}
                        		$modalInstance.close();
							};
                			var trans=$translate.instant(['PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_RATETITLE','PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_RATELINE']);
                			$scope.confirmationtext=trans.PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_RATELINE;
                			$scope.headertext=trans.PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_RATETITLE;
						},
            			resolve: {
                			data: function () { return data; },
                			idx: function () { return idx; }
            			}
        		});
		  };
	  
	  //End Rate Polic Rates
		  
		  //Rate Plicy Taxes Start
		$scope.taxtypes = [];
		$scope.taxpercentage = [];

		$scope.updatetaxconstants = function () {		  
			$scope.taxtypes = [
				// {value: 1, text: 'Per Stay / Room'},
				// {value: 2, text: 'Per Stay / Person'},
				// {value: 3, text: 'Per Day / Room'},
				// {value: 4, text: 'Per Day / Person'}
				{value: 1, text: $translate.instant('PROPERTY_RATEPLAN_TAXES_PERSTAY_ROOM')},
				{value: 2, text: $translate.instant('PROPERTY_RATEPLAN_TAXES_PERSTAY_PERSON')},
				{value: 3, text: $translate.instant('PROPERTY_RATEPLAN_TAXES_PERDAY_ROOM')},
				{value: 4, text: $translate.instant('PROPERTY_RATEPLAN_TAXES_PERDAY_PERSON')}
			]; 
		  

			$scope.taxpercentage = [
				{value: 0, text: $translate.instant('PROPERTY_PRODUCTS_ABSOLUTE')},
				{value: 1, text: $translate.instant('PROPERTY_PRODUCTS_PERCENTAGE')}
			]; 

		}

		$scope.updatetaxconstants();

		  $scope.showTaxes = function(val) {
			    var selected = $filter('filter')($scope.taxtypes, {value: val});
			    return (val && selected.length) ? selected[0].text : $translate.instant('GENERAL_NOT_SET');
			  };
		  
			  
		  

           $scope.showTaxPercentage = function(val) {
        	   var selected = $filter('filter')($scope.taxpercentage, {value: val});
        	   return (val && selected.length) ? selected[0].text : $translate.instant('GENERAL_NOT_SET');
           };

			$scope.getPercentageTypeLabel = function(value) {
				if (value == 0) {
					return $translate.instant('PROPERTY_PRODUCTS_ABSOLUTE');
				}else{
					return $translate.instant('PROPERTY_PRODUCTS_PERCENTAGE');
            	}
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
     		
     	  	this.RatePolicy[id].RatePolicyTaxes=$scope.RatePolicy[id].RatePolicyTaxes;
     	  	
     	  };
     	  
           
     	  
     	  
     	 $scope.saveRatePolicyTaxes = function(data,idx) {
 			
			  if(data.ID==-1) {

				  tmes=hostCallserver+"&object=RatePolicyTaxes&method=Insert&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&FK_RatePolicy="+data.FK_RatePolicy+"&Description="+data.Description+"&Type="+data.Type+"&Percentage="+data.Percentage+"&Amount="+data.Amount;

			  } else {
				  tmes=hostCallserver+"&object=RatePolicyTaxes&method=Update&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID+"&FK_RatePolicy="+data.FK_RatePolicy+"&Description="+data.Description+"&Type="+data.Type+"&Percentage="+data.Percentage+"&Amount="+data.Amount;
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
		  	        $uibModal.open({
            			templateUrl: "views/confirmationModal.html",
            			scope: $scope,
            			controller: function($rootScope, $scope, $http, $modalInstance, data, idx) {
                    		$scope.cancel = function() {
                        		$modalInstance.dismiss('cancel');
                    		};
							$scope.ok = function() {		  	
								var id=findid($scope.RatePolicy,data.FK_RatePolicy);
								if( data.ID<0 ) {
									$scope.RatePolicy[id].RatePolicyTaxes.splice(idx,1);
								} else {
									callserver(hostCallserver+"&object=RatePolicyTaxes&method=Destroy&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID,function (response) {
										if (response.status == 'OK') {
											if(response.data.Status === undefined){
												new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
											} else {
												if(response.data.Status == "OK") {
													new logger("<p>Data Saved</p>","notice","growl","slide").log();
													$scope.RatePolicy[id].RatePolicyTaxes.splice(idx,1);
												} else {
													new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
												}
											}
										} else {
											if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
												new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
											}
										}
									},$http,$scope); 
								}
								$modalInstance.close();
							};
                			var trans=$translate.instant(['PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_TAXTITLE','PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_TAXLINE']);
                			$scope.confirmationtext=trans.PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_TAXLINE;
                			$scope.headertext=trans.PROPERTY_RATEPLAN_MODAL_CONFIRM_DELETE_TAXTITLE;
						},
            			resolve: {
                			data: function () { return data; },
                			idx: function () { return idx; }
            			}
        		});
		  };
		  
		  //Rate Plicy Taxes End


});