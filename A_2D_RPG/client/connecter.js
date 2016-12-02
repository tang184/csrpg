var Connector = {};
Connector.init = function(address) {
    Connector.socket = new WebSocket(address);
    Connector.socket.onmessage = function (event) {
		var response = JSON.parse(event.data);
		// console.log(response);
		var statement = response.statement;
		var stat_char;
		var real_char;
		
		var to_add = statement.add;
		for (id in to_add) {
			console.log("add");
			stat_char = to_add[id];
			real_char = ContentHandler.new_content(stat_char.id, new Point(stat_char.px, stat_char.py), new Point(stat_char.vx, stat_char.vy), stat_char.image);
		}
		
		var to_send = statement.send;
		for (id in to_send) {
			stat_char = to_send[id];
			real_char = ContentHandler.contents[id];
			real_char.position = new Point(stat_char.px, stat_char.py);
			real_char.velocity = new Point(stat_char.vx, stat_char.vy);
		}
		
		var to_remove = statement.remove;
		for (id in to_remove) {
			stat_char = to_remove[id];
			delete ContentHandler.contents[id];
		}
		
		ControlHandler.player = ContentHandler.contents[response.char_id];
	};
}