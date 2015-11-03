/**
 * Cube - Bootstrap Admin Theme
 * Copyright 2014 Phoonio
 */


function bsNavbar($window, $location) {

	var defaults = this.defaults = {
		activeClass: 'active',
		routeAttr: 'data-match-route',
		strict: true
	};

	return {
		restrict: 'A',
		link: function postLink(scope, element, attr, controller) {

			// Directive options
			var options = angular.copy(defaults);
			angular.forEach(Object.keys(defaults), function(key) {
				if(angular.isDefined(attr[key])) options[key] = attr[key];
			});

			// Watch for the $location
			scope.$watch(function() {

				return $location.path();

			}, function(newValue, oldValue) {

				var liElements = element[0].querySelectorAll('li[' + options.routeAttr + '],li > a[' + options.routeAttr + ']');

				angular.forEach(liElements, function(li) {

					var liElement = angular.element(li);
					var pattern = liElement.attr(options.routeAttr).replace('/', '\\/');
					if(options.strict) {
						pattern = '^' + pattern;
					}
					var regexp = new RegExp(pattern, ['i']);

					if(regexp.test(newValue)) {
						liElement.addClass(options.activeClass);
					} else {
						liElement.removeClass(options.activeClass);
					}

				});

				// Close all other opened elements
				var op = $('#sidebar-nav').find('.open:not(.active)');
				op.children('.submenu').slideUp('fast');
				op.removeClass('open');
			});

		}

	};
}

function gd(year, day, month) {
	return new Date(year, month - 1, day).getTime();
}

function showTooltip(x, y, label, data) {
	$('<div id="flot-tooltip">' + '<b>' + label + ': </b><i>' + data + '</i>' + '</div>').css({
		top: y + 5,
		left: x + 20
	}).appendTo("body").fadeIn(200);
}


function showtab() {
	return {
		link: function (scope, element, attrs) {
			element.click(function(e) {
				e.preventDefault();
				$(element).tab('show');
			});
		}
	};
}


function footableload(){
		return function(scope, element)
		{

		if(scope.$last && !$('.footable').hasClass('footable-loaded')) {
				$('.footable').footable();
		}

		var footableObject = $('.footable').data('footable');
		footableObject
		if (footableObject  !== undefined) {
				footableObject.appendRow($(element));
		}

		};
}

function editableCustom () {
	return function(scope, element) {
		element.on('focus', function() {
			element.addClass("form-control");
			element.removeClass("text-like");
			element.removeClass("editable-click");
		});
		element.on('blur', function() {
			element.removeClass("form-control");
			element.addClass("text-like");
			element.addClass("editable-click");

		});
		element.on("keyup", function(e) {
			if(e.which === 13) {
				scope.updatedata(scope.store.ID, scope.store, scope.$index);
				e.preventDefault();
				element.blur();
			}
		})
	}
}


function customDatepicker() {
	return {
		require: "ngModel",
		link:function (scope, element, attrs, ngModelCtrl) {

				element.datepicker({
					format: 'dd/mm/yyyy',
					autoclose: true
				});
				ngModelCtrl.$render = function () {
					var init = moment(ngModelCtrl.$viewValue).format("DD/MM/YYYY");
					element.datepicker("update", init);
				};
		}
	}
}

function csReportrange($rootScope, $translate) {
	// Attribuites:
	// callback="<callback function>" - runs function in $scope.<callback>
	// noranges="true" - does not display ranges

	return {
			
		link:function ($scope, element, attrs) {
			loadComponent();
			$rootScope.$on('$translateChangeSuccess', function () {
				loadComponent();
			});


			function loadComponent() {

				$('#'+element.attr('id')).daterangepicker({
					width: '300px'
				    });
			    
				var loc={};
				var noranges = !!attrs.noranges;
				var ranges = {};

				var call = attrs.call;
				
				var opens = attrs.where || 'left';
				var trans = $translate.instant(['DATEPICKER_TODAY','DATEPICKER_YESTERDAY','DATEPICKER_LAST_7_DAYS','DATEPICKER_LAST_30_DAYS','DATEPICKER_THIS_MONTH','DATEPICKER_LAST_MONTH',
					'DATEPICKER_APPLY','DATEPICKER_CANCEL','DATEPICKER_FROM','DATEPICKER_TO','DATEPICKER_CUSTOM_RANGE',
					'DATEPICKER_DOW_SU','DATEPICKER_DOW_MO','DATEPICKER_DOW_TU','DATEPICKER_DOW_WE','DATEPICKER_DOW_TH','DATEPICKER_DOW_FR','DATEPICKER_DOW_SA',
					'DATEPICKER_JANUARY','DATEPICKER_FEBRUARY','DATEPICKER_MARCH','DATEPICKER_APRIL','DATEPICKER_MAY','DATEPICKER_JUNE','DATEPICKER_JULY','DATEPICKER_AUGUST','DATEPICKER_SEPTEMBER','DATEPICKER_OCTOBER','DATEPICKER_NOVEMBER','DATEPICKER_DECEMBER'
					]);

				var temp={};
				temp[trans.DATEPICKER_TODAY] = [moment(),moment()];
				temp[trans.DATEPICKER_YESTERDAY] = [moment().subtract('days', 1), moment().subtract('days', 1)];
				temp[trans.DATEPICKER_LAST_7_DAYS] = [moment().subtract('days', 6), moment()];
				temp[trans.DATEPICKER_LAST_30_DAYS] = [moment().subtract('days', 29), moment()];
				temp[trans.DATEPICKER_THIS_MONTH] = [moment().startOf('month'), moment().endOf('month')];
				temp[trans.DATEPICKER_LAST_MONTH] = [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')];


				loc = {
				applyLabel: trans.DATEPICKER_APPLY,
				cancelLabel: trans.DATEPICKER_CANCEL,
				fromLabel: trans.DATEPICKER_FROM,
				toLabel: trans.DATEPICKER_TO,
				customRangeLabel: trans.DATEPICKER_CUSTOM_RANGE,
				daysOfWeek: [trans.DATEPICKER_DOW_SU,trans.DATEPICKER_DOW_MO,trans.DATEPICKER_DOW_TU,trans.DATEPICKER_DOW_WE,trans.DATEPICKER_DOW_TH,trans.DATEPICKER_DOW_FR,trans.DATEPICKER_DOW_SA],
				monthNames: [trans.DATEPICKER_JANUARY,trans.DATEPICKER_FEBRUARY,trans.DATEPICKER_MARCH,trans.DATEPICKER_APRIL,trans.DATEPICKER_MAY,trans.DATEPICKER_JUNE,trans.DATEPICKER_JULY,trans.DATEPICKER_AUGUST,trans.DATEPICKER_SEPTEMBER,trans.DATEPICKER_OCTOBER,trans.DATEPICKER_NOVEMBER,trans.DATEPICKER_DECEMBER],
				firstDay: 1
				};

				if(noranges) {
					ranges = undefined;
				} else {
					ranges = temp;
				}
				 
				var mindateSet;
				if(element.attr('id')==="reportrange")
				{
					mindateSet=new Date();
				}
				else
					mindateSet='01/01/2015';

				element.daterangepicker({
						width: 'auto',
						startDate: $scope.dateFrom,
						endDate: $scope.dateTo,
						minDate: mindateSet,//new Date(),//'01/01/1990',
						maxDate: '12/31/2022',
						dateLimit: { days: 365 },
						showDropdowns: $scope.showDropdowns || true,
						showWeekNumbers: true,
						timePicker: false,
						timePickerIncrement: 1,
						timePicker12Hour: true,
						ranges: ranges,
						opens: opens,
						buttonClasses: ['btn btn-sm'],
						applyClass: 'btn-primary',
						cancelClass: 'btn-danger',
						format: 'DD/MM/YYYY',
						separator: ' to ',
						locale: loc,
						lang: 'es',

					},
					function(start, end) {
						 
						element.find('span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
						$scope.dateFrom=start;
						$scope.dateTo=end;
						$scope.$apply();
						if (call == "false") {
							return false;
						}
			            if (attrs.callback) {
			                $scope[attrs.callback](start, end);
			            }
			            else {
						   $scope.update(start,end);
			            }
					}); 
						//Set the initial state of the picker label
				element.find('span').html($scope.dateFrom.format('MMMM D, YYYY') + ' - ' + $scope.dateTo.format('MMMM D, YYYY'));
			}
		}
	}
}

function customAutocomplete(filterFilter) {
	return {
		transclude: true,
		replace: true,
		scope: true,
		template: '<div><div ng-transclude></div><div class="autocomplete-list" ng-hide="hidden || !autoResults.length">'+
		'<span ng-click="clickAction(c)" ng-class="{active: $index == index, $index: true}" ng-repeat="c in autoResults">{{c[prop]}}</span></div></div>',
		link:function (scope, element, attrs) {
				var filter = filterFilter;
				scope.prop = attrs.csAutocomplete;
				var guest = attrs.guest;
				var searchObj = {};
				scope.hidden = true;
				scope.autoResults = [];
				var input = element.find('input');
				scope.index = 0;
				input.on('input', function() {
					var val = input.val();
					searchObj[scope.prop] =  val;
					scope.$apply(function() {
						scope.autoResults = filter(scope.ac.customers, searchObj);
						scope.number = scope.autoResults.length;
						scope.hidden = false;
						scope.index = 0;
					});
				});

				scope.clickAction = function(c) {
					scope.setHolder(c, guest);
					scope.hidden = true;
				};

				$(document).on("click", function(e) {
					if (e.target !== input) {
						scope.$apply(function() {
							scope.hidden = true;
						});	
					}
				});

				$(document).on("keydown", function(e) {
					if(e.keyCode == '40') {
						scope.index += 1;
						if(scope.index >= scope.number) {
							scope.index = 0;
						}
						scope.$apply();
					}
					if(e.keyCode == '38') {
						scope.index -= 1;
						if(scope.index < 0) {
							scope.index = scope.number - 1;
						}
						scope.$apply();
					}
					if(e.keyCode == '13') {
						/*if(!scope.hidden) {
							e.stopPropagation();
							e.preventDefault();
						}*/
						element.find('span').eq(scope.index).click();
						return false;
					}
				})
		}
	}
}


function tableload(){
	return function(scope, element)
	{

		if ( ! $.fn.DataTable.isDataTable( '#table-bookinglist' ) ) {
			var table = $('#table-bookinglist').dataTable({
				'info': false,
				'sDom': 'lTfr<"clearfix">tp',
				'tableTools': {
		            "aButtons": [
		                "copy",
		                "csv",
		                "xls",
		                {
		                    "sExtends": "pdf",
		                    "sPdfOrientation": "landscape",
		                    "sPdfMessage": "Your custom message would go here."
		                }
		            ]
				}
			});
			
		    //var tt = new $.fn.dataTable.TableTools( table );
			//$( tt.fnContainer() ).insertBefore('div.dataTables_wrapper');
		}

	};
}

function dropzone() {
	return {
		link:function (scope, element, attrs) {
			 
			$(element).dropzone({
				method: "post",
				url: scope.uploadUrl,
				uploadMultiple: false,
				init: function() {
			          this.on('success', function(file, json) {
			        	  scope.getCompanyData();
			          });
				}
				});
		}
	}
}


function dropzone2() {
	return {
		link:function (scope, element, attrs) {
			 
			$(element).dropzone({
				method: "post",
				url: scope.uploadUrl,
				uploadMultiple: false,
		        init: function() {
		          //scope.files.push({file: 'added'}); // here works
		          this.on('success', function(file, json) {
		        	  //alert("luis "+file+" "+json);
		        	  
		        	  scope.getPropertyImages();
		        	  
		          });
		        }
			});
		}
	};
}


function dropzone3() {
	return {
		link:function (scope, element, attrs) {
			
			var id=attrs.dropzone3;
			//alert("luis: "+id)
		 
			if(id!="-1"){
			$(element).dropzone({
				method: "post",
				url: scope.roomtypes[id].uploadURL,
				uploadMultiple: false,
				acceptedFiles: "image/*",
		        init: function() {
		          //scope.files.push({file: 'added'}); // here works
		          this.on('success', function(file, json) {
		        	  //alert("luis "+file+" "+json);
		        	  
		        	  scope.getRoomTypeImages();
		        	  
		          });
		        }
			});
			}
		}
	};
}

function sortgal() {
	return {
		link:function (scope, element, attrs) {
		$('ul#gallery-photos').sortable({ 
			opacity: 0.6, 
			cursor: 'move', 
			update: function(event, ui) {
			var order = $(this).sortable('serialize'); 
			//$.post('/gallery-sortimages.html', order, function(theResponse){
			//});
			//alert("luis "+event+ui);
			scope.reorder();
			}	
	});
	}
	}
}

/*
 * angular-confirm
 * http://schlogen.github.io/angular-confirm/
 * Version: 1.0 - 2014-24-11
 * License: Apache
 */
angular.module('angular-confirm', ['ui.bootstrap'])
.controller('ConfirmModalController', function($scope, $modalInstance, data) {
  $scope.data = angular.copy(data);
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.value('$confirmModalDefaults', {
  template: '<div class="md-content small-modal"><div class="modal-header" style="border:none"><h3 class="modal-title" style="border:none">Confirm</h3></div><div class="modal-body" style="padding:15px">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div></div>',
  controller: 'ConfirmModalController'
})
.factory('$confirm', function($uibModal, $confirmModalDefaults) {
  return function(data, settings) {
    settings = angular.extend($confirmModalDefaults, (settings || {}));
    data = data || {};
    
    if ('templateUrl' in settings && 'template' in settings) {
      delete settings.template;
    }
    
    settings.resolve = {data: function() { return data; }};

    return $uibModal.open(settings).result;
  };
})
.directive('confirm', function($confirm) {
    return {
      priority: 1,
      restrict: 'A',
      scope: {
        confirmIf: "=",
        ngClick: '&',
        confirm: '@'
      },
      link: function(scope, element, attrs) {
        function reBind(func) {
          element.unbind("click").bind("click", function() {
            func();
          });
        }
        
        function bindConfirm() {
          $confirm({text: scope.confirm}).then(scope.ngClick);
        }
        
        if ('confirmIf' in attrs) {
          scope.$watch('confirmIf', function(newVal) {
            if (newVal) {
              reBind(bindConfirm);
           } else {
              reBind(function() {
             	  scope.$apply(scope.ngClick);
              }); 
            }
          });
        } else {
          reBind(bindConfirm);
        }
      }
    }
});




function inputfilechange() {
	
	
	
	return {
	    restrict: 'A',
	    link: function (scope, element, attrs) {
	    	var userID=attrs.userID;
	    	var onChangeFunc = scope.$eval(attrs.inputfilechange);
	    	element.bind('change', onChangeFunc);
	    }
	}
	
};


function areaChart($window) { // Didn't work, marked to delete
	return {
		restrict: 'A',
		scope: {
			areaData: '=',
			areaXkey: '@',
			areaYkeys: '@',
			areaLabels: '@'
		},
		link: function(attr, elem) {
			var morris;

			angular.element($window).bind('resize load shown.bs.tab', function() {
				if (attr.areaData || morris) {
					// console.log('Morris area resized/loaded !');
					morris.redraw();
				}
			});

			attr.$watch('areaData', function() {
				if (attr.areaData) {
					if (!morris) {
						morris = new Morris.Area({
							element: elem,
							data: attr.areaData,
							xkey: attr.areaXkey,
							ykeys: JSON.parse(attr.areaYkeys),
							labels: JSON.parse(attr.areaLabels)
						});
					}
				}
			});
		}
	}
}

function barChart($window) {
	return {
		restrict: 'A',
		scope: {
			barX: '@',
			barY: '@',
			barLabels: '@',
			barData: '=',
			barHorizontal: '='
		},
		link: function(attr, elem) {
			var morris;

			angular.element($window).bind('resize load shown.bs.tab', function() {
				if (attr.barData || morris) {
					// console.log('Morris bar resized/loaded !');
					morris.redraw();
				}
			});

			attr.$watch('barData', function() {
				if (attr.barData) {
					if (!morris) {
						morris = new Morris.Bar({
							element: elem,
							data: attr.barData,							
							xkey: attr.barX,
							ykeys: JSON.parse(attr.barY),
							labels: JSON.parse(attr.barLabels),
							horizontal: attr.barHorizontal,
							xLabelMargin: 2
						});
					}
				}
			});
		}
	}
}


angular
	.module('bearpms3App')
	.directive('bsNavbar', bsNavbar)
	.directive('showtab', showtab)
	.directive('footableload',footableload)
	.directive('customDatepicker',customDatepicker)
	.directive('csReportrange',csReportrange)
	.directive('editableCustom',editableCustom)
	.directive('csAutocomplete',['filterFilter', customAutocomplete])
	.directive('tableload',tableload)
	.directive('dropzone', dropzone)
	.directive('sortgal',sortgal)
	.directive('dropzone2', dropzone2)
	.directive('dropzone3', dropzone3)
	.directive('inputfilechange', inputfilechange)
	.directive('areaChart', areaChart)
	.directive('barChart', barChart)