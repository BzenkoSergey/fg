var PersonElement = require('./person.js');
var Position = require('./../core/position.js');

var Hunter = PersonElement.extend({
	impassable: true,
	isHunter: true,
	step: 1,
	css: {
		backgroundColor: 'black'
	},
	hardness: 0.1,
	init: function(opts) {
		this.name = ':(';
	},

	kill: function(element) {
		var self = this;

		var killing = setInterval(function() {
			var moveStatus = self.moveToElement(element);
			if(!moveStatus) {
				clearInterval(killing);
				return false;
			}
		}, 500);
	},

	moveToElement: moveToElement,
	conflict: function(isAttack) {
		if(isAttack) {
			return false;
		}
		return true;
	}
});

function moveToElement(element) {
	var scene = this.private('scene');
	if(!scene.hasElement(element)) {
		return false;
	}

	var my_positon = scene.getElementPosition(this),
		el_position = scene.getElementPosition(element),
		vector = detectVector.apply(this, [my_positon, el_position]);

	console.log(my_positon, el_position);
	return this.moveTo(vector);
}

function detectVector(my_positon, el_position) {
	var scene = this.private('scene'),
		x_diff = my_positon.x - el_position.x,
		y_diff = my_positon.y - el_position.y;

	var axle = detectAxle(x_diff, y_diff),
		negative = (axle === 'x') ? x_diff > 0 : y_diff > 0;

	return scene.detectVectorByAxle({
		axle: axle,
		negative: negative
	});
}

function detectAxle(x_diff, y_diff) {
	x_diff = Math.abs(x_diff);
	y_diff = Math.abs(y_diff);
	return (y_diff === 0 || x_diff >= y_diff) ? 'x' : 'y';
}

module.exports = Hunter;