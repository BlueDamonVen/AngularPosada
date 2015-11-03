'use strict';

/**
 * @ngdoc service
 * @name bearpms3App.langTransService
 * @description
 * # langTransService
 * Service in the bearpms3App.
 */
angular.module('bearpms3App')
  .service('langTransService', function ($rootScope, $translate) {
    // AngularJS will instantiate a singleton by calling "new" on this function
	    
	    this.getSelectedLanguage=function() 
	    {  
	    	var selectedLanguage;
	    	var selLang = $translate.proposedLanguage(); //see if there is a proposed language change
	   		if(selLang===undefined) selLang=$translate.use(); //if there is no change in progress see current language
	   		if(selLang===undefined) selLang=$rootScope.globals.selectedLanguage; //in case none of the above gets a response check rootscope variable

	    	if(selLang==="en")
	    		selectedLanguage="ENG";
	    	else if(selLang==="pl")
	    		selectedLanguage="POL";
	    	else if(selLang==="es")
	    		selectedLanguage="ESP";
	    	else if(selLang==="fr")
	    		selectedLanguage="FRA";
	    	else selectedLanguage="ENG";



	      return selectedLanguage;

	    };

	

  });
