'use strict';

var SocketTestController = function($scope) {

    var socket = new SockJS("/ws");
    var stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);

        //TAIL for errors in remote machine or log 
        stompClient.subscribe("/test", function(message) {
            alert("ola");
        });

    });


};
