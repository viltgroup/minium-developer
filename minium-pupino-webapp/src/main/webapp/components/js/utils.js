(function(componentsModule) {
	'use strict';
	var UtilsService = function(){};

	UtilsService.prototype.calcPerCent = function(value, total) {
        return (100 * value / total).toFixed(2);
    };
    
	componentsModule.service('UtilsService', UtilsService);	
})(angular.module('vilt.components'));