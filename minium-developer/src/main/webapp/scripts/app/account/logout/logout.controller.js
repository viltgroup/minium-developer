'use strict';

angular.module('miniumdevApp')
    .controller('LogoutController', function (Auth) {
        Auth.logout();
    });
