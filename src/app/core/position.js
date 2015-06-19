var Model = require('../libs/model.js');

var Position = Model.extend({
	isPosition: true,
	init: function(position, positionY) {
		this.update(position, positionY);
	},
	update: function(position, positionY) {
		position = normalizeInput(position, positionY);
		this.x(position.x);
		this.y(position.y);
	},
	isReady: isReady,
	isEmpty: isEmpty,
	equal: equal,

	x: function(x) {
		if(x === undefined) {
			return this.x;
		}
		if(x < 0) {
			return this.x;
		}
		this.x = parseInt(x);
	},

	y: function(y) {
		if(y === undefined) {
			return this.x;
		}
		if(y < 0) {
			return this.y;
		}

		this.y = parseInt(y);
		return this.y;
	}
});

function isEmpty() {
	return !!(typeof this.x !== 'number' || typeof this.y !== 'number');
}

function isReady() {
	return !!(this.x && this.y);
}

function equal(position) {
	if(!position) {
		return false;
	}
	position = normalizeInput(position);
	return !!(this.x == position.x && this.y == position.y);
}

function normalizeInput(position, positionY) {
	var x, y;

	if(positionY !== undefined) {
		x = position;
		y = positionY;
	}

	if(Array.isArray(position)) {
		x = position[0];
		y = position[1];
	}

	if(!Array.isArray(position) && typeof position === 'object') {
		x = position.x;
		y = position.y;
	}

	return {
		x: x,
		y: y
	};
}

module.exports = Position;