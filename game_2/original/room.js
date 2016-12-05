var gl;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl", {alpha:false});
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {

    }
    if (!gl) {
	   alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
	   return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
	   if (k.nodeType == 3) {
	   str += k.textContent;
	}
	   k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
	   shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
	   shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
	   return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    	alert(gl.getShaderInfoLog(shader));
    	return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	   alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
	
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
	
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}

var pMatrix = mat4.create();

var room;
var temp;
var door;
function init_scene() {
	/*
    temp = mat4.create();
    room = new_cube(1, [true, true, true, true, true, true]);
    
    mat4.identity(temp);
    mat4.translate(temp, [0, 0, -2]);
    mat4.multiply(temp, room.pos_rel, room.pos_rel);
	*/
	
	
    calculate_all_pos_abs();
    appply_all_pos_draw();
}

function draw_objects() {
	
    for (id in objects) {
	   draw_object(objects[id]);
    }
}

function calculate_all_pos_abs() {
    for (id in objects) {
	   calculate_pos_abs(objects[id]);
    }
}

function appply_all_pos_draw(offset) {
    for (id in objects) {
	   appply_pos_draw(objects[id], offset);
    }
	/*
    if (offset) {
	   mat4.identity(offset);
    }
	*/
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.001, 100.0, pMatrix);
    
    draw_objects();
}

var canvas;
function webGLStart() {
	canvas = document.getElementById("lesson02-canvas");

	canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
	
    //var foreground = document.getElementById("lesson01-canvas").getContext('2d');
    initGL(canvas);
    initShaders();
    init_scene();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
    // gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
		
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
	
	// Connector.init("ws://localhost:12315");
	// Connector.init("ws://yakume.xyz:12315");

	ScoreBoard.init();
    tick();
}

var time_last = 0;
function tick() {
    requestAnimFrame(tick);
    var time_now = new Date().getTime();
    var time_delta = (time_now - time_last) / 1000.0;
    if (time_last != 0) {
    	handleKeys(time_delta);
    }
    time_last = time_now;
	
	mat4.identity(openset_matrix);
	
	var temp = mat4.create;
	mat4.identity(temp);
	
	// mat4.translate(temp, [-position[0], -position[1], -position[2]]);
	var position = [0, 0, 0];
	vec3.negate(Connector.player.position, position);
	mat4.translate(temp, position);
    mat4.multiply(temp, openset_matrix, openset_matrix);
    mat4.multiply(rotation, openset_matrix, openset_matrix);
	
	Connector.tick(time_delta);
    appply_all_pos_draw(openset_matrix);
	drawScene();
	ScoreBoard.draw();
}

var openset_matrix = mat4.create();
mat4.identity(openset_matrix);

var currentlyPressedKeys = {};
var position = vec3.create([0, 0, 0]);

function handleKeys(time_delta) {
    var speed = 2.4;
    // Enter
    if (currentlyPressedKeys[13]) {
	
    }
    temp = mat4.create();
    translation = vec3.create([0, 0, 0]);
    
    // W and S
    if (currentlyPressedKeys[87]) {
		translation[2] = translation[2] - (time_delta * speed);
    }
    if (currentlyPressedKeys[83]) {
		translation[2] = translation[2] + (time_delta * speed);
    }
    
    // A and D
    if (currentlyPressedKeys[65]) {
		translation[0] = translation[0] - (time_delta * speed);
    }
    if (currentlyPressedKeys[68]) {
		translation[0] = translation[0] + (time_delta * speed);
    }
	
	translation = v3m4(translation, rotation_p);
	Connector.send_movement(translation);
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

var mouseDown = false;

var xangle = 0;
var yangle = 0;
var rotation = mat4.create();
mat4.identity(rotation);
var rotation_p = mat4.create();
mat4.identity(rotation_p);

function handleMouseDown(event) {
	if (mouseDown) {
		mouseDown = false;
		document.exitPointerLock();
	}
	else {
		mouseDown = true;
		canvas.requestPointerLock();
	}
}

function handleMouseUp(event) {
	// mouseDown = false;
}

function handleMouseMove(event) {
	if (!mouseDown) {
		return;
	}
	var rotation_speed = Math.PI / 500;

	yangle = yangle + (event.movementX * rotation_speed);
	xangle = xangle + (event.movementY * rotation_speed);
	
	// Calculate current rotation
	mat4.identity(rotation);
	mat4.identity(rotation_p);
    var temp = mat4.create();
	
	mat4.identity(temp);
	mat4.rotate(temp, yangle, [0, 1, 0]);
    mat4.multiply(temp, rotation, rotation);
	
	mat4.identity(temp);
	mat4.rotate(temp, xangle, [1, 0, 0]);
    mat4.multiply(temp, rotation, rotation);
	
	mat4.identity(temp);
	mat4.rotate(temp, -yangle, [0, 1, 0]);
    mat4.multiply(rotation_p, temp, rotation_p);
	
	mat4.identity(temp);
	mat4.rotate(temp, -xangle, [1, 0, 0]);
    mat4.multiply(rotation_p, temp, rotation_p);
	
}