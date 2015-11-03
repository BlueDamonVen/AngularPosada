(function() {
    'use strict';
    angular
        .module('bearpms3App')
        .controller('rateplanOptionsModal',rateplanOptionsModal);
        
        rateplanOptionsModal.$inject = ["$rootScope","$scope","$http","$modalInstance","data","langTransService","RatePlanConditionsTypeServices","LangServices","langs"];

		function rateplanOptionsModal ($rootScope, $scope, $http, $modalInstance, data, langTransService, RatePlanConditionsTypeServices, langs){
			/* jshint validthis: true */
			var vm = this;
			
			vm.langs = langs.langs;
			vm.descriptions = [];
			vm.addDescription = addDescription;
			vm.deleteDescription = deleteDescription;
			vm.saveDescription = saveDescription;
			vm.ok = ok;
			
			init()
					
			function init() {
				if (data.ID!=-1){
					RatePlanConditionsTypeServices.$listRatePlanConditionsDescription(data.ID)
						.then(function(response) {
							if(response) {
								vm.descriptions = response;
								for (var indexL in vm.langs) {
									for (var indexD in vm.descriptions) {
										if(vm.descriptions[indexD].LangCode == vm.langs[indexL]){
											vm.langs.splice(indexL,1);
										}
									}
								}
							}
						}, 
						function(error) {
							console.log(error);
						});
				}else{
					vm.descriptions.push({
						ID: -1,
						LangCode: langTransService.getSelectedLanguage(),
						Description: ''
					});
					vm.langs.splice(0,1);					
				}
			}

			function addDescription(lang) {
				vm.descriptions.push({
					ID: -1,
					LangCode: lang,
					Description: ''
				});
				vm.langs.splice(vm.langs.indexOf(lang),1);
			}

			function deleteDescription(description){
				var index=findid(vm.descriptions,description.ID);
				if(description.ID!=-1){
					RatePlanConditionsTypeServices.$deleteRatePlanConditionsDescription(description.ID)
						.then(function(response) {
							if(response) {
								if (response.Status == 'OK') {
									new logger("<p>Data Saved</p>","notice","growl","slide").log();
									vm.descriptions.splice(index,1);
									vm.langs.push(description.LangCode);
								}else{
									if(typeof(response.ErrorNumber) != "undefined" && responsea.ErrorNumber != "1010" ) {
										new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
									}
								}									
							}
						}, 
						function(error) {
							console.log(error);
						});		
				}else{
					vm.descriptions.splice(index,1);
					vm.langs.push(description.LangCode);
				}							
			}										

			function saveDescription(description){
				if(data.ID!=-1){
					if(description.ID!=-1){
						RatePlanConditionsTypeServices.$updateRatePlanConditionsDescription(description.ID,description.Description,description.LangCode)
							.then(function(response) {
								if(response) {
									if (response.Status == 'OK') {
										new logger("<p>Data Saved</p>","notice","growl","slide").log();
										if (description.LangCode == langTransService.getSelectedLanguage()){
											data.Description = description.Description;
										}
									}else{
										if(typeof(response.ErrorNumber) != "undefined" && responsea.ErrorNumber != "1010" ) {
											new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
										}
									}									
								}
							}, 
							function(error) {
								console.log(error);
							});							
					}else{
						var exists = false;
						vm.descriptions.forEach(function(de) {
							if(de.LangCode == description.LangCode && description.ID!=-1) {
								exists = true;
							}
						});
						if (!exists){	
							RatePlanConditionsTypeServices.$InsertRatePlanConditionsDescription(description.Description,description.LangCode,data.ID)
								.then(function(response) {
									if(response) {
										if (response.Status == 'OK') {
											new logger("<p>Data Saved</p>","notice","growl","slide").log();
											description.ID = response.ID;
										}else{
											new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
										}
									}
								}, 
								function(error) {
									console.log(error);
								});									
						}else{
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: Language Repeated </p>","error","growl","slide").log();										
						}
					}
				}else{
					RatePlanConditionsTypeServices.$InsertRatePlanConditionsType(description.Description,description.LangCode,data.Group,data.Icon)
						.then(function(response) {
							if(response) {
								if (response.Status == 'OK') {
									new logger("<p>Data Saved</p>","notice","growl","slide").log();
									data.ID = response.ID;
									data.Description = description.Description;
								}else{
									new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
								}
							}
						}, 
						function(error) {
							console.log(error);
						});	
				}
			}

			function ok() {
				$modalInstance.close();
				console.log(langs);
			};
		}
})();					