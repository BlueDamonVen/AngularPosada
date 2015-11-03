'use strict';

/**
 * @ngdoc service
 * @name bearpms3App.createBooking
 * @description
 * # createBooking
 * Service in the bearpms3App.
 */
angular.module('bearpms3App')
  .service('createBooking', function ( $rootScope, $http,$q,webConstants) {
	var host=webConstants.host;
   
   this.callRatePolicyApi= 	function(booking)
   {
	    if (booking)
	    {var deferred = $q.defer();
	       
	        var ratePolicy_fk = booking.FK_RatePolicy; 
	        var property_fk = booking.FK_Property;    
	                 $.ajax({
	                  // /bearcrsl?callback&object=RatePolicy&method=List&FK_Property=18&token={{token}}&FK_RatePolicy=1
	                    url: host+"/bearcrsl?object=RatePolicy&method=List"+"&FK_Property="+property_fk+"&token="+$rootScope.credentials.currentUser.token+"&FK_RatePolicy="+ratePolicy_fk ,
	                        type: 'GET',
	                        crossDomain: true,
	                        dataType: 'jsonp',
	                        success: function(data) {
	                              
	                            deferred.resolve(data);
	                        },
	                        error: function() { alert('Request failed, try again'); },
	                }); 
	           
	    }
	     return deferred.promise;
	}//...........call rate policy api ends

   this.callExtendApi = function (booking)
   {
	    if (booking)
	    {
	    	var deferred = $q.defer(); 
	        var ratePolicy_fk = booking.FK_RatePolicy; 
	        var property_fk = booking.FK_Property;
	        var roomTypeFk = booking.FK_RoomType;
	                 
	                 $.ajax({ 
	                  url: host+"/bearcrsl?object=RatePolicyRates&method=List"+"&SK_Property="+property_fk+"&token="+$rootScope.credentials.currentUser.token+"&FK_RatePolicy="+ratePolicy_fk+"&FK_RoomType="+roomTypeFk ,
	                        type: 'GET',
	                        crossDomain: true,
	                        dataType: 'jsonp',
	                        success: function(data) { 
	                            deferred.resolve(data);
	                        },
	                        error: function() { alert('Request failed, try again'); },
	                }); 
	           
	    }
	     return deferred.promise;
	}
		 
	this.days_between= function (date1, date2) 
			{

			    // The number of milliseconds in one day
			    var ONE_DAY = 1000 * 60 * 60 * 24 
			    var date1_ms = date1.getTime();
			    var date2_ms = date2.getTime();

			    // Calculate the difference in milliseconds
			    var difference_ms = Math.abs(date1_ms - date2_ms);

			    // Convert back to days and return
			    return Math.round(difference_ms/ONE_DAY);

			}

	this.safeApply = function(fn) {
	  var phase = this.$root.$$phase;
	  if(phase == '$apply' || phase == '$digest') {
	    if(fn && (typeof(fn) === 'function')) {
	      fn();
	    }
	  } else {
	    this.$apply(fn);
	  }
	};

	this.saveAsDraft = function(str)
		{ 
		  if (str)
		    {    console.log("usama draft model service",str); 
		    var deferred = $q.defer(); 
	            $.ajax({ 
	              url: host+"/bearcrsl?object=TempBooking&method=Insert&token="+
	              $rootScope.credentials.currentUser.token+"&FK_Property="+18+"&"+str,

	                  type: 'POST',
	                    crossDomain: true,
	                    dataType: 'jsonp',
	                    success: function(data) { 
	                    	console.log("resolved");
	                        deferred.resolve(data);
	                    },
	                    error: function() { alert('Request failed, try again'); },
	            }); 
		        return deferred.promise;   
		    }
		 //    return deferred.promise; 

		};
		this.removeDraft = function(id)
		{  
		  if (id)
		    {  
		    var deferred = $q.defer(); 
	            $.ajax({ 
	              url: host+"/bearcrsl?object=TempBooking&method=Delete&token="+
	              $rootScope.credentials.currentUser.token+"&FK_Property="+18+"&ID="+id,

	                  type: 'POST',
	                    crossDomain: true,
	                    dataType: 'jsonp',
	                    success: function(data) { 
	                    	console.log("resolved");
	                        deferred.resolve(data);
	                    },
	                    error: function() { alert('Request failed, try again'); },
	            }); 
		        return deferred.promise;   
		    }
		 //    return deferred.promise; 

		};
    //


    // AngularJS will instantiate a singleton by calling "new" on this function
  });
