const { Server } = require('socket.io');

let io = null;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
}

function emitirNotificacion(data) {
  if (io) {
    io.emit('nueva-notificacion', data);
  }
}

module.exports = {
  initSocket,
  emitirNotificacion,
};
