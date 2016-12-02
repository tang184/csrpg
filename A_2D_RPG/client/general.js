var General = {};

General.zeroPad = function(num, places) {
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}

General.dick_to_string = function(dict) {
	function fix(e) {
		if (isNaN(e)) {
			return "\"" + e.toString() + "\"";
		}
		else {
			return e.toString();
		}
	}
	var s = "{";
	var len = Object.keys(dict).length
	var count = 0;
	for (k in dict) {
		s = s + fix(k) + ":" + fix(dict[k]);
		if (count < len - 1) {
			s = s + ",";
		}
		else {
			s = s + "}";
		}
		count = count + 1;
	}
	return s;
}

var Point = function(x, y) {
	this.x = x;
	this.y = y;
	
	this.add = function(point) {
		return new Point(this.x + point.x, this.y + point.y);
	}
	this.sub = function(point) {
		return new Point(this.x - point.x, this.y - point.y);
	}
	this.mul = function(scale) {
		return new Point(this.x * scale, this.y * scale);
	}
	this.div = function(scale) {
		return new Point(this.x / scale, this.y / scale);
	}
	this.cross = function(point) {
		return (this.x * point.x) + (this.y * point.y);
	}
	this.clone = function() {
		return new Point(this.x, this.y);
	}
}