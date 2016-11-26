	function new_cube(size, alpha) {
		var object;
		var vertices;
		var colors;
		var temp = mat4.create();
		
		base_object = create_virtual_object();
		
		
		vertices = [
             size,  size,  0.0,
            -size,  size,  0.0,
             size, -size,  0.0,
            -size, -size,  0.0
        ];
		
		colors = [
             1.0,  0.0,  0.0,  alpha,
             1.0,  0.0,  0.0,  alpha,
             1.0,  0.0,  0.0,  alpha,
             1.0,  0.0,  0.0,  alpha
        ];
		object = create_object(vertices, colors, base_object);
		
		mat4.identity(temp);
		mat4.translate(temp, [0.0, 0.0, -size]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		
		colors = [
             0.0,  1.0,  1.0,  alpha,
             0.0,  1.0,  1.0,  alpha,
             0.0,  1.0,  1.0,  alpha,
             0.0,  1.0,  1.0,  alpha
        ];
		object = create_object(vertices, colors, base_object);
		
		mat4.identity(temp);
		mat4.translate(temp, [0.0, 0.0, -size]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		mat4.identity(temp);
		mat4.rotate(temp, Math.PI / 1, [0, 1, 0]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		
		colors = [
             0.0,  1.0,  0.0,  alpha,
             0.0,  1.0,  0.0,  alpha,
             0.0,  1.0,  0.0,  alpha,
             0.0,  1.0,  0.0,  alpha
        ];
		object = create_object(vertices, colors, base_object);
		
		mat4.identity(temp);
		mat4.translate(temp, [0.0, 0.0, -size]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		mat4.identity(temp);
		mat4.rotate(temp, Math.PI / 2, [0, 1, 0]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		
		colors = [
             1.0,  0.0,  1.0,  alpha,
             1.0,  0.0,  1.0,  alpha,
             1.0,  0.0,  1.0,  alpha,
             1.0,  0.0,  1.0,  alpha
        ];
		object = create_object(vertices, colors, base_object);
		
		mat4.identity(temp);
		mat4.translate(temp, [0.0, 0.0, -size]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		mat4.identity(temp);
		mat4.rotate(temp, Math.PI / 2, [0, -1, 0]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		
		colors = [
             0.0,  0.0,  1.0,  alpha,
             0.0,  0.0,  1.0,  alpha,
             0.0,  0.0,  1.0,  alpha,
             0.0,  0.0,  1.0,  alpha
        ];
		object = create_object(vertices, colors, base_object);
		
		mat4.identity(temp);
		mat4.translate(temp, [0.0, 0.0, -size]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		mat4.identity(temp);
		mat4.rotate(temp, Math.PI / 2, [1, 0, 0]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		
		colors = [
             1.0,  1.0,  0.0,  alpha,
             1.0,  1.0,  0.0,  alpha,
             1.0,  1.0,  0.0,  alpha,
             1.0,  1.0,  0.0,  alpha
        ];
		object = create_object(vertices, colors, base_object);
		
		mat4.identity(temp);
		mat4.translate(temp, [0.0, 0.0, -size]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		mat4.identity(temp);
		mat4.rotate(temp, Math.PI / 2, [-1, 0, 0]);
		mat4.multiply(temp, object.pos_rel, object.pos_rel);
		
		return base_object;
	}