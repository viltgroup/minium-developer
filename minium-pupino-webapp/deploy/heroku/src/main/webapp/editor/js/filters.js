'use strict';

/* Filters */

angular.module('cucumby.filters', []).
filter('relativize', function() {
    return function(uri, baseUri) {
        return String(uri).replace(baseUri, '');
    };
}).
filter('duration', function() {
    return function(time) {
        return moment.duration(time);
    };
}).
filter('durationInMinutes', function() {
    return function(time) {
        var time = moment.duration(time);
        return time.seconds();
    };
}).
filter('humanize', function() {
    return function(duration) {
        return duration.humanize();
    };
}).
filter('moment', function() {
    return function(time) {
        return moment(time);
    };
}).
filter('fromNow', function() {
    return function(time) {
        return moment(time).fromNow();
    };
}).
filter('unescape', function() {
    return window.unescape;
}).
filter('iconUrl', function() {
    return function(fileProp) {
        var iconName = "empty";
        if (fileProp.type === 'DIR') {
            iconName = "folder";
        } else {
            var idx = fileProp.relativeUri.lastIndexOf(".");
            if (idx !== -1) {
                var ext = fileProp.relativeUri.substring(idx + 1);
                if (ext === 'feature') {
                    iconName = "feature";
                }
            }
        }
        return "/app/icons/" + iconName + ".png";
    };
}).
filter('isEmpty', function() {
    var bar;
    return function(obj) {
        for (bar in obj) {
            if (obj.hasOwnProperty(bar)) {
                return false;
            }
        }
        return true;
    };
});
