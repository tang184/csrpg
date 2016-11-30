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

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

var pMatrix = mat4.create();

function init_scene() {
    var cube;
    var temp = mat4.create();;
    
    cube = new_cube(1, 1);
    
    mat4.identity(temp);
    mat4.translate(temp, [0, 0, -8]);
    mat4.multiply(temp, base_object.pos_rel, base_object.pos_rel);
    mat4.translate(openset_matrix, [ 0.0,  0.0,  8.0], openset_matrix);
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
    if (offset) {
	   mat4.identity(offset);
    }
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(120, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    
    draw_objects();
}

function webGLStart() {
    var canvas = document.getElementById("lesson02-canvas");
    initGL(canvas);
    initShaders();
    init_scene();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    canvas.onmousedown = handleMouseDown;

    tick();
    
}

var time_last = 0;
function tick() {
    requestAnimFrame(tick);
    var time_now = new Date().getTime();
    if (time_last != 0) {
    	var time_delta = time_now - time_last;
    	handleKeys(time_delta / 1000.0);
    }
    time_last = time_now;
    appply_all_pos_draw(openset_matrix)
	drawScene();
}

var currentlyPressedKeys = {};

var totalangle = 0;

function handleKeys(time_delta) {
    //var speed = 2.4;
    // Enter
    if (currentlyPressedKeys[13]) {
	
    }
    /*
    // W and S
    if (currentlyPressedKeys[87]) {
	mat4.translate(openset_matrix, [ 0.0,  0.0,  1.0 * speed * time_delta], openset_matrix);
    }
    if (currentlyPressedKeys[83]) {
	mat4.translate(openset_matrix, [ 0.0,  0.0, -1.0 * speed * time_delta], openset_matrix);
    }

    
    // A and D
    if (currentlyPressedKeys[65]) {
	mat4.translate(openset_matrix, [ 1.0 * speed * time_delta,  0.0,  0.0], openset_matrix);
    }
    if (currentlyPressedKeys[68]) {
	mat4.translate(openset_matrix, [-1.0 * speed * time_delta,  0.0,  0.0], openset_matrix);
    }*/


    if (currentlyPressedKeys[83]) {
        mat4.rotate(openset_matrix, (time_delta)*100 / 500, [1, 0, 0]);
    }
    if (currentlyPressedKeys[87]) {
        mat4.rotate(openset_matrix, -(time_delta)*100 / 500, [1, 0, 0]);
    }
    if (currentlyPressedKeys[68]) {
        mat4.rotate(openset_matrix, (time_delta)*400 / 500, [0, 1, 0]);
        totalangle+=(time_delta)*100;

    }
    if (currentlyPressedKeys[65]) {
        mat4.rotate(openset_matrix, -(time_delta)*400 / 500, [0, 1, 0]);
        totalangle-=(time_delta)*100;

    }


}
function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

var lastMouseX = null;
var lastMouseY = null;
var openset_matrix = mat4.create();
mat4.identity(openset_matrix);

function handleMouseDown(event) {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    var currangle = totalangle % 783;
    if (Math.abs(currangle) < 20 || (783-Math.abs(currangle)) < 20) {
        console.log(true);
    } else {
        console.log(false);
    }
    console.log(totalangle % 783);

    console.log("angle" + totalangle)
    console.log(lastMouseX);
    console.log(lastMouseY);
}

