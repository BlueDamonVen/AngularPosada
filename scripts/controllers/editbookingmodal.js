'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:EditbookingmodalCtrl
 * @description
 * # EditbookingmodalCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('editBookingModalCtrl', function ($scope, $rootScope, data, $modalInstance, $http, $uibModal,createBooking,$location, $timeout,$q,BookingService,webConstants) {
		var host=webConstants.host;
		var hostCallserver =webConstants.hostCallserver;
		var FK_RatePolicy,modalEditRate;
		$scope.data = data; 
		$scope.idSaveDraft = data.ID;
		$scope.countries = $rootScope.countries;
//........................... 	

		//....seting roles
		$scope.rightValue =false;
		$scope.rightsValues = $rootScope.globals.fk_rightsResponse;
		if($scope.rightsValues.data[0].Booking === 1 )
  			$scope.rightValue=true;
  		//....seting roles ends

		 $scope.errorMessageShow ="";
		var dateToCheck;
		var dateFromCheck;
		var startDatePicker, endDatePicker;
		$scope.roomTypeSelected;
		var checkFormLoad=0;
		$scope.today =new Date(); 
		var startdateId=0;
		var dataIdNewBooking ;
		//...below two variables are to check date change for extend api
		var extendApiDateTo;
		var extendApiDateFrom;
		
		//$scope.data.bookingList = [];
		var p=false;
		function init ()
		{
			$scope.roomTypeSelected='Single';
		}
		init(); 
	$scope.reservedCheckedIn = function(objClick)
	{	$scope.chkInEditButon = true;
		//$("#btnEdit").removeClass('btn btn-primary btn-bearGray pull-left');
		 
		if(data.ID)
		{  
		  	if($scope.data.FK_BookingStatus==="2")
			{
				$scope.reservedAndCheckedIn= false; 
			}
			if( convertDate( $('#startdate').datepicker("getDate") )=== convertDate (new Date()) )
			{ 
				if(objClick==="CKin")//(document.getElementById("checkInIn").innerHTML ==="Check In")
				{
					 
					checkInApiCall();
					//$scope.close();
					$scope.reservedAndCheckedIn= false; 
				}
				//else $scope.reservedAndCheckedIn= true; 
                else if(convertDate( $('#startdate').datepicker("getDate") ) === $scope.dateFrom)
				 $scope.reservedAndCheckedIn= true; 

				
			}
			else $scope.reservedAndCheckedIn= false;
			
		    if( convertDate( $('#enddate').datepicker("getDate") )=== convertDate (new Date()) )
			{
				if(objClick==="CKout")
				{  
					checkOutApiCall();
					$scope.close();

					$scope.checkOutRes = false; 
				} 
				else $scope.checkOutRes = true; 
				
			} 
			else $scope.checkOutRes = false;
			//
			if($scope.reservedAndCheckedIn=== false && $scope.checkOutRes === false)
			{
				//$("#btnEdit").removeClass('btn btn-primary btn-bearGray pull-left');
			}
 
		}
		else
		{  
			if( $scope.reservedAndCheckedInand )
			{
				 
			

				$scope.reservedAndCheckedIn= false; 
				//if(document.getElementById("checkInR").innerHTML ==="Reserve &amp; Check In")
				if(objClick==="CKres")
				{	
					$scope.reserve().then(function(data)
						{
							checkInApiCall();
						});
					
				}
			}
			else if( convertDate( $('#startdate').datepicker("getDate") )===convertDate (new Date()) ) 
			{ 
				$scope.reservedAndCheckedInIn= false;
				$scope.reservedAndCheckedInand =false;
			} 
		}
	} 
	function convertDate(inputFormat) 
	{
		  function pad(s) { return (s < 10) ? '0' + s : s; }
		  var d = new Date(inputFormat);
		  return [pad(d.getMonth()+1),pad(d.getDate()),d.getFullYear() ].join('/');
	}
	function dateCompare(str1, str2)
	{
	    return new Date(str1) > new Date(str2);
	}
	//...
	 
	$scope.updateBookingEditMode = function() 
	{ 
		if($("#roomType option:selected").text()==="" || $("#ratePlane option:selected").text()==="")
		{console.log("DSSdsififififif ",$("#roomType option:selected").text(),modalEditRate);
			$scope.data.dailyRatePerNight =0;
			$scope.data.reservationTotalPrice =0;
		}
		else
		{
		  console.log("DSSdselse ",$("#roomType option:selected").text(),modalEditRate);
		  $scope.data.dailyRatePerNight	= modalEditRate;
		}

		console.log("update");
		if( convertDate( $('#startdate').datepicker("getDate") )=== convertDate (new Date()) )
		{	 
			$scope.reservedAndCheckedIn= true; 
		}
		else $scope.reservedAndCheckedIn= false;
		
	    if( convertDate( $('#enddate').datepicker("getDate") )=== convertDate (new Date()) )
		{
			$scope.checkOutRes = true; 
		} 
		else $scope.checkOutRes = false;
		if($scope.data.FK_BookingStatus==="2")
		{
			$scope.reservedAndCheckedIn= false; 
		}
		

		if(data.ID)
		{   
			//
			if($("#roomType option:selected").text()!="" && $("#ratePlane option:selected").text()!="")
			{
				var Date1=   $('#startdate').datepicker("getDate");  
				var Date2 =   $('#enddate').datepicker("getDate"); 
				var howLong= createBooking.days_between(Date1,Date2);
				 $scope.data.dailyRatePerNight	= modalEditRate;
				if($scope.data.bookingList[0].PricePerPerson===1)
				{ 
					$scope.data.reservationTotalPrice = $scope.data.dailyRatePerNight * howLong * (parseInt($scope.data.adults) + parseInt($scope.data.children) * howLong * $scope.RateChildrenExtendApiValue) ;
				}
				else if($scope.data.bookingList[0].PricePerPerson===0)
				{
					$scope.data.reservationTotalPrice = $scope.data.dailyRatePerNight * howLong ;
				}
			}
		}
	}	
	//...
	$scope.updateBookingFlow = function() 
	{
			//
		 
			if($("#roomType option:selected").text()==="" && $("#ratePlane option:selected").text()==="")
			{
				$scope.data.dailyRatePerNight =0;
				$scope.data.reservationTotalPrice =0;
			}

			if( convertDate( $('#startdate').datepicker("getDate") )===convertDate (new Date()) )
			{ 
				$scope.reservedAndCheckedInand= true; 
			}
			else $scope.reservedAndCheckedInand = false;
			
			if(data.ID)
			{
				//$scope.reservedCheckedIn();
				 
			}
			else
			{ 
			
			 
		    var Date2 = $('#enddate').datepicker("getDate");
			var Date1= $('#startdate').datepicker("getDate"); 

			 
			 
			var howLong= createBooking.days_between(Date1, Date2);
			 

			//...below piece of code changing room plan according to roo type
		/*	if($scope.data.bookingList)// && $scope.data.pickedRatePlanType)
			{	
				var len =Object.keys($scope.data.bookingList).length;
				if(len)
				{ 
					for(var i=0;i<len;i++)
					{
						if ($scope.data.bookingList[i].room === $("#roomType option:selected").text() )
						//if ($scope.data.bookingList[i].room === $scope.data.bookingList[$scope.data.pickedRoomType].room)
						{ 
						if($scope.data.bookingList[i].ratePlan === $("#ratePlane option:selected").text())
						//if($scope.data.bookingList[i].ratePlan === $scope.data.bookingList[$scope.data.pickedRatePlanType].ratePlan)
							{ 
								$scope.data.dailyRatePerNight = $scope.data.bookingList[i].rate;
								console.log("dadad :if dailyRatePerNight ",$scope.data.dailyRatePerNight);
								if($scope.data.bookingList[i].PricePerPerson===1)
								{ 
									$scope.data.reservationTotalPrice = $scope.data.bookingList[i].rate * howLong * (parseInt($scope.data.adults) + parseInt($scope.data.children) * howLong * $scope.data.bookingList[i].RateChildren) ;
								}
								else 
								{

									$scope.data.reservationTotalPrice = $scope.data.bookingList[i].rate * howLong ;
								}
								 
							}
						}
						else
						{
							if(p===false)
							{ 
								$scope.data.dailyRatePerNight = $scope.data.bookingList[0].rate;
								console.log("dadad :else dailyRatePerNight ",$scope.data.dailyRatePerNight);
								if($scope.data.bookingList[0].PricePerPerson===1)
								{ 
									$scope.data.reservationTotalPrice = $scope.data.bookingList[0].rate * howLong * (parseInt($scope.data.adults) + parseInt($scope.data.children) * howLong * $scope.data.bookingList[0].RateChildren) ;
								}
								else
								{
									$scope.data.reservationTotalPrice = $scope.data.bookingList[0].rate * howLong ;
								}
							}
						}
					}
				
				}
			}
			p=true; */
			if($scope.luisavail)// && $scope.data.pickedRatePlanType)
			{	
				var len =Object.keys($scope.luisavail).length;
				
				if(len)
				{ 
					for(var i=0;i<len;i++)
					{

					var lenn =Object.keys($scope.luisavail[i].RatePolicies).length;
					
						if ($scope.luisavail[i].RoomTypeShortDescription === $("#roomType option:selected").text() )
						//if ($scope.data.bookingList[i].room === $scope.data.bookingList[$scope.data.pickedRoomType].room)
						{ 
							for (var k=0;k<lenn;k++)
						{
							
						if($scope.luisavail[i].RatePolicies[k].Description === $("#ratePlane option:selected").text())
						//if($scope.data.bookingList[i].ratePlan === $scope.data.bookingList[$scope.data.pickedRatePlanType].ratePlan)
							{ 
								$scope.data.dailyRatePerNight = $scope.luisavail[i].RatePolicies[k].Rate;
								console.log("dadad :if dailyRatePerNight ",$scope.data.dailyRatePerNight);
								if($scope.luisavail[i].RatePolicies[k].PricePerPerson===1)
								{ 
									$scope.data.reservationTotalPrice = $scope.luisavail[i].RatePolicies[k].Rate * howLong * (parseInt($scope.data.adults) + parseInt($scope.data.children) * howLong * $scope.luisavail[i].RatePolicies[k].RateChildren) ;
								}
								else 
								{

									$scope.data.reservationTotalPrice = $scope.luisavail[i].RatePolicies[k].Rate * howLong ;
								}
								 
							
							}
						}
					}
						else
						{
							if(p===false)
							{ 
								$scope.data.dailyRatePerNight = $scope.luisavail[0].RatePolicies[0].Rate;
								console.log("dadad :else dailyRatePerNight ",$scope.data.dailyRatePerNight);
								if($scope.luisavail[0].PricePerPerson===1)
								{ 
									$scope.data.reservationTotalPrice = $scope.luisavail[0].RatePolicies[0].Rate * howLong * (parseInt($scope.data.adults) + parseInt($scope.data.children) * howLong * $scope.luisavail[0].RatePolicies[0].RateChildren) ;
								}
								else
								{
									$scope.data.reservationTotalPrice = $scope.luisavail[0].RatePolicies[0].Rate * howLong ;
								}
							}
						}
					}//....
				
				}
				else
				{
					$scope.data.dailyRatePerNight =0;
					$scope.data.reservationTotalPrice =0;
				}
			}
		//}
			p=true; 
			//...................ends 
	}
			if(!data.ID)
			$scope.luisselectedratepolicylist =  $scope.luisavail[findid($scope.luisavail, parseInt($scope.data.pickedRoomType))].RatePolicies;
			else
			{
			//	$scope.luisselectedratepolicylist =  $scope.luisavail[0].RatePolicies;
			//	console.log("da : ",$scope.luisselectedratepolicylist);
				 
				$scope.updateBookingEditMode();
			}
 

}
 
	//
	
   $scope.update = function (pickedDateFrom, pickedDateTo, pickedRooms, pickedAdults, pickedChildren) {

   	$scope.showDropdowns=false;
    
		   	var checkDateType = 0;
		   $scope.errorMessageShow = "";
		   			 
					var token = $rootScope.credentials.currentUser.token;
					var serverUrl = $rootScope.globals.serverUrl;
					var fk_property = $rootScope.globals.fk_property.id;
					 
					if (pickedDateFrom === 'undefined' || pickedDateTo === 'undefined') 
					{   checkDateType = 0;
						$scope.dateFrom = moment();
						$scope.dateTo = moment().add(1, 'days');
						 
					} 
					else 
					{

						checkDateType = 1;
						$scope.dateTo =moment(pickedDateTo).add(1, 'days'); 

						$scope.dateFrom=moment(pickedDateFrom);  

					}

					
					 
					$scope.data = {};

					if (pickedRooms !== undefined) {
						$scope.data.rooms = pickedRooms;
					}
					else {
						$scope.data.rooms = 1;
					}
					if (pickedAdults !== undefined) {
						$scope.data.adults = pickedAdults;
					}
					else {
						$scope.data.adults = 1;
					}
					if (pickedChildren !== undefined) {
						$scope.data.children = pickedChildren;
					}
					else {
						$scope.data.children = 0;
					}

					$scope.data.reservationTotalPrice = 0;
					$scope.data.reservationTotalRooms = 0;
					$scope.data.currency = "";
					$scope.data.dailyRatePerNight = 0;

					var occupancy = $scope.data.adults;
					 
					$scope.data.bookingList = [];
					$scope.luisavail = [];
					$scope.luisselectedratepolicylist = [];
 
					callserver(hostCallserver+"&object=Availability&method=GeneralAvail&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&DateFrom="+$scope.dateFrom.format("YYYY-MM-DD")+"&DateTo="+$scope.dateTo.format("YYYY-MM-DD")+"&ReturnDayAvailability=0&Occupancy="+occupancy+"&RoomsRequested="+$scope.data.rooms+"&Children="+$scope.data.children,function (response) {
						   //........
						   //console.log("response.data ",response);
						   if(!response.data[0])
							{
								//console.log("response.data if empty");
							 	//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+"No Availability"+" </p>","error","growl","slide").log();
							 	$scope.errorMessageShow ="7001";
							
							} 

							//.........
							if (response.status == 'OK') {
								if(response.data.Status === undefined){
									if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
									//	 console.log("response.data : : ",response.data);

										for (var i in response.data) {


											var luisid=findid($scope.luisavail,parseInt(response.data[i].FK_RoomType));
											if( luisid === undefined) {
												$scope.luisavail.push(
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
														}
														]
													});
											} else {
												if(findid($scope.luisavail[luisid].RatePolicies,response.data[i].FK_RatePolicy)===undefined) {
													$scope.luisavail[luisid].RatePolicies.push({
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
												PricePerPerson: data.PricePerPerson,
												RateChildren: data.RateChildren,
												FK_RatePolicy : data.FK_RatePolicy
											});
											if (i == 0) {
												$scope.data.dailyRatePerNight = '0';
											}
											
											
										}
								
										if($scope.data.bookingList)
										$scope.data.currency = $scope.data.bookingList[0].currency;
										
										 
										//console.log("booking : : ", $scope.data.bookingList);
										FK_RatePolicy = data.FK_RatePolicy;
										 
										 
										if(checkDateType === 1)
										{
											if(checkFormLoad ===1)
											{
												$scope.dateFrom = $('#startdate').datepicker("getDate");
												$scope.dateTo = $('#enddate').datepicker("getDate");
											} 
											else
											{ 
												$('#startdate').datepicker('setDate', new Date(pickedDateFrom) );
												$("#startdate").datepicker("update");
												//
												$('#enddate').datepicker('setDate',new Date(pickedDateTo));
												$("#enddate").datepicker("update");
												
												$scope.dateTo = convertDate(moment(pickedDateTo)); 
												$scope.dateFrom= convertDate( moment(pickedDateFrom) ); 
												checkFormLoad=1;
											} 
											
										}
										 
  
										$("#roomType").val(1);
										$scope.data.pickedRoomType =1;
										
									 	if($scope.luisavail[0].RatePolicies.length)
										{	
											var value,min;
											value=$scope.luisavail[0].RatePolicies[0].Rate; 
											for(var i=1;i<$scope.luisavail[0].RatePolicies.length;i++)
											{
												
											if(value >$scope.luisavail[0].RatePolicies[i].Rate)
												{
													min= i;
													value= $scope.luisavail[0].RatePolicies[i].Rate;
												}
											else
												min = 1;
												console.log("value : ",min);

											}
											//min=2;
											$("#ratePlane").val(1);
											$scope.data.pickedRatePlanType =1; 
										} 
										
										 
										$scope.roomTypeSelected =  $("#roomType option:selected").text();
									

										//$("#ratePlane").val(1);
										//$scope.data.pickedRatePlanType =1;
										 

										p=false;

									$scope.updateBookingFlow();		
									}
								} else {

									if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
										new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+"</p>","error","growl","slide").log();
									}
								}
							}	else {
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>No available rooms</p>","error","growl","slide").log();
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							}
					},$http,$scope);
			//} // for edit check else end
		}
		 
 function callExtendApi(booking)
   {
   
      createBooking.callExtendApi(booking).then(function(data)
                {console.log("!!!!!!!!!!");
                	 
                     //$scope.data.dailyRatePerNight= data[0].Rate;
                     modalEditRate =data[0].Rate;
                     $scope.RateChildrenExtendApiValue =  data[0].RateChildren;
                 	
                },
                function(errorMessage)
                {
                    //error handling goes here
                });

	}
//.................ratepolicy api
function callRatePolicyApi(booking)
{
   
     createBooking.callRatePolicyApi(booking).then(function(data)
                {
                	
                     $scope.data.bookingList[0].PricePerPerson = data[0].PricePerPerson;
                },
                function(errorMessage)
                {
                    //error handling goes here
                });
}
//......................ratepolicy api ends

		$scope.caller = "occupancy";
		$scope.createBookingSearch = function(caller) {
				var sDate ;
				$scope.days1= 1;
				var eDate ;
				var dataToSend = {};
				startdateId++;
				 console.log("id",data);
				if( !($scope.dateTo) && !($scope.dateFrom) )
				{	  
					extendApiDateTo =data.dateToToShow;
					extendApiDateFrom = data.dateFromToShow;
				}
				else if(data.ID)
				{
					// 
					$scope.dateFrom = $('#startdate').datepicker("getDate");
					$scope.dateTo = $('#enddate').datepicker("getDate");
					//
					 
				}
				//..........



				//........
				dataToSend = {
					rooms : data.rooms,
					children: $scope.data.children,
					adults: $scope.data.adults,
					occupants : $scope.data.adults + $scope.data.children
				}

				$rootScope.$broadcast('createBookingSearch', dataToSend);
				if(!data.ID)
				$scope.update(data.dateFromToShow, data.dateToToShow, dataToSend.rooms, dataToSend.adults, dataToSend.children);
				
				else if(data.ID)	
				{	
					
					if(caller != "occupancy")
					{console.log("data :,calling extend api all edit booking modal " );
						callExtendApi(data);
					}
					callRatePolicyApi(data);
					$scope.luisavail = data.luisavail;

					console.log("data : ",data.luisavail);


					$("#roomType").val($scope.luisavail[0].FK_RoomType); 
					$scope.luisselectedratepolicylist =  $scope.luisavail[0].RatePolicies;
					console.log("da : ",$scope.luisselectedratepolicylist);
					$("#ratePlane").val($scope.luisavail[0].RatePolicies[0].FK_RatePolicy); 

					$scope.roomTypeSelected =  $("#roomType option:selected").text(); 
				  	 
					
					
					/*if($("#roomType option:selected").text()===null)
					{ 
						$("#roomType").text("select one");
						$("#ratePlane").text("select one");
						$scope.data.pickedRoomType = "select one";
						$scope.data.pickedRatePlanType = "select one"; 

					}*/


				}

		}
		
		$scope.createBookingSearch();

		//........

		$scope.setOccupants  = function() {
			var setOccupantsHelper = "";

		};
		
		$scope.cancel = function() {
			$modalInstance.dismiss("cancel"); 
			if(data.callerType=== "bookingList")
				$location.path("/bookings/booking_list");
			else 
				$location.path("/");
		};
		$scope.close = function() {
			$modalInstance.close();
			if(data.callerType=== "bookingList")
				$location.path("/bookings/booking_list");
			else 
				$location.path("/");
		};
		$scope.decrementRooms = function(value) {
			if(value > 0) {
				$scope.data.rooms--;
			}
		};
		$scope.decrementOccupants = function(value) {
			if(value > 0) {
				$scope.data.occupants--;
			}
		};
		$scope.getNumber = function(num) {
			return new Array(num);
		};
 
		$scope.ac = {};
		$scope.ac.customers = []; 
		callserver(hostCallserver+"&object=Customer&method=List&withstays=1&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
			if (response.status == 'OK') {
				 
				if (response.data.Status === undefined) {
					//..................
				if( !($scope.dateTo) && !($scope.dateFrom) && data.ID)
				{	
					var sDate = new Date(Date.parse(data.dateFromToShow)).toString();
					var eDate =  new Date(Date.parse(data.dateToToShow)).toString();
				 
					$scope.dateTo = convertDate(moment(data.dateToToShow)); 
					$scope.dateFrom= convertDate(moment(data.dateFromToShow));
					
					$('#startdate').datepicker('setDate',  new Date(sDate) );
					$("#startdate").datepicker("update" );
					//
					$('#enddate').datepicker('setDate', new Date (eDate) );
					$("#enddate").datepicker("update" );
				}

					//................
					if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
						for (var i in response.data) {
							$scope.ac.customers.push({
									"ID": response.data[i].ID,
									"Prefx": response.data[i].Prefx,
									"FirstName": response.data[i].FirstName,
									"LastName": response.data[i].LastName,
									"Address1": response.data[i].Address1,
									"Address2": response.data[i].Address2,
									"City": response.data[i].City,
									"ProvinceState": response.data[i].ProvinceState,
									"PostalCode": response.data[i].PostalCode,
									"Phone": response.data[i].Phone,
									"Mobile": response.data[i].Mobile,
									"Email": response.data[i].Email,
									"BookingCount": response.data[i].BookingCount,
									"Country": response.data[i].Country
							});
						}
					}
				} else {
					if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
						//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
					}
				}
			}
		
		},$http,$scope);

//................
//.............
		$scope.Exp1 = [{
			v: "01",
			name: "01 - January"
		},{
			v: "02",
			name: "02 - February"
		},{
			v: "03",
			name: "03 - March"
		},{
			v: "04",
			name: "04 - April"
		},{
			v: "05",
			name: "05 - May"
		},{
			v: "06",
			name: "06 - June"
		},{
			v: "07",
			name: "07 - July"
		},{
			v: "08",
			name: "08 - August"
		},{
			v: "09",
			name: "09 - September"
		},{
			v: "10",
			name: "10 - October"
		},{
			v: "11",
			name: "11 - November"
		},{
			v: "12",
			name: "12 - December"
		}];
		$scope.Exp2 = [{
			v: "15",
			name: "2015"
		},
		{
			v: "16",
			name: "2016"
		},{
			v: "17",
			name: "2017"
		},{
			v: "18",
			name: "2018"
		},{
			v: "19",
			name: "2019"
		},{
			v: "20",
			name: "2020"
		}];
		$scope.holder = {};	
		$scope.setHolder = function(holder, guest) {
		 
			if(guest) {
				$scope.data.guest = {};
				$scope.data.guest.ID = holder.ID;
				$scope.data.guest.LastName = holder.LastName;
				$scope.data.guest.FirstName = holder.FirstName;
				$scope.data.guest.City = holder.City;
				$scope.data.guest.Address1 = holder.Address1;
				$scope.data.guest.Country = holder.Country;
				$scope.data.guest.Phone = holder.Phone;
				$scope.data.guest.PostalCode = holder.PostalCode;
				$scope.data.guest.Email = holder.Email;
				$scope.data.guest.ProvinceState = holder.ProvinceState;
				return false;
			}
			$scope.data.ID = holder.ID;
			$scope.data.LastName = holder.LastName;
			$scope.data.FirstName = holder.FirstName;
			$scope.data.City = holder.City;
			$scope.data.Address1 = holder.Address1;
			$scope.data.Country = holder.Country;
			$scope.data.Phone = holder.Phone;
			$scope.data.PostalCode = holder.PostalCode;
			$scope.data.Email = holder.Email;
			$scope.data.ProvinceState = holder.ProvinceState;
		}
		//
