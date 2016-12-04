var TextureHandler = {};

TextureHandler.cache = {};

TextureHandler.load = function(filename) {
	if (TextureHandler.cache[filename]) {
		return TextureHandler.cache[filename];
	}
	
    var texture = gl.createTexture();
	texture.image = new Image();
    texture.image.onload = function () {
		// draw test texutres
		var canvas = document.getElementById("test-canvas");
		var ctx = canvas.getContext("2d");
		ctx.drawImage(texture.image, 0, 0);
		
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
	}
	texture.image.src = filename;
	
	return texture
}