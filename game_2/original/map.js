MapHandler = {};

MapHandler.set = function(data) {
	MapHandler.max_x = data.mx;
	MapHandler.max_y = data.my;
	MapHandler.max_z = data.mz;
	MapHandler.max_w = data.mw;
	MapHandler.goal_pos = [data.gp[0], data.gp[1], data.gp[2]];
	MapHandler.map_value = data.bt;
}

MapHandler.cube_inside_map = function(x, y, z, w) {
	var cx = (x >= 0) && (x < MapHandler.max_x);
	var cy = (y >= 0) && (y < MapHandler.max_y);
	var cz = (z >= 0) && (z < MapHandler.max_z);
	var cw = (w >= 0) && (w < MapHandler.max_w);
	return cx && cy && cz && cw;
}

MapHandler.assemble_cube = function(ax, ay, az, aw) {
	if (MapHandler.cube_inside_map(ax, ay, az, aw) && MapHandler.map_value[aw][az][ay][ax]) {
		var face_bool = [true, true, true, true, true, true];
		if (MapHandler.cube_inside_map(ax - 1, ay, az, aw) && MapHandler.map_value[aw][az][ay][ax - 1]) {
			face_bool[0] = false;
		}
		if (MapHandler.cube_inside_map(ax + 1, ay, az, aw) && MapHandler.map_value[aw][az][ay][ax + 1]) {
			face_bool[1] = false;
		}
		if (MapHandler.cube_inside_map(ax, ay - 1, az, aw) && MapHandler.map_value[aw][az][ay - 1][ax]) {
			face_bool[2] = false;
		}
		if (MapHandler.cube_inside_map(ax, ay + 1, az, aw) && MapHandler.map_value[aw][az][ay + 1][ax]) {
			face_bool[3] = false;
		}
		if (MapHandler.cube_inside_map(ax, ay, az - 1, aw) && MapHandler.map_value[aw][az - 1][ay][ax]) {
			face_bool[4] = false;
		}
		if (MapHandler.cube_inside_map(ax, ay, az + 1, aw) && MapHandler.map_value[aw][az + 1][ay][ax]) {
			face_bool[5] = false;
		}
		return new_cube(1, face_bool, "textures/cube.png", [1.0, 1.0, 1.0, 1.0]);
	}
	else {
		return false;
	}
}

MapHandler.clean_map = function() {
	var cx;
	var cy;
	var cz;
	var cw;
    var cube;

	// Remove old cubes
	if (MapHandler.cubes) {
		cw = 0;
		while (cw < MapHandler.max_w) {
			cz = 0;
			while (cz < MapHandler.max_z) {
				cy = 0;
				while (cy < MapHandler.max_y) {
					cx = 0;
					while (cx < MapHandler.max_x) {
						cube = MapHandler.cubes[cw][cz][cy][cx];
						if (cube) {
							var i = objects.indexOf(cube);
							objects.splice(i, 1);;
						}
						cx = cx + 1;
					}
					cy = cy + 1;
				}
				cz = cz + 1;
			}
			cw = cw + 1;
		}
		
		var i = objects.indexOf(MapHandler.goal);
		objects.splice(i, 1);
	}
}

MapHandler.assemble_map = function() {
	/* Assemble all cubes */
	var lx;
	var ly;
	var lz;
	var lw;
	var cx;
	var cy;
	var cz;
	var cw;
	var temp = mat4.create();
    var cube;
	
	
	// Assemple new cubes
	lw = []
	cw = 0;
	while (cw < MapHandler.max_w) {
		lz = [];
		cz = 0;
		while (cz < MapHandler.max_z) {
			ly = [];
			cy = 0;
			while (cy < MapHandler.max_y) {
				lx = [];
				cx = 0;
				while (cx < MapHandler.max_x) {
					cube = MapHandler.assemble_cube(cx, cy, cz, cw);
					lx.push(cube);
					
					if (cube) {
						mat4.identity(temp);
						mat4.translate(temp, [cx, cy, cz]);
						mat4.multiply(temp, cube.pos_rel, cube.pos_rel);
					}
					
					cx = cx + 1;
				}
				ly.push(lx);
				cy = cy + 1;
			}
			lz.push(ly);
			cz = cz + 1;
		}
		lw.push(lz);
		cw = cw + 1;
	}
	
	MapHandler.cubes = lw;
	console.log(MapHandler.cubes);
	
	/* Draw Final */
	MapHandler.goal = new_cube(0.99, [true, true, true, true, true, true], "textures/goal.png", [1.0, 1.0, 1.0, 0.5]);
	mat4.identity(temp);
	mat4.translate(temp, MapHandler.goal_pos);
	mat4.multiply(temp, MapHandler.goal.pos_rel, MapHandler.goal.pos_rel);
	
	/* Put characters to the last of the list */
	
	for (k in Connector.players) {
		var i = objects.indexOf(Connector.players[k].cube);
		var cube = objects.splice(i, 1);

		objects.push(cube[0]);
	}
	
}