function convertDateForExtendApi(inputFormat) 
	{
		  function pad(s) { return (s < 10) ? '0' + s : s; }
		  var d = new Date(inputFormat);
		  return [d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate())].join('-');
	}
 
	$scope.reserve = function() {
		if($scope.data.modalMode==='edit')
		{
			//...................extend api start's
			if( ($scope.dateTo != extendApiDateTo) || ($scope.dateFrom != extendApiDateFrom) )
			{
				var room_str="&FK_Room="+data.FK_Room ; 
				
				 $.ajax({
			  	  url: host+"/bearcrsl?object=Booking&method=Extend"+room_str+"&token="+$rootScope.credentials.currentUser.token+"&ID="+data.ID+"&FK_Property="+$rootScope.globals.fk_property.id+"&DateFrom="+convertDateForExtendApi($scope.dateFrom)+"&DateTo="+convertDateForExtendApi($scope.dateTo),
			  		    type: 'GET',
			  		    crossDomain: true,
			  		    dataType: 'jsonp',
			  		    success: function() {
			  		    	 
			  		    },
			  		    error: function() { alert('Request failed, try again'); },
			  	}).done(function(data) { });

			}
			//......................................extend api ends
			var d= {};
			d["ID"] = $scope.data.ID;
			d["City"] = $scope.data.City;
			d["FirstName"] = $scope.data.FirstName;
			d["LastName"] = $scope.data.LastName;
			d["Email"] = $scope.data.Email;
			d["City"] = $scope.data.City;
			d["Country"] = $scope.data.Country;
			d["Address1"] = $scope.data.Address1;
			d["PostalCode"] = $scope.data.PostalCode;
			d["ProvinceState"] = $scope.data.ProvinceState;
			d["Phone"] = $scope.data.Phone;
			d["CC"] = $scope.data.CC;
			d["CCExp"] = $scope.data.CCExp1 + "/" +$scope.data.CCExp2;
			d["CCCW"] = $scope.data.CCCW;
			d["CCName"] = $scope.data.CCName;
			d["Occupancy"] = parseInt($scope.data.adults);
			d["Children"] = parseInt($scope.data.children);

			var str = $.param(d);
			$scope.errorMessageShow ="";
			var saved = callserver(hostCallserver+"&object=Booking&method=Update&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&"+str,function (response) {
				if (response.status == 'OK') {
                    $scope.$emit('refresh', true);
                     
					if(response.data.Status === undefined){
						
						
					} else {
						if(response.data.Status == "OK") {
						 
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
							 	/*if(data.callerType=== "bookingList")
								$location.path("/bookings/booking_list");
								else 
								$location.path("/");*/
								
						}
					}	
					
					} else {
						$scope.errorMessageShow = response.data.ErrorNumber;//"7001";
						if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						}
						
						saved = false;
					}
					

			},$http,$scope);
			$scope.close();
		}//...........if ends here
	else
	{	var deferred = $q.defer();
		 
		 
			var d= {};
			 
			d["DateFrom"] =  moment($scope.dateFrom).format("YYYY-MM-DD");
			d["DateTo"] = moment($scope.dateTo).format("YYYY-MM-DD");
	  
			d["FK_RoomType"] = $scope.data.bookingList[$scope.data.pickedRoomType].roomType;

			if(typeof $scope.data.guest !== 'undefined') {
				d["Customer2"] = $scope.data.guest.ID;
			}
			if(typeof $scope.data.ID !== "undefined") {
				d["HolderID"] = $scope.data.ID;
			}
			if(typeof $scope.data.ID === "undefined") {
				d["Country"] = $scope.data.Country;
				d["Address1"] = $scope.data.Address1;
				d["PostalCode"] = $scope.data.PostalCode;
				d["Phone"] = $scope.data.Phone;
				d["City"] = $scope.data.City;
				d["FirstName"] = $scope.data.FirstName;
				d["LastName"] = $scope.data.LastName;
				d["Email"] = $scope.data.Email;
			}
			d["CC"] = $scope.data.CC;
			d["CCExp"] = $scope.data.CCExp1 + "/" +$scope.data.CCExp2;
			d["CCCW"] = $scope.data.CCCW;
			d["CCName"] = $scope.data.CCName;
			d["Children"] = $scope.data.children;
			d["FK_RatePolicy"] = $scope.data.pickedRatePlanType; 
			d["Occupancy"] = parseInt($scope.data.adults) + parseInt($scope.data.children);
			d["BookingSource"] = "PMS";
	 
			var str = $.param(d);
			$scope.errorMessageShow =""; 
 
			var saved = callserver(hostCallserver+"&object=Booking&method=CreateBooking&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&"+str,function (response) {
				console.log("response : ", response );
				if (response.status == 'OK') {
					if(response.data.Status === undefined){
					} else {
						if(response.data.Status == "OK") {
								console.log("response",response);
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
								deferred.resolve(response[0]);
								 
						}
					}	
					
					} else {
						
						 
						$scope.errorMessageShow = response.data.ErrorNumber;//"7001"; 
						if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
						}
						saved = false;
					}

			},$http,$scope);

			saved.then(function(data) {
				 
			//	dataIdNewBooking = data.data.ID;
	 
				
				$scope.cancel();

				$uibModal.open({
					templateUrl: "bookingConfirmation.html",
					controller: function($scope, $modalInstance) {
						$scope.close = function() {
							$modalInstance.close();
							if(data.data.Status == "OK") {
								/*if(data.callerType=== "bookingList")
								$location.path("/bookings/booking_list");
								else 
								$location.path("/");*/
							}
						};
						$scope.ID = data.data.ID;
						$scope.BookingCode = data.data.BookingCode;

					},
					windowClass: "tiny-modal",
					resolve: {

					}
				})
			})	
			return deferred.promise;
		}//.....esle ends here

 }
  //
//................check in api starts
function checkInApiCall()
{
	 $('#myModal')
        .modal({ backdrop: 'static', keyboard: false })
        .one('click', '#ok', function(e) {

	var dataID;
	if(dataIdNewBooking)
		dataID= dataIdNewBooking
	else
		dataID=data.ID; 
	  BookingService.$checkIn(dataID)
            .then(function(response) { 
            	 
            		new logger("<p>Data Saved</p>","notice","growl","slide").log();
            	 
            }, function(error) {
                new errorLogger(error.message).log();
            });
        });
	  
}
//.............checkin apiends


function checkOutApiCall(){
 $('#myModalOut')
        .modal({ backdrop: 'static', keyboard: false })
        .one('click', '#ok', function(e) {
	var dataID;
	if(dataIdNewBooking)
		dataID= dataIdNewBooking
	else
		dataID=data.ID; 
	 BookingService.$checkOut(dataID)
            .then(function(response) { 
            	new logger("<p>Data Saved</p>","notice","growl","slide").log();
            }, function(error) {
                new errorLogger(error.message).log();
            });
        });
 
	}
	//.............checkout apiends
	$scope.saveAsDraft = function()
	{
		
		$('#myModalDraft')
        .modal({ backdrop: 'static', keyboard: false })
        .one('click', '#ok', function(e) {

        	var booking = returnVa();
        	console.log("usama draft model",booking);
        	createBooking.saveAsDraft(booking)
        	 .then(function(response) { 
            	new logger("<p>Data Saved</p>","notice","growl","slide").log();
            	$scope.cancel();
            }, function(error) {
                new errorLogger(error.message).log();
            });

        });

	};
    //
    function returnVa()
    {
    	var d= {};  
    	  	
			d["DateFrom"] =  moment($scope.dateFrom).format("YYYY-MM-DD");
			d["DateTo"] = moment($scope.dateTo).format("YYYY-MM-DD");
			if(data.ID)
			{
				d["FK_RoomType"] =$scope.luisavail[0].FK_RoomType;
				d["FK_RatePolicy"] = $scope.luisavail[0].RatePolicies[0].FK_RatePolicy;
			}
			else
			{
			d["FK_RoomType"] = $scope.data.bookingList[$scope.data.pickedRoomType].roomType;
			d["FK_RatePolicy"] = $scope.data.pickedRatePlanType;
			}
			d["Children"] = $scope.Children;
			d["Description"] = $("#ratePlane option:selected").text();
			d["Occupancy"] = parseInt($scope.data.adults) + parseInt($scope.data.children);
			d["BookingSource"] = "PMS"; 
  			d["Prefx"] = "Mr";
  			d["FK_Currency"] = $scope.data.currency;
  			d["FirstName"] = $scope.data.FirstName;
			d["LastName"] = $scope.data.LastName;
			d["Address1"] = $scope.data.Address1;
			d["Address2"] = $scope.data.Address2;
			d["City"] = $scope.data.City;
			d["Country"] = $scope.data.Country; 
			d["PostalCode"] = $scope.data.PostalCode;
			d["Phone"] = $scope.data.Phone;
			d["Mobile"] = $scope.data.Phone; 
			d["Email"] = $scope.data.Email; 
			d["CC"] = $scope.data.CC;
			d["CCExp"] = $scope.data.CCExp1 + "/" +$scope.data.CCExp2;
			d["CCCW"] = $scope.data.CCCW;
			d["CCName"] = $scope.data.CCName;  
			var str = $.param(d);
			return str;
    }

  });




angular.module('bearpms3App')
  .controller('BookingModalCtrl2', 
  	function ($scope, $rootScope, booking, dates, room, adults, BookingService, $http, $modalInstance, $uibModal, webConstants, $route, $translate, $location, moment) {
		
  		//data.modalMode == "new" Availability is run and a new reservation flow is initiated
  		//data.modalMode == "edit" the data object is expected to be populated with the information of an existing reservation

		
		// $scope.data = booking; 
		// $scope.idSaveDraft = data.ID;
		$scope.booking={};

		$scope.newbooking=false;

		$scope.selectedRoom={"ID":parseInt(room)};

		if(booking===undefined) {
			$scope.newbooking=true;
			$scope.dateFrom=moment(dates.dateFrom);
        	$scope.dateTo=moment(dates.dateTo);
        	$scope.booking.Occupancy= (adults || 1);
	        $scope.booking.Children=0;
	        $scope.BookingCustomer={};
	        $scope.booking.FK_BookingStatus=1;
		} else {
			$scope.booking=booking;
			$scope.dateFrom=moment(booking.DateFrom);
        	$scope.dateTo=moment(booking.DateTo);
        	$scope.selectedRoom= {
        		"ID":booking.FK_Room
        	};

        	if($scope.booking.ID===undefined || $scope.booking.IsDraft) {

        		$scope.booking.DraftID=$scope.booking.ID;
        		$scope.booking.ID=undefined;
        		$scope.newbooking=true;
        		$scope.booking.FK_BookingStatus=1;

				$scope.BookingCustomer={};
        		$scope.BookingCustomer["Country"] = $scope.booking.Country;
				$scope.BookingCustomer["Address1"] = $scope.booking.Address1;
				$scope.BookingCustomer["PostalCode"] = $scope.booking.PostalCode;
				$scope.BookingCustomer["Phone"] = $scope.booking.Phone;
				$scope.BookingCustomer["City"] = $scope.booking.City;
				$scope.BookingCustomer["FirstName"] = $scope.booking.FirstName;
				$scope.BookingCustomer["LastName"] = $scope.booking.LastName;
				$scope.BookingCustomer["Email"] = $scope.booking.Email;
				$scope.BookingCustomer["ProvinceState"] = $scope.booking.ProvinceState;

        	}
		}

		var originaldateTo = $scope.dateFrom;
		var originaldateFrom = $scope.dateTo;

		$scope.Rooms=[];
		

		$scope.countries = $rootScope.countries;


		//....setting roles
		$scope.rightValue =false;
		$scope.rightsValues = $rootScope.globals.fk_rightsResponse;
		if($scope.rightsValues.data[0].Booking === 1 )
  			$scope.rightValue=true;
  
       
        
		$scope.availability=[];
		if($scope.newbooking) {

			$scope.selectedRoomType={};
			$scope.selectedRatePlan={};
			$scope.selectedDays="";

		} else {
			$scope.selectedDays=$scope.dateTo.diff($scope.dateFrom, 'days');

			$scope.selectedRoomType=$scope.booking.RoomType;
			$scope.selectedRatePlan=$scope.booking.RatePolicy;

			$scope.booking.RoomType.RatePolicies=[];
			$scope.booking.RoomType.RatePolicies.push($scope.booking.RatePolicy);

			$scope.availability.push(booking.RoomType);
		}

	

        $scope.checkavailability = function (datefrom_avail,dateto_avail) {
        	if(datefrom_avail!==undefined) $scope.dateFrom=moment(datefrom_avail);
			if(dateto_avail!==undefined) $scope.dateTo=moment(dateto_avail);
			
			$scope.selectedDays=$scope.dateTo.diff($scope.dateFrom, 'days');
	        
	        $scope.availability=[];
	        $scope.selectedRoomType={};
	        $scope.selectedRatePlan={};

	        callserver("/bearcrsl?callback=JSON_CALLBACK&object=Availability&method=GeneralAvail&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&DateFrom="+$scope.dateFrom.format("YYYY-MM-DD")+"&DateTo="+$scope.dateTo.format("YYYY-MM-DD")+"&ReturnDayAvailability=0&Occupancy="+$scope.booking.Occupancy+"&RoomsRequested=1&Children="+$scope.booking.Children+"&withAdditionalinfo=1&Version=3",function (response) {
			   if(!response.data[0])
				{
				 	$scope.errorMessageShow ="7001";
				} else {

					$scope.errorMessageShow="";
				}

				//.........
				if (response.status == 'OK') {
					if(response.data.Status === undefined){
						if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
							$scope.availability=response.data;
							$scope.selectedRoomType=$scope.availability[0];
							$scope.selectedRatePlan=$scope.selectedRoomType.RatePolicies[0];
							//$scope.calculateamounts();
						}
					}
				}

			},$http,$scope);
		};

		 if($scope.newbooking) {		
	        $scope.checkavailability();
    	}

		//calculate amounts
		$scope.PriceNight="0.00";
		$scope.PriceTotal="0.00";
		

		$scope.$watch('selectedRatePlan', function () {
		    if($scope.selectedRatePlan.Rate!==undefined) $scope.calculateamounts();
		}, true);

		$scope.updateselectedRatePlan = function (srp) {
			$scope.selectedRatePlan=srp;
		}

		$scope.calculateamounts = function () {

			var days=$scope.selectedDays;

			if($scope.selectedRatePlan.PricePerPerson=="0") {
				$scope.PriceNight=parseFloat(Number($scope.selectedRatePlan.Rate)+(Number($scope.selectedRatePlan.RateChildren)*$scope.booking.Children)).toFixed(2);
				$scope.PriceTotal=parseFloat($scope.PriceNight*days).toFixed(2);
			} else {
				$scope.PriceNight=parseFloat((Number($scope.selectedRatePlan.Rate)*$scope.booking.Occupancy)+(Number($scope.selectedRatePlan.RateChildren)*$scope.booking.Children)).toFixed(2);
				$scope.PriceTotal=parseFloat($scope.PriceNight*days).toFixed(2);
			}

		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel"); 

			//$scope.$emit('refresh', true);
		};

		$scope.reserve = function () {

			//check to run extend api
			if(!$scope.newbooking) {
				if(originaldateFrom!=$scope.dateFrom || originaldateTo!=$scope.dateTo) {
					BookingService.$extend($scope.booking.ID,$scope.dateFrom,$scope.dateTo,false)
					.then(function(data) {
						//success
					}, function(data) {
						//reject
						return;
					});
				}
			}	
			
			var d= {};
			d["DateFrom"] = moment($scope.dateFrom).format("YYYY-MM-DD");
			$scope.booking.DateFrom = d["DateFrom"];
			d["DateTo"] = moment($scope.dateTo).format("YYYY-MM-DD");
			$scope.booking.DateTo = d["DateTo"];
	  
			d["FK_RoomType"] = $scope.selectedRoomType.FK_RoomType;
			$scope.booking.FK_RoomType = $scope.selectedRoomType.FK_RoomType;

			if($scope.selectedRoom.ID) {
				d["FK_Room"] = $scope.selectedRoom.ID;
			}

			$scope.booking.FK_Room = $scope.selectedRoom.ID;
			$scope.booking.FK_Room_Number = $scope.Rooms[findid($scope.Rooms,$scope.selectedRoom.ID)].Number;
			

			if(typeof $scope.BookingCustomer.HolderID !== "undefined") {
				d["HolderID"] = $scope.BookingCustomer.HolderID;
			} else {
				
				d["Country"] = $scope.BookingCustomer.Country;
				d["Address1"] = $scope.BookingCustomer.Address1;
				d["PostalCode"] = $scope.BookingCustomer.PostalCode;
				d["Phone"] = $scope.BookingCustomer.Phone;
				d["City"] = $scope.BookingCustomer.City;
				d["FirstName"] = $scope.BookingCustomer.FirstName;
				d["LastName"] = $scope.BookingCustomer.LastName;
				d["Email"] = $scope.BookingCustomer.Email;
				d["ProvinceState"] = $scope.BookingCustomer.ProvinceState;
			}

			$scope.booking.BookingCustomer=$scope.BookingCustomer;

			d["CC"] = $scope.booking.CC;
			d["CCExp"] = $scope.booking.CCExp1 + "/" +$scope.booking.CCExp2;
			d["CCCW"] = $scope.booking.CCCW;
			d["CCName"] = $scope.booking.CCName;
			d["Children"] = $scope.booking.Children;
			d["FK_RatePolicy"] = $scope.selectedRatePlan.FK_RatePolicy; 
			d["Occupancy"] = parseInt($scope.booking.Occupancy);
			d["BookingSource"] = "PMS";

			$scope.booking["CC"] = $scope.booking.CC;
			$scope.booking["CCExp"] = $scope.booking.CCExp1 + "/" +$scope.booking.CCExp2;
			$scope.booking["CCCW"] = $scope.booking.CCCW;
			$scope.booking["CCName"] = $scope.booking.CCName;
			$scope.booking["Children"] = $scope.booking.Children;
			$scope.booking["FK_RatePolicy"] = $scope.selectedRatePlan.FK_RatePolicy; 
			$scope.booking["Occupancy"] = parseInt($scope.booking.Occupancy);
	 
			var str = $.param(d);
			$scope.errorMessageShow =""; 

			if($scope.newbooking) {
				BookingService.$create(d,false)
				.then(function(response) { //success
					
					if (response.Status !== undefined) {
						if(response.Status == "OK"){
								
								$modalInstance.close($scope.booking);

								var confirmationScreen = $uibModal.open({
									templateUrl: "views/bookingConfirmation.html",
									controller: function($scope, $modalInstance) {
									

										$scope.close = function() {
											$modalInstance.close();
											
										};

										$scope.ID = response.ID;
										$scope.BookingCode = response.BookingCode;
									
									}
								})

								confirmationScreen.result.then(function() {
									$route.reload();
								});

						} else {
							 
							$scope.errorMessageShow = response.ErrorNumber;//"7001"; 
							if(typeof(response.ErrorNumber) != "undefined" && response.ErrorNumber != "1010" ) {
								
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
							
							}
						}
					} else {
						new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
					}

				},function (response) { //error
					$modalInstance.dismiss("cancel");
				});
			} else { //else to update booking
				var updateParams = {};

				
				updateParams["ProvinceState"] = $scope.BookingCustomer.ProvinceState;
				updateParams["Country"] = $scope.BookingCustomer.Country;
				updateParams["Address1"] = $scope.BookingCustomer.Address1;
				updateParams["PostalCode"] = $scope.BookingCustomer.PostalCode;
				updateParams["Phone"] = $scope.BookingCustomer.Phone;
				updateParams["City"] = $scope.BookingCustomer.City;
				updateParams["FirstName"] = $scope.BookingCustomer.FirstName;
				updateParams["LastName"] = $scope.BookingCustomer.LastName;
				updateParams["Email"] = $scope.BookingCustomer.Email;

				updateParams["CC"] = $scope.booking.CC;
				updateParams["CCExp"] = $scope.booking.CCExp1 + "/" +$scope.booking.CCExp2;
				updateParams["CCCW"] = $scope.booking.CCCW;
				updateParams["CCName"] = $scope.booking.CCName;
				updateParams["Children"] = $scope.booking.Children;
				updateParams["Occupancy"] = parseInt($scope.booking.Occupancy);

				BookingService.$update($scope.booking.ID, updateParams, false)
				.then(function(response) {
					$modalInstance.close($scope.booking);
				}, function (response) {
					$modalInstance.dismiss("cancel");
				});
			}

	};


$scope.getbooking = function (booking) {

for(var i=0;i<booking.BookingCustomer.length;i++){
	if(booking.BookingCustomer[i].IsHolder==1) {
		//for(var k in booking.BookingCustomer[i]){
			$scope.BookingCustomer=booking.BookingCustomer[i];
		//}
	}
}

}

$scope.showCheckOut = function (booking) {
	return BookingService.$canCheckOut(booking.FK_BookingStatus, booking.DateTo);
}

$scope.checkOut = function (bookingID) {
	var modal = $uibModal.open({
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

	modal.result.then(function () {
		$scope.cancel();
	})
}

$scope.showCheckIn = function (booking) {
	return BookingService.$canCheckIn(booking.FK_BookingStatus, booking.DateFrom, booking.DateTo) && !$scope.newbooking;
}

$scope.checkIn = function (bookingID) {
	BookingService.$checkInConfirm(bookingID)
	.then(function(response) {
			if(response) {
				$scope.booking.FK_BookingStatus=2;
			}
		}, function(error) {

		});
}

$scope.reserveAndCheckIn = function () {
	$scope.reserve();
	$scope.checkIn($scope.ID);
}

$scope.canReserveAndCheckin = function () {
	return $scope.newbooking && $scope.dateFrom.isSame(moment(), 'day');
}

if(!$scope.newbooking) $scope.getbooking($scope.booking);


$scope.getRooms = function() {
	return $scope.Rooms.length ? null : $http.jsonp($rootScope.globals.serverUrl+webConstants.hostCallserver+"&object=Room&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id)
	.success(function(data) {
		$scope.Rooms = data;
	});
};

$scope.getRooms();

$scope.calculateamounts();

$scope.saveAsDraft = function() {

	var d= {};
	d["DateFrom"] = moment($scope.dateFrom).format("YYYY-MM-DD");
	d["DateTo"] = moment($scope.dateTo).format("YYYY-MM-DD");
	
	d["FK_RoomType"] = $scope.selectedRoomType.FK_RoomType;
	
	if($scope.selectedRoom.ID) {
		d["FK_Room"] = $scope.selectedRoom.ID;
	}

	d["Country"] = $scope.BookingCustomer.Country;
	d["Address1"] = $scope.BookingCustomer.Address1;
	d["PostalCode"] = $scope.BookingCustomer.PostalCode;
	d["Phone"] = $scope.BookingCustomer.Phone;
	d["City"] = $scope.BookingCustomer.City;
	d["FirstName"] = $scope.BookingCustomer.FirstName;
	d["LastName"] = $scope.BookingCustomer.LastName;
	d["Email"] = $scope.BookingCustomer.Email;
	d["ProvinceState"] = $scope.BookingCustomer.ProvinceState;
	//d["BookingCustomer"]=[$scope.BookingCustomer];

	d["Children"] = $scope.booking.Children;
	d["FK_RatePolicy"] = $scope.selectedRatePlan.FK_RatePolicy; 
	d["Occupancy"] = parseInt($scope.booking.Occupancy);
	d["BookingSource"] = "PMS";


	BookingService.$saveasdraft(d)
	.then(function (data) {
		$modalInstance.close();
		new logger("<p>Data Saved</p>","notice","growl","slide").log();
	}, function(error) {
		new errorLogger(error.message).log();
	});

}


		//.............
		$scope.Exp1 = [{
			v: "01",
			name: "01 - January"
		},{
			v: "02",
			name: "02 - February"
		},{
			v: "03",
			name: "03 - March"
		},{
			v: "04",
			name: "04 - April"
		},{
			v: "05",
			name: "05 - May"
		},{
			v: "06",
			name: "06 - June"
		},{
			v: "07",
			name: "07 - July"
		},{
			v: "08",
			name: "08 - August"
		},{
			v: "09",
			name: "09 - September"
		},{
			v: "10",
			name: "10 - October"
		},{
			v: "11",
			name: "11 - November"
		},{
			v: "12",
			name: "12 - December"
		}];

		$scope.Exp2 = [{
			v: "15",
			name: "2015"
		},{
			v: "16",
			name: "2016"
		},{
			v: "17",
			name: "2017"
		},{
			v: "18",
			name: "2018"
		},{
			v: "19",
			name: "2019"
		},{
			v: "20",
			name: "2020"
		}];

  })
  .directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function(val) {
        return '' + val;
      });
    }
  };
});