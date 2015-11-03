'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:InvoicesCtrl
 * @description
 * # InvoicesCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('invoicesCtrl', function  ($scope, $rootScope, $http, $window,  BookingService, InvoiceService, countries, companyInfo, transactionTypes, products, invoice,$location,ngDialog, DTOptionsBuilder, DTColumnDefBuilder, $translate, $uibModal) {
        
        $scope.percentageTypes = [{
                "label": "Absolute",
                "value": 0
            },{
                "label": "Percentage",
                "value": 1
            }];
        
        $scope.checkoutPopup= false;
             //....seting roles
        $scope.rightValue =false;
        $scope.rightValue2=false;
        $scope.rightsValues = $rootScope.globals.fk_rightsResponse;
        if($scope.rightsValues.data[0].Folio === 1 )
            $scope.rightValue=true;
        if($scope.rightsValues.data[0].Folio === 2 )
            $scope.rightValue2=true;
        //....seting roles ends


        $scope.dateformat = "dd/MM/yyyy";

        //.................. booking listdatatable code

    //$scope.dtInstance={};

     //.... watching the lang change
    $rootScope.$on('$translateChangeSuccess', function () {
        $scope.vm();
        //$scope.refresh();
        //$scope.dtInstance.rerender();

        InvoiceService.$transactionTypes()
        .then(function(response) {
        $scope.transactionTypes = response;         
        }, function(error) {

        });

    });


    //.................vm 

    $scope.vm = function()
    {     
        var trans=[];

        trans=$translate.instant(['TABLE_SEARCH_PLACEHOLDER','TABLE_EMPTY','TABLE_LOADING','TABLE_PROCESSING','TABLE_ZERO_RECORDS', 'TABLE_COPY', 'TABLE_FIRST', 'TABLE_LAST', 'TABLE_NEXT', 'TABLE_PREVIOUS', 'PDF_MESSAGE']);

        if($scope.dtOptions===undefined) 
            $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withDOM('T<"clearfix"f>t<"bottom"rp>')
            .withTableTools('/swf/copy_csv_xls_pdf.swf')
            .withOption('responsive', true);
           
        
        $scope.dtOptions
        .withLanguage({
                'sSearch' : "",
                "searchPlaceholder": trans.TABLE_SEARCH_PLACEHOLDER,
                "sEmptyTable":     trans.TABLE_EMPTY,
                "sLoadingRecords": trans.TABLE_LOADING,
                "sProcessing":     trans.TABLE_PROCESSING,
                "sZeroRecords":   trans.TABLE_ZERO_RECORDS,
                "paginate": {
                            "first":      trans.TABLE_FIRST,
                            "last":       trans.TABLE_LAST,
                            "next":       trans.TABLE_NEXT,
                            "previous":   trans.TABLE_PREVIOUS
                        }
                    }) 
        .withTableToolsButtons([
            {
                "sExtends": "copy",
                "sButtonText": trans.TABLE_COPY,
                "mColumns": [ 0, 1, 2, 3, 4, 5, 6, 7 ],
            },
            {
                "sExtends": "csv",
                "mColumns": [ 0, 1, 2, 3, 4, 5, 6, 7 ],
            },
            {
                "sExtends": "xls",
                "mColumns": [ 0, 1, 2, 3, 4, 5, 6, 7 ],
            }, 
            {
                "sExtends": "pdf",
                "sPdfOrientation": "landscape",
                "mColumns": [ 0, 1, 2, 3, 4, 5, 6, 7 ],
                "sPdfMessage": trans.PDF_MESSAGE
            }
        ]);;
        
        
            
        
        // $scope.dtColumnDefs = [
        //     DTColumnDefBuilder.newColumnDef(0),
        //     DTColumnDefBuilder.newColumnDef(1),
        //     DTColumnDefBuilder.newColumnDef(2),
        //     DTColumnDefBuilder.newColumnDef(3),
        //     DTColumnDefBuilder.newColumnDef(4),
        //     DTColumnDefBuilder.newColumnDef(5),
        //     DTColumnDefBuilder.newColumnDef(6).notSortable(),
        //     DTColumnDefBuilder.newColumnDef(7),
        //     DTColumnDefBuilder.newColumnDef(8),
        // ];
    }
 $scope.vm ();
         
        //...................... booking listdatatable code end
        $scope.getPercentageTypeLabel = function(value) {
            if (value == 0) {
                return "Absolute";
            }
            else {
                return "Percentage";
            }
        }
        
        $scope.getCountryFromCode = function(code) {
            var c = "";
            $scope.countries.forEach(function(country) {
                if (country.id === code) {
                    c = country.value;
                }
            });
            return c;
        };
        
		$scope.invoices = [];
        $scope.selectedInvoices = [];
        $scope.selectedInvoice = null;

        $scope.dateFrom = moment().startOf("month");
                $scope.dateTo = moment().endOf("month");
         
        
        $scope.countries = countries;
        $scope.company = companyInfo;
        $scope.transactionTypes = transactionTypes;
        $scope.products = products;
        




        $scope.totals = {
            sub_total: 0,
            tax: 0,
            total: 0,
            payments: 0,
            balance: 0,
            currency: ""
        };

        //....
        $scope.pdfLinkPrint = function(index) {
            $scope.invoiceToPrint = $scope.selectedInvoice; 
            console.log("pdfLinkPrint");
            $scope.printPdfLink =InvoiceService.$pdfLink($scope.invoiceToPrint.ID);
            $window.open($scope.printPdfLink, '_blank');
          
        }

         $scope.pdfLinkPrintIndex = function(index) { 
            console.log("pdfLinkPrintIndex");
            var invoice = $scope.selectedInvoices[index];  
            $scope.printPdfLinkInd  =InvoiceService.$pdfLink(invoice.ID);
             $window.open($scope.printPdfLinkInd, '_blank');
          
        }
      /* $scope.$on('ngDialog.opened', function (event, $dialog) {
        $dialog.find('.ngdialog-content').css('width', '80%','background-color','white');
      });*/
        //...
        $scope.pdfLink = function(index) {// change its name
       
            var invoice = $scope.selectedInvoices[index];   
            if(invoice.ID)
            $scope.downloadPdf = InvoiceService.$pdfLinkD(invoice.ID);
            console.log("invoice : ",$scope.downloadPdf);
            $window.open($scope.downloadPdf);
            //return  $scope.downloadPdf;
        }
        
		$scope.update = function (pickedDateFrom,pickedDateTo) {
             
			if (pickedDateFrom === undefined || pickedDateTo === undefined) {
                if($scope.dateFrom === undefined || $scope.dateTo === undefined) {
				$scope.dateFrom = moment().startOf("month");
				$scope.dateTo = moment().endOf("month");
            }
			}
			else {
				if($scope.dateFrom.diff(moment(pickedDateFrom), 'days') > 0) {
					$scope.dateFrom = moment(pickedDateFrom);
				}
				if (moment(pickedDateTo).diff($scope.dateTo, 'days') > 0) {
					$scope.dateTo = moment(pickedDateTo);
				}
			}
            
		
            
            InvoiceService.$list($scope.dateFrom, $scope.dateTo)
            .then(function(invoices) {
               
                if(Object.prototype.toString.call(invoices) === '[object Array]' ) {
                        $scope.invoices = [];
                        $scope.selectedInvoices = [];
                        $scope.selectedInvoice = null;

                    invoices.forEach(function(invoice) {
                        
                        if(invoice.Company==='null')
                            invoice.Company='';
                        $scope.invoices.push({
                            invoiceNo: invoice.InvoiceNumber,
                            roomNo: invoice.RoomNo,
                            guest: invoice.Name.replace(/([A-Z])/g, ' $1'),
                            companyName: invoice.Company,
                            total: invoice.TotalPrice,
                            totalFolio: invoice.TotalFolio,
                            createdOn: convertDateToDash(invoice.DateCreated),
                            checkInDate: convertDateToDash(invoice.DateFrom),
                            checkOutDate: convertDateToDash(invoice.DateTo),
                            address1: invoice.Address1,
                            city: invoice.City,
                            postalCode: invoice.PostalCode,
                            country: invoice.Country,
                            vatTaxNo: invoice.VAT_TaxNo,
                            ID: invoice.ID,
                            bookingId: invoice.FK_Booking,
                            IsInvoice: invoice.IsInvoice
                        });
                    });
                    
                    $scope.selectedInvoices = angular.copy($scope.invoices);
                    //vm.selectedInvoices=$scope.selectedInvoices;
                    //$scope.dtInstance.rerender();
                    
                }
                
        
            }, function(error) {
                
            });
		};

        //$scope.update();
        
        $scope.changeAddress = function(invoice) {
            InvoiceService.$changeAddress(invoice) 
            .then(function(resonse) {
                
        }, function(error) {
            });
        };
        
        $scope.addItemLine = function(product) {
            var item = {
                Description: "",
                FK_Currency: $scope.selectedInvoice.items[0].FK_Currency,
                FK_Folio: $scope.selectedInvoice.ID,
                FK_TransactionType: 1,
                Quantity: 1,
                TaxPercentage: 0,
                TaxAmount: 0,
                TransactionDate: new Date(),
                UnitPrice: 0,
                TaxEditable: true
            }
            if (product) {
                item.Description = product.Description;
                item.FK_Currency = product.FK_Currency;
                item.Quantity = 1;
                item.TaxPercentage = product.TaxPercentage;
                item.TaxAmount = product.TaxAmount;
                item.UnitPrice = Math.round(product.UnitPrice * 100)/100;
                item.TaxEditable = false;
            }
            $scope.selectedInvoice.items.push(item);
        };
        
        $scope.addPaymentLine = function(paymentType) {
            var item = {
                Description: paymentType.Description,
                FK_Currency: $scope.selectedInvoice.items[0].FK_Currency,
                FK_Folio: $scope.selectedInvoice.ID,
                FK_TransactionType: 2,
                Quantity: 1,
                TaxPercentage: 0,
                TaxAmount: 0,
                TransactionDate: new Date(),
                UnitPrice: 0,
                TaxEditable: false
            }
            $scope.selectedInvoice.items.push(item);
        }
        
        $scope.saveLineItem = function(lineItem) {
            if (lineItem.ID) {
                InvoiceService.$updateFolioLineItem(lineItem.FK_Folio,lineItem, $scope.formatDate2)
                .then(function(response) {
                }, function(error) {
                });
            }
            else {
                InvoiceService.$insertFolioLineItem(lineItem.FK_Folio,lineItem, $scope.formatDate2)
                .then(function(response) {
                    lineItem.ID = response.ID;
                }, function(error) {
                });
            }
        }
        
        $scope.makePaymentNegative = function(lineItem) {
            lineItem.UnitPrice = (lineItem.UnitPrice > 0 ? lineItem.UnitPrice * -1 : lineItem.UnitPrice);
            $scope.saveLineItem(lineItem);
        }
        
        $scope.formatDate = function(date) {
            return convertDateToDash(date);
        }
        
        $scope.formatDate2 = function(date) {
            return convertDate(date);
        }
        
        $scope.productChanged = function(lineItem, product) {
            lineItem.Description = product.Description;
            lineItem.FK_Currency = product.FK_Currency;
            lineItem.UnitPrice = product.UnitPrice;
            lineItem.TaxPercentage = product.TaxPercentage;
            lineItem.TaxAmount = product.TaxAmount;
            $scope.saveLineItem(lineItem);
        }
        
        $scope.lineItemTax = function(lineItem) {
            if (lineItem.TaxPercentage == 0) {
                return lineItem.Quantity * lineItem.TaxAmount;
            }
            else {
                return (lineItem.UnitPrice * lineItem.Quantity) * (lineItem.TaxAmount / 100) 
            }
        }
        
        $scope.lineItemTotal = function(lineItem) {
            var sub_total = lineItem.UnitPrice * lineItem.Quantity;
            var tax = $scope.lineItemTax(lineItem);
            return sub_total + tax;
        }
        
        $scope.invoiceTotals = function(invoice) {
          //  alert("usama");
            var invoice_sub_total = 0;
            var invoice_tax = 0;
            var invoice_total = 0;
            var invoice_payments = 0;
            var invoice_currency = "";
            var i=0;
            var k=0;
            var Transac98=0;
            if (invoice && invoice.items) {
                invoice.items.forEach(function(lineItem) {

                    var line_sub_total = lineItem.UnitPrice * lineItem.Quantity;
                    invoice_currency = lineItem.FK_Currency;
                    var line_tax = $scope.lineItemTax(lineItem);
                    var line_total = line_sub_total + line_tax;
                if(lineItem.FK_TransactionType == 99 || lineItem.FK_TransactionType == 1 || lineItem.FK_TransactionType == 98 )
                {
                    if (lineItem.FK_TransactionType == 1) {
                        invoice_sub_total += line_sub_total;
                        invoice_tax += line_tax;
                        invoice_total += line_total;
                    }
                    
                    if (lineItem.FK_TransactionType == 98) {


                        if(i===0)
                        {
                            invoice_tax += 98;  
                        }
                        i++; 
                        //invoice_sub_total = invoice_sub_total - line_sub_total; 
                        invoice_tax += line_tax;
                        invoice_total += line_total;
                    }
                    if (lineItem.FK_TransactionType == 99) {
                        if(k===0)
                        {
                            invoice_sub_total += 99; 
                        }
                        k++;

                        invoice_sub_total += line_sub_total;
                        invoice_tax += line_tax;
                        invoice_total += line_total;
                    }
                }
                    else {
                        invoice_payments += line_total;
                    }
                   
                });
                  
            }
            return {
                sub_total: invoice_sub_total,
                tax: invoice_tax,
                total: invoice_total,
                payments: invoice_payments,
                balance: invoice_total + invoice_payments,
                currency : invoice_currency
            }
        };
        
        $scope.checkIn = function(bookingId) {

            BookingService.$checkInConfirm(bookingId)
                .then(function(response) {
                    if(response) {
                        
                        $scope.selectedBooking.FK_BookingStatus = 2;
                        
                    }
                }, function(error) {
                    //reloadCalender();
                    //new errorLogger(error.message).log();
                });



            //  $('#myModal')
            // .modal({ backdrop: 'static', keyboard: false })
            // .one('click', '#ok', function(e) {
            //     BookingService.$checkIn(bookingId)
            //     .then(function(response) {
            //         $scope.selectedBooking.FK_BookingStatus = 2;
            //     }, function(error) {
            //         new errorLogger(error.message).log();
            //     });
            // });
        }
        
        $scope.checkOut = function(bookingId) {
            /* $('#myModalOut')
            .modal({ backdrop: 'static', keyboard: false })
            .one('click', '#ok', function(e) {*/
                    BookingService.$checkOutConfirm(bookingId)
                    .then(function(response) {
                        //console.log("response : ",response);
                        if(response) {
                            $scope.selectedBooking.FK_BookingStatus = 3;
                            $scope.checkoutPopup= false;
                            $scope.selectedBooking.IsInvoice=true;
                        }
                    }, function(error) {
                        //console.log("usama");
                        new errorLogger(error.message).log();
                    });
           // });
        }
        
        $scope.$watch("selectedInvoice", function(selectedInvoice) {
            $scope.totals = $scope.invoiceTotals(selectedInvoice);
        }, true);
        

        $scope.refresh = function () {

            $scope.update(); 
            $scope.selectedInvoice = null;
            $scope.selectedInvoices = null; 
            $scope.selectedInvoices = angular.copy($scope.invoices);
        }

        $scope.open = function (invoice) {
            if ($scope.selectedInvoice) {
                  
                $scope.update(); 
                $scope.selectedInvoice = null;
                $scope.selectedInvoices = null; 
                $scope.selectedInvoices = angular.copy($scope.invoices);
                 
                
            }
            else { 
                invoice.items = [];
                InvoiceService.$folioLineItems(invoice.ID)
                .then(function(items) {
                    $scope.selectedInvoice = invoice;
                    items.forEach(function(item) {
                        item.UnitPrice = Math.round(item.UnitPrice * 100)/100;
                        item.TransactionDate = moment(item.TransactionDate).toDate();
                        //console.log(moment(item.TransactionDate).isValid());
                    });
                    $scope.selectedInvoice.items = items;
                    
                    $scope.selectedInvoices = [invoice];
                }, function(error) {
                    invoice.items = [];
                });
                var tempid;
                if(invoice.bookingId===undefined) {
                    tempid=invoice.FK_Booking;
                } else {
                    tempid=invoice.bookingId;
                }

                BookingService.$detail(tempid)
                .then(function(booking) {
                    
                    $scope.selectedBooking = booking;
                }, function(error) {
                    $scope.selectedBooking = null;
                });
            }
		};
        
    //
    $scope.deleteInvoiceRecord =function(index,item)
    {

        //  $('#deletePopup')
        // .modal({ backdrop: 'static', keyboard: false })
        // .one('click', '#ok', function(e) {

        //     $scope.selectedInvoice.items.splice(index,1); 
        //     InvoiceService.$deleteInvoiceRecord(item.ID); 

        // });

        $uibModal.open({
            templateUrl: "views/confirmationModal.html",
            controller: function($scope, $modalInstance, links, index, item) {
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.ok = function() {
                        links.selectedInvoice.items.splice(index,1); 
                        InvoiceService.$deleteInvoiceRecord(item.ID); 
                        $modalInstance.close();
                    };

                var trans=$translate.instant(['INVOICE_MODAL_CONFIRM_DELETE_FOLIOLINE_TITLE','INVOICES_MODAL_CONFIRM_DELETE_FOLIOLINE']);
                $scope.confirmationtext=trans.INVOICES_MODAL_CONFIRM_DELETE_FOLIOLINE;
                $scope.headertext=trans.INVOICE_MODAL_CONFIRM_DELETE_FOLIOLINE_TITLE;


            },
            resolve: {
                links: function () { return $scope; },
                index: function () { return index; },
                item: function () { return item; }
            }
            
        });


 
    }
    $scope.checkOutPopUp = function(selectedBooking,balance,invoiceID)
    {
        //console.log("usamain popup checkOut : ",balance);
        if(balance===0)
        { 
           
            // $('#checkoutGuest')
            // .modal({ backdrop: 'static', keyboard: false })
            // .one('click', '#ok', function(e) {
            //
                $scope.checkOut(selectedBooking);
                
                $scope.selectedInvoice = null;
                $scope.selectedInvoices = null; 
                $scope.selectedInvoices = angular.copy($scope.invoices);

                $scope.selectedInvoices[findid($scope.selectedInvoices,invoiceID)].IsInvoice=true;
                

            //
            //});
          
        }
        else
        {


            $uibModal.open({
                templateUrl: "views/confirmationModal.html",
                controller: function($scope, $modalInstance, links) {
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };

                        $scope.ok = function() {

                            BookingService.$checkOut(selectedBooking)
                            .then(function(response) {


                                links.selectedInvoice = null;
                                links.selectedInvoices = null; 
                                links.selectedInvoices = angular.copy(links.invoices);

                                links.selectedInvoices[findid(links.selectedInvoices,invoiceID)].IsInvoice=true;
                                //links.update();
                                $modalInstance.close();
                             
                            }, function(error) {
               
                            });
                            
                            //ok=true;
                            //deferred.resolve(ok);
                            
                        };

                    var trans=$translate.instant(['INVOICES_CHECK_OUT','INVOICES_BALANCE_NOT_0_CONFIRMATION_MESSAGE']);
                    $scope.confirmationtext=trans.INVOICES_BALANCE_NOT_0_CONFIRMATION_MESSAGE;
                    $scope.headertext=trans.INVOICES_CHECK_OUT;


                },
                resolve: {
                    links: function () {
                        return $scope;
                    }
                }
                
            });


                
              

        }
    }



        if (invoice) {
            invoice=invoice[0];
            //$scope.invoices = invoice;
           // $scope.selectedInvoices = invoice;
            //$scope.selectedInvoice = invoice[0];
                if(invoice.Company==='null')
                    invoice.Company='';

                var tempinvoice=
                {
                    invoiceNo: invoice.InvoiceNumber,
                    roomNo: invoice.RoomNo,
                    guest: invoice.Name.replace(/([A-Z])/g, ' $1'),
                    companyName: invoice.Company,
                    total: invoice.TotalPrice,
                    totalFolio: invoice.TotalFolio,
                    createdOn: convertDateToDash(invoice.DateCreated),
                    checkInDate: convertDateToDash(invoice.DateFrom),
                    checkOutDate: convertDateToDash(invoice.DateTo),
                    address1: invoice.Address1,
                    city: invoice.City,
                    postalCode: invoice.PostalCode,
                    country: invoice.Country,
                    vatTaxNo: invoice.VAT_TaxNo,
                    ID: invoice.ID,
                    bookingId: invoice.FK_Booking,
                    IsInvoice: invoice.IsInvoice
                };


            $scope.open(tempinvoice);
        } else {
            $scope.update();
        }

    
  });
