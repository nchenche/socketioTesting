const socketio = require('socket.io');

module.exports = function(server) {
  // io server
  const io = socketio(server);
  
  // game state (players list)
  const players = {};
  var bonuses = [];
  setInterval(function(){new Bonus().addTo(bonuses); console.log(bonuses);}, 5*1000);

  
  io.on('connection', function(socket) {
    // register new player
    addPlayer(socket.id);
    console.log(socket)


    socket.on('move left',  () => { movePlayer(socket.id, "left") });
    socket.on('move up',  () => { movePlayer(socket.id, "up") });
    socket.on('move right',  () => { movePlayer(socket.id, "right") });
    socket.on('move down',  () => { movePlayer(socket.id, "down") });

    // delete disconnected player
    socket.on('disconnect', () => { deletePlayer(socket.id) });
  
  });

  function addPlayer(sid) {
    players[sid] = {
      x: 0,
      y: 0,
      size: 20,
      speed: 1,
      c: "#"+((1<<24)*Math.random()|0).toString(16)
    };
  };

  function deletePlayer(sid) {
    delete players[sid];
  };

  function movePlayer(sid, direction) {
    switch (direction) {
      case "left":
        _x = players[sid].x - players[sid].speed;
        if (_x > 0 ) {
          players[sid].x -= players[sid].speed;
        }
        break;

      case "up":
        _y = players[sid].y - players[sid].speed;
        if (_y > 0 ) {
          players[sid].y -= players[sid].speed;
        }        
        break;

      case "right":
        _x = players[sid].x + players[sid].speed;
        if (_x < 640-players[sid].size ) {
          players[sid].x += players[sid].speed;
        }
        break;

      case "down":
        _y = players[sid].y + players[sid].speed;
        if (_y < 480-players[sid].size ) {
          players[sid].y += players[sid].speed;
        }
        break;

      default:
        break;
    }
  }

  function update() {
    io.volatile.emit('players list', {list: Object.values(players), bonuses: bonuses} );
  }
  
  setInterval(update, 1000/60);

  function Bonus(){};
  
  Bonus.prototype.addTo = function(arr) {
     var bonus = {
      x: Math.floor(Math.random() * 630) + 10,
      y: Math.floor(Math.random() * 470) + 10,
      c: "#"+((1<<24)*Math.random()|0).toString(16)
     }
     arr.push(bonus); //adding current instance to array
  
     setTimeout(function() { //setting timeout to remove it later
         arr.shift();
         console.log(arr);
     }, 2*1000)
  };

};

