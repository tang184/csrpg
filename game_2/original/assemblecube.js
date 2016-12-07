	function new_cube(size, showing, texture_name, color) {
		var object;
		var vertices;
		var colors;
		var temp = mat4.create();
		
		size = size / 2;
		
		base_object = create_virtual_object();
		
		
		vertices = [
             size,  size,  0.0,
            -size,  size,  0.0,
             size, -size,  0.0,
            -size, -size,  0.0
        ];
		
		colors = color.concat(color).concat(color).concat(color);
		
		text_vertices = [
             1.0,  1.0,
             0.0,  1.0,
             1.0,  0.0,
             0.0,  0.0
        ];
		
		// Back
		if (showing[4]) {
			object = create_object(vertices, colors, base_object);
			set_texture_buffer(object, text_vertices);
			object.texture = TextureHandler.load(texture_name);
		
			mat4.identity(temp);
			mat4.translate(temp, [0.0, 0.0, -size]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
		}
		
		// Front
		if (showing[5]) {
			object = create_object(vertices, colors, base_object);
			set_texture_buffer(object, text_vertices);
			object.texture = TextureHandler.load(texture_name);
		
			mat4.identity(temp);
			mat4.translate(temp, [0.0, 0.0, -size]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
			mat4.identity(temp);
			mat4.rotate(temp, Math.PI / 1, [0, 1, 0]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
		}
		
		// Left
		if (showing[0]) {
			object = create_object(vertices, colors, base_object);
			set_texture_buffer(object, text_vertices);
			object.texture = TextureHandler.load(texture_name);
		
			mat4.identity(temp);
			mat4.translate(temp, [0.0, 0.0, -size]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
			mat4.identity(temp);
			mat4.rotate(temp, Math.PI / 2, [0, 1, 0]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
		}
		
		// Right
		if (showing[1]) {
			object = create_object(vertices, colors, base_object);
			set_texture_buffer(object, text_vertices);
			object.texture = TextureHandler.load(texture_name);
			
			mat4.identity(temp);
			mat4.translate(temp, [0.0, 0.0, -size]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
			mat4.identity(temp);
			mat4.rotate(temp, Math.PI / 2, [0, -1, 0]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
		}
		
		// Top?
		if (showing[3]) {
			object = create_object(vertices, colors, base_object);
			set_texture_buffer(object, text_vertices);
			object.texture = TextureHandler.load(texture_name);
			
			mat4.identity(temp);
			mat4.translate(temp, [0.0, 0.0, -size]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
			mat4.identity(temp);
			mat4.rotate(temp, Math.PI / 2, [1, 0, 0]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
		}
		
		// Bottom?
		if (showing[2]) {
			object = create_object(vertices, colors, base_object);
			set_texture_buffer(object, text_vertices);
			object.texture = TextureHandler.load(texture_name);
			
			mat4.identity(temp);
			mat4.translate(temp, [0.0, 0.0, -size]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
			mat4.identity(temp);
			mat4.rotate(temp, Math.PI / 2, [-1, 0, 0]);
			mat4.multiply(temp, object.pos_rel, object.pos_rel);
		}
		return base_object;
	}