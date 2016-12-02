var Ticker = {};
Ticker.time = new Date().getTime() / 1000.0;

Ticker.tick = function() {
	var new_time = new Date().getTime() / 1000.0;
	var delta_time = new_time - Ticker.time;
	Ticker.time = new_time;
	return delta_time
}