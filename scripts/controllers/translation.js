'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:TranslationCtrl
 * @description
 * # TranslationCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('translationCtrl', function ($scope,$translate,$rootScope){ 
    // 
 
	 	$scope.translatelabels = function(key){
	 		
	 		$rootScope.globals.selectedLanguage= key;
	 		 
	 		//....
	 		
	 		
	 		if(key==='es')
	 		{
		 		var src="js/fullcalendar/lang/es.js";
		 		var src1 ="js/bstrapLang/bes.js";
		 		var jsLink = $("<script type='text/javascript' src='"+src+"'>");
		 		var jsLink1 = $("<script type='text/javascript' src='"+src1+"'>");
		 		$("head").append(jsLink);
		 		$("head").append(jsLink1); 
	 		}
	 		else if(key==='de')
	 		{
	 			var src="js/fullcalendar/lang/de.js";
		 		var src1 ="js/bstrapLang/bde.js";
		 		var jsLink = $("<script type='text/javascript' src='"+src+"'>");
		 		var jsLink1 = $("<script type='text/javascript' src='"+src1+"'>");
		 		$("head").append(jsLink);
		 		$("head").append(jsLink1);
	 		}
	 		else if(key==='fr')
	 		{
	 			var src1 ="js/bstrapLang/frb.js";
		 		var src="js/fullcalendar/lang/fr.js";
		 		var jsLink = $("<script type='text/javascript' src='"+src+"'>");
		 		var jsLink1 = $("<script type='text/javascript' src='"+src1+"'>");
		 		$("head").append(jsLink);
		 		$("head").append(jsLink1);
	 		}
	 		else if(key==='en')
	 		{
		 		var src="js/fullcalendar/lang/en-au.js";
		 		var src1 ="js/bstrapLang/ben.js";
		 		var jsLink = $("<script type='text/javascript' src='"+src+"'>");
		 		var jsLink1 = $("<script type='text/javascript' src='"+src1+"'>");
		 		$("head").append(jsLink);
		 		$("head").append(jsLink1);
	 		}
	 		
	 		else if(key==='pl')
	 		{
		 		var src="js/fullcalendar/lang/pl.js";
		 		var src1 ="js/bstrapLang/bpl.js";
		 		var jsLink = $("<script type='text/javascript' src='"+src+"'>");
		 		var jsLink1 = $("<script type='text/javascript' src='"+src1+"'>");
		 		$("head").append(jsLink);
		 		$("head").append(jsLink1);
	 		}
	 		else  
	 		{
		 		var src="js/fullcalendar/lang/en-au.js";
		 		var src1 ="js/bstrapLang/ben.js";
		 		var jsLink = $("<script type='text/javascript' src='"+src+"'>");
		 		var jsLink1 = $("<script type='text/javascript' src='"+src1+"'>");
		 		$("head").append(jsLink);
		 		$("head").append(jsLink1);
	 		}
	 		//....
            $translate.use(key);
            
			$scope.selectedLanguage = key;  
			 
		};

		$scope.languageArray = ['en','de','es','fr','pl'];

		var selLang=$translate.proposedLanguage(); //see if there is a proposed language change
   		if(selLang===undefined) selLang=$translate.use(); //if there is no change in progress see current language
   		if(selLang===undefined) selLang="en"; //in case none of the above gets a response 

	   	$scope.selectedLanguage = selLang;  
		//if(selLang!==undefined) $rootScope.globals.selectedLanguage= selLang; //$translate.use(selLang);

		//return $translate.use();
		
		
		
	 
  });
