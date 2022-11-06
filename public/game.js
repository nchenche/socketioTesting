const socket = io();
let players = [];
const ctx = canvas.getContext('2d');
const keyboard = {};
let bonuses = [];


socket.on('players list', function(data) {
    players = data.list;
    bonuses = data.bonuses;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawBonuses();
    drawPlayers();
});


function drawPlayers() {
    players.forEach(function({x, y, size, c}) {
      ctx.beginPath();
      ctx.rect(x, y, size, size);
      ctx.fillStyle = c;
      ctx.fill();
    });
}

function movePlayer() {
    if (keyboard['ArrowLeft']) socket.emit('move left');
    if (keyboard['ArrowUp']) socket.emit('move up');
    if (keyboard['ArrowRight']) socket.emit('move right');
    if (keyboard['ArrowDown']) socket.emit('move down');
}


function drawBonuses() {
    bonuses.forEach(function({x, y, c}) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = c;
      ctx.fill();
    });
}




window.onkeydown = function(e) {
    keyboard[e.key] = true;
};

window.onkeyup = function(e) {
    delete keyboard[e.key];
};
  