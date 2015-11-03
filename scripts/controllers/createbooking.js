'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:CreatebookingCtrl
 * @description
 * # CreatebookingCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('createBookingCtrl', function ($scope,$rootScope,$http,$uibModal,$q,langTransService,webConstants,$translate,DTOptionsBuilder,DTColumnDefBuilder,BookingService) {
		var host=webConstants.host;
		var hostCallserver =webConstants.hostCallserver;
		$scope.data = {
			"rooms" : 0,
			"occupants" : 0,
			"adults": 0
		};
		// $scope.guestsNumberType=[
		// 	{value:1,text:"1"},
		// 	{value:2,text:"2"},
		// 	{value:3,text:"3"},
		// 	{value:4,text:"4"},
		// 	{value:5,text:"5"}
			
		// ];
		// $scope.showNumber = function(numberType) {
  //   		var selected = $filter('filter')($scope.guestsNumberType, {value: numberType});
  //   		return (selected.length) ? selected[0].text : 'Not set';
  // 		};

		$scope.guestsNumber = "1";
		var dateToCheck;
		var dateFromCheck;  
		
		$scope.dateFrom = moment();
		$scope.dateTo = moment().add(30, 'days');
   
		$rootScope.$on('updateSearchResult', function(event,s) {	 
			console.log(s)
			// $scope.searchTerm = s;
			// $scope.update('start','end','SEARCH');
		});

		var dtColumnDefs=[];
		var dtOptions="";
		$scope.vm = function() {
			var trans=[];
			trans=$translate.instant(['TABLE_SEARCH_PLACEHOLDER','TABLE_EMPTY','TABLE_LOADING','TABLE_PROCESSING','TABLE_ZERO_RECORDS', 'TABLE_COPY', 'TABLE_FIRST', 'TABLE_LAST', 'TABLE_NEXT', 'TABLE_PREVIOUS', 'PDF_MESSAGE']);
			$scope.dtOptions = DTOptionsBuilder.newOptions()
				// .withPaginationType('full_numbers')
				.withDisplayLength(10)
				// .withDOM('T<"clearfix"f>t<"bottom"rp>')
				// .withTableTools('/swf/copy_csv_xls_pdf.swf')
				.withOption('responsive', true)
				//must add multilingual options
				.withLanguage({
					// 'sSearch' : "",
					// "searchPlaceholder": trans.TABLE_SEARCH_PLACEHOLDER,
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
				// .withTableToolsButtons([{
				// 		"sExtends": "copy",
				// 		"sButtonText": trans.TABLE_COPY
				// 	},
				// 	'csv',
				// 	{
				// 		"sExtends": "xls",
				// 		"mColumns": [ 0, 1, 2, 3, 4, 5 ],
				// 	}, 
				// 	{
				// 		"sExtends": "pdf",
				// 		"sPdfOrientation": "landscape",
				// 		"mColumns": [ 0, 1, 2, 3, 4, 5 ],
				// 		"sPdfMessage": trans.PDF_MESSAGE
				// 	}
				// ])
				;
			$scope.dtColumnDefs = [
				DTColumnDefBuilder.newColumnDef(0),
				DTColumnDefBuilder.newColumnDef(1),
				DTColumnDefBuilder.newColumnDef(2),
				DTColumnDefBuilder.newColumnDef(3),
				DTColumnDefBuilder.newColumnDef(4),
				DTColumnDefBuilder.newColumnDef(5).notSortable()
			];
		}
		$scope.vm ();

		$scope.popoverRoomType= function (){
			var lan = langTransService.getSelectedLanguage();
			var deferred = $q.defer(); 
				$.ajax({
					url: host+"/bearcrsl?object=RoomTypeAmenities&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&LangCode="+lan,
					type: 'GET',
					crossDomain: true,
					dataType: 'jsonp',
					success: function() {},
					error: function() { alert('Request failed, try again'); },
				}).done(function(data) {
					deferred.resolve(data);
					$scope.popoverRType = data;
					$scope.list();
				});
			return deferred.promise;
		}
		//.............popover roomtype apiends
		$scope.popoverRoomType();

		$scope.list =function(){  
			$scope.pRvalues1=[];
			$scope.pRvalues2=[];
			$scope.pRvalues3=[];
			$scope.pRvalues4=[]; 
			var popi = [].concat($scope.popoverRType); 
			var len = $scope.popoverRType.length; 
			for (var i=0 ;i <len ; i++)	{
				if(popi[i].FK_RoomType === 1){
					$scope.pRvalues1.push({Description: popi[i].Description});
				}
	     		if(popi[i].FK_RoomType === 2){
					$scope.pRvalues2.push({Description: popi[i].Description});
				}
	     		if(popi[i].FK_RoomType === 3){
					$scope.pRvalues3.push({Description: popi[i].Description});
	     		}
	     		if(popi[i].FK_RoomType === 4){
					$scope.pRvalues4.push({Description: popi[i].Description});
				}
	     	} 
	    }
		//....................
		$scope.popoverRateType= function (){

			var lan = langTransService.getSelectedLanguage();
			var deferred = $q.defer(); 
			$.ajax({
				url: host+"/bearcrsl?object=RatePolicyConditions&method=List&SK_Property="+19+"&token="+$rootScope.credentials.currentUser.token+"&withdescription="+1+"&LangCode="+lan ,
				type: 'GET',
				crossDomain: true,
				dataType: 'jsonp',
				success: function() {},
				error: function() { alert('Request failed, try again'); },
			}).done(function(data) {
				deferred.resolve(data);
				$scope.popoverRateType = data;
				$scope.listrate();
			});
			return deferred.promise;
		}
		//.............popover roomtype apiends
		$scope.popoverRateType();
  	  		 
		$scope.listrate =function(){  
			$scope.pRatevalues1=[];
			$scope.pRatevalues2=[];
			$scope.pRatevalues3=[];
			$scope.pRatevalues4=[]; 
			$scope.pRatevalues5=[]; 
			var popi = [].concat($scope.popoverRateType); 
			var len = $scope.popoverRateType.length; 
			for (var i=0 ;i <len ; i++){
				if(popi[i].FK_RatePolicy === 1){
					$scope.pRatevalues1.push({Description: popi[i].Description});
				}
				if(popi[i].FK_RatePolicy === 2){
					$scope.pRatevalues2.push({Description: popi[i].Description});
				}
				if(popi[i].FK_RatePolicy === 3){
		     			$scope.pRatevalues3.push({Description: popi[i].Description});
				}
				if(popi[i].FK_RatePolicy === 4){
					$scope.pRatevalues4.push({Description: popi[i].Description});
				}
				if(popi[i].FK_RatePolicy === 5){
					$scope.pRatevalues5.push({Description: popi[i].Description});
				}
			} 
		}
		$scope.decrementRooms = function() {
			if($scope.data.rooms > 0) {
				$scope.data.rooms--;
			}
		}
		$scope.decrementAdults = function() {
			if($scope.data.adults > 0) {
				$scope.data.adults--;
			}
		}
		$scope.decrementChildren = function() {
			if($scope.data.children > 0) {
				$scope.data.children--;
			}
		}
		$scope.incrementRooms = function() {
			$scope.data.rooms++;
		}
		$scope.incrementAdults = function() {
			$scope.data.adults++;
		}
		$scope.incrementChildren = function() {
			$scope.data.children++;
		}
		$scope.updateQuantity = function(value, index, type) {
			if (type == "increment") {
				$scope.data.bookingList[index].quantity++;
			}else if (type == "decrement" && value > 0) {
				$scope.data.bookingList[index].quantity--;
			}
			$scope.data.bookingList[index].totalPrice = $scope.dateTo.diff(moment($scope.dateFrom), 'days') * $scope.data.bookingList[index].priceNight * $scope.data.bookingList[index].quantity;
			$scope.data.reservationTotalPrice = 0;
			$scope.data.reservationTotalRooms = 0;
			for (var i in $scope.data.bookingList) {
				$scope.data.reservationTotalPrice += $scope.data.bookingList[i].totalPrice;
				$scope.data.reservationTotalRooms += $scope.data.bookingList[i].quantity;
			}
			$scope.data.dailyRatePerNight = $scope.data.reservationTotalPrice / $scope.dateTo.diff(moment($scope.dateFrom), 'days');
		}
		$scope.update = function (pickedDateFrom, pickedDateTo, pickedRooms, pickedAdults, pickedChildren) {
			var token = $rootScope.credentials.currentUser.token;
			var serverUrl = $rootScope.globals.serverUrl;
			var fk_property = $rootScope.globals.fk_property.id;
			if (pickedDateFrom === undefined || pickedDateTo === undefined) {
				$scope.dateFrom = moment();
				$scope.dateTo = moment().add(1, 'days');
			}else{
				if($scope.dateFrom.diff(moment(pickedDateFrom), 'days') > 0) {
					$scope.dateFrom = moment(pickedDateFrom);
				}
				if (moment(pickedDateTo).diff($scope.dateTo, 'days') > 0) {
					$scope.dateTo = moment(pickedDateTo);
				}
			//	$scope.dateFrom =moment(data.dateFromToShow);
			//	$scope.dateTo = moment(data.dateToToShow);
			}
			$scope.data = {};
			if (pickedRooms !== undefined) {
				$scope.data.rooms = pickedRooms;
			}else{
				$scope.data.rooms = 1;
			}
			if (pickedAdults !== undefined) {
				$scope.data.adults = pickedAdults;
			}else{
				$scope.data.adults = 1;
			}
			if (pickedChildren !== undefined) {
				$scope.data.children = pickedChildren;
			}else{
				$scope.data.children = 0;
			}
			$scope.data.reservationTotalPrice = 0;
			$scope.data.reservationTotalRooms = 0;
			$scope.data.currency = "";
			$scope.data.dailyRatePerNight = 0;

			var occupancy = $scope.guestsNumber;
			$scope.data.bookingList = [];
			$scope.data.luisavail = [];
			$scope.data.bookingListRoomType =[];
			var link = hostCallserver+"&object=Availability&method=GeneralAvail&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&DateFrom="+$scope.dateFrom.format("YYYY-MM-DD")+"&DateTo="+$scope.dateTo.format("YYYY-MM-DD")+"&ReturnDayAvailability=0&Occupancy="+occupancy+"&RoomsRequested="+$scope.data.rooms+"&Children="+$scope.data.children;
			console.log(link);
			callserver(link,function (response) {
					console.log(response);
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
								for (var i in response.data) {
									var luisid=findid($scope.data.luisavail,parseInt(response.data[i].FK_RoomType));
											if( luisid === undefined) {
												$scope.data.luisavail.push(
													{
														ID: response.data[i].FK_RoomType,
														FK_RoomType: response.data[i].FK_RoomType,
														RoomTypeShortDescription: response.data[i].RoomTypeShortDescription,
														RoomTypeLongDescription: response.data[i].RoomTypeLongDescription,
														RoomTypeURL: response.data[i].RoomTypeURL,
														AvailableRooms: response.data[i].AvailableRooms,
														RatePolicies: 
														[{
															ID: response.data[i].FK_RatePolicy,
															FK_RatePolicy: response.data[i].FK_RatePolicy,
															Description: response.data[i].Description,
															Rate: response.data[i].Rate,
															RateAdditionalPerson: response.data[i].RateAdditionalPerson,
															RateChildren: response.data[i].RateChildren,
															Taxes_Included: response.data[i].Taxes_Included,
															PricePerPerson: response.data[i].PricePerPerson,
															MaxOccupancy: response.data[i].MaxOccupancy,
															FK_Currency: response.data[i].FK_Currency,
															RatePolicyPromotionDescription: response.data[i].RatePolicyPromotionDescription
														}]
													});
											} else {
												if(findid($scope.data.luisavail[luisid].RatePolicies,response.data[i].FK_RatePolicy)===undefined) {
													$scope.data.luisavail[luisid].RatePolicies.push({
																ID: response.data[i].FK_RatePolicy,
																FK_RatePolicy: response.data[i].FK_RatePolicy,
																Description: response.data[i].Description,
																Rate: response.data[i].Rate,
																RateAdditionalPerson: response.data[i].RateAdditionalPerson,
																RateChildren: response.data[i].RateChildren,
																Taxes_Included: response.data[i].Taxes_Included,
																PricePerPerson: response.data[i].PricePerPerson,
																MaxOccupancy: response.data[i].MaxOccupancy,
																FK_Currency: response.data[i].FK_Currency,
																RatePolicyPromotionDescription: response.data[i].RatePolicyPromotionDescription
															});
													}
											}
									//.................................

									var data = response.data[i]; 
									 
									var quantity, totalPrice, occupancy, priceNight, maxOccupancyHelper = "";
									/* fix the MaxOccupancy */
									if((data.MaxOccupancy) == "null") {
										data.MaxOccupancy = "";
										maxOccupancyHelper = 0;
									}
									else {
										maxOccupancyHelper = data.MaxOccupancy;
									}
									/* set price / night */
									if (data.PricePerPerson == 0) {
										priceNight = data.Rate;
									}
									else { /* Price / night = Rate * Occupancy in request that the user selected */
										priceNight = data.Rate * maxOccupancyHelper;
									}
									/* set quantity 1 as default for 1 row with lowest rate (TODO) */
									quantity = 0;
									if (i == 0) {
										quantity = 1;
									}
									totalPrice = $scope.dateTo.diff(moment($scope.dateFrom), 'days') * priceNight * quantity;
									$scope.data.howLong = $scope.dateTo.diff(moment($scope.dateFrom), 'days');
									$scope.data.reservationTotalPrice += totalPrice;
									$scope.data.reservationTotalRooms += quantity;
									$scope.data.bookingList.push({
										room: data.RoomTypeShortDescription,
										ratePlan: data.Description,
										currency: data.FK_Currency,
										priceNight: priceNight,
										totalPrice: totalPrice,
										maxOccupancy: data.MaxOccupancy,
										quantity: quantity,
										roomType: data.FK_RoomType,
										rate: data.Rate,
										ratePolicy: data.FK_RatePolicy//data.ID
									});

									if (i == 0) 
									{
										$scope.data.dailyRatePerNight = priceNight
									}
								}

								// $scope.data.currency = $scope.data.bookingList[0].currency;
								 
							}
						} else {

							if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
								console.log(response);
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+"</p>","error","growl","slide").log();
							}
						}
					}	else {
						console.log(response);
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>No available rooms</p>","error","growl","slide").log();
					}
			},$http,$scope);
			
		}
		$scope.update();
		//....
		$scope.$watch("dateTo", function(val) {
			$scope.howLong = $scope.dateTo.diff(moment($scope.dateFrom), 'days') ;
		});
		$scope.$watch("dateFrom", function(val) {
			$scope.howLong = $scope.dateTo.diff(moment($scope.dateFrom), 'days') ;
		})
		$scope.howLong = $scope.dateTo.diff(moment($scope.dateFrom), 'days');
		//...
		$scope.createBookingSearch = function() {
				var dataToSend = {};
				if( ($scope.dateTo != dateToCheck) || ($scope.DateFrom != dateFromCheck) )
				{
					dateToCheck=$scope.dateTo;
					dateFromCheck=$scope.dateFrom;
				}
				dataToSend = {
					rooms : $scope.data.rooms,
					// children: $scope.data.children,
					adults: $scope.guestsNumber,
					occupants : $scope.guestsNumber,
				}
				$rootScope.$broadcast('createBookingSearch', dataToSend);
				$scope.update( $scope.dateFrom, $scope.dateTo, dataToSend.rooms, dataToSend.adults, dataToSend.children);
		}
		$scope.$on("callAvailability", function(broadCast , event)
                {
                	$scope.createBookingSearch();
                 });

		//
		$scope.open = function() {
			// var modalInstance;
			// modalInstance = $uibModal.open({
			// 	templateUrl: "views/booking-modal.html",
			// 	controller: "bookingModalCtrl",
			// 	windowClass: "small-modal",
			// 	resolve: {
			// 		data: function() {
			// 			$scope.data.dateFromToShow = moment($scope.dateFrom).format("YYYY-MM-DD");
			// 			$scope.data.dateToToShow = moment($scope.dateTo).format("YYYY-MM-DD");
			// 			return  $scope.data;
			// 		}
			// 	}
			// })

		 BookingService.$editBooking(undefined,moment($scope.dateFrom),moment($scope.dateTo),undefined, $scope.data.adults)
            .then(function(response) {
              
            }, function (response) {
              
            });

		}
	

   //
  });
