var Model = require('../libs/model.js');

var Position = Model.extend({
	init: function(x, y) {
		this.x = x;
		this.y = y;
	},
	isReady: isReady
});

function isReady() {
	return !!(this.x && this.y);
}

module.exports = Position;