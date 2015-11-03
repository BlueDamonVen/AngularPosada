'use strict';

/**
 * @ngdoc directive
 * @name bearpms3App.directive:nbDatePicker
 * @description
 * # nbDatePicker
 */
angular.module('bearpms3App')
  
.directive('nbDatePicker', ['$timeout', function($timeout) {
        return {
            restrict: 'A', 
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) { 
                
               
            scope.days_between= function (date1, date2) 
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
                  var id=0;
                var days =1;
                    var minDate = scope.$eval(attrs.minDate);
                     
                    $(element).datepicker('remove');

                    $(element).datepicker({
                   	format: 'mm/dd/yyyy',
				    startDate: minDate,
    				autoclose: true  
                    }).on('changeDate', function(e) {
                   
                       e.date.setDate(e.date.getDate() + days); 

                    	$("#enddate").datepicker('remove');
                    	$("#enddate").datepicker({
		                   	format: 'mm/dd/yyyy',
						    startDate: e.date,
		    				autoclose: true 
		                      }).on('changeDate', function(e) {
                          //.....
                   if(id===0)
                    {
                        var Date1= $('#startdate').datepicker("getDate"); 
                        var Date2 = $('#enddate').datepicker("getDate");
                        
                        days=  scope.days_between(Date1,Date2);
                        days++;
                        id++;
                        console.log("days 1234 :---------==========--- ",days,Date1,Date2);
                    }
                            //
                            });
                    	//
                    	$("#enddate").datepicker("update", e.date);  
                        $(element).datepicker('hide');

 
                    });

                    // hack to make datepicker show in right place first time invoked
                    $(element).datepicker('show');
                    $(element).datepicker('hide');
                    $("#enddate").datepicker('show');
                    $("#enddate").datepicker('hide');
 
               

            }
        }
    }]);

