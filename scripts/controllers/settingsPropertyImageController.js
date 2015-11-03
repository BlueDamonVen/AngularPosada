function settingsPropertyImagesCtrl ($scope, $rootScope, $http,webConstants) {
		
		  var hostCallserver =webConstants.hostCallserver;
		  var host = webConstants.host;
		  $scope.PropertyImages=[];
		  $scope.uploadUrl = host+"/gcs/bearcrsuploadimages?callback=callback&object=Property&method=AddImage&FK_Company="+$rootScope.globals.fk_property.fk_company+"&FK_Property="+$rootScope.globals.fk_property.id+"&fileextension=.png&token="+$rootScope.credentials.currentUser.token;
		  
		  
		  $scope.savePropertyImage = function() {
		  		var str = $.param($scope.property);
				callserver(hostCallserver+"&object=Property&method=Update&token="+$rootScope.credentials.currentUser.token+"&"+str,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
						} else {
							if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();

								$scope.$broadcast("reloadProperties");
							
							} else {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();								
							}
						}

						} else {
							if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
							}
						}
				},$http,$scope);
		  }
		  
		  $scope.reorder = function() {
			  
			  for (var i in $scope.PropertyImages) {
				  $scope.PropertyImages[i].OrderID=i+1;
			  }
			  
			  //call reorder on backend
			  
		  }

		  $scope.getPropertyImages = function () {
				callserver(hostCallserver+"&object=PropertyImages&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
								$scope.PropertyImages=[];
								for (var i in response.data) {
									$scope.PropertyImages.push(response.data[i]);
								}
								
							}

						} else {
							if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
							}
						}
						
						
					}
				
				},$http,$scope);   

			} 

		  $scope.getPropertyImages();
		  
		  
		  $scope.removePropertyImages = function(idx,data) {
			  
		  		
				callserver(hostCallserver+"&object=PropertyImages&method=Delete&token="+$rootScope.credentials.currentUser.token+"&ID="+data.ID+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();							
						} else {
							if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
								
								$scope.PropertyImages.splice(findid($scope.PropertyImages,data.ID),1);
								
							} else {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();								
							}
						}

						} else {
							if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
							}
						}
				},$http,$scope);
		  }
		  
		  
	}

	angular
	.module('bearpms3App')
	.controller('settingsPropertyImagesCtrl', settingsPropertyImagesCtrl);