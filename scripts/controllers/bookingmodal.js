
'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:BookingmodalCtrl
 * @description
 * # BookingmodalCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('bookingModalCtrl', function ($scope, $rootScope, data , $modalInstance, $http, $uibModal,$location,createBooking,webConstants ) {
		
  		var hostCallserver =webConstants.hostCallserver;

		$scope.data = data;
		
		$scope.dateFrom= data.dateFromToShow; 
		$scope.dateTo= data.dateToToShow;  
	 	var FK_RatePolicy,p;
	 	//...............
	 	$scope.dattta =  data.luisavail ; 



		for(var i=0; i< $scope.dattta.length; i++)
		{
			for( var k=0; k< $scope.dattta[i].RatePolicies.length ; k++ )
			{ 
				if($scope.dattta[i].RatePolicies[k].Rate !=  $scope.data.dailyRatePerNight)
				{  
					$scope.dattta[i].RatePolicies.splice(k,1); 
					k--;
				}
			}
			if($scope.dattta[i].RatePolicies.length<1)
			{ 
				$scope.dattta.splice(i,1);
				i--;
			}
		}

		//............................
		console.log("usama : : ",data.luisavail);

		$scope.luisavail = $scope.dattta ;
		 
		//....seting roles
		$scope.rightValue =false;
		$scope.rightsValues = $rootScope.globals.fk_rightsResponse;
		if($scope.rightsValues.data[0].Booking === 1 )
  			$scope.rightValue=true;

  		//....seting roles ends
 		

		$scope.countries = $rootScope.countries;
		var dateToCheck;
		var dateFromCheck;
		$scope.search = function() {

			var dataToSend = {
				rooms : data.rooms,
				occupants : data.occupants,
				dateFrom : data.dateFrom.format('YYYY-MM-DD'),
				dateTo : data.dateTo.format('YYYY-MM-DD')
			}
			if($location.path() != "/create_booking") {
				$location.path('/create_booking').search(dataToSend);
			}
			else {
				$rootScope.$broadcast('availabilitySearch', dataToSend);
			}
			$modalInstance.close()
		};
		$scope.setDates = function() {
			var dateHelper, dateFromHelper, dateToHelper = "";
			dateHelper = $scope.data.checkInOutDate.split(" - ");
			dateFromHelper = dateHelper[0].split(" / ");
			dateToHelper = dateHelper[1].split(" / ");
			$scope.data.dateFrom = moment(dateFromHelper[2] + "-" + dateFromHelper[1] + "-" + dateFromHelper[0]);
			$scope.data.dateTo = moment(dateToHelper[2] + "-" + dateToHelper[1] + "-" + dateToHelper[0]);
		};
		$scope.setOccupants  = function() {
			var setOccupantsHelper = "";
			 
		};
		$scope.cancel = function() { 
			
			$modalInstance.dismiss("cancel"); 
			$rootScope.$broadcast('callAvailability'); 
			$location.path("/bookings/create_booking");
		};
		$scope.close = function() {
			
			$modalInstance.close();
			$rootScope.$broadcast('callAvailability');  
			$location.path("/bookings/create_booking");
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
		$scope.greaterThan = function(prop, val) {
			return function(item){
				return item[prop] > val;
			}
		};
		if($scope.data.bookingList)
		{
			 
		}
		 
		var today = new Date();
		var startDatePicker, endDatePicker;
		$scope.roomTypeSelected;

		function init ()
		{
			
			//$scope.roomTypeSelected=$scope.data.bookingList[$scope.data.pickedRoomType].room;
		}
		init();
  
	function convertDate(inputFormat) 
	{
		  function pad(s) { return (s < 10) ? '0' + s : s; }
		  var d = new Date(inputFormat);
		  return [pad(d.getMonth()+1),pad(d.getDate()),d.getFullYear() ].join('/');
	}
	function convertDateInit(inputFormat) 
	{
		  function pad(s) { return (s < 10) ? '0' + s : s; }
		  var d = new Date(inputFormat); 
		  return [d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate()) ].join('-');
	}
	function dateCompare(str1, str2)
	{
	    return new Date(str1) > new Date(str2);
	}
	 
	//........
	$scope.updateBookingFlow = function() 
	{ 
		 
			$scope.data.dailyRatePerNight = '0'; 
			$scope.data.reservationTotalPrice = '0';
								//....
		    var Date2 = $('#enddate').datepicker("getDate");
			var Date1=$('#startdate').datepicker("getDate");
			  
			var howLong=  createBooking.days_between(Date1, Date2);

			//...below piece of code changing room plan according to roo type
			/*if($scope.data.bookingList && $scope.data.pickedRatePlanType)
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
					}
				}
			}*/
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
//if($scope.luisavail)
//$scope.luisselectedratepolicylist =  $scope.luisavail[findid($scope.luisavail, parseInt($scope.data.pickedRoomType))].RatePolicies;
//$("#ratePlane").val(1);
//$scope.luisselectedratepolicylist =  $scope.luisavail[0].RatePolicies;

	}
	

	//..........................................................

		$scope.ac = {};
		$scope.ac.customers = []; 
		callserver(hostCallserver+"&object=Customer&method=List&withstays=1&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
			if (response.status == 'OK') {

				var sDate = new Date(Date.parse(data.dateFromToShow)).toString();
				var eDate =  new Date(Date.parse(data.dateToToShow)).toString();
					 
					
					$scope.dateTo = convertDate(moment(data.dateToToShow)); 
					$scope.dateFrom= convertDate(moment(data.dateFromToShow));
					
					$('#startdate').datepicker('setDate',  new Date(sDate) );
					$("#startdate").datepicker("update" );
					//
					$('#enddate').datepicker('setDate', new Date (eDate) );
					$("#enddate").datepicker("update" ); 
					
					//$scope.luisselectedratepolicylist =  $scope.luisavail[0].RatePolicies;
					if($("#roomType option:selected").text()==="" && $("#ratePlane option:selected").text()==="")
					{
						$scope.data.dailyRatePerNight =0;
						$scope.data.reservationTotalPrice =0;
					}

			        $("#roomType").val($scope.luisavail[0].FK_RoomType); 
					if($scope.luisavail)
					$scope.luisselectedratepolicylist =  $scope.luisavail[0].RatePolicies;
					console.log("da : ",$scope.luisselectedratepolicylist);
							
					$("#ratePlane").val($scope.luisavail[0].RatePolicies[0].FK_RatePolicy);  
					// 
						
					   
				//................
				if(response.data.Status === undefined){
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

		$scope.reserve = function() {
			
		//var len =Object.keys($scope.data.bookingList).length;
		 
		FK_RatePolicy= $scope.data.pickedRatePlanType; 
		//$scope.data.bookingList[$scope.data.pickedRoomType].ratePolicy;
		 
		 
		console.log("value : ",FK_RatePolicy);


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
			d["FK_RatePolicy"] = FK_RatePolicy;//$scope.data.pickedRatePlanType; 
			d["Occupancy"] = parseInt($scope.data.adults) + parseInt($scope.data.children);
			d["BookingSource"] = "PMS";
	

			var str = $.param(d);
			$scope.errorMessageShow ="";
			var saved = callserver(hostCallserver+"&object=Booking&method=CreateBooking&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&"+str,function (response) {
				if (response.status == 'OK') {
					if(response.data.Status === undefined){
					} else {
						if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
						}
					}	
					
					} else {
						$scope.errorMessageShow = response.data.ErrorNumber;//"7001";
						if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
						}
						saved = false;
					}

			},$http,$scope);

			saved.then(function(data) {
				 
				$modalInstance.close();
				$uibModal.open({
					templateUrl: "bookingConfirmation.html",
					controller: function($scope, $modalInstance) {
						$scope.close = function() {
							$modalInstance.close();
							$rootScope.$broadcast('callAvailability'); 
							if(response.data.Status == "OK")
							$location.path("/bookings/create_booking");
						};
						$scope.ID = data.data.ID;
						$scope.BookingCode = data.data.BookingCode;
					},
					windowClass: "tiny-modal",
					resolve: {

					}
				})
			})	
		}

	 
  //
  //..........................
  $scope.saveAsDraft = function()
	{
		console.log("usama draft model");
		$('#myModalDraft')
        .modal({ backdrop: 'static', keyboard: false })
        .one('click', '#ok', function(e) {
        	var booking = returnVa();
        	createBooking.saveAsDraft(booking)
        	 .then(function(response) { 
            	new logger("<p>Data Saved</p>","notice","growl","slide").log();
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

  //.............................................................................................
  });
