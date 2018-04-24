const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8080);

const games = {};

app.get('/', function (req, res) {
  res.json({});
});

io.on('connection', function(socket){

  socket.on('NEW_GAME', function(data) {
    games[data.gameId] = data;
    socket.join(data.gameId);
    console.log('new game' + data.gameId)
  });

  socket.on('JOIN_GAME', function(gameId){
    console.log('join game', gameId);
    io.of('/').in(gameId).clients((error, inRoom) => {
      if(error) throw error;
      if(inRoom.length === 1) {
        socket.join(gameId);
        socket.broadcast.to(gameId).emit('SYNC', {
          ...games[gameId],
          ...{ status: 'started' }
        });
      }
    });
  });

  socket.on('REQUEST_GAME_INFO', function(gameId){
    if(!games[gameId]) return;
    socket.emit('SYNC', {
      ...games[gameId],
      ...{
        status: 'waiting_to_join',
      }
    });
  });

  socket.on('SYNC', function(data){
    console.log(data);
    games[data.gameId] = data;
    console.log(data.gameId);
    socket.broadcast.to(data.gameId).emit('SYNC', data);
  })
});