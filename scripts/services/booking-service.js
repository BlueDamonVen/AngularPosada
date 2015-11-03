angular
	.module('bearpms3App')
    .factory('BookingService', function($rootScope, $http, $q,webConstants, $uibModal, $translate, moment) {
       var hostCallserver =webConstants.hostCallserver;
        function formatDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
	       var d = new Date(inputFormat);
	       return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
        };


        function openBookingModal(booking, datefrom, dateto, room, adults) {
       var deferred = $q.defer();
        var modalInstance = $uibModal.open({
            templateUrl: "views/booking-modal2.html",
            controller: "BookingModalCtrl2",
            windowClass: "small-modal",
            resolve: {
                booking: function() {
                  if(booking===undefined) {
                    return undefined;
                  } else {
                    if(booking.ID===undefined) {
                      return undefined;
                    } else {
                      return booking;
                    }
                  }
                },
                dates: function () {
                  return {
                    dateFrom: datefrom,
                    dateTo: dateto
                  };
                },
                room: function () {
                  return room;
                },
                adults: function () {
                  return adults;
                }
            }
        });

        modalInstance.result.then(function (data) {
            deferred.resolve(data);
          }, function (data) {
              $rootScope.$emit('refresh', true);
              deferred.resolve(data);
        });

        return deferred.promise;

    };
    
        return {
            $detail: function(bookingId) {
                    
                    
                    var url = $rootScope.globals.serverUrl+hostCallserver +
                         "&object=" + "Booking" +
                        "&method=" + "Detail" +
                        "&token=" + $rootScope.credentials.currentUser.token + 
                        "&ID=" + bookingId +
                        "&FK_Property=" + $rootScope.globals.fk_property.id;
                    var deferred = $q.defer();
                    $http.jsonp(url)
                    .success(function(response) {
                        
                        if (response.ErrorNumber!==undefined) {
                            deferred.reject({
                                code: response.ErrorNumber,
                                message: response.ErrorMessage
                            });
                        }
                        else {
                            deferred.resolve(response[0]);
                        }
                    })
                    .error(function(response) {
                        deferred.reject({
                            code: response.ErrorNumber,
                            message: response.ErrorMessage
                        });
                    });
                    return deferred.promise;
                 
            },
            $listbydates: function(datefrom, dateto) {
                    var deferred = $q.defer();
                    
                    if(datefrom===undefined || dateto === undefined) {
                        return deferred.reject("Invalid date");
                    }

                    var df=moment(datefrom);
                    var dt=moment(dateto);
                    if(df==="Invalid date" || dt === "Invalid date"){
                        return deferred.reject("Invalid date");   
                    }

                    var url = $rootScope.globals.serverUrl+hostCallserver +
                         "&object=" + "Booking" +
                        "&method=" + "ListbyDates" +
                        "&token=" + $rootScope.credentials.currentUser.token + 
                        "&DateFrom=" + df.format("YYYY-MM-DD") +
                        "&DateTo=" + dt.format("YYYY-MM-DD") +
                        "&FK_Property=" + $rootScope.globals.fk_property.id +
                        "&withbookingcustomer=1";
                    
                    $http.jsonp(url)
                    .success(function(response) {
                        
                        if (response.ErrorNumber!==undefined) {
                            deferred.reject({
                                code: response.ErrorNumber,
                                message: response.ErrorMessage
                            });
                        }
                        else {
                            for(var i=0;i<response.length;i++){
                                response[i].DateFrom=moment(response[i].DateFrom);
                                response[i].DateTo=moment(response[i].DateTo);
                            }
                            deferred.resolve(response);
                        }
                    })
                    .error(function(response) {
                        deferred.reject({
                            code: response.ErrorNumber,
                            message: response.ErrorMessage
                        });
                    });
                    return deferred.promise;
                 
            },
            $search: function(criteria) {
                    var deferred = $q.defer();
                    
                    var url = $rootScope.globals.serverUrl+hostCallserver +
                        "&object=" + "Booking" +
                        "&method=" + "Search" +
                        "&token=" + $rootScope.credentials.currentUser.token + 
                        "&Criteria=" + criteria +
                        "&FK_Property=" + $rootScope.globals.fk_property.id +
                        "&withbookingcustomer=1";
                    
                    $http.jsonp(url)
                    .success(function(response) {
                        
                        if (response.ErrorNumber!==undefined) {
                            deferred.reject({
                                code: response.ErrorNumber,
                                message: response.ErrorMessage
                            });
                        }
                        else {
                            for(var i=0;i<response.length;i++){
                                response[i].DateFrom=moment(response[i].DateFrom);
                                response[i].DateTo=moment(response[i].DateTo);
                            }
                            deferred.resolve(response);
                        }
                    })
                    .error(function(response) {
                        deferred.reject({
                            code: response.ErrorNumber,
                            message: response.ErrorMessage
                        });
                    });
                    return deferred.promise;
                 
            },
            $saveasdraft: function(data) {
                    var deferred = $q.defer();
                    var url = $rootScope.globals.serverUrl+hostCallserver +
                        "&object=" + "TempBooking" +
                        "&method=" + "Insert" +
                        "&token=" + $rootScope.credentials.currentUser.token + 
                        "&FK_Property=" + $rootScope.globals.fk_property.id +
                        "&"+$.param(data);
                    
                    $http.jsonp(url)
                    .success(function(response) {
                        
                        if (response.ErrorNumber!==undefined) {
                            deferred.reject({
                                code: response.ErrorNumber,
                                message: response.ErrorMessage
                            });
                        }
                        else {
                            deferred.resolve(response);
                        }
                    })
                    .error(function(response) {
                        deferred.reject({
                            code: response.ErrorNumber,
                            message: response.ErrorMessage
                        });
                    });
                    return deferred.promise;
                 
            },
            $checkIn: function(bookingId) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                     "&object=" + "Booking" +
                    "&method=" + "CheckIn" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&ID=" + bookingId +
                    "&FK_Property=" + $rootScope.globals.fk_property.id;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    if (response.ErrorNumber!==undefined) {
                        new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
                         deferred.reject({
                            code: response.ErrorNumber,
                            message: response.ErrorMessage
                        });
                    }
                    else {
                        new logger("<p>Data Saved</p>","notice","growl","slide").log();
                        deferred.resolve(response);
                    }
                })
                .error(function(response) {
                    deferred.reject({
                        code: response.ErrorNumber,
                        message: response.ErrorMessage
                    });
                });
                return deferred.promise;
            },
            $checkOut: function(bookingId) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Booking" +
                    "&method=" + "CheckOut" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&ID=" + bookingId +
                    "&FK_Property=" + $rootScope.globals.fk_property.id;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {

                    if (response.ErrorNumber!==undefined) {
                            new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
                        
                        deferred.reject({
                            code: response.ErrorNumber,
                            message: response.ErrorMessage
                        });
                    }
                    else {
                         new logger("<p>Data Saved</p>","notice","growl","slide").log();
                        deferred.resolve(response);
                    }
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $noShow: function(bookingId) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Booking" +
                    "&method=" + "NoShow" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&ID=" + bookingId +
                    "&FK_Property=" + $rootScope.globals.fk_property.id;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                     new logger("<p>Data Saved</p>","notice","growl","slide").log();
                    deferred.resolve(response);
                })
                .error(function(response) {
                     new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
                        
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $cancel: function(bookingId) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                     "&object=" + "Booking" +
                    "&method=" + "Cancel" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&ID=" + bookingId +
                    "&FK_Property=" + $rootScope.globals.fk_property.id;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    if (response.ErrorNumber) {
                        new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
                         deferred.reject({
                            code: response.ErrorNumber,
                            message: response.ErrorMessage
                        });
                    }
                    else {
                        new logger("<p>Data Saved</p>","notice","growl","slide").log();
                        deferred.resolve(response);
                    }
                })
                .error(function(response) {
                    deferred.reject({
                        code: response.ErrorNumber,
                        message: response.ErrorMessage
                    });
                });
                return deferred.promise;
            },
            $extend: function(bookingId,dateFrom,dateTo,viewSuccess) {
                if(viewSuccess===undefined) viewSuccess=true;
                var url = $rootScope.globals.serverUrl+hostCallserver +
                     "&object=" + "Booking" +
                    "&method=" + "Extend" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&ID=" + bookingId +
                    "&FK_Property=" + $rootScope.globals.fk_property.id + 
                    "&DateFrom=" + moment(dateFrom).format("YYYY-MM-DD") +
                    "&DateTo=" + moment(dateTo).format("YYYY-MM-DD");
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    if (response.ErrorNumber) {
                        if(viewSuccess)
                        new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
                         deferred.reject(response);
                    }
                    else {
                        if(viewSuccess)
                        new logger("<p>Data Saved</p>","notice","growl","slide").log();
                        deferred.resolve(response);
                    }
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $update: function(bookingId, params, viewSuccess) {
                //params > variable will be parsed from JSON list
                if(viewSuccess===undefined) viewSuccess=true;
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Booking" +
                    "&method=" + "Update" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&ID=" + bookingId +
                    "&FK_Property=" + $rootScope.globals.fk_property.id + 
                    "&"+$.param(params);
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    if (response.ErrorNumber) {
                        if(viewSuccess)
                        new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
                         deferred.reject(response);
                    }
                    else {
                        if(viewSuccess)
                        new logger("<p>Data Saved</p>","notice","growl","slide").log();
                        deferred.resolve(response);
                    }
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $create: function(params, viewSuccess) {
                //params > variable will be parsed from JSON list
                if(viewSuccess===undefined) viewSuccess=true;
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Booking" +
                    "&method=" + "CreateBooking" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id + 
                    "&"+$.param(params);
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    if (response.ErrorNumber) {
                        if(viewSuccess)
                        new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.ErrorNumber+" "+response.ErrorMessage+" </p>","error","growl","slide").log();
                         deferred.reject(response);
                    }
                    else {
                        if(viewSuccess)
                        new logger("<p>Data Saved</p>","notice","growl","slide").log();
                        deferred.resolve(response);
                    }
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $arrivals: function(date) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Booking" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&DateFrom=" + formatDate(date) +
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&withbookingcustomer=" + "1" +
                    "&FK_BookingStatus=" + "1";
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                   // console.log("response:arrivals ",response); 
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $departures: function(date) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Booking" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&DateTo=" + formatDate(date) +
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&withbookingcustomer=" + "1" +
                    "&FK_BookingStatus=" + "2";
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
            $pendingArrivals: function(date) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Booking" +
                    "&method=" + "ListPendings" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&Date=" + formatDate(date) +
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&withbookingcustomer=" + "1" +
                    "&FK_BookingStatus=" + "1";
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
            $pendingDepartures: function(date) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Booking" +
                    "&method=" + "ListPendings" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&Date=" + formatDate(date) +
                    "&FK_Property=" + $rootScope.globals.fk_property.id +
                    "&withbookingcustomer=" + "1" +
                    "&FK_BookingStatus=" + "2";
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
            $listCheckInCheckOut: function(date) {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "Booking" +
                    "&method=" + "ListCheckInOut" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&Date=" + formatDate(date) +
                    "&FK_Property=" + $rootScope.globals.fk_property.id;
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
            $listDraftReservations: function() {
                var url = $rootScope.globals.serverUrl+hostCallserver +
                    "&object=" + "TempBooking" +
                    "&method=" + "List" +
                    "&token=" + $rootScope.credentials.currentUser.token + 
                    "&FK_Property=" + $rootScope.globals.fk_property.id;
                var deferred = $q.defer();
                $http.jsonp(url)
                .success(function(response) {
                    //console.log("response: listDraftReservations ",response);
                    for(var i in response){
                        response[i].IsDraft=true;
                    }

                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $checkInConfirm: function(bookingId) { 
                var deferred = $q.defer();
                
                var self = this;
                $uibModal.open({
                    templateUrl: "views/confirmationModal.html",
                    controller: function($scope, $modalInstance) {
                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                                deferred.resolve(false);
                            };

                            $scope.ok = function() {

                                //var data = $scope.rawBookings[i].BookingCustomer[0];
                                self.$checkIn(bookingId)
                                .then(function(response) {
                                    
                                    //$scope.update();
                                    deferred.resolve(true);
                                    $modalInstance.close();
                                    //return true;
                                 
                                }, function(error) {
                                    //reloadCalender();
                                    $modalInstance.close();
                                    new errorLogger(error.message).log();
                                    //return false;
                                    deferred.resolve();

                                });
                                
                                //ok=true;
                                //deferred.resolve(ok);
                                
                            };

                        var trans=$translate.instant(['CONFIRM_MODAL_TITLE_CHECKIN','CONFIRM_MODAL_TEXT_CHECKIN']);
                        $scope.confirmationtext=trans.CONFIRM_MODAL_TEXT_CHECKIN;
                        $scope.headertext=trans.CONFIRM_MODAL_TITLE_CHECKIN;


                    }
                    
                });
                return deferred.promise;
            },
            $checkOutConfirm: function(bookingId) { 
                var deferred = $q.defer();
                
                var self = this;
                $uibModal.open({
                    templateUrl: "views/confirmationModal.html",
                    controller: function($scope, $modalInstance) {
                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                                deferred.resolve(false);
                            };

                            $scope.ok = function() {

                                //var data = $scope.rawBookings[i].BookingCustomer[0];
                                self.$checkOut(bookingId)
                                .then(function(response) {
                                    
                                    //$scope.update();
                                    deferred.resolve(true);
                                    $modalInstance.close();
                                    //return true;
                                 
                                }, function(error) {
                                    //reloadCalender();
                                    $modalInstance.close();
                                    new errorLogger(error.message).log();
                                    //return false;
                                    deferred.resolve();

                                });
                                
                                //ok=true;
                                //deferred.resolve(ok);
                                
                            };

                        var trans=$translate.instant(['CONFIRM_MODAL_TITLE_CHECKOUT','CONFIRM_MODAL_TEXT_CHECKOUT']);
                        $scope.confirmationtext=trans.CONFIRM_MODAL_TEXT_CHECKOUT;
                        $scope.headertext=trans.CONFIRM_MODAL_TITLE_CHECKOUT;


                    }
                    
                });
                return deferred.promise;
            },
            $noShowConfirm: function(bookingId) { 
                var deferred = $q.defer();
                
                var self = this;
                $uibModal.open({
                    templateUrl: "views/confirmationModal.html",
                    controller: function($scope, $modalInstance) {
                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                                deferred.resolve(false);
                            };

                            $scope.ok = function() {

                                //var data = $scope.rawBookings[i].BookingCustomer[0];
                                self.$noShow(bookingId)
                                .then(function(response) {
                                    
                                    //$scope.update();
                                    deferred.resolve(true);
                                    $modalInstance.close();
                                    //return true;
                                 
                                }, function(error) {
                                    //reloadCalender();
                                    $modalInstance.close();
                                    new errorLogger(error.message).log();
                                    //return false;
                                    deferred.resolve();

                                });
                                
                                //ok=true;
                                //deferred.resolve(ok);
                                
                            };

                        var trans=$translate.instant(['CONFIRM_MODAL_TITLE_NOSHOW','CONFIRM_MODAL_TEXT_NOSHOW']);
                        $scope.confirmationtext=trans.CONFIRM_MODAL_TEXT_NOSHOW;
                        $scope.headertext=trans.CONFIRM_MODAL_TITLE_NOSHOW;


                    }
                    
                });
                return deferred.promise;
            },
            $cancelConfirm: function(bookingId) { 
                var deferred = $q.defer();
                
                var self = this;
                $uibModal.open({
                    templateUrl: "views/confirmationModal.html",
                    controller: function($scope, $modalInstance) {
                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                                deferred.resolve(false);
                            };

                            $scope.ok = function() {

                                //var data = $scope.rawBookings[i].BookingCustomer[0];
                                self.$cancel(bookingId)
                                .then(function(response) {
                                    
                                    //$scope.update();
                                    deferred.resolve(true);
                                    $modalInstance.close();
                                    //return true;
                                 
                                }, function(error) {
                                    //reloadCalender();
                                    $modalInstance.close();
                                    new errorLogger(error.message).log();
                                    //return false;
                                    deferred.resolve();

                                });
                                
                                //ok=true;
                                //deferred.resolve(ok);
                                
                            };

                        var trans=$translate.instant(['CONFIRM_MODAL_TITLE_CANCEL','CONFIRM_MODAL_TEXT_CANCEL']);
                        $scope.confirmationtext=trans.CONFIRM_MODAL_TEXT_CANCEL;
                        $scope.headertext=trans.CONFIRM_MODAL_TITLE_CANCEL;


                    }
                    
                });
                return deferred.promise;
            },
            $editBooking: function(booking, datefrom, dateto, room, adults) {
                var deferred = $q.defer();

                var self = this;
                var b;
                if(booking!==undefined) {
                    if(booking.ID!==undefined) {
                        b=booking.ID;
                    } else if(booking.id!==undefined){
                        b=booking.id;
                    } else if(booking!==undefined){
                        b=booking;
                    } else {
                        b=undefined;
                    }
                } else {
                    b=undefined;
                }

                if(b!==undefined){
                self.$detail(b)
                 .then(function(booking) {
                    openBookingModal(booking,undefined,undefined,undefined,undefined)
                    .then(function(data) {
                        deferred.resolve(data);
                    });    
                  }, function(error) {
                    
                  });
                } else {
                    openBookingModal(undefined,moment(datefrom),moment(dateto).add(1, 'days'),room, adults)
                    .then(function(data) {
                        deferred.resolve(data);
                    });  
                }

                return deferred.promise;
                

        },
        $editBookingDraft: function(booking) {
            var deferred = $q.defer();

             openBookingModal(booking,undefined,undefined,undefined)
                .then(function(data) {
                    deferred.resolve(data);
                });    

            return deferred.promise;
        },
        $canCheckIn: function (status, DateFrom, DateTo) {
            /**
            If status is 1 (confirmed) and Today is between DateFrom and DateTo (inclusively)
            Can Check In, else, no.
            **/
            var today = moment();
            if (status === 1 &&  
              (
                today.isSame(DateFrom, 'day') || today.isSame(DateTo, 'day') || 
                moment.range(DateFrom, DateTo).contains(today)
              )
            ) {
              
              return true;
            }
            return false;
        },
        $canCheckOut: function (status, DateTo) {
            /**
            If Status is 2 (Checked in) and if
            Today is DateTo or if Today is after DateTo
            **/
            var today = moment();
            if(status === 2 && (today.isSame(DateTo, 'day') || today.isAfter(DateTo))) {
              return true;
            }
            return false;
        },
        $canNoShow: function (status, DateFrom) {
            /**
            Can do No Show only if status is 1 (Confirmed) and
            Today is DateTo or is after DateTo
            **/
            var today = moment();
            if (status === 1 && (today.isSame(DateFrom, 'day') || today.isAfter(DateFrom))) {
                return true;
            }
            return false;
        },
        $canCancel: function (status) {
            /**
            Can cancel at any time, only if status is 1 (Confirmed)
            **/
            return status === 1;
        }

        };
    });
