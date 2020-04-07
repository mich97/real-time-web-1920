import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const app = express();
const server = http.createServer(app);
const ioInstance = socketIO(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

ioInstance.on('connection', function(socket) {
    console.log('socket created');

    let userName = 'anonymous';
    socket.emit('server message', `SERVER: Welcome to the void.`);
    socket.broadcast.emit('server message', `SERVER: User ${userName} connected.`);

    socket.on('set user', function(id) {
        const oldUsername = userName;
        userName = id;
        console.log(`user with id ${userName} connected`);
        socket.emit('server message', `SERVER: Your username was changed to ${userName}.`);
        socket.broadcast.emit('server message', `SERVER: User ${oldUsername} changed their name to ${userName}.`);
    });

    socket.on('disconnect', function(){
        console.log(`user with id ${userName} disconnected`);
        ioInstance.emit('server message', `SERVER: User with id ${userName} disconnected.`);
    });

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        ioInstance.emit('chat message', `${userName}: ${msg}`);
    });
})

server.listen(3000, function() {
    console.log('listening on *:3000');
});