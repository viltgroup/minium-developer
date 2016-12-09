'use strict';

angular.module('miniumdevApp')
    .factory('Utils', function() {

        var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789';

        var Utils = function() {};

        Utils.generateId = function() {
            var generatedId = "";
            var MAX_CHARS = 10;

            for (var i = 0; i < MAX_CHARS; i++) {
                generatedId += keyStr.charAt(Math.floor(Math.random() * keyStr.length));
            }

            return generatedId;
        };
        
        return Utils;
    });
