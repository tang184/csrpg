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

function set_texture_buffer(object, input_text_vertices) {
	var text_vertices = input_text_vertices.slice();
    VertexTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(text_vertices), gl.STATIC_DRAW);
    VertexTextureBuffer.itemSize = 2;
    VertexTextureBuffer.numItems = Math.round(text_vertices.length / VertexTextureBuffer.itemSize);
	
	object.VertexTextureBuffer = VertexTextureBuffer;
}

function create_object(vertices, colors, parent_object) {
	object = {};

	object.vertices = vertices.slice();
	object.colors = colors.slice();
	set_vertex_buffer(object, object.vertices);
	set_color_buffer(object, object.colors);
	set_default_textuare(object);
	set_texture_buffer(object, object.text_vertices);
	
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

function set_default_textuare(object) {
	var v_num = Math.floor(object.vertices.length / 3);
	var text_vertices = [];
	var i = 0;
	while (i < v_num) {
		text_vertices.push(Math.random());
		text_vertices.push(Math.random());
		i = i + 1;
	}
	object.text_vertices = text_vertices;
	object.texture = TextureHandler.load("textures/empty.gif");
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

        gl.bindBuffer(gl.ARRAY_BUFFER, object.VertexTextureBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, VertexTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, object.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		setMatrixUniforms(mvMatrix);
		// gl.drawArrays(gl.TRIANGLES, 0, object.VertexPositionBuffer.numItems);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, object.VertexPositionBuffer.numItems);
	}
	
    for (id in object.subobjects) {
		subobject = object.subobjects[id];
		draw_object(subobject);
	}
}

