var ControlHandler = {};

// This is going to be pulled from the server.
ControlHandler.init = function() {
	ControlHandler.abilities = {};
	ControlHandler.casting_ability = null;
	
	var ability;
	
	ability = ControlHandler.new_ability("images/characters/hardfake/icon_Q.png", "MS", "A");
	ability.hotkey = 81;
	ability.target = "P";
	ability.cooldown = 4.0
	ability.resttime = 0.0
	ControlHandler.abilities[ability.hotkey] = ability;
	
	ability = ControlHandler.new_ability("images/characters/hardfake/icon_E.png", "AL", "A");
	ability.hotkey = 69;
	ability.target = "P";
	ability.cooldown = 15.0
	ability.resttime = 0.0
	ControlHandler.abilities[ability.hotkey] = ability;
}

ControlHandler.new_ability = function(image_name, name, type) {
	var ability = {};
	ability.image = ImageHandler.load(image_name);
	ability.name = name;
	ability.type = type;
	return ability;
}

ControlHandler.tick_ability = function(ability, time_delta) {
	if ((ability.type == "A") && (ability.resttime > 0)) {
		ability.resttime = ability.resttime - time_delta;
		if (ability.resttime < 0) {
			ability.resttime = 0;
		}
	}
}

ControlHandler.cast_ability = function(ability, target) {
	if ((ability.type == "A") && (ability.resttime <= 0)) {
		console.log("casting ability" + ability.name);
		console.log(MapHandler.to_map_pos(target));
	}
}

ControlHandler.send_movement = function() {
	var v = new Point(0.0, 0.0);
	if (EventHandler.currentlyPressedKeys[87]) {
		v = v.add(new Point(0.0, -1.0));
	};
	if (EventHandler.currentlyPressedKeys[83]) {
		v = v.add(new Point(0.0, 1.0));
	};
	if (EventHandler.currentlyPressedKeys[65]) {
		v = v.add(new Point(-1.0, 0.0));
	};
	if (EventHandler.currentlyPressedKeys[68]) {
		v = v.add(new Point(1.0, 0.0));
	};
	command = {};
	command["command"] = "move";
	command["x"] = v.x;
	command["y"] = v.y;
	Connector.socket.send(General.dick_to_string(command));
}

ControlHandler.handleKeyDown = function(key) {
	ControlHandler.send_movement();
	var ability = ControlHandler.abilities[key];
	console.log(ability);
	if ((!ability) || (ability.type != "A") || (ability.resttime > 0)) {
		return;
	}
	if (ability.target) {
		ControlHandler.casting_ability = ability;
	}
	else {
		ControlHandler.cast_ability(ability);
	}
}

ControlHandler.handleKeyUp = function(key) {
	ControlHandler.send_movement()
}

ControlHandler.handleMouseDown = function(button, position) {
	
	if (ControlHandler.casting_ability) {
		ControlHandler.cast_ability(ControlHandler.casting_ability, ControlHandler.to_abs_pos(position));
	}
	
	// Perform attack.
}

ControlHandler.tick = function(time_delta) {
	var key;
	for (key in ControlHandler.abilities) {
		ControlHandler.tick_ability(ControlHandler.abilities[key], time_delta);
	}
}

ControlHandler.to_char_pos = function(pos) {
	var x = pos.x;
	var y = pos.y;
	var player_abs_pos = MapHandler.to_abs_pos(ControlHandler.player.position);
	var px = player_abs_pos.x;
	var py = player_abs_pos.y;
	return new Point(x - px + (DoubleBuff.max_x / 2), y - py + (DoubleBuff.max_y / 2));
}

ControlHandler.to_abs_pos = function(pos) {
	var x = pos.x;
	var y = pos.y;
	var player_abs_pos = MapHandler.to_abs_pos(ControlHandler.player.position);
	var px = player_abs_pos.x;
	var py = player_abs_pos.y;
	return new Point(x + px - (DoubleBuff.max_x / 2), y + py - (DoubleBuff.max_y / 2));
}