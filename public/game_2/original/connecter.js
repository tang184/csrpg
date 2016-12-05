var Connector = {};
Connector.init = function(address) {
    Connector.socket = new WebSocket(address);
	Connector.players = {};
    Connector.socket.onmessage = function (event) {
		
		var response = JSON.parse(event.data);
		if (response.cmd == "st") {
			Connector.update_statement(response);
		}
		if (response.cmd == "mp") {
			MapHandler.clean_map();
			MapHandler.set(response.mp);
			MapHandler.assemble_map();
		}
		
		Connector.player = Connector.players[Connector.player_id];
	};
}

Connector.update_statement = function (response) {
	var statement = response.st;
	var stat_char;
	var real_char;
	
	Connector.player_id = response.id;
	
	var to_add = statement.a;
	for (id in to_add) {
		Connector.new_player(to_add[id]);
		Connector.update_player(to_add[id]);
	}
	
	var to_send = statement.s;
	for (id in to_send) {
		Connector.update_player(to_send[id]);
	}
	
	var to_remove = statement.r;
	for (id in to_remove) {
		console.log("to_remove");
		Connector.remove_player(to_remove[id]);
		delete Connector.players[id];
	}
	
	Connector.player = Connector.players[Connector.player_id];
	
}

Connector.new_player = function (stat) {
	var player = {};
	player.id = stat["id"];
	Connector.players[player.id] = player;
	
	if (player.id == Connector.player_id) {
		player.cube = create_virtual_object();
	}
	else {
		player.cube = new_cube(0.3, [true, true, true, true, true, true], "textures/character_bottom.gif", [1.0, 1.0, 1.0, 1.0]);
	}
}

Connector.update_player = function (stat) {
	var player = Connector.players[stat["id"]];
	player.position = JSON.parse(stat["p"]);
	player.velocity = JSON.parse(stat["v"]);
	player.score = stat["s"];
}

Connector.remove_player = function (stat) {
	var player = Connector.players[stat["id"]];
	var i = objects.indexOf(player.cube);
	objects.splice(i, 1);;
}

Connector.tick = function(time_delta) {
	for (id in Connector.players) {
		Connector.tick_player(Connector.players[id], time_delta);
	}
}

Connector.tick_player = function (player, time_delta) {
	
	var temp = [0, 0, 0]
	vec3.scale(player.velocity, time_delta, temp);
	vec3.add(player.position, temp);
	
	player.cube.pos_rel = mat4.create();
    mat4.identity(player.cube.pos_rel);
    mat4.translate(player.cube.pos_rel, player.position);
	calculate_pos_abs(player.cube);
	
	Connector.update_distance_certain(player);
}

Connector.send_movement = function(movement) {
	function unit(v) {
		var l = vec3.length(v);
		if (l == 0) {
			return [0, 0, 0];
		}
		return vec3.scale(v, 1 / l, vec3.create());
	}
	if ((Connector.last_movement) && (vec3.length(vec3.subtract(unit(movement), unit(Connector.last_movement), vec3.create())) < 0.05)) {
		return;
	}
	Connector.last_movement = [movement[0], movement[1], movement[2]];
	var data = {}
	data.command = "move";
	data.x = movement[0];
	data.y = movement[1];
	data.z = movement[2];
	Connector.socket.send(Connector.dict_to_string(data));
}

Connector.dict_to_string = function(dict) {
	function fix(e) {
		if (isNaN(e)) {
			return "\"" + e.toString() + "\"";
		}
		else {
			return e.toString();
		}
	}
	var s = "{";
	var len = Object.keys(dict).length
	var count = 0;
	for (k in dict) {
		s = s + fix(k) + ":" + fix(dict[k]);
		if (count < len - 1) {
			s = s + ",";
		}
		else {
			s = s + "}";
		}
		count = count + 1;
	}
	return s;
}

Connector.list_to_string = function(list) {
	function fix(e) {
		if (isNaN(e)) {
			return "\"" + e.toString() + "\"";
		}
		else {
			return e.toString();
		}
	}
	var s = "[";
	var len = Object.keys(dict).length
	for (k in list) {
		s = s + fix(dict[k]);
		if (k < len - 1) {
			s = s + ",";
		}
		else {
			s = s + "]";
		}
	}
	return s;
}

Connector.update_distance_certain = function(player) {
	if (player == Connector.player) {
		return;
	}
	var d = vec3.length(vec3.subtract(player.position, Connector.player.position, vec3.create()));
	var a = (d / 0.3) - 1.0;
	if (a < 0.0) {
		player.cube.a = 0.0;
		player.cube.drawing = false;
		return;
	}
	if (a > 1.0) {
		a = 1.0;
	}
	if (player.cube.a != a) {
		player.cube.a = a;
		player.cube.drawing = true;
		
		var faces = player.cube.subobjects;
		var face;
		var k;
		for (k in faces) {
			face = faces[k];
			face.colors[3] = a;
			face.colors[7] = a;
			face.colors[11] = a;
			face.colors[15] = a;
			set_color_buffer(face, face.colors);
		}
	}
}