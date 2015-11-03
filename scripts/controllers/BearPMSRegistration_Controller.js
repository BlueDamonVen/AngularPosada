angular.module('BearPMSRegistration')
.controller('BearPMSRegistrationCtrl', function ($scope, $translate) {


	$scope.languageArray = ['en','de','es','fr','pl'];
	var selLang=$translate.proposedLanguage(); //see if there is a proposed language change
	if(selLang===undefined) selLang=$translate.use(); //if there is no change in progress see current language
	if(selLang===undefined) selLang="en"; //in case none of the above gets a response 

	$scope.selectedLanguage = selLang;  
	
	$scope.checkform=false;
	// $scope.isformvalid=false;

	// $scope.$watch('RegisterForm.$valid', function(newVal) {
        
 //    $scope.isformvalid=true;
 //    });

	$scope.RegistrationData = {
		Name: "",
		Email: "",
		CompanyName: "",
		PropertyName: "",
		AccetedTerms: 0
	};

	$scope.translatelabels = function(key){
	 	    $translate.use(key);

	 	    $scope.selectedLanguage = key;
		};

	$scope.register = function () {
		$scope.checkform=true;

		if($scope.RegisterForm.$valid) {
			alert("form valid");
		}

	};

});
