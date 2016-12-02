var DoubleBuff = {};

DoubleBuff.init = function(canvas_0, canvas_1) {
	DoubleBuff.canvas_show = canvas_0;
	DoubleBuff.canvas_hide = canvas_1;
	DoubleBuff.canvas_show.style.visibility = "visible";
	DoubleBuff.canvas_hide.style.visibility = "hidden";
	DoubleBuff.ctx = DoubleBuff.canvas_hide.getContext("2d");
	
	DoubleBuff.max_x = DoubleBuff.canvas_show.width;
	DoubleBuff.max_y = DoubleBuff.canvas_show.height;
}

DoubleBuff.flip = function() {
	var temp = DoubleBuff.canvas_show;
	DoubleBuff.canvas_show = DoubleBuff.canvas_hide;
	DoubleBuff.canvas_hide = temp;
	DoubleBuff.canvas_show.style.visibility = "visible";
	DoubleBuff.canvas_hide.style.visibility = "hidden";
	DoubleBuff.ctx = DoubleBuff.canvas_hide.getContext("2d");
	// console.log(this.canvas_show);
}

DoubleBuff.inside = function(x, y) {
	return (x >= 0) && (x < DoubleBuff.max_x) && (y > 0) && (y < DoubleBuff.max_y);
}