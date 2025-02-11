const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" folder
app.use(express.static(__dirname + '/public'));

// Use the port Cloud Run provides, or default to 3030 for local testing
const port = process.env.PORT || 3030;

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('join', room => {
    socket.join(room);
    socket.room = room;

    const clients = io.sockets.adapter.rooms.get(room);
    console.log(`Room "${room}" has ${clients.size} client(s)`);

    socket.emit('joined');

    if (clients.size > 1) {
      socket.to(room).emit('other-user');
    }
  });

  socket.on('offer', offer => {
    if (socket.room) {
      socket.to(socket.room).emit('offer', offer);
    }
  });

  socket.on('answer', answer => {
    if (socket.room) {
      socket.to(socket.room).emit('answer', answer);
    }
  });

  socket.on('ice-candidate', candidate => {
    if (socket.room) {
      socket.to(socket.room).emit('ice-candidate', candidate);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Listen on all network interfaces for Cloud Run compatibility
server.listen(port, '0.0.0.0', () =>
  console.log(`Server is running on port ${port}`)
);
