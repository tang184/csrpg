var ScoreBoard = {};

ScoreBoard.init = function() {
	ScoreBoard.canvas = document.getElementById("scoreboard-canvas");
	ScoreBoard.ctx = ScoreBoard.canvas.getContext("2d");
}

ScoreBoard.draw = function() {
	var player;
	var y = 50;
	
	ScoreBoard.ctx.font = "20px Consolas";
	
	ScoreBoard.ctx.beginPath();
	ScoreBoard.ctx.rect(0, 0, 200, 800);
	ScoreBoard.ctx.fillStyle = "#FFFF99";
	ScoreBoard.ctx.fill();
	for (id in Connector.players) {
		player = Connector.players[id];
		if (id == Connector.player_id) {
			ScoreBoard.ctx.fillStyle = 'blue';
		}
		else {
			ScoreBoard.ctx.fillStyle = 'black';
		}
		ScoreBoard.ctx.fillText("player " + id.toString() + " : " + player.score.toString(), 50, y);
		y = y + 50;
	}
}