var objects = [];

function setMatrixUniforms(mvMatrix) {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function set_vertex_buffer(object, input_vertices) {
	var vertices = input_vertices.slice();
	VertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    VertexPositionBuffer.itemSize = 3;
    VertexPositionBuffer.numItems = Math.round(vertices.length / VertexPositionBuffer.itemSize);
	
	object.VertexPositionBuffer = VertexPositionBuffer;
}

function set_color_buffer(object, input_colors) {
	var colors = input_colors.slice();
    VertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    VertexColorBuffer.itemSize = 4;
    VertexColorBuffer.numItems = Math.round(colors.length / VertexColorBuffer.itemSize);
	
	object.VertexColorBuffer = VertexColorBuffer;
}

function create_object(vertices, colors, parent_object) {
	object = {};
	set_vertex_buffer(object, vertices);
	set_color_buffer(object, colors);
		
	object.pos_rel = mat4.create();
    mat4.identity(object.pos_rel);
	
	object.subobjects = [];
	object.drawable = true;
	if (!parent_object) {
		objects.push(object);
	}
	else {
		parent_object.subobjects.push(object);
	}
		
	return object;
}

function create_virtual_object(parent_object) {
	object = {};

	object.pos_rel = mat4.create();
    mat4.identity(object.pos_rel);
	
	object.subobjects = [];
	object.drawable = false;
	if (!parent_object) {
		objects.push(object);
	}
	else {
		parent_object.push(object);
	}
		
	return object;
}

function calculate_pos_abs(object, offset) {
	if (!object.pos_abs) {
		object.pos_abs = mat4.create();
	}
	if (!offset) {
		mat4.identity(object.pos_abs);
	}
	else {
		mat4.set(offset, object.pos_abs);
	}
	// mat4.multiply(object.pos_rel, object.pos_abs, object.pos_abs);
	mat4.multiply(object.pos_abs, object.pos_rel, object.pos_abs);
	
    for (id in object.subobjects) {
		calculate_pos_abs(object.subobjects[id], object.pos_abs);
	}
}

function appply_pos_draw(object, offset) {
	if (!object.pos_abs) {
		calculate_pos_abs(object)
	}
	if (!object.pos_draw) {
		object.pos_draw = mat4.create();
		mat4.set(object.pos_abs, object.pos_draw);
	}
	if (offset) {
		mat4.multiply(offset, object.pos_draw, object.pos_draw);
	}
	
    for (id in object.subobjects) {
		appply_pos_draw(object.subobjects[id], offset);
	}
}

function draw_object(object) {
    var mvMatrix = mat4.create();
    mat4.set(object.pos_draw, mvMatrix);
	
	if (object.drawable) {
		gl.bindBuffer(gl.ARRAY_BUFFER, object.VertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, object.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, object.VertexColorBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, object.VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		setMatrixUniforms(mvMatrix);
		// gl.drawArrays(gl.TRIANGLES, 0, object.VertexPositionBuffer.numItems);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, object.VertexPositionBuffer.numItems);
	}
	
    for (id in object.subobjects) {
		subobject = object.subobjects[id];
		draw_object(subobject);
	}
}

