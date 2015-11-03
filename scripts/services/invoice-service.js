angular
	.module('bearpms3App')
    .factory('InvoiceService', function($rootScope, $http, $q,langTransService,webConstants) {
        var hostCallserver =webConstants.hostCallserver;
         var host=webConstants.host;
        return {
            $transactionTypes: function() {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "FolioTransactionType" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&LangCode="+ langTransService.getSelectedLanguage();
                var deferred = $q.defer();
                console.log(url);
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $list: function(startDate, endDate) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Folio" +
                    "&method=" + "List" +
                    "&withstays=" + "1" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&DateFrom=" + startDate.format("YYYY-MM-DD") +
                    "&DateTo=" + endDate.format("YYYY-MM-DD");
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $invoiceByBookingId: function(bookingId) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Folio" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&FK_Booking=" + bookingId;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $changeAddress: function(folio) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Folio" +
                    "&method=" + "Update" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&Company=" + folio.companyName +
                    "&Name=" + folio.guest + 
                    "&Address1=" + folio.address1 +
                    "&City=" + folio.city +
                    "&PostalCode=" + folio.postalCode +
                    "&Country=" + folio.country +
                    "&VAT_TaxNo=" + folio.vatTaxNo +
                    "&ID=" + folio.ID;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $folioLineItems: function(folioId) {
                var url = $rootScope.globals.serverUrl+hostCallserver+
                    "&object=" + "FolioLine" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&FK_Folio=" + folioId;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $insertFolioLineItem: function(folioId, lineItem, formatFunc) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "FolioLine" +
                    "&method=" + "Insert" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&FK_Folio=" + folioId + 
                    "&Description=" + lineItem.Description +
                    "&UnitPrice=" + lineItem.UnitPrice + 
                    "&FK_Currency=" + lineItem.FK_Currency +
                    "&TaxPercentage=" + lineItem.TaxPercentage +
                    "&TaxAmount=" + lineItem.TaxAmount +
                    "&FK_TransactionType=" + lineItem.FK_TransactionType +
                    "&TransactionDate=" + formatFunc(lineItem.TransactionDate) +
                    "&Quantity=" + lineItem.Quantity;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $updateFolioLineItem: function(folioId, lineItem, formatFunc) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "FolioLine" +
                    "&method=" + "Update" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&SK_Property=" + $rootScope.globals.fk_property.id +
                    "&FK_Folio=" + folioId + 
                    "&ID=" + lineItem.ID +
                    "&Description=" + lineItem.Description +
                    "&UnitPrice=" + lineItem.UnitPrice + 
                    "&FK_Currency=" + lineItem.FK_Currency +
                    "&TaxPercentage=" + lineItem.TaxPercentage +
                    "&TaxAmount=" + lineItem.TaxAmount +
                    "&FK_TransactionType=" + lineItem.FK_TransactionType +
                    "&TransactionDate=" + formatFunc(lineItem.TransactionDate) +
                    "&Quantity=" + lineItem.Quantity;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $pdfLink: function(invoiceId) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Folio" +
                    "&method=" + "GeneratePDF" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&ID=" + invoiceId;
                return url;
            },
             $pdfLinkD: function(invoiceId) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Folio" +
                    "&method=" + "GeneratePDF" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&ID=" + invoiceId +
                    "&Download=" + 1 ;
                return url;
            },
            $generatePDF: function(invoiceId) {
                 var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Folio" +
                    "&method=" + "GeneratePDF" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&ID=" + invoiceId;
                var deferred = $q.defer();
                $http.jsonp(url, {
                    responseType: "arraybuffer"
                })
                .success(function(response) {
                    
                    
                    var file = new Blob([response], {type: 'octet/stream'});
                    var fileURL = URL.createObjectURL(file);
                    deferred.resolve(fileURL);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
             $deleteInvoiceRecord :function(item)
            { 
                
                 
                 var url = $rootScope.globals.serverUrl+hostCallserver +
                 "&object=FolioLine&method=Delete&token="+$rootScope.credentials.currentUser.token+
                 "&FK_Property="+$rootScope.globals.fk_property.id+
                 "&ID="+item; 
                $http.jsonp(url);

                 
            }

            //...............
        };
    });
