var app = angular.module('bhpPasswordReset', [
  'ngRoute',
  'ngCookies'
]);

// app.config(['$routeProvider', function ($routeProvider) {
//   $routeProvider
//   .when("/token/:resettoken", {
//             templateUrl: "resetPW.html",
//             controller: "ResetPWCtrl"
            
//             })
//   .otherwise({
//       redirectTo:'/error-404'
//     });
// }]);
app.run(['$rootScope', function($rootScope) {

if($rootScope.globals===undefined){
  $rootScope.globals=[];
}

if($rootScope.globals.serverUrl===undefined){
  $rootScope.globals.serverURL="https://bearcrs.nuevah.com";
}


}]);

app.controller('ResetPWCtrl', function ($scope, $location) {
    
    //$scope.resettoken=$routeParams;
    //console.log($route.current.params);
    $scope.resettoken = $location.search().resettoken;
    $scope.password1="";
    $scope.password2="";


    $scope.runResetPW = function (password){

      new logger("Password: "+password,"notice","bar","slidetop").log();

    }

function callserver(message, callback, $http, $rootScope) {
    

    var url = $rootScope.globals.serverUrl+message;

    var response = {};
    

    return $http.jsonp(url)
      .then(function(data) {
        response.status = "OK";
        response.data=data.data;
        callback(response);
      }, function(data) {
        //new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Server Error - Please Refresh Page</p><p>Error: "+data.data+"</p>","error","growl","slide").log();
        
        new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
            
        response.status = "ERROR";
        response.data=data.data;
        callback(response);
      });
  
  
}

function logger(message, severity, type, effect) {
  
  if(type==='undefined' || type=="") { 
    this.type = "bar" 
  } else {
    this.type=type;
  }
  
  this.message=message;
  
  if(severity==='undefined' || severity=="") {
    this.severity = "error";
  } else {
    this.severity = severity;
  }
  
  if(effect==='undefined' || effect=="") {
    this.effect="slidetop";
  } else {
    this.effect = effect;
  }
  this.log = function () {
    
    
      // create the notification
    //'<span class="icon fa fa-bullhorn fa-2x"></span><p>You have some interesting news in your inbox. Go <a href="">check it out</a> now.</p>' 
    var notification = new NotificationFx({
        message : this.message,
        layout : this.type, //bar, attached, growl
        effect : this.effect, //scale, jelly, slide, 'slidetop'
        type : this.severity, // notice, warning or error
        onClose : function() {}
      });

      // show the notification
      notification.show();
      
    
    
  };
}

  });