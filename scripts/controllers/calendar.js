'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:CalendarCtrl
 * @description
 * # CalendarCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('calendarCtrl', function ($http, $scope, $rootScope, $translate) {
 
		$scope.eventSources = [];
			//code which is solving context menue open problem on right click.
			$('*').contextmenu( function() {
    		return false;
			});
			//
		 var fk_property = $rootScope.globals.fk_property.id;

		if (fk_property === undefined) {
			return;
		}
		 
				
		// $scope.$watch(function() {
		//   return $rootScope.globals.selectedLanguage;
		// }, function() {
		//   $scope.lang = $rootScope.globals.selectedLanguage;

		// translateFullCalendar(); 
		// });

		$rootScope.$on('$translateChangeSuccess', function () {
		
			$scope.translateFullCalendar(); 
	  
    	});

var monthname,shortday,monthNameShort;

$scope.translateFullCalendar = function() {

	var selLang=$translate.proposedLanguage(); //see if there is a proposed language change
	if(selLang===undefined) selLang=$translate.use(); //if there is no change in progress see current language
	if(selLang===undefined) selLang="en"; //in case none of the above gets a response 

	//.............................switch starts here
switch(selLang) {
//............................"es" case starts here
	case "es":
	 
	monthname=	['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
					'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

	 shortday= ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi','Sa'];
	 monthNameShort:["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
	break;

	case "fr":
	 
	monthname=	['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août',
						'Septembre','Octobre','Novembre','Décembre'];
 	shortday= ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Va','Sa'];
 	monthNameShort:['janv.','févr.','mars','avr.','mai','juin','juil.',
						'août','sept.','oct.','nov.','déc.'];
	 
	break;

	case "pl":
	 
	monthname=	[ 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
					'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
		];
		 shortday= ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt','So'];
		 monthNameShort:["Sty","Lu","Mar","Kw","Maj","Cze","Lip","Sie","Wrz","Pa","Lis","Gru"];
	 
	break;

	case "de":
	 
	monthname=	['Ene', 'Febr', 'Mar', 'Abl', 'Mo', 'Juo', 'lio',
					'Agto', 'Sembre', 'Oce', 'Nobre', 'Dembre'];
	 shortday= ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi','Sa'];
	 monthNameShort:["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
	 
	break;

	default:
	monthname=	['January' , 'February', 'March', 'April',
	 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	  shortday= ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'];
	  monthNameShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	break;
}
//............................switch ends here
							 
					 
					 $scope.uiConfig = {  
			      calendar:{ 

		      		monthNames: monthname,
					monthNamesShort:monthNameShort,
					/*	dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],*/
					dayNamesShort: shortday,
			      	
			      	//..

			        height: 450,
			        editable: true,
		            //selectable: true, 
			        header:{ 
			          left: 'month basicWeek basicDay agendaWeek agendaDay',
			          center: 'title',
			          right: 'today prev,next'
			        },
			        firstDay: 1,
		            dayRender: function(date, cell) {
		                cell.bind('mousedown', function(e) {
		                    if (e.which == 3) {
		                        //addReservation(date, e.offsetY);
		                       
		                        showReservationMenu(date, e.offsetY);
		                    }
		                });
		            },

			         
		            eventDrop: $scope.alertOnDrop,
			        eventResize: $scope.alertOnResize,
			        slotEventOverlap : false, 
			        default: false,
		            select: function(start, end, allDay, jsEvent) {
		            	 
		                addReservation(start, end, allDay, jsEvent);
		            }
			      }
			    };
				$scope.events = [];
				$scope.eventSources = [$scope.events];

				
		 		
		 		 
						
						
					
	}				 

	$scope.translateFullCalendar();
 	//this.propertyid=propertyid;
		//alert(this.propertyid);
		
	
   //
  });
