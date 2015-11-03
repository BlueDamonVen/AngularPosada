'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:ReportingCtrl
 * @description
 * # ReportingCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('reportingCtrl', function  ($scope, $rootScope, $http, $modal, ReportingService, allRoomTypes) {
        
        $scope.allRoomTypes = allRoomTypes;

        
             var   startDate = moment().startOf('month');
              var  endDate = moment().endOf('month');
            
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            
            $scope.reports.$getRoomTypes() 
            .then(function(adr) {
                $scope.allRoomTypes = adr;
            }, function(error) {
                $scope.adr = 0;
            });
        //............
 
        
        $scope.roomTypes = [];
        $scope.selectedLanguage = "ENG";
        
        $scope.selectedRoomTypes7 = [];
        $scope.selectedRoomTypes8 = [];
        $scope.selectedRoomTypes9 = [];
        $scope.selectedRoomTypes11 = [];
        
        
        $rootScope.$on("language-changed", function(event, lang) {
            if (lang === 'en' || lang === 'fr') {
                $scope.selectedLanguage = "ENG";
            }
            else if (lang === 'pl') {
                $scope.selectedLanguage = "POL";
            }
            else {
                $scope.selectedLanguage = "ENG";
            }
        });
        
        $scope.$watch("selectedLanguage", function(newLanguage) {
            
            $scope.roomTypes = [];
            $scope.selectedRoomTypes7 = [];
            $scope.selectedRoomTypes9 = [];
            $scope.selectedRoomTypes11 = [];
            $scope.allRoomTypes.forEach(function(roomType) {
                if (roomType.LangCode === newLanguage) {
                    $scope.roomTypes[roomType.ID] = roomType;
                    
                    $scope.selectedRoomTypes8.push({
                        "ID": roomType.ID
                    });
                    $scope.selectedRoomTypes11.push({
                        "ID": roomType.ID
                    });
                }
            });
            
            $scope.loadAllReports();
        });
        
        /*
            Glance Reports:
            1. Avg. Daily Rate
            2. Avg. Length of Stay
            3. Total Revenue
            4. Total Reservations
            5. Cancelled Reservations
            6. No Show Reservations
        */
        $scope.loadGlanceReports = function(startDate, endDate) {
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            
            $scope.reports.$getADR() 
            .then(function(adr) {
                $scope.adr = Math.round(parseInt(adr));
            }, function(error) {
                $scope.adr = 0;
            });
            
            $scope.reports.$getALOS()
            .then(function(alos) {
                $scope.alos = Math.round(alos);
            }, function(error) {
                $scope.alos = 0;
            });
            
            $scope.reports.$getTotalRevenue()
            .then(function(totalRevenue) {
                $scope.totalRevenue = totalRevenue;
            }, function(error) {
                $scope.totalRevenue = 0;
            });
            
            $scope.totalReservations = 0;
            $scope.cancelledReservations = 0;
            $scope.noShowReservations = 0;
            
            $scope.reports.$getReservations()
            .then(function(reservations) {
                if (!reservations || reservations.length == 0) return;
                reservations.forEach(function(summary) {
                    $scope.totalReservations += summary.NumberOfReservations;
                    if (summary.FK_BookingStatus === 4) {
                        $scope.cancelledReservations = summary.NumberOfReservations;
                    }
                    else if (summary.FK_BookingStatus === 5) {
                        $scope.noShowReservations = summary.NumberOfReservations;
                    }
                });
            }, function(error) {
                new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+error+"       </p>","error","growl","slide").log();
            });
        };
        //...............................................
        
        /*
            Bar Chart.
            7)	Number of Reservations and Avg Revenue per Reservation per Room Type 
        */
        $scope.loadBookingsAndRevenueReport = function(startDate, endDate) {
            
            $scope.sort7 = "";
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            
            $scope.reports.$getBookingsAndRevenueByRoomType()
            .then(function(records) {
                var barData = [];

                var bard=[];
                var key1 , valueType,bar1,valueType2,valueType3; 
 
            for(var i=0 ; i<2;i++)
            { 
                if(i===0)
                {
                    key1= "Number Of Reservations";  
                    valueType= Math.round(records[0].NumberOfReservations); 
                    valueType2= Math.round(records[1].NumberOfReservations); 
                    valueType3= Math.round(records[2].NumberOfReservations);

                    bar1=true;
                }
                else
                {
                    key1= "Average Income"; 
                    valueType= Math.round(records[0].AverageIncome); 
                    valueType2= Math.round(records[1].AverageIncome); 
                    valueType3= Math.round(records[2].AverageIncome);
                    bar1=false;
                }
                 bard.push({
                     
                    key: key1,
                    bar: bar1,
                    values :
                    [
                        [
                              $scope.roomTypes[1].ShortDescription,
                              
                              valueType
                        ],
                        [
                              $scope.roomTypes[2].ShortDescription,
                              
                              valueType2
                        ]
                        ,
                        [
                              $scope.roomTypes[3].ShortDescription,
                              
                              valueType3
                        ]
                    ]
                     
                    
                    
                });
            }
        
            var data = [];

//...........................graph nv plugin
        nv.addGraph(function() {
            var chart = nv.models.linePlusBarChart()
              .margin({top: 30, right: 60, bottom: 50, left: 70})
              .x(function(d,i) { return i })
              .y(function(d) { return d[1] })
              .color(d3.scale.category10().range())
              ; 
            chart.xAxis
              .showMaxMin(false)
              .tickFormat(function(d) { 
                var xValue="";
                if(!(data[0].values[d]===undefined)){
                  xValue=data[0].values[d][0];
                } 
                return xValue;
              });


            chart.y1Axis;
             // .tickFormat(d3.format(',f'));

            chart.y2Axis;
             // .tickFormat(function(d) { return   d3.format(',f')(d) });

            chart.bars.forceY([0]); 
 
        
            //tell the function which property to use as text
            //....
            chart.showLegend(false); 
            d3.select('#chart svg')
              .datum(data)
              .transition().duration(500)
              .call(chart);

            nv.utils.windowResize(chart.update);
            
            chart.tooltipContent(function (key, x, y, e, graph) {
                 
            return '<p><strong>' + "Average Income" + '</strong></p>' +
                   '<p>' + x+ ":"+y+ '</p>';
            });
 
             
             

            return chart;
        });
        data= bard; 
 //...........................................................................
 
                
            }, function(error) {
                 
                $scope.barData = [];
            });
        };
        
        /*
            Line Chart.
            8)	Total Revenue per Room Type 
        */
        $scope.loadTotalRevenueReport = function(startDate, endDate) {
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            $scope.startDate8 = startDate;
            $scope.endDate8 = endDate
            
            $scope.reports.$getTotalRevenuePerRoomType()
            .then(function(records) {
                var finalData = [];
                var keys = [];
                var keyNames = [];
                var i;
                for (i=0; i<records.length; i++) {
                    var record = records[i];
                    var roomData = [];
                    if (i === 0) {
                        angular.forEach(record, function(key, value) {
                            finalData.push(value);
                        });
                    }
                    var j=0;
                    angular.forEach(record, function(key, value) {
                        if (value != "ID") {
                            finalData[j] = finalData[j] + "," + key;
                        }
                        else {
                            keys.push(key);
                        }
                        j++;
                    });
                }
                finalData.splice(0,1);
                var lineData = [];
                for (i=0; i<finalData.length; i++) {
                    var data = finalData[i];
                    var parts = data.split(",");
                    var line = {};
                    for (j=0; j<parts.length; j++) {
                        var part = parts[j];
                        if (j === 0) {
                            line["y"] = part;
                        }
                        else {
                            var key = keys[j-1];
                            $scope.selectedRoomTypes8.forEach(function(roomType) {
                                if (roomType.ID === key) {
                                    line[key] = part;
                                }
                            });
                        }
                    }
                    lineData.push(line);
                }
                $scope.lineData = lineData;
                $scope.keys = keys;
                $scope.keyNames = [];
                $scope.selectedRoomTypes8.forEach(function(roomType) {
                    $scope.keyNames.push($scope.roomTypes[roomType.ID].ShortDescription);
                });
                
            }, function(error) {
            });
        };
        
        /*
            Bar Chart.
            9)	Avg Length of Stay / Avg Leadtime per Room Type
        */
        $scope.loadLOSReport = function(startDate, endDate) {
            
            $scope.sort9 = "";
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            
            $scope.reports.$getLOSAndLTByRoomType()
            .then(function(records) {
                var barData = [];
                //....changed
               // records.forEach(function(record) {
                        
                    //..........................................dfsadjfas
                var barData = [];

                var bard=[];
                var key1 , valueType,bar1,valueType2,valueType3,color1; 
 
            for(var i=0 ; i<2;i++)
            { 
                 if(i===0)
                {
                    key1= "AvgLOS";  
                    valueType= Math.round(records[0].AvgLOS); 
                    valueType2= Math.round(records[1].AvgLOS);  
                     color1="#abc";
                    bar1=true;
                }
                else
                {
                    key1= "AvgLeadTime"; 
                    valueType= Math.round(records[0].AvgLeadTime); 
                    valueType2= Math.round(records[1].AvgLeadTime);  
                    bar1=false;
                    color1="#F00";
                }
                 bard.push({
                     
                    key: key1,
                    bar: bar1,
                    color: color1,
                    values :
                    [
                        [
                              $scope.roomTypes[records[0].FK_RoomType].ShortDescription,
                              
                              valueType
                        ],
                        [
                              $scope.roomTypes[records[1].FK_RoomType].ShortDescription,
                              
                              valueType2
                        ]
                        
                    ]
                     
                    
                    
                });
            }
        
            var data = [];

//...........................graph nv plugin
        nv.addGraph(function() {
            var chart = nv.models.linePlusBarChart()
              .margin({top: 30, right: 60, bottom: 50, left: 70})
              .x(function(d,i) { return i })
              .y(function(d) { return d[1] })
              .color(d3.scale.category10().range()) 
              ; 
            chart.xAxis
              .showMaxMin(false)
              .tickFormat(function(d) { 
                var xValue="";
                if(!(data[0].values[d]===undefined)){
                  xValue=data[0].values[d][0];
                } 
                return xValue;
              });


            chart.y1Axis;
             // .tickFormat(d3.format(',f'));

            chart.y2Axis;
             // .tickFormat(function(d) { return   d3.format(',f')(d) });

            chart.bars.forceY([0]); 
 
        
            //tell the function which property to use as text
            //....
            chart.showLegend(false); 
            //chart.tooltips(false);      //Don't show tooltips
            //chart.line(false);
            d3.select('#chart1 svg')
              .datum(data)
              .transition().duration(500)
              .call(chart);

            nv.utils.windowResize(chart.update);
            
            chart.tooltipContent(function (key, x, y, e, graph) {
                
            return '<p><strong>' + "Avg Lead Time" + '</strong></p>' +
                   '<p>' + x+ ":"+y+ '</p>';
            });
 
             
             

            return chart;
        });
        data= bard; 
 //...........................................................................
 
                 /*   
                    barData.push({
                        id: record.FK_RoomType,
                        y: $scope.roomTypes[record.FK_RoomType].ShortDescription,
                        a: record.AvgLos ? Math.round(record.AvgLos) : 0,
                        b: Math.round(record.AvgLeadTime)
                    });
                });
                
                $scope.barData2 = barData;
                $scope.barData2Original = angular.copy($scope.barData2);
                */
            }, function(error) {
                $scope.barData2 = [];
                $scope.barData2Original = [];
            });
        };
        
        /*
            Area Chart.
            10)	Occupancy
        */
        $scope.loadOccupancyPerDayReport = function(startDate, endDate) {
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            
            $scope.reports.$getOccupancyPerDay()
            .then(function(records) {
                var occupancyData = [];
                angular.forEach(records, function(key, value) {
                    occupancyData.push({
                        y: value,
                        a: key*100
                    });
                });
                $scope.occupancyData = occupancyData;
            }, function(error) {
                $scope.occupancyData = [];
            });
        };
            
        /*
            Knob Chart.
            11)	Occupancy per Room Type
        */
        $scope.loadOccupancyPerRoomTypeReport = function(startDate, endDate) {
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            $scope.startDate11 = startDate;
            $scope.endDate11 = endDate;
            
            $scope.reports.$getOccupancyPerRoomType()
            .then(function(records) {
                var occupancyData2 = [];
                records.forEach(function(record) {
                    $scope.selectedRoomTypes11.forEach(function(roomType) {
                        //.......changed
                        if (roomType.ID == record.FK_RoomType) {
                  
                            occupancyData2.push({
                                "id": record.FK_RoomType,
                                "label": $scope.roomTypes[record.FK_RoomType].ShortDescription,
                                "value": Math.round(record.OccupancyRate * 100),
                                "options": {
                                    readOnly: true,
                                    width: 100
                                }
                            });
                        }
                    });
                });
                
                $scope.occupancyData2 = occupancyData2;
                
            }, function(error) {
                $scope.occupancyData2 = [];
                $scope.occupancyData2Original = [];
            });
        };
        
        /*
            Bar Chart.
            12)	Weekly Check Ins/Check outs
        */
        $scope.loadWeeklyCheckInOutReport = function(startDate, endDate) {
            
            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            
            $scope.reports.$getWeeklyCheckInsCheckOuts()
            .then(function(records) {
                var weeklyCheckInOuts = [];
                records.forEach(function(record) {
                    weeklyCheckInOuts.push({
                        y: days[record.DOW-1],
                        a: record.CheckIN,
                        b: record.CheckOUT
                    });
                });
                $scope.weeklyCheckInOuts = weeklyCheckInOuts;
            }, function(error) {
                $scope.weeklyCheckInOuts = [];
            });
        };
        
        /*
            Horizontal Bar Chart.
            13)	Payment Methods
        */
        $scope.loadPaymentReport = function(startDate, endDate) {
            
            $scope.sort13 = "";
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            
            $scope.reports.$getBookingsByTransactionType()
            .then(function(records) {
                var paymentData = [];
                records.forEach(function(record) {
                    paymentData.push({
                        y: record.Description,
                        a: record.NumberOfBookings
                    });
                });
                $scope.paymentData = paymentData;
            }, function(error) {
                $scope.paymentData = [];
            });
        };
        
        /*
            Pie Chart.
            14)	Direct vs Indirect Bookings
        */
        $scope.loadDirectIndirectBookingsReport = function(startDate, endDate) {
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            
            $scope.reports.$getDirectIndirectBookings()
            .then(function(records) {
                var channelDonut = {};
                channelDonut.data = [];
                records.forEach(function(record) {
                    if (record.Internal) {
                        channelDonut.data.push({
                            label: "Internal",
                            data: record.BookingCount
                        });
                    }
                    else {
                        channelDonut.push({
                            label: "External",
                            value: record.BookingCount
                        });
                    }
                });
                $scope.channelDonut = channelDonut;
            }, function(error) {
                $scope.channelDonut = [];
            });
        };
        
        /*
            Pie Chart.
            15)	Reservations % by booking Channel
        */
        $scope.loadPercentBookingsBySourceReport = function(startDate, endDate) {
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            
            $scope.reports.$getBookingsAndRevenueBySource()
            .then(function(records) {
                var bookingDonut = {};
                bookingDonut.data = [];
                records.forEach(function(record) {
                    bookingDonut.data.push({
                        label: record.Description,
                        data: record.BookingCount
                    });
                });
                $scope.bookingDonut = bookingDonut;
            }, function(error) {
                $scope.bookingDonut = [];
            });
        };
        
        /*
            Bar Chart.
            16)	Number of Reservations and Revenue by Booking Channel
        */
        $scope.loadBookingsAndRevenueBySourceReport = function(startDate, endDate) {
            
            $scope.sort16 = "";
            
            if (!startDate || !endDate) {
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
            }
            $scope.reports = ReportingService.reports({
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            });
            
            $scope.reports.$getBookingsAndRevenueBySource()
            .then(function(records) {
                var bookingBarData = [];
                records.forEach(function(record) {
                    bookingBarData.push({
                        y: record.Code,
                        a: record.BookingCount,
                        b: record.TotalRevenue
                    });
                });
                $scope.bookingBarData = bookingBarData;
            }, function(error) {
                
            });
        };
        
        
        $scope.loadAllReports = function() {
            
            $scope.dateFrom = moment().startOf('month');
            $scope.dateTo = moment().endOf('month');
            
            $scope.loadGlanceReports($scope.dateFrom, $scope.dateTo);
            $scope.loadBookingsAndRevenueReport($scope.dateFrom, $scope.dateTo);
            $scope.loadTotalRevenueReport($scope.dateFrom, $scope.dateTo);
            $scope.loadLOSReport($scope.dateFrom, $scope.dateTo);
            $scope.loadOccupancyPerDayReport($scope.dateFrom, $scope.dateTo);
            $scope.loadOccupancyPerRoomTypeReport($scope.dateFrom, $scope.dateTo);
            $scope.loadWeeklyCheckInOutReport($scope.dateFrom, $scope.dateTo);
            $scope.loadPaymentReport($scope.dateFrom, $scope.dateTo);
            $scope.loadDirectIndirectBookingsReport($scope.dateFrom, $scope.dateTo);
            $scope.loadPercentBookingsBySourceReport($scope.dateFrom, $scope.dateTo);
            $scope.loadBookingsAndRevenueBySourceReport($scope.dateFrom, $scope.dateTo);
        };
        
        $scope.sortReport7 = function(type) {
            
            if (type === '') {
                return;
            }
            
            var temp = angular.copy($scope.barData);
            temp.sort(function(a,b) {
                if (type === "a") {
                    return parseInt(a.a) - parseInt(b.a);
                }
                else {
                    return parseInt(a.b) - parseInt(b.b);
                }
            });
            $scope.barData = temp;
        };
        
        $scope.sortReport9 = function(type) {
            
            if (type === '') {
                return;
            }
            
            var temp = angular.copy($scope.barData2);
            temp.sort(function(a,b) {
                if (type === "a") {
                    return parseInt(a.a) - parseInt(b.a);
                }
                else {
                    return parseInt(a.b) - parseInt(b.b);
                }
            });
            $scope.barData2 = temp;
        };
        
        $scope.sortReport16 = function(type) {
            
            if (type === '') {
                return;
            }
            
            var temp = angular.copy($scope.bookingBarData);
            temp.sort(function(a,b) {
                if (type === "a") {
                    return parseInt(a.a) - parseInt(b.a);
                }
                else {
                    return parseInt(a.b) - parseInt(b.b);
                }
            });
            $scope.bookingBarData = temp;
            
        };
        
        $scope.initialize = function() {
            
            $scope.multiSettings = {
                displayProp: 'ShortDescription', 
                idProp: 'ID',
                externalIdProp: 'ID'
            };
            $scope.multiEvents8 = {
                onItemSelect: function() {
                    $scope.loadTotalRevenueReport($scope.startDate8, $scope.endDate8);
                },
                onItemDeselect: function() {
                    $scope.loadTotalRevenueReport($scope.startDate8, $scope.endDate8);
                }
            };
            $scope.multiEvents11 = {
                onItemSelect: function() {
                    $scope.loadOccupancyPerRoomTypeReport($scope.startDate11, $scope.endDate11);
                },
                onItemDeselect: function() {
                    $scope.loadOccupancyPerRoomTypeReport($scope.startDate11, $scope.endDate11);
                }
            };
            
            var dateFrom = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            var dateTo = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0);
            
            $scope.loadAllReports();
            
        };
        $scope.initialize();
        
   
   //
  });
