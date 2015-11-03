'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:BookinglisttableCtrl
 * @description
 * # BookinglisttableCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('bookingListTableCtrl', function ($rootScope, $scope, $filter, $http, $location, $uibModal, DTOptionsBuilder, DTColumnDefBuilder,BookingService,webConstants,langTransService,createBooking,searchService, $translate) {
   //

		//var hostCallserver =webConstants.hostCallserver;	
		var vm = this;
		$scope.searchState = {
            searchTerm: "" 
        };
        $scope.searchTerm ;   
        var k;
        var searchvalue;
	    //....seting roles
		$scope.rightValue =false;
		$scope.rightValue2=false;
		$scope.rightsValues = $rootScope.globals.fk_rightsResponse;
		if($scope.rightsValues.data[0].Booking === 1 )
  			$scope.rightValue=true;
  		if($scope.rightsValues.data[0].Booking === 2 )
  			$scope.rightValue2=true;
  		//....seting roles ends
   
   		$scope.dateFrom = moment();
		$scope.dateTo = moment().add(30, 'days');
   
     $rootScope.$on('updateSearchResult', function(event,s) 
     {	 
     		$scope.searchTerm = s;
    		$scope.update('start','end','SEARCH');
                    	 
     });
     
    $rootScope.$on('$translateChangeSuccess', function () {
		
		$scope.vm();
	  
    });
	
	var dtColumnDefs=[];
	var dtOptions="";

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
	    .withOption('responsive', true)
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
                "sButtonText": trans.TABLE_COPY
            },
            'csv',
            {
                "sExtends": "xls",
                "mColumns": [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ],
            }, 
            {
                "sExtends": "pdf",
                "sPdfOrientation": "landscape",
                "mColumns": [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ],
                "sPdfMessage": trans.PDF_MESSAGE
            }
        ])
        .withOption('aaSorting', [3, 'asc']);
	    
	    
			
	    
	    $scope.dtColumnDefs = [
	        DTColumnDefBuilder.newColumnDef(0),
	        DTColumnDefBuilder.newColumnDef(1),
	        DTColumnDefBuilder.newColumnDef(2),
	        DTColumnDefBuilder.newColumnDef(3),
	        DTColumnDefBuilder.newColumnDef(4),
          DTColumnDefBuilder.newColumnDef(5),
          DTColumnDefBuilder.newColumnDef(6),
          DTColumnDefBuilder.newColumnDef(7),
          DTColumnDefBuilder.newColumnDef(8),
          DTColumnDefBuilder.newColumnDef(9).notSortable()
	    ];
		
}
	

	$scope.vm ();
	
	
  
	var init;
			
	$scope.update = function (pickedDateFrom, pickedDateTo,search) {
		if(search === "SEARCH") {
			BookingService.$search($scope.searchTerm)
				.then(aResponse,function(response) {
				$scope.bookingList=[];
			});
		} else {
			BookingService.$listbydates($scope.dateFrom,$scope.dateTo)
				.then(aResponse,function(response) {
					$scope.bookingList=[];
				});
			}
	
	}

	function aResponse (response) {
		$scope.bookingList=response;
		for(var i=0;i<$scope.bookingList.length;i++) {
			$scope.bookingList[i].Holder={};
			$scope.bookingList[i].CreatedON=moment($scope.bookingList[i].CreatedON);
			$scope.bookingList[i].lasttimestamp=moment($scope.bookingList[i].lasttimestamp);

			var troom="";
			var roomid=0;
			if($scope.bookingList[i].FK_Room === undefined || $scope.bookingList[i].FK_Room == null || $scope.bookingList[i].FK_Room == "null") {
				troom="";
			} else {
				roomid=findid($rootScope.globals.fk_property.roomlist,parseInt($scope.bookingList[i].FK_Room));
				if(!(roomid === undefined)) {
					troom=($rootScope.globals.fk_property.roomlist[roomid].number | "");
				} else {
					troom= "ID: " + $scope.bookingList[i].FK_Room
				}
			}

			$scope.bookingList[i].FK_Room_Number=troom;
			
			for(var holder in $scope.bookingList[i].BookingCustomer){
				if($scope.bookingList[i].BookingCustomer[holder].IsHolder==1 || $scope.bookingList[i].BookingCustomer[holder].IsHolder=="1"){
					$scope.bookingList[i].Holder=$scope.bookingList[i].BookingCustomer[holder];
					break;
				}
			}

		}
	}
			
			if(!$scope.searchTerm)
			$scope.update();
			else
			$scope.update('start','end','SEARCH');

		
			$scope.checkIn = function(bookingID) {
		
				BookingService.$checkInConfirm(bookingID)
				.then(function(response) {
    				if(response) {
    					$scope.bookingList[findid($scope.bookingList,bookingID)].FK_BookingStatus=2;
    				}
    			}, function(error) {

    			});


			}

			$scope.checkOut = function(bookingID) {

				$uibModal.open({
					templateUrl: "views/confirmationModal.html",
					controller: function($scope, $modalInstance) {
							$scope.cancel = function() {
								$modalInstance.dismiss('cancel');
							};

							$scope.ok = function() {
								$location.path("invoices/" + bookingID);
								$modalInstance.close();
							};

						var trans=$translate.instant(['CONFIRM_MODAL_TITLE_CHECKOUT','CONFIRM_MODAL_TEXT_CHECKOUT']);
                        $scope.confirmationtext=trans.CONFIRM_MODAL_TEXT_CHECKOUT;
                        $scope.headertext=trans.CONFIRM_MODAL_TITLE_CHECKOUT;
					}
					
				});






			}

			$scope.cancel = function(bookingID) {



				BookingService.$cancelConfirm(bookingID)
				.then(function(response) {
    				if(response) {
    					var id=findid($scope.bookingList,bookingID);
    					$scope.bookingList[id].FK_BookingStatus=4;
    				}
    			}, function(error) {

    			});



			}

			$scope.openModal = function(i) {
				 
				 BookingService.$editBooking(i,undefined,undefined,undefined)
				 .then(function(data) {
						
						if(data=="cancel") {

						} else {

							var bid=findid($scope.bookingList,data.ID);

							var troom="";
							
							if(data.FK_Room_Number===undefined) {
								troom= "ID: " + data.FK_Room;
							} else {
								troom=data.FK_Room_Number;
							}
						
	    					$scope.bookingList[bid].FK_BookingStatus = data.FK_BookingStatus;
					 		$scope.bookingList[bid].Holder.FirstName = data.BookingCustomer.FirstName;
					 		$scope.bookingList[bid].Holder.LastName = data.BookingCustomer.LastName;
					 		$scope.bookingList[bid].room = troom;
							$scope.bookingList[bid].DateFrom = moment(data.DateFrom);
							$scope.bookingList[bid].DateTo = moment(data.DateTo);
							
						}


				 });
		
			}

			 
	$scope.noShow = function(bookingID) {

				BookingService.$noShowConfirm(bookingID)
				.then(function(response) {
    				if(response) {

    					$scope.bookingList[findid($scope.bookingList,bookingID)].FK_BookingStatus=5;
    				}
    			}, function(error) {
          			//reloadCalender();
        			//new errorLogger(error.message).log();
    			});




		

    };

    
    $scope.showCheckIn = function (status, DateFrom, DateTo) {
      return BookingService.$canCheckIn(status, DateFrom, DateTo);
    };

    $scope.showCheckOut = function (status, DateTo) {
      return BookingService.$canCheckOut(status, DateTo);
    };

    $scope.showNoShow = function (status, DateFrom) {
      return BookingService.$canNoShow(status, DateFrom);
    };
	
  });