var ImageHandler = {};

ImageHandler.cache = {};
ImageHandler.load = function(filename) {
	if (ImageHandler.cache[filename]) {
		return ImageHandler.cache[filename];
	}
	
	var image = new Image();
	image.src = filename;
	ImageHandler.cache[filename] = image;
	return image;
}