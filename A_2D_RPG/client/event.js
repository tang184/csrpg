var EventHandler = {};
EventHandler.currentlyPressedKeys = {};
EventHandler.mouse = false;
EventHandler.mouse_x = 0;
EventHandler.mouse_y = 0;


EventHandler.handleKeyDown = function(event) {
	EventHandler.currentlyPressedKeys[event.keyCode] = true;
	ControlHandler.handleKeyDown(event.keyCode);
}
EventHandler.handleKeyUp = function(event) {
	EventHandler.currentlyPressedKeys[event.keyCode] = false;
	ControlHandler.handleKeyUp(event.keyCode);
}
EventHandler.handleKeyTick = function(time_delta) {

	// ControlHandler.player.velocity = v;
}
EventHandler.handleMouseDown = function(event) {
	EventHandler.mousedown = true;
	EventHandler.mouse_x = event.clientX;
	EventHandler.mouse_y = event.clientY;
	ControlHandler.handleMouseDown(event.button, new Point(EventHandler.mouse_x, EventHandler.mouse_y));
}
EventHandler.handleMouseUp = function(event) {
	EventHandler.mousedown = false;
	EventHandler.mouse_x = event.clientX;
	EventHandler.mouse_y = event.clientY;
}
EventHandler.handleMouseMove = function(event) {
	EventHandler.mouse_x = event.clientX;
	EventHandler.mouse_y = event.clientY;
}