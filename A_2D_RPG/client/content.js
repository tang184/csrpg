var ContentHandler = {};
ContentHandler.contents = {};

ContentHandler.new_content = function(id, position, velocity, image_name) {
	var content = {};
	content.position = position.clone();
	content.velocity = velocity.clone();
	content.image = ImageHandler.load(image_name);
	ContentHandler.contents[id] = content;
	return content;
};

ContentHandler.draw = function() {
	var content;
	var temp;
	
	for (id in ContentHandler.contents) {
		content = ContentHandler.contents[id];
		temp = ControlHandler.to_char_pos(MapHandler.to_abs_pos(content.position)).sub(new Point(content.image.width / 2, content.image.height));
		DoubleBuff.ctx.drawImage(content.image, temp.x, temp.y);
	}
};

ContentHandler.tick = function(time_delta) {
	var content;
	var temp;
	
	for (id in ContentHandler.contents) {
		content = ContentHandler.contents[id];
		content.position = content.position.add(content.velocity.mul(time_delta));
	}
};