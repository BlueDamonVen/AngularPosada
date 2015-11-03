'use strict';

/**
 * @ngdoc service
 * @name bearpms3App.searchService
 * @description
 * # searchService
 * Service in the bearpms3App.
 */
angular.module('bearpms3App')
  .service('searchService', function ($q,webConstants,$rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var host=webConstants.host;
     this.search = function(term)
        {  
        	if (term)
			    {
			    	var deferred = $q.defer(); 
			             
	                $.ajax({
	                  url: host+"/bearcrsl?object=Booking&method=Search"+
	                  "&FK_Property="+18+
	                  "&token="+$rootScope.credentials.currentUser.token+
	                  "&Criteria="+term+"&withbookingcustomer="+1 ,
	                        type: 'GET',
	                        crossDomain: true,
	                        dataType: 'jsonp',
	                        success: function(data) {
	                              
	                            deferred.resolve(data);
	                        },
	                        error: function() 
	                        { 
	                        	alert('Request failed, try again'); 
	                        }
	                }); 
			           
			    }
			     return deferred.promise;
        }
  });
