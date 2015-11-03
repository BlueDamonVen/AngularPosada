'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:SettingsWizardCtrl
 * @description
 * # SettingsWizardCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('SettingsWizardCtrl', function  ($scope, $rootScope, $http,langTransService,webConstants,$location, $translate) {

  $scope.model = {company:{}, property:{}};
  $scope.steps = [
      {templateUrl: 'views/settingsWizardStep1.html' , title: "Step 1", hasForm: true},
      {templateUrl: 'views/settingsWizardStep2.html' , title: "Step 2", hasForm: true},
      {templateUrl: 'views/settingsWizardStep3.html' , title: "Step 3"},
      {templateUrl: 'views/settingsWizardStep4.html' , title: "Step 4"},
      {templateUrl: 'views/settingsWizardStep5.html' , title: "Step 5"}
  ];

  var hostCallserver =webConstants.hostCallserver;
  var host = webConstants.host;

  //Company
  $scope.saveCompany = function() {
      var str = $.param($scope.model.company);
    callserver(hostCallserver+"&object=Company&method=Update&token="+$rootScope.credentials.currentUser.token+"&"+str,function (response) {
      if (response.status == 'OK') {
        new logger("<p>Data Saved</p>","notice","growl","slide").log();
        if(response.data.Status === undefined){
        } else {
          if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
            new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
          }
        }
      }
    },$http,$scope);
  };

  $scope.getCompanyData = function () {
    callserver(hostCallserver+"&object=Company&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Company="+$rootScope.globals.fk_property.fk_company,function (response) {
      if (response.status == 'OK') {
        if(response.data.Status === undefined){
          if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
            var companies = [];
            for (var i in response.data) {
              companies.push(response.data[i]);
            }
            $scope.model.company = companies[0];
            $scope.model.company.Logo += "?_ts="+ new Date().getTime();
          }
        } else {
          if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
            new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
          }
        }
        
        
      }
    
    },$http,$scope);   
  };

  $scope.getCompanyData();

  //Property
  $scope.PropertyImages=[];
  $scope.uploadUrl = host+"/gcs/bearcrsuploadimages?callback=callback&object=Property&method=AddImage&FK_Company="+$rootScope.globals.fk_property.fk_company+"&FK_Property="+$rootScope.globals.fk_property.id+"&fileextension=.png&token="+$rootScope.credentials.currentUser.token;
  $scope.map = {
    center: {
      latitude: 52.2296756, //defaul Warsaw Center
      longitude: 21.012228699999998
    },
    zoom: 15,
  };
  var events = {
    places_changed: function (autocomplete) {
      var place = autocomplete.getPlaces();
      if (place[0].address_components) {
        $scope.map.center.latitude=place[0].geometry.location.lat();
        $scope.map.center.longitude=place[0].geometry.location.lng();

        $scope.marker.coords.latitude=$scope.map.center.latitude;
        $scope.marker.coords.longitude=$scope.map.center.longitude;

        if($scope.property.Latitude!=$scope.map.center.latitude || $scope.property.Longitude!=$scope.map.center.longitude) {
          $scope.property.Latitude=$scope.map.center.latitude;
          $scope.property.Longitude=$scope.map.center.longitude;
          $scope.save();
        }

        $scope.map.zoom = 15;
        $scope.$apply();
      } else {
      }

    }
  };
  $scope.searchbox = { template:'searchbox.tpl.html', events:events};

  var onSuccess = function(position) {
    $scope.map.center = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    $scope.map.zoom = 15;
    $scope.$apply();
  }
  function onError(error) {
    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
  }

  $scope.centeronlocation = function (longitude,latitude) {
    if(longitude===undefined || latitude===undefined) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      $scope.map.center = {
        latitude: latitude,
        longitude: longitude
      };

      $scope.map.zoom = 15;
    }
  }

  $scope.marker = {
    id: 0,
    coords: {
      latitude: $scope.map.center.latitude,
      longitude: $scope.map.center.longitude
    },
    options: { draggable: true },
    events: {
      dragend: function (marker, eventName, args) {
        var lat = marker.getPosition().lat();
        var lon = marker.getPosition().lng();

        $scope.marker.options = {
          draggable: true
        };

        $scope.model.property.Latitude = lat;
        $scope.model.property.Longitude = lon;
        $scope.save();
      }
    }
  };

  $scope.saveProperty = function() {
      var str = $.param($scope.model.property);
      callserver(hostCallserver+"&object=Property&method=Update&token="+$rootScope.credentials.currentUser.token+"&"+str,function (response) {
      if (response.status == 'OK') {
        if(response.data.Status === undefined){
          new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
        } else {
          if(response.data.Status == "OK") {
            new logger("<p>Data Saved</p>","notice","growl","slide").log();
            $scope.$broadcast("reloadProperties");
          
          } else {
            new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
          }
        }

        } else {
          if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
            new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
          }
        }
    },$http,$scope);
  }

  $scope.getPropertyDescriptions = function() {
    $scope.model.property.desc = [];
    callserver(hostCallserver+"&object=Propertydesc&method=List&token="+$rootScope.credentials.currentUser.token+"&FK_Property="+$rootScope.globals.fk_property.id,function (response) {
      if (response.status == 'OK') {
        if(response.data.Status === undefined){
          if( Object.prototype.toString.call( response.data ) === '[object Array]' ) {
            for (var i in response.data) {
              $scope.model.property.desc.push(response.data[i]);
            }
          }
        } else {
          if(typeof(response.data.ErrorNumber) != "undefined" && response.data.ErrorNumber != "1010" ) {
            new logger("<span class='fa fa-exclamation-circle fa-3x pull-left'></span><p>Error: "+response.data.ErrorNumber+" "+response.data.ErrorMessage+" </p>","error","growl","slide").log();
          }
        }
      }
    
    },$http,$scope); 
  }

  $scope.getPropertyDescriptions();

  $scope.roomtypes = [
    {
      BedType: "3",
      ID: 1,
      LangCode: "ENG",
      LongDescription: "RoomType Long Description",
      OccupancyAdults: "1",
      OccupancyChildren: "0",
      RoomSize: "40",
      ShortDescription: "Single"
    }
  ];
  var trans=[];
  $scope.BedTypes=[];

  $scope.translateBedTypes = function () {

    trans=$translate.instant(['PROPERTY_ROOMTYPE_BED_SINGE', 'PROPERTY_ROOMTYPE_BED_DOUBLE']);
    
    $scope.BedTypes=[
      {"ID":1,"Name": trans.PROPERTY_ROOMTYPE_BED_SINGE},
      {"ID":2,"Name": trans.PROPERTY_ROOMTYPE_BED_DOUBLE},
      {"ID":3,"Name":"Queen"},
      {"ID":4,"Name":"King"}
    ];
  }

  $scope.translateBedTypes();

  /**
  * 
  **/
  $scope.handleNextStep = function (currentStep) {
    switch(currentStep){
      case 1:
        $scope.model.property.Email = angular.copy($scope.model.company.Email);
        $scope.saveCompany();
        break;
      default:
        break;
    }
  }

});