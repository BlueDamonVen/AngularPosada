'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
   .controller('mainCtrl', function ($scope, $rootScope, $route, $location, $uibModal, BookingService, TodoService ,$q,$http,createBooking, $translate) {
   
   //....seting roles
        $scope.rightValue =false;
        $scope.rightValue2=false;
        $scope.rightsValues = $rootScope.globals.fk_rightsResponse;
        if($scope.rightsValues.data[0].Booking === 1 )
            $scope.rightValue=true;
        if($scope.rightsValues.data[0].Booking === 2 )
            $scope.rightValue2=true;
        var now = new Date();

       $scope.now = convertDateNow(now);
               //   console.log("now",$scope.now);


        $scope.pendingarrivalsDate =function(index)
        {
            var inin= $scope.pendingArrivals[index].raw.DateFrom;
            var out= $scope.pendingArrivals[index].raw.DateTo;
            //console.log("now",$scope.pendingArrivals[index] );
            if( $scope.now > inin  && $scope.now < out)
            {
                return true;
            }

        }


        
        function convertDateNow(inputFormat) 
        {
          function pad(s) { return (s < 10) ? '0' + s : s; }
          var d = new Date(inputFormat);
          $scope.now = [d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate())].join('-');
          console.log("now", $scope.now);
          return $scope.now;
        }
    //....seting roles ends

   var  arrivals,departures, pendingArrivals,pendingDepartures ,summaryCheckInCheckOut;
   var  draftReservations,todoList;
    $scope.init =function()
    {
        
         
        BookingService.$arrivals(new Date()).then(function(data)
                {
                 arrivals= data;
                 console.log("data : ", data ); 

                     if(arrivals)
                     {   
                        $scope.arrivals = [];
                         arrivals.forEach(function(arrival) {
                                $scope.arrivals.push({
                                    raw: arrival,
                                    customer: arrival.BookingCustomer[0].FirstName + " " + arrival.BookingCustomer[0].LastName,
                                    checkinDate: moment(arrival.DateFrom).format("DD MMM"),
                                    checkoutDate: moment(arrival.DateTo).format("DD MMM"),
                                    nights: moment(arrival.DateTo).diff(moment(arrival.DateFrom), "days"),
                                    room: getRoom(arrival.FK_Room)
                                });
                             });
                     }   
                });
               
        BookingService.$departures(new Date()).then(function(data)
                {
                 departures= data;  
                     if(departures)
                     {
                         $scope.departures = []; 
                                departures.forEach(function(departure) {
                                    $scope.departures.push({
                                        raw: departure,
                                        customer: departure.BookingCustomer[0].FirstName + " " + departure.BookingCustomer[0].LastName,
                                        checkinDate: moment(departure.DateFrom).format("DD MMM"),
                                        checkoutDate: moment(departure.DateTo).format("DD MMM"),
                                        nights: moment(departure.DateTo).diff(moment(departure.DateFrom), "days"),
                                        room: getRoom(departure.FK_Room)
                                    });
                                });
                        
                     } 
                });
      BookingService.$pendingArrivals(new Date()).then(function(data)
                {
                  pendingArrivals= data; 
                  if(pendingArrivals)
                  {
                       $scope.pendingArrivals = [];
                       pendingArrivals.forEach(function(arrival) {
                                    $scope.pendingArrivals.push({
                                        raw: arrival,
                                        customer: arrival.BookingCustomer[0].FirstName + " " + arrival.BookingCustomer[0].LastName,
                                        checkinDate: moment(arrival.DateFrom).format("DD MMM"),
                                        checkoutDate: moment(arrival.DateTo).format("DD MMM"),
                                        nights: moment(arrival.DateTo).diff(moment(arrival.DateFrom), "days"),
                                        room: getRoom(arrival.FK_Room)
                                    });
                                });
                   }
                  console.log("pendingArrivals : ",pendingArrivals);  
                });
        BookingService.$pendingDepartures(new Date()).then(function(data)
                {
                  pendingDepartures= data;
                  if(pendingDepartures)
                     {  
                         $scope.pendingDepartures = [];
                         pendingDepartures.forEach(function(departure) {
                                $scope.pendingDepartures.push({
                                    raw: departure,
                                    customer: departure.BookingCustomer[0].FirstName + " " + departure.BookingCustomer[0].LastName,
                                    checkinDate: moment(departure.DateFrom).format("DD MMM"),
                                    checkoutDate: moment(departure.DateTo).format("DD MMM"),
                                    nights: moment(departure.DateTo).diff(moment(departure.DateFrom), "days"),
                                    room: getRoom(departure.FK_Room)
                                });
                            });
                     }    
                });
        BookingService.$listCheckInCheckOut(new Date()).then(function(data)
                {
                    console.log("data listCheckInCheckOut : ",data);
                  
                        summaryCheckInCheckOut=data;
                        if(summaryCheckInCheckOut)
                        {
                        $scope.checkinRemaining = summaryCheckInCheckOut[0].CheckInPending;
                        $scope.checkinTotal = summaryCheckInCheckOut[0].CheckInTotal;
                        $scope.checkinPercentage = (($scope.checkinTotal - $scope.checkinRemaining) / $scope.checkinTotal) * 100;
                        
                        // 3. Check-Outs Summary.
                        $scope.checkoutRemaining = summaryCheckInCheckOut[0].CheckOutPending;
                        $scope.checkoutTotal = summaryCheckInCheckOut[0].CheckOutTotal;
                        $scope.checkoutPercentage = (($scope.checkoutTotal - $scope.checkoutRemaining) / $scope.checkoutTotal) * 100;
                        if(!$scope.checkinPercentage)
                            $scope.checkinPercentage=0;
                        if(!$scope.checkoutPercentage)
                            $scope.checkoutPercentage=0;

                        }
                        else
                        {
                            $scope.checkinPercentage='0';
                            $scope.checkoutPercentage='0';
                        }
                });
       BookingService.$listDraftReservations().then(function(data)
                {
                    
                    $scope.draftReservations=data;
                    
                    // draftReservations= data;
                    //  draftReservations.forEach(function(reservation) {
                    //         $scope.draftReservations.push({
                    //             raw: reservation, 
                    //             BookingCustomer: reservation,
                    //             customer: reservation.FirstName + " " + reservation.LastName,
                    //             checkinDate: moment(reservation.DateFrom).format("DD MMM"),

                    //             checkoutDate: moment(reservation.DateTo).format("DD MMM"),
                    //             nights: moment(reservation.DateTo).diff(moment(reservation.DateFrom), "days"),
                    //             room: reservation.FK_Room
                    //         });
                    //     }); 
                    //     console.log("data",data);  
                });
        TodoService.$list().then(function(data)
                {
                 todoList=data;
                  $scope.arrangeReportData();   
                });
   // $rootScope.$broadcast('updateWidgets',"date"); 
    }
    $scope.init();

 //new thingiend
	$scope.isCollapsed=false;
	
    $('#page-wrapper').removeClass('nav-small');
    
    //
    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
    //
    var getRoom = function(roomId) {
        var roomNum = "NA";
        $rootScope.globals.fk_property.roomlist.forEach(function (room) {
            if (room.id == roomId) {
                roomNum = room.number;
            }
        });
        return roomNum;
    }
    
    var listener = $rootScope.$on('open-booking-modal', function(event, b) {
         
            // if(b.id) {
            //   BookingService.$detail(b.id)
            //      .then(function(booking) {
            //         $scope.openBookingModal(booking,undefined,undefined,undefined);    
            //       }, function(error) {
                    
            //       });
            // } else {
            //   $scope.openBookingModal(undefined,moment(b.date),moment(b.date).add(1, 'days'),b.room);
            // }
            BookingService.$editBooking(b.id,moment(b.date),moment(b.date).add(1, 'days'),b.room)
            .then(function(response) {
              $route.reload();
            }, function (response) {
              $route.reload();
            });
         
    
    });
    $scope.$on('$destroy', listener);
     
    $rootScope.$on('updateWidgets', function(event, date)
    {    
        //return BookingService.$arrivals(new Date()); 
       BookingService.$arrivals(new Date()).then(function(data)
                {
                if(data) 
                  {
                          if(data.Status ==='ERROR')
                            {
                                $scope.arrivals = [];
                            }    
                            else {
                                $scope.arrivals = [];
                               arrivals= data;
                               arrivals.forEach(function(arrival) {
                                $scope.arrivals.push({
                                    raw: arrival,
                                    customer: arrival.BookingCustomer[0].FirstName + " " + arrival.BookingCustomer[0].LastName,
                                    checkinDate: moment(arrival.DateFrom).format("DD MMM"),
                                    checkoutDate: moment(arrival.DateTo).format("DD MMM"),
                                    nights: moment(arrival.DateTo).diff(moment(arrival.DateFrom), "days"),
                                    room: getRoom(arrival.FK_Room)
                                });
                             });
                            }
                    }
                    else
                    {
                        $scope.arrivals = [];
                    }
        }); 
        BookingService.$departures(new Date()).then(function(data)
                {
                    
                if(data) 
                  {
                        if(data.Status ==='ERROR')
                        {
                             $scope.departures = [];
                        }    
                        else
                        { 
                            $scope.departures = [];
                            departures=data;
                                departures.forEach(function(departure) {
                                    $scope.departures.push({
                                        raw: departure,
                                        customer: departure.BookingCustomer[0].FirstName + " " + departure.BookingCustomer[0].LastName,
                                        checkinDate: moment(departure.DateFrom).format("DD MMM"),
                                        checkoutDate: moment(departure.DateTo).format("DD MMM"),
                                        nights: moment(departure.DateTo).diff(moment(departure.DateFrom), "days"),
                                        room: getRoom(departure.FK_Room)
                                    });
                                });
                            }
                    }
                    else
                    {
                        $scope.departures = [];
                    }
                });
       BookingService.$pendingArrivals(new Date()).then(function(data)
                {
                  if(data) 
                  {
                        if(data.Status ==='ERROR')
                        {
                            console.log("pendingArrivals error : ");
                            $scope.pendingArrivals = [];
                        }    
                        else {
                            $scope.pendingArrivals = [];
                            pendingArrivals=data;
                            pendingArrivals.forEach(function(arrival) {
                                $scope.pendingArrivals.push({
                                    raw: arrival,
                                    customer: arrival.BookingCustomer[0].FirstName + " " + arrival.BookingCustomer[0].LastName,
                                    checkinDate: moment(arrival.DateFrom).format("DD MMM"),
                                    checkoutDate: moment(arrival.DateTo).format("DD MMM"),
                                    nights: moment(arrival.DateTo).diff(moment(arrival.DateFrom), "days"),
                                    room: getRoom(arrival.FK_Room)
                                });
                            });
                        }
                 }
                  else
                    {
                      console.log("pendingArrivals empty data : ");
                      $scope.pendingArrivals = [];
                    }
                    
                });
        BookingService.$pendingDepartures(new Date()).then(function(data)
                {
                   if(data) 
                  {
                       if(data.Status ==='ERROR')
                        {
                            $scope.pendingDepartures = [];
                        }    
                        else {
                            $scope.pendingDepartures = [];
                            pendingDepartures=data;
                            pendingDepartures.forEach(function(departure) {
                                $scope.pendingDepartures.push({
                                    raw: departure,
                                    customer: departure.BookingCustomer[0].FirstName + " " + departure.BookingCustomer[0].LastName,
                                    checkinDate: moment(departure.DateFrom).format("DD MMM"),
                                    checkoutDate: moment(departure.DateTo).format("DD MMM"),
                                    nights: moment(departure.DateTo).diff(moment(departure.DateFrom), "days"),
                                    room: getRoom(departure.FK_Room)
                                });
                            });
                        }
                    }
                     else
                    {
                        $scope.pendingDepartures = [];
                    }
                });
        BookingService.$listDraftReservations().then(function(data)
                {
                    
                    if(data.Status ==='ERROR')
                    {

                    }    
                    else {
                        $scope.draftReservations = [];
                        $scope.draftReservations=data;
                        // console.log("data",data);
                        // draftReservations=data;
                        // draftReservations.forEach(function(reservation) {
                        //     $scope.draftReservations.push({
                        //         raw: reservation,
                        //         BookingCustomer: reservation,
                        //         customer: reservation.FirstName + " " + reservation.LastName,
                        //         checkinDate: moment(reservation.DateFrom).format("DD MMM"),
                        //         checkoutDate: moment(reservation.DateTo).format("DD MMM"),
                        //         nights: moment(reservation.DateTo).diff(moment(reservation.DateFrom), "days"),
                        //         room: reservation.FK_Room
                        //     });
                        // });
                    }
                });
         //
           TodoService.$list().then(function(data)
                {
                    if(data.Status ==='ERROR')
                    {

                    }    
                    else {
                    $scope.todoList = [];
                    if (data) {
                        todoList=data;
                        todoList.forEach(function(todoItem) {
                            $scope.todoList.push({
                                ID: todoItem.ID,
                                Item: todoItem.Item,
                                Status: todoItem.Status,
                                LastModifiedOn: moment.utc(todoItem.LastModifiedOn).toDate()
                            });
                        });
                    }
                }
                });
          //
          BookingService.$listCheckInCheckOut(new Date()).then(function(data)
                {
                   console.log("function data : ");
                   if(data.Status ==='ERROR')
                    {

                    }    
                    else {
                        // 2. Check-Ins Summary.
                        if(data)
                        {
                        summaryCheckInCheckOut=data;
                        $scope.checkinRemaining = summaryCheckInCheckOut[0].CheckInPending;
                        $scope.checkinTotal = summaryCheckInCheckOut[0].CheckInTotal;
                        $scope.checkinPercentage = (($scope.checkinTotal - $scope.checkinRemaining) / $scope.checkinTotal) * 100;
                        
                        // 3. Check-Outs Summary.
                        $scope.checkoutRemaining = summaryCheckInCheckOut[0].CheckOutPending;
                        $scope.checkoutTotal = summaryCheckInCheckOut[0].CheckOutTotal;
                        $scope.checkoutPercentage = (($scope.checkoutTotal - $scope.checkoutRemaining) / $scope.checkoutTotal) * 100;
                        }
                    }
               });
            
      
      //$scope.arrangeReportData();
       
    });

    $scope.arrangeReportData = function() {
        
        
        // 1.1. Arrivals.
        $scope.arrivals = [];
         
        if (Object.prototype.toString.call(arrivals) === '[object Array]') {
            arrivals.forEach(function(arrival) {
                $scope.arrivals.push({
                    raw: arrival,
                    customer: arrival.BookingCustomer[0].FirstName + " " + arrival.BookingCustomer[0].LastName,
                    checkinDate: moment(arrival.DateFrom).format("DD MMM"),
                    checkoutDate: moment(arrival.DateTo).format("DD MMM"),
                    nights: moment(arrival.DateTo).diff(moment(arrival.DateFrom), "days"),
                    room: getRoom(arrival.FK_Room)
                });
            });
        }
        
        // 1.2. Departures.
        $scope.departures = [];
        if (Object.prototype.toString.call(departures) === '[object Array]') {
            departures.forEach(function(departure) {
                $scope.departures.push({
                    raw: departure,
                    customer: departure.BookingCustomer[0].FirstName + " " + departure.BookingCustomer[0].LastName,
                    checkinDate: moment(departure.DateFrom).format("DD MMM"),
                    checkoutDate: moment(departure.DateTo).format("DD MMM"),
                    nights: moment(departure.DateTo).diff(moment(departure.DateFrom), "days"),
                    room: getRoom(departure.FK_Room)
                });
            });
        }
        
        // 2. Check-Ins Summary.
        if(summaryCheckInCheckOut)
        {
        $scope.checkinRemaining = summaryCheckInCheckOut[0].CheckInPending;
        $scope.checkinTotal = summaryCheckInCheckOut[0].CheckInTotal;
        $scope.checkinPercentage = (($scope.checkinTotal - $scope.checkinRemaining) / $scope.checkinTotal) * 100;
        
        // 3. Check-Outs Summary.
        $scope.checkoutRemaining = summaryCheckInCheckOut[0].CheckOutPending;
        $scope.checkoutTotal = summaryCheckInCheckOut[0].CheckOutTotal;
        $scope.checkoutPercentage = (($scope.checkoutTotal - $scope.checkoutRemaining) / $scope.checkoutTotal) * 100;
        if(!$scope.checkinPercentage)
            $scope.checkinPercentage=0;
        if(!$scope.checkoutPercentage)
            $scope.checkoutPercentage=0;

        }
        else
        {
            $scope.checkinPercentage='0';
            $scope.checkoutPercentage='0';
        }
        // 4.1. Pending Arrivals.
        $scope.pendingArrivals = [];
        if (Object.prototype.toString.call(pendingArrivals) === '[object Array]') {
            pendingArrivals.forEach(function(arrival) {
                $scope.pendingArrivals.push({
                    raw: arrival,
                    customer: arrival.BookingCustomer[0].FirstName + " " + arrival.BookingCustomer[0].LastName,
                    checkinDate: moment(arrival.DateFrom).format("DD MMM"),
                    checkoutDate: moment(arrival.DateTo).format("DD MMM"),
                    nights: moment(arrival.DateTo).diff(moment(arrival.DateFrom), "days"),
                    room: getRoom(arrival.FK_Room)
                });
            });
        }
        
        // 4.2. Pending Departures.
        $scope.pendingDepartures = [];
        if (Object.prototype.toString.call(pendingDepartures) === '[object Array]') {
            pendingDepartures.forEach(function(departure) {
                $scope.pendingDepartures.push({
                    raw: departure,
                    customer: departure.BookingCustomer[0].FirstName + " " + departure.BookingCustomer[0].LastName,
                    checkinDate: moment(departure.DateFrom).format("DD MMM"),
                    checkoutDate: moment(departure.DateTo).format("DD MMM"),
                    nights: moment(departure.DateTo).diff(moment(departure.DateFrom), "days"),
                    room: getRoom(departure.FK_Room)
                });
            });
        }
        
        // 5. Todo List.
        $scope.todoList = [];
        if (Object.prototype.toString.call(todoList) === '[object Array]') {
            todoList.forEach(function(todoItem) {
                $scope.todoList.push({
                    ID: todoItem.ID,
                    Item: todoItem.Item,
                    Status: todoItem.Status,
                    LastModifiedOn: moment.utc(todoItem.LastModifiedOn).toDate()
                });
            });
        }
        
        // 6. Draft Reservations
        // $scope.draftReservations = [];
        // if (Object.prototype.toString.call(draftReservations) === '[object Array]') {
        //     // draftReservations.forEach(function(reservation) {
        //     //     $scope.draftReservations.push({
        //     //         raw: reservation, 
        //     //         BookingCustomer: reservation,
        //     //         customer: reservation.FirstName + " " + reservation.LastName,
        //     //         checkinDate: moment(reservation.DateFrom).format("DD MMM"),
        //     //         checkoutDate: moment(reservation.DateTo).format("DD MMM"),
        //     //         nights: moment(reservation.DateTo).diff(moment(reservation.DateFrom), "days"),
        //     //         room: reservation.FK_Room
        //     //     });
              
        //     // });
        //     $scope.draftReservations=draftReservations;
        // }
        
       
    };
   // $scope.arrangeReportData();
    //
    /* $scope.$watch($scope.arrivals , function()
        {
          $scope.arrivals =$scope.arrivals;
      

        });*/
    //
    
    $scope.options = {
		barColor: '#03a9f4',
		trackColor: '#f2f2f2',
		scaleColor: false,
		lineWidth: 3,
		size: 125,
		animate: 1500,
		onStep: function(from, to, percent) {
			$(this.el).find('.percent').text(Math.round(percent));
		},
	};
    
    $scope.formatDate = function(date) {
        return convertDateToDash(date);
    };

    // $scope.openModal1 = function(booking) {

    //     var book={};
    //     console.log("booking : ",booking);
    //     book.id= booking;
    //     $rootScope.$broadcast('open-booking-modal',book); 
    // };


   // $scope.openBookingModal = function(booking, datefrom, dateto, room) {
       
   //      var modalInstance = $uibModal.open({
   //          templateUrl: "views/booking-modal2.html",
   //          controller: "BookingModalCtrl2",
   //         // controller: "bookingModalCtrl",
   //          windowClass: "small-modal",
   //          resolve: {
   //              booking: function() {
   //                if(booking===undefined) {
   //                  return undefined;
   //                } else {
   //                  if(booking.ID===undefined) {
   //                    return undefined;
   //                  } else {
   //                    return booking;
   //                  }
   //                }
   //              },
   //              dates: function () {
   //                return {
   //                  dateFrom: datefrom,
   //                  dateTo: dateto
   //                };
   //              },
   //              room: function () {
   //                return room;
   //              }
   //          }
   //      });

   //      modalInstance.result.then(function () {
   //        }, function () {
   
   //      });

   //  };
    //...............................
function reloadCalender()
{
            $("#calender").html(''); 
            $('#calender').fullCalendar({
                 height: 450,
                editable: true,
                //selectable: true,
                header:{
                  left: 'month basicWeek basicDay agendaWeek agendaDay',
                  center: 'title',
                  right: 'today prev,next'
                },
                firstDay: 1,
                dayRender: function(date, cell) {
                    cell.bind('mousedown', function(e) {
                        if (e.which == 3) {
                            //addReservation(date, e.offsetY);
                             
                            showReservationMenu(date, e.offsetY);
                        }
                    });
                },
           //     eventDrop: $scope.alertOnDrop,
            //    eventResize: $scope.alertOnResize,
                select: function(start, end, allDay, jsEvent) {
                    
                    addReservation(start, end, allDay, jsEvent);
                } 
        });
}

    //....................
    $scope.checkIn = function(booking) {



      BookingService.$checkInConfirm(booking.raw.ID)
        .then(function(response) {
            if(response) {
              $rootScope.$broadcast('updateWidgets',"date");
              reloadCalender();
            }
          }, function(error) {
              reloadCalender();
              //new errorLogger(error.message).log();
          });



    };
    
    $scope.checkOut = function(booking) {

      $uibModal.open({
          templateUrl: "views/confirmationModal.html",
          controller: function($scope, $modalInstance, booking) {
              $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
              };

              $scope.ok = function() {
                $location.path("invoices/" + booking.raw.ID);
                $modalInstance.close();
              };

            var trans=$translate.instant(['CONFIRM_MODAL_TITLE_CHECKOUT','CONFIRM_MODAL_TEXT_CHECKOUT']);
                        $scope.confirmationtext=trans.CONFIRM_MODAL_TEXT_CHECKOUT;
                        $scope.headertext=trans.CONFIRM_MODAL_TITLE_CHECKOUT;
          },
            resolve: {
                booking: function () { return booking; }
            }
          
        });





    };
    
    $scope.noShow = function(booking,source,ind) {


        BookingService.$noShowConfirm(booking.raw.ID)
        .then(function(response) {
            if(response) {
              if(source === "pendingArrivals")
              {   
                  console.log("pendingArrivals");
                  $scope.pendingArrivals.splice(ind, 1);
              }
              else  $route.reload();    
            }
          }, function(error) {
                //reloadCalender();
              $route.reload();
          });





      
    };
    
    $scope.showInvoice = function(booking) {
        $location.path("invoices/" + booking.raw.ID);
    };
    
    $scope.todos = {
        new: function() {
            $scope.todoList.unshift({
                Item: "New Todo",
                Status: 1,
                LastModifiedOn: moment()
            });
        },
        save: function(todo) {
            if (todo.ID) {
                TodoService.$update(todo.ID, todo.Item, status)
                .then(function(response) {
                    todo.LastModifiedOn = moment()
                }, function(error) {
                });
            }
            else {
                TodoService.$insert(todo.Item)
                .then(function(response) {
                    todo.ID = response.ID;
                    todo.LastModifiedOn = moment()
                }, function(error) {
                });
            }
        },
        update: function($event, todo) {
            var status = todo.Status;
            if ($event) {
                var checkbox = $event.target;
                status = (checkbox.checked? 2: 1);
            }
            TodoService.$update(todo.ID, todo.Item, status)
            .then(function(response) {
                todo.LastModifiedOn = moment()
            }, function(error) {
            });
        },
        delete: function(index) {
            var todo = $scope.todoList[index];
            if (todo) {
                TodoService.$delete(todo.ID)
                .then(function(response) {
                    $scope.todoList.splice(index, 1);       
                }, function(error) {
                });
            }
        }
    };
    
    $scope.newTodo = function() {
        $scope.todoList.unshift({
            Item: "New Todo",
            Status: 1,
            LastModifiedOn: moment()
        });
    };
    
    //$scope.updateTodo = 
    
    $scope.saveTodo = function(todo) {
        if (todo.ID) {
            TodoService.$update(todo.ID, todo.Item, status)
            .then(function(response) {
                todo.LastModifiedOn = moment()
            }, function(error) {
            });
        }
        else {
            TodoService.$insert(todo.Item)
            .then(function(response) {
                todo.ID = response.ID;
                todo.LastModifiedOn = moment()
            }, function(error) {
            });
        }
    };
    
    $scope.deleteTodo = function(index) {
        var todo = $scope.todoList[index];
        if (todo) {
            TodoService.$delete(todo.ID)
            .then(function(response) {
                $scope.todoList.splice(index, 1);       
            }, function(error) {
            });
        }
    };

    // open draft reservation
    $scope.openDraft = function(booking) {
       BookingService.$editBookingDraft(booking)
       .then(function(response) {

       }, function (response) {

       });
    }

    $scope.openBooking = function(bookingID) {
        BookingService.$editBooking(bookingID,undefined,undefined,undefined)
            .then(function(response) {
              $route.reload();
            }, function (response) {
              $route.reload();
            });
    }


    //....delete draft reservation
    $scope.removeDraft = function(id,index)
    { 
      $uibModal.open({
          templateUrl: "views/confirmationModal.html",
          controller: function($scope, $modalInstance, id,index,links,createBooking) {
              $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
              };

              $scope.ok = function() {
                links.draftReservations.splice(index,1);
                createBooking.removeDraft(id)
                 .then(function(response) { 
                    new logger("<p>Data Saved</p>","notice","growl","slide").log(); 
                }, function(error) {
                    new errorLogger(error.message).log();
                });
                $modalInstance.close();
              };

            var trans=$translate.instant(['CONFIRM_MODAL_TITLE_DELETE_DRAFT','CONFIRM_MODAL_TEXT_DELETE_DRAFT']);
                        $scope.confirmationtext=trans.CONFIRM_MODAL_TEXT_DELETE_DRAFT;
                        $scope.headertext=trans.CONFIRM_MODAL_TITLE_DELETE_DRAFT;
          },
            resolve: {
                id: function () { return id; },
                index: function () { return index; },
                links: function () { return $scope; }
                //createBooking: function () { return createBooking; }
            }
          
        }).result.then(function() {
            $route.reload();
        });

        // $('#deletePopup')
        // .modal({ backdrop: 'static', keyboard: false })
        // .one('click', '#ok', function(e) { 
        //     $scope.draftReservations.splice(index,1);
        //     createBooking.removeDraft(id)
        //      .then(function(response) { 
        //         new logger("<p>Data Saved</p>","notice","growl","slide").log(); 
        //     }, function(error) {
        //         new errorLogger(error.message).log();
        //     });

        // });

    };
    $scope.canCheckIn = function  (arrival) {
      return BookingService.$canCheckIn(arrival.raw.FK_BookingStatus, arrival.raw.DateFrom, arrival.raw.DateTo);
    };
    //....delete draft reservation end
    $rootScope.$on("refresh", function (event, refresh) {
        if (refresh) {
            $route.reload();
        }
    });
    

  });
