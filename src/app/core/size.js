var Model = require('../libs/model.js');

module.exports = Model.extend({
	init: function() {
		this.update.apply(this, arguments);
	},
	update: function(size, sizeY) {
		if(!size) {
			return false;
		}
		size = normalizeInput(size, sizeY);
		this.x(size.x);
		this.y(size.y);
	},
	x: function(x) {
		if(x === undefined) {
			return this.x;
		}
		this.x = parseInt(x);
	},
	y: function(y) {
		if(y === undefined) {
			return this.x;
		}
		this.y = parseInt(y);
	}
});

function normalizeInput(size, sizeY) {
	var x, y;

	if(sizeY) {
		x = size;
		y = sizeY;
	}

	if(Array.isArray(size)) {
		x = size[0];
		y = size[1];
	}

	if(!Array.isArray(size) && typeof size === 'object') {
		x = size.x;
		y = size.y;
	}

	return {
		x: x,
		y: y
	};
}