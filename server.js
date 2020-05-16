var app = require('./app');
var port = 4000;
var server = app.listen(port,function(){
    console.log("express app listening on port "+ port);
});

var io = require('socket.io').listen(server);
// signaling
io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('create or join', function (room) {
        console.log('create or join to room ', room);
        
        var myRoom = io.sockets.adapter.rooms[room] || { length: 0 };
        var numClients = myRoom.length;

        console.log(room, ' has ', numClients, ' clients');

        if (numClients == 0) {
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients == 1) {
            console.log(">>>>>joined");
            socket.join(room);
            socket.emit('joined', room);
        } else {
            socket.emit('full', room);
        }
    });

    socket.on('ready', function (room){
        console.log(">>>>>ready");
        socket.broadcast.to(room).emit('ready');
    });

    socket.on('candidate', function (event){
        console.log(">>>>>candidate");
        socket.broadcast.to(event.room).emit('candidate', event);
    });

    socket.on('offer', function(event){
        console.log(">>>>>offer");
        socket.broadcast.to(event.room).emit('offer',event.sdp);
    });

    socket.on('answer', function(event){
        console.log(">>>>>answer");
        socket.broadcast.to(event.room).emit('answer',event.sdp);
    });

});

