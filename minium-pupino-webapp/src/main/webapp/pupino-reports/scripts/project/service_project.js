'use strict';

pupinoReports
    .factory('Project', function($resource) {
        return $resource('app/rest/projects/:id', {}, {
            'query': {
                method: 'GET',
                isArray: true
            },
            'get': {
                method: 'GET'
            }
        });
    });

/**
 * Factory to calculate the progress of the a build
 * Given the timestamp and the duration of the build
 * @param  {[type]} ) {               var EstimationTime [description]
 * @return {[type]}   [description]
 */
pupinoReports.factory('EstimationTime', function() {
    var EstimationTime = function(timestamp, duration) {
        this.start = timestamp;
        this.end = timestamp + duration + 1000;
        //this.estimatedTime = this.currentTime();
    };

    EstimationTime.prototype.currentTime = function() {
        var now = new Date();
        var nowEpoch = now.getTime();

        var total = roundDown(this.end - this.start);
        var elapsed = roundDown(nowEpoch - this.start);
        var estimatedTime = roundDown(elapsed / total);

        return estimatedTime;
    };

     EstimationTime.prototype.duration = function() {
        return this.end;
    };

    var roundDown = function(floating) {
        var rounded = Math.round(floating * 100);
        return rounded;
    }

    return EstimationTime;

});
