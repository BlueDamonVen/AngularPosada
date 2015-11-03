angular
	.module('bearpms3App')
    .factory('ReportingService', function($rootScope, $http, $q,langTransService,webConstants) {
        var lan = langTransService.getSelectedLanguage();
        // var lan = $rootScope.globals.selectedLanguage;
         var hostCallserver =webConstants.hostCallserver;
        function Report(dateRange){
            this.token = $rootScope.credentials.currentUser.token;
           // alert("11usama reports");
            var dateFrom = dateRange.startDate;
            var dateTo = dateRange.endDate;
            
            this.dateFrom = dateFrom;
            this.dateTo = dateTo;
            
            this.object = "Reporting";
            this.fkProperty = $rootScope.globals.fk_property.id;
            this.getUrl = function(method, object) {
                return $rootScope.globals.serverUrl+hostCallserver + 
                    "&object=" + this.object + 
                    "&method=" + method +
                    "&token=" + this.token +
                    "&FK_Property=" + this.fkProperty + 
                    "&DateFrom=" + this.dateFrom + 
                    "&DateTo=" + this.dateTo;
            }
            this.getRoomTypeUrl = function() {
                return $rootScope.globals.serverUrl+hostCallserver + 
                    "&object=" + "RoomType" + 
                    "&method=" + "List" +
                    "&token=" + this.token +
                    "&FK_Property=" + this.fkProperty + 
                    "&DateFrom=" + this.dateFrom + 
                    "&DateTo=" + this.dateTo +
                    "&Lang="+lan;
            }
        }
    
        Report.prototype = {
            $getRoomTypes: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getRoomTypeUrl())
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getADR: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("GetADR"))
                .success(function(response) {
                    if (response[0].ADR) {
                        deferred.resolve(response[0].ADR);
                    }
                    else {
                        deferred.resolve(0);
                    }
                })
                .error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getALOS: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("GetALOS"))
                .success(function(response) {
                    if (response[0].ALOS) {
                        deferred.resolve(response[0].ALOS);
                    }
                    else {
                        deferred.resolve(0);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getTotalRevenue: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("TotalRevenue"))
                .success(function(response) {
                    if (response[0].TotalRevenue) {
                        deferred.resolve(response[0].TotalRevenue);
                    }
                    else {
                        deferred.resolve(0);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getReservations: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("ReservationsbyStatus"))
                .success(function(response) {
                    if (response.ErrorMessage) {
                        deferred.reject(response.ErrorMessage);
                    }
                    else {
                        deferred.resolve(response);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getBookingsAndRevenueByRoomType: function() {

                
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("RoomTypeBookingsWAvgRevenue"))
                .success(function(response) {
                    if (response.ErrorMessage) {
                        deferred.reject(response.ErrorMessage);
                    }
                    else {
                        deferred.resolve(response);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getLOSAndLTByRoomType: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("AvgLOSAvgLTPerRoomType"))
                .success(function(response) {
                    if (response.ErrorMessage) {
                        deferred.reject(response.ErrorMessage);
                    }
                    else {
                        deferred.resolve(response);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getTotalRevenuePerRoomType: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("TotalIncomePerRoomType"))
                .success(function(response) {
                    if (response.ErrorMessage) {
                        deferred.reject(response.ErrorMessage);
                    }
                    else {
                        deferred.resolve(response);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getOccupancyPerDay: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("OccupancyRate"))
                .success(function(response) {
                    if (response.ErrorMessage) {
                        deferred.reject(response.ErrorMessage);
                    }
                    else {
                        deferred.resolve(response[0]);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getOccupancyPerRoomType: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("OccupancyRatePerRoomTypeTotal"))
                .success(function(response) {
                    if (response.ErrorMessage) {
                        deferred.reject(response.ErrorMessage);
                    }
                    else {
                        deferred.resolve(response);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getWeeklyCheckInsCheckOuts: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("WeeklyCheckINOUT"))
                .success(function(response) {
                    if (response.ErrorMessage) {
                        deferred.reject(response.ErrorMessage);
                    }
                    else {
                        deferred.resolve(response);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getDirectIndirectBookings: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("BookingsInternalvsExternal"))
                .success(function(response) {
                    if (response.ErrorMessage) {
                        deferred.reject(response.ErrorMessage);
                    }
                    else {
                        deferred.resolve(response);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getBookingsAndRevenueBySource: function() {
                var deferred = $q.defer();
                $http.jsonp(this.getUrl("BookingsbySource"))
                .success(function(response) {
                    if (response.ErrorMessage) {
                        deferred.reject(response.ErrorMessage);
                    }
                    else {
                        deferred.resolve(response);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            },
            $getBookingsByTransactionType: function() {
                 var deferred = $q.defer();
                $http.jsonp(this.getUrl("BookingsByTransactionType"))
                .success(function(response) {
                    if (response.ErrorMessage) {
                        deferred.reject(response.ErrorMessage);
                    }
                    else {
                        deferred.resolve(response);
                    }
                }).error(function(response) {
                    deferred.reject(response);
                });
                return deferred.promise;
            }
        }
        
        function reports(dateFrom, dateTo) {
            
            return new Report(dateFrom, dateTo);
        }
    
        return {
            reports: reports
        }

});
