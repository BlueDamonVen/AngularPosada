function testCtrl($scope, $http,  $rootScope) {

$scope.luis="";
$scope.response="";


$scope.callservertest = function (message) {
		
		


	/*	var url = $rootScope.globals.serverUrl+message;

		///bearcrsl?callback=JSON_CALLBACK&object=Login&method=Login&Email="+username+"&Password="+password;
		
		//var response = {};
		
		$http.jsonp(url)
			.then(function(data) {
				$scope.response=data.data;
			}, function(data) {
				$scope.response=data.data;
			});*/

		callserver(message,function (response) {
				$scope.response=response.data; 

				if (response.status == 'OK') { 
				
				if(response.data.Status === undefined){
				 	
				} else {

				if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
					new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
					//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" " + response.data.ErrorMessage + " </p>","error","growl","slide").log();
				}

				}
				
				
				}
			
			},$http,$scope); 
	
}

}


angular
	.module('bearpms3App')
	.controller('testCtrl', testCtrl);