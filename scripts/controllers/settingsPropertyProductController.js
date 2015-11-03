'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:SettingpropertyproductCtrl
 * @description
 * # SettingpropertyproductCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('SettingpropertyproductCtrl', function ($scope, $rootScope, $http, $filter,webConstants,createBooking,DTOptionsBuilder, DTColumnDefBuilder, $translate) {

    //................................................................
 	 var hostCallserver =webConstants.hostCallserver;
 	 var vm = this;
 	 var tmes="";
 	 
      //....seting roles
        $scope.rightValue =false;
        $scope.rightValue2=false;
        $scope.rightsValues = $rootScope.globals.fk_rightsResponse;
        if($scope.rightsValues.data[0].Company === 1 )
            $scope.rightValue=true;
        if($scope.rightsValues.data[0].Company === 2 )
            $scope.rightValue2=true;
        //....seting roles ends

         $scope.percentageTypes = [{
                "label": "Absolute",
                "value": 0
            },{
                "label": "Percentage",
                "value": 1
            }];

          $scope.getPercentageTypeLabel = function(value) {
            if (value == 0) {
                return "Absolute";
            }
            else {
                return "Percentage";
            }
        }
        //

        //.... watching the lang change
	    $rootScope.$on('$translateChangeSuccess', function () {
		
		$scope.vm();
	  
    });
   
    //.................vm 
    $scope.vm = function()
    {     		

    	var trans=[];

    	trans=$translate.instant(['TABLE_SEARCH_PLACEHOLDER','TABLE_EMPTY','TABLE_LOADING','TABLE_PROCESSING','TABLE_ZERO_RECORDS', 'TABLE_COPY', 'TABLE_FIRST', 'TABLE_LAST', 'TABLE_NEXT', 'TABLE_PREVIOUS', 'PDF_MESSAGE']);

	        vm.dtOptions = DTOptionsBuilder.newOptions()
	        .withOption('responsive', true)
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
	                "mColumns": [ 0, 1, 2, 3, 4, 5, 6, 7 ],
	                "sButtonText": trans.TABLE_COPY
	            },
	            {
	                "sExtends": "csv",
	                "mColumns": [ 0, 1, 2, 3, 4, 5, 6, 7 ]
	            },
	            {
	                "sExtends": "xls",
	                "mColumns": [ 0, 1, 2, 3, 4, 5, 6, 7 ]
	            }, 
	            {
	                "sExtends": "pdf",
	                "sPdfOrientation": "landscape",
	                "mColumns": [ 0, 1, 2, 3, 4, 5, 6, 7 ],
	                "sPdfMessage": trans.PDF_MESSAGE
	            }
	        ]);
	        
		   
		     vm.dtColumnDefs = [
		        DTColumnDefBuilder.newColumnDef(0),
		        DTColumnDefBuilder.newColumnDef(1),
		        DTColumnDefBuilder.newColumnDef(2),
		        DTColumnDefBuilder.newColumnDef(3),
		        DTColumnDefBuilder.newColumnDef(4),
		        DTColumnDefBuilder.newColumnDef(5),
		        DTColumnDefBuilder.newColumnDef(6),
		        DTColumnDefBuilder.newColumnDef(7).notSortable()
		    ];

	        //.............vm ends
        }

        $scope.vm ();
         

	$scope.ratepolicychanged=[];
	$scope.ratechanged=[];

	$scope.lang=$rootScope.languages;

	$scope.RatePolicy=[];
	$scope.Currencies = [];
	$scope.RoomTypes = [];
	$scope.RatePolicyConditionsTypes = [];
 
	 
  	//..
  	 $scope.lineItemTax = function(lineItem) {
            if (lineItem.TaxPercentage == 0) {
                return lineItem.Quantity * lineItem.TaxAmount;
            }
            else {
                return (lineItem.UnitPrice * lineItem.Quantity) * (lineItem.TaxAmount / 100) 
            }
        }
        
        $scope.lineItemTotal = function(lineItem) {
            if(lineItem.TaxPercentage===1)	
             return parseFloat(lineItem.UnitPrice) + ( lineItem.UnitPrice * lineItem.TaxAmount);
         	else
         	return	parseFloat(lineItem.UnitPrice) + parseFloat(lineItem.TaxAmount);

            
        }

  	//...

	$scope.getProduct = function() {
 		tmes=hostCallserver+"&object=Product&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id;
		  callserver(tmes,function (response) {
				if (response.status == 'OK') { 
				
				if(response.data.Status === undefined){
					
					$scope.RatePolicy=response.data; 
					$scope.total = 5;
				 	
				} else {
					if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
					}
				}
				
				
				}
			
			},$http,$scope); 

	};


	
	
$scope.getProduct();

 

	  $scope.saveProduct = function(data,idx) {
		  var tmes="";
		  	console.log("data data update : ",data);
		  		 if(data.ID===-1) 
		  		 {  

		  		 	tmes=hostCallserver+"&object=Product&method=Insert&token="
					  +$rootScope.credentials.currentUser.token+"&FK_Property="
					  +$rootScope.globals.fk_property.id+"&Lang="+"ENG"+"&FK_Currency="+data.FK_Currency+
					  "&Description="+data.Description+"&FK_CostCenter="+data.FK_CostCenter+"&PublishIBE="+data.PublishIBE
					  +"&TaxAmount="+data.TaxAmount+"&TaxPercentage="+data.TaxPercentage
					  +"&UnitPrice="+data.UnitPrice+"&Active="+data.Active;

		  		 } 
		  		 else 
		  		 {
					  tmes=hostCallserver+"&object=Product&method=Update&token="
					  +$rootScope.credentials.currentUser.token+"&FK_Property="
					  +$rootScope.globals.fk_property.id+"&ID="+data.ID+"&FK_Currency="+data.FK_Currency+
					  "&Description="+data.Description+"&FK_CostCenter="+data.FK_CostCenter+"&PublishIBE="+data.PublishIBE
					  +"&TaxAmount="+data.TaxAmount+"&TaxPercentage="+data.TaxPercentage
					  +"&UnitPrice="+data.UnitPrice+"&Active="+data.Active;
				 }
		if( data.FK_Currency!= null && data.Description!= null && data.PublishIBE != null && data.UnitPrice!= null  && data.TaxAmount!= 0)
		 {
		  callserver(tmes,function (response) {
				if (response.status == 'OK') {
					console.log("response : ",response);
					if(response.data.Status === undefined){
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
					} else {
						if(response.data.Status == "OK") {
							new logger("<p>Data Saved</p>","notice","growl","slide").log();
							
							if(data.ID==-1) {

								
								$scope.getProduct();
 
								
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
	
	  $scope.deleteProduct = function(data,idx) {
			if( data.ID<0 ) {
				$scope.RatePolicy.splice(idx,1);
			} else {
				  callserver(hostCallserver+"&object=Product&method=Delete&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID,function (response) {
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
	 
	  
 		$scope.addProduct = function () {
		
		$scope.RatePolicy.push({
		"ID": -1,
		"FK_Property": $rootScope.globals.fk_property.id,
		"Active": 1,
		"Description": null,
		"FK_CostCenter": 1,
		"FK_Currency": null,  
		"PublishIBE": null,
		"TaxAmount": 0,
		"TaxPercentage": 0,
		"UnitPrice": 0 ,
		"TaxEditable": true
		});
		//createBooking.safeApply();
		console.log("dsaf : ",$scope.RatePolicy);	
	};
		
			 
 
		   
	  
	  
	  
    //...................................................................................
  
  });
