'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:ModalinstancectrlCtrl
 * @description
 * # ModalinstancectrlCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('modalInstanceCtrl', function ($scope, $rootScope, $http, $modalInstance, data, products, $q,webConstants) {
			$scope.countries = $rootScope.countries;
			var hostCallserver =webConstants.hostCallserver;
			$scope.products =products;
			$scope.foliolinesList = [];
			callserver(hostCallserver+"&object=FolioLine&method=List&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&FK_Folio="+data.id,function (response) {
					if (response.status == 'OK') {
						if(response.data.Status === undefined){
							if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
								for (var i in response.data) {
									$scope.foliolinesList.push({
										description: response.data[i].Description,
										unitPrice: Math.abs(Number(response.data[i].UnitPrice.replace(/[^0-9\.]+/g,""))),
										fkCurrency: response.data[i].FK_Currency,
										quantity: response.data[i].Quantity,
										totalPrice: response.data[i].TotalPrice,
										totalTaxes: response.data[i].TotalTaxes,
										totalRow: response.data[i].TotalRow,
										id: response.data[i].ID,
										date: response.data[i].TransactionDate,
										payment: !!response.data[i].IsPayment
									});
								}
							}
							$scope.updateTotal();
						} else {
							if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
								new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
								//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+"</p>","error","growl","slide").log();
							}
						}
					}
			},$http,$scope); 

		$scope.invoice = data;
		$scope.close = function() {
			$modalInstance.dismiss();
		}
		$scope.print = function() {
			window.print();
		}
		$scope.save = function() {
			var saved = true;
			var dataString = $.param({
				Company: data.companyName,
				Address1: data.address1,
				City: data.city,
				Country: data.country,
				PostalCode: data.postalCode,
				VAT_TaxNo: data.vatTaxNo,
				Name: data.guest,
				ID: data.id
			});
			var promise1 = callserver(hostCallserver+"&object=Folio&method=Update&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id+"&"+dataString,function (response) {
				if (response.status == 'OK') {
					if(response.data.Status === undefined){
					} else {
						if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
						}
					}	
					
					} else {
						if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
						}
					}

			},$http,$scope);
			//multipupdate
			var folioData = "";
			$scope.foliolinesList.forEach(function(v, i) {
					var d = {};
					id = v.id;
					if(typeof id !== 'undefined') {
						d["ID" + i] = id;	

					}
					d["UnitPrice" + i] = v.unitPrice;
					if(v.payment) {
						d["UnitPrice" + i] = -v.unitPrice;
					}
					d["Description" + i] = v.description;
					d["TaxPercentage" + i] = v.taxPercentage || 0;
					d["TaxAmount" + i] = v.taxAmount || 0;
					d["IsPayment" + i] = v.payment;
					d["Quantity" + i] = v.quantity;
					d["FK_Folio" + i] = data.id;
					d["TotalRow" + i] = v.totalRow;
					d["TransactionDate" + i] = moment(v.date, "DD/MM/YYYY").format("YYYY-MM-DD");
					folioData += "&" + $.param(d);

			});
			var promise2 = callserver(hostCallserver+"&object=FolioLine&method=MultiUpdate&token="+$rootScope.credentials.currentUser.token+"&SK_Property="+$rootScope.globals.fk_property.id+"&"+folioData,function (response) {
				if (response.status == 'OK') {
					if(response.data.Status === undefined){
					} else {
						if(response.data.Status == "OK") {
								new logger("<p>Data Saved</p>","notice","growl","slide").log();
						}
					}	
					
					} else {
						if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
							new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
						
							//new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data+"</p>","error","growl","slide").log();
						}
						saved = false;
					}

			},$http,$scope);
			$q.all(promise1, promise2).then(function() {
				$modalInstance.close();
			});
		};

		$scope.addRow = function (product) {
			product.quantity = 1;
			product.date = moment().format("YYYY-MM-DD");
			$scope.foliolinesList.push(product);
			$scope.updateTotal();
			$scope.product = undefined;
		}
		$scope.addPayment = function(method) {
			$scope.foliolinesList.push({
				quantity: 1,
				payment: true,
				unitPrice: 0,
				date: moment().format("YYYY-MM-DD"),
				description: "Payment " + method
			});
			$scope.paymentMethod = undefined;
			$scope.updateTotal();
		}
		$scope.$watch("foliolinesList.length", function(n, o) {
			//fTODO: find another solution
			if(o === 0) {
				return false;
			}
			setTimeout(function() {
				$(".invoice-items-wrapper").scrollTop($('.invoice-items').height() + 60);
			}, 10)
		})

		$scope.total = 0;
		$scope.credits = 0;

		$scope.updateTotal = function() {
			$scope.total = 0;
			$scope.credits = 0;
			for(var i = 0; i < $scope.foliolinesList.length; i++ ) {
				var folio = $scope.foliolinesList[i];
				if(folio.payment) {
					folio.credit = - folio.quantity * folio.unitPrice || 0;
					$scope.credits += parseInt(folio.credit);
				} else {
					folio.totalRow = folio.quantity * folio.unitPrice || 0;
					$scope.total += parseInt(folio.totalRow);
				}																
			}

			$scope.balance = parseInt($scope.total, 10) + parseInt($scope.credits);
			$scope.invoice.total = $scope.balance;
		}
		$scope.updateTotal();
		$scope.payments = ["Cash", "Credit card", "Other"]
	

  });
