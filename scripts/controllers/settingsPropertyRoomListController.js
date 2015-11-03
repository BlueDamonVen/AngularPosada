function settingsPropertyRoomListCtrl ($scope, $rootScope, $http, ngTableParams, $filter,webConstants,DTOptionsBuilder, DTColumnDefBuilder, $translate) {
	
	 var hostCallserver =webConstants.hostCallserver;
	$scope.roomlist=[];
	$scope.roomtypes=[];
	var data=$scope.roomlist;
	
	 $scope.roomtypestatuses = [
	                    {value: 1, text: 'Active'},
	                    {value: 2, text: 'Out of Order'}
	                  ]; 
	 //.................vm 

	$rootScope.$on('$translateChangeSuccess', function () {
		$scope.vm();
	});

 	var vm =this;
    $scope.vm = function()
    {     		
	    
	    var trans=[];

    	trans=$translate.instant(['TABLE_SEARCH_PLACEHOLDER','TABLE_EMPTY','TABLE_LOADING','TABLE_PROCESSING','TABLE_ZERO_RECORDS', 'TABLE_COPY', 'TABLE_FIRST', 'TABLE_LAST', 'TABLE_NEXT', 'TABLE_PREVIOUS', 'PDF_MESSAGE']);

	    vm.dtOptions = DTOptionsBuilder.newOptions()
	    .withPaginationType('full_numbers')
	    .withDisplayLength(10)
	    .withDOM('T<"clearfix"f>t<"bottom"rp>')
	    .withTableTools('/swf/copy_csv_xls_pdf.swf')
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
                "sButtonText": trans.TABLE_COPY
            },
            'csv',
            {
                "sExtends": "xls",
                "mColumns": [ 0, 1, 2, 3, 4, 5 ],
            }, 
            {
                "sExtends": "pdf",
                "sPdfOrientation": "landscape",
                "mColumns": [ 0, 1, 2, 3, 4, 5 ],
                "sPdfMessage": trans.PDF_MESSAGE
            }
        ]);
	    
	    
			
	    
	    vm.dtColumnDefs = [
	        DTColumnDefBuilder.newColumnDef(0),
	        DTColumnDefBuilder.newColumnDef(1),
	        DTColumnDefBuilder.newColumnDef(2),
	        DTColumnDefBuilder.newColumnDef(3),
	        DTColumnDefBuilder.newColumnDef(4),
	        DTColumnDefBuilder.newColumnDef(5).notSortable()
	    ];
		
	}			
	$scope.vm ();
	 //............vm ends




	
	$scope.getRoomlist = function () {
		callserver(hostCallserver+"&object=Room&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
			
			if (response.status == 'OK') {
				
				if(response.data.Status === undefined){
					$scope.roomlist=response.data;
					data=response.data;
					vm.roomlist=$scope.roomlist;
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
		callserver(hostCallserver+"&object=RoomType&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&Lang=ENG",function (response) {
			
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
		return ($scope.roomtypes && selected.length) ? selected[0].ShortDescription : $translate.instant('GENERAL_NOT_SET');
	};
	
	
	$scope.getRoomlist();
	$scope.getRoomTypes();
	
	
	
	$scope.showRoomTypeStatus = function(id) {
		//var idt=(findid($scope.roomlist,id) | 0);
	    var selected = $filter('filter')($scope.roomtypestatuses, {value: id});
	    return ($scope.roomtypestatuses && selected.length) ? selected[0].text : $translate.instant('GENERAL_NOT_SET');
	  };
	
	
	  $scope.addRoom = function () {
		  $scope.roomlist.unshift({
			  ID: -1,
			  FK_Property: $rootScope.globals.fk_property.id,
			  FK_RoomType: null,
			  FK_RoomStatusType: null,
			  Number: "",
			  Floor: null,
			  Comment: null
		  });
		  
		  // $scope.tableParams.sorting({ID: 'asc'});
	  }
	  
	
	// var currentPage = null;
	
	// $scope.$watch("filter.$", function () {
 //        $scope.tableParams.reload();
        
 //        if(!($scope.filter===undefined)){
 //        if ($scope.filter.$.length > 0) {
 //            if (currentPage === null) {
 //                currentPage = $scope.tableParams.$params.page;
 //            }
 //            $scope.tableParams.page(1);
 //        } else {
 //            $scope.tableParams.page(currentPage);
 //            currentPage = null;
 //        }
 //        }
 //    });
	
	// $scope.tableParams = new ngTableParams({
 //        page: 1,            // show first page
 //        count: 10,           // count per page
 //        filter: {
 //            afilt: ''       // initial filter
 //        },
 //        sorting: {
 //            Number: 'asc'     // initial sorting
 //        }
	// }, {
	// 	counts: [],
 //    	filterSwitch: true,
 //        total: 0, // length of data
 //        getData: function ($defer, params) {
        	
 //        	var filteredData = $filter('filter')(data, $scope.filter);
        	
 //        	var orderedData = params.sorting() ?
 //                    $filter('orderBy')(filteredData, params.orderBy()) :
 //                    	filteredData;
                    
 //        	$scope.roomlist = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
 //        	// following 2 lines fixed "paging controls not showing up issue" for me
 //        	params.total(orderedData.length); // set total for recalc pagination
        	
 //        	$defer.resolve($scope.roomlist);
 //        }
 //    });
	
	
	 $scope.saveRoom = function(data,idx) {
			
		  var tmes="";
		  if(data.ID==-1) {
			  tmes=hostCallserver+"&object=Room&method=Insert&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&FK_RoomType="+data.FK_RoomType+"&FK_RoomStatusType="+data.FK_RoomStatusType+"&Number="+data.Number+"&Floor="+data.Floor+"&Comment="+data.Comment;
		  } else {
			  tmes=hostCallserver+"&object=Room&method=Update&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&FK_RoomType="+data.FK_RoomType+"&FK_RoomStatusType="+data.FK_RoomStatusType+"&Number="+data.Number+"&Floor="+data.Floor+"&Comment="+data.Comment+"&ID="+data.ID;
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
		  
		  tmes=hostCallserver+"&object=Room&method=Delete&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&ID="+data.ID;
		  
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


angular
	.module('bearpms3App')
	.controller('settingsPropertyRoomListCtrl', settingsPropertyRoomListCtrl);