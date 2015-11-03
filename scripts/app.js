'use strict';

/**
 * @ngdoc overview
 * @name bearpms3App
 * @description
 * # bearpms3App
 *
 * Main module of the application.
 */
/*angular
  .module('bearpms3App', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });*/

var app = angular.module('bearpms3App', [
  'ngRoute',
  'angular-loading-bar',
  'ngAnimate',
  'easypiechart',
  'ngCookies',
  'xeditable',
  'ui.bootstrap',
  'ui.calendar',
  'ngResource',
  'datatables',
  'datatables.tabletools',
  // 'stpa.morris',
  'ui.knob',
  'ngSanitize',
  'ui.select',
  'angularjs-dropdown-multiselect',
  'flang',
  'ngTable',
  'angularMoment',
  'angular-confirm', 
  'ngFileUpload',
  'angular.filter',
  'checklist-model',
  'sun.scrollable',
  'ngDialog',
  'pascalprecht.translate' ,
  'ng-nvd3',
  'ngWig',
  'tableSort',
  'uiGmapgoogle-maps',
  'multiStepForm'
]);

app.config(['$tooltipProvider', function($tooltipProvider){
    $tooltipProvider.setTriggers({
      'mouseenter': 'mouseleave',
      'click': 'click',
      'focus': 'blur',
      'never': 'mouseleave' // <- This ensures the tooltip will go away on mouseleave
    });
  }]);

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeBar = true;
  cfpLoadingBarProvider.includeSpinner = true;
  cfpLoadingBarProvider.latencyThreshold = 100;
}]);

app.constant('angularMomentConfig', {
    timezone: 'Poland'
});

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", {
      redirectTo:'/dasboard'
    })
    .when("/dasboard", {
      templateUrl: "views/dashboard.html", 
      controller: "mainCtrl", 
      title: 'Dashboard'/*,
            resolve: {
                arrivals: function(BookingService) {
                    return BookingService.$arrivals(new Date());
                },
                departures: function(BookingService) {
                    return BookingService.$departures(new Date());
                },
                pendingArrivals: function(BookingService) {
                    return BookingService.$pendingArrivals(new Date());
                },
                pendingDepartures: function(BookingService) {
                    return BookingService.$pendingDepartures(new Date());
                },
                summaryCheckInCheckOut: function(BookingService) {
                    return BookingService.$listCheckInCheckOut(new Date());
                },
                draftReservations: function(BookingService) {
                    return BookingService.$listDraftReservations();
                },
                todoList: function(TodoService) {
                    return TodoService.$list();
                }
            }*/
    })
    .when("/bookings/booking_list", {
      templateUrl: "views/booking_list.html", 
      title: 'Booking List'
    })
    .when("/customers", {
      templateUrl: "views/customers.html", 
      //controller: "mainCtrl", 
      title: 'Customers'
    })
    .when("/invoices", {
      templateUrl: "views/invoices.html", 
      controller: "invoicesCtrl", 
      title: 'Invoices',
            resolve: {
                countries: function(CompanyService) {
                    return CompanyService.$countries();
                },
                companyInfo: function(CompanyService) {
                    return CompanyService.$info();
                },
                transactionTypes: function(InvoiceService) {
                    return InvoiceService.$transactionTypes();
                },
                products: function(ProductService) {
                    return ProductService.$list();
                },
                invoice: function() {
                    return null;
                }
            }
    })
        .when("/invoices/:id", {
            templateUrl: "views/invoices.html",
            controller: "invoicesCtrl",
            title: 'Invoice',
            resolve: {
                countries: function(CompanyService) {
                    return CompanyService.$countries();
                },
                companyInfo: function(CompanyService) {
                    return CompanyService.$info();
                },
                transactionTypes: function(InvoiceService) {
                    return InvoiceService.$transactionTypes();
                },
                products: function(ProductService) {
                    return ProductService.$list();
                },
                invoice: function(InvoiceService, $route) {
                    return InvoiceService.$invoiceByBookingId($route.current.params.id);
                }
            }
        })
    .when("/bookings/create_booking", {
      templateUrl: "views/create_booking.html", 
      //controller: "mainCtrl", 
      title: 'Create Booking'
    })
    .when("/settings/properties_details", {
      templateUrl: "views/settings_properties_details.html", 
      //controller: "mainCtrl", 
      title: 'Settings-Properties'
    })
     .when("/settings/properties_notifications", {
      templateUrl: "views/settings_properties_notifications.html", 
      //controller: "mainCtrl", 
      title: 'Settings-Properties'
    })
     .when("/settings/properties_rooms", {
      templateUrl: "views/settings_properties_rooms.html", 
      //controller: "mainCtrl", 
      title: 'Settings-Properties'
    })
     .when("/settings/properties_rateplans", {
      templateUrl: "views/settings_properties_rateplans.html", 
      //controller: "mainCtrl", 
      title: 'Settings-Properties'
    })
     .when("/settings/properties_products", {
      templateUrl: "views/settings_properties_products.html", 
      //controller: "mainCtrl", 
      title: 'Settings-Properties'
    })

    .when("/settings/company_details", {
      templateUrl: "views/settings_company_details.html", 
      //controller: "mainCtrl", 
      title: 'Settings-Company'
    })
    .when("/settings/company_users", {
      templateUrl: "views/settings_company_users.html", 
      //controller: "mainCtrl", 
      title: 'Settings-Company'
    })
     .when("/settings/ibe", {
      templateUrl: "views/settings_ibe.html", 
      //controller: "mainCtrl", 
      title: 'Settings-IBE'
    })
        .when("/reporting", {
            templateUrl: "views/reporting.html",
            controller: "reportingCtrl",
            title: 'Reporting',
            resolve: {
                 allRoomTypes: function(ReportingService) {
                    var reports = ReportingService.reports({startDate: null, endDate: null}); 
                    return reports.$getRoomTypes();
                }
            }
        })
    .when("/error-404", {
      templateUrl: "views/error-404.html", 
      controller: "mainCtrl",
      title: 'Error 404'
    })
    .when("/about", {
      templateUrl: "views/about.html", 
      //controller: "mainCtrl", 
      title: 'About BHP'
    })
    .when("/support", {
      templateUrl: "views/support.html", 
      //controller: "mainCtrl", 
      title: 'Support BHP'
    })
    
    .when("/i18n", {
      templateUrl: "/i18n/" 
    })
    .when("/settings/wizard", {
      templateUrl: "views/settings_wizard.html", 
      //controller: "mainCtrl", 
      title: 'Settings-Wizard'
    })
    /*
    .when('/views/signin', {
              //controller: 'SigninController',
      redirectTo: 'views/signin.html'
         })
         */
    .otherwise({
      redirectTo:'/error-404'
    });
}]);

app.run(['$location', '$rootScope','$http', function($location, $rootScope, $http) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
     //   $rootScope.title = current.$$route.title;
        
        var languageset="en"; 
        if($rootScope.globals===undefined)
        {

        } 
        else 
        {
          if($rootScope.globals.selectedLanguage===undefined)
          {
            languageset="en";
            $rootScope.globals.selectedLanguage=languageset;
          } 
          else 
          {
            languageset=$rootScope.globals.selectedLanguage;
          }
        }
         
    });
}]); 
//...................
app.config(['$translateProvider' , function ($translateProvider ) {
  
  $translateProvider.useStaticFilesLoader({
      prefix: '/i18n/resources-locale_',
      suffix: '.js'
  });
  $translateProvider.preferredLanguage('en');
    // remember language
  $translateProvider.useLocalStorage();

}]);
//.....................

app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  });

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

app.config(function($sceDelegateProvider) {
$sceDelegateProvider.resourceUrlWhitelist([
  // Allow same origin resource loads.
  'self',
  // Allow loading from our assets domain.  Notice the difference between * and **.
  'https://bearcrs.nuevah.com/**']);
});

app.run(['$rootScope', '$injector', '$location', '$cookieStore', '$window','webConstants', function($rootScope, $injector, $location, $cookieStore, $window,webConstants) {
  var host =  webConstants.host ;
  if($rootScope.globals === undefined) {
    if(localStorage.getItem("globals") === null) {
      $rootScope.globals = {};
    } else {
      $rootScope.globals = JSON.parse(localStorage["globals"]);
    }
  }
  if($rootScope.countries === undefined) {
    if(localStorage.getItem("countries") === null) {
      $rootScope.countries = null;
    } else {
      $rootScope.countries = JSON.parse(localStorage["countries"]);
    }
  }

  var cookie = $cookieStore.get('credentials');
  if (cookie === undefined && $window.location.href.search("signin")==-1) {
     
    $window.location.href = '/signin.html';
  } else if (cookie) {

    if($rootScope.credentials === undefined) {
        $rootScope.credentials = {};
      }
    
  if($rootScope.credentials.currentUser === undefined) {
    $rootScope.credentials.currentUser = cookie.currentUser;
    }
  }
 
  if($rootScope.languages === undefined) {
    if(localStorage.getItem("languages") === null) {
      $rootScope.languages = null;
    } else {
      $rootScope.languages = JSON.parse(localStorage["languages"]);
    }
  }

  
  $rootScope.globals.serverUrl =  host; //"http://localhost:8880";
  
  $injector.get("$http").defaults.transformRequest = function(data, headersGetter) { 
    var cookie = $cookieStore.get('credentials');
     
   if (cookie === undefined && $window.location.href.search("signin")==-1) {
       
      $window.location.href = '/signin.html';
    } else if (cookie) {              
      
      if($rootScope.globals === undefined) {
        
        if(localStorage.getItem("globals") === null) {
          $rootScope.globals = {};
        } else {
          $rootScope.globals = JSON.parse(localStorage["globals"]);
        }
        
      }
      
      if($rootScope.credentials === undefined) {
            $rootScope.credentials = {};
          }
      
      if($rootScope.credentials.currentUser === undefined) {
        $rootScope.credentials.currentUser = cookie.currentUser;
      }
      
       
      
      
      
    }
    /*
     * wszystkie requesty do stronki sa autoryzowane przez cookie, jesli nie ma cookie to redirect na signin page
     * 
      $rootScope.globals = {};
          $cookieStore.remove('globals');
          $http.defaults.headers.common.Authorization = 'Basic ';
    */
  } 
}]);

