var Model = require('../libs/model.js');

var Position = Model.extend({
	init: function(x, y) {
		if(typeof arguments[0] === 'object') {
			this.setX(arguments[0].x);
			this.setY(arguments[0].y);
			return true;
		}
		this.setX(x);
		this.setY(y);
	},
	isReady: isReady,
	isEmpty: isEmpty,
	equal: equal,

	setX: function(x) {
		x = parseInt(x);
		if(Number.isNaN(x)) {
			return false;
		}
		this.x = x;
		return x;
	},
	setY: function(y) {
		y = parseInt(y);
		if(Number.isNaN(y)) {
			return false;
		}
		this.y = y;
		return y;
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
	return !!(this.x == position.x && this.y == position.y);
}

module.exports = Position;