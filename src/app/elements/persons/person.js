var Base = require('../base.js');

var Person = Base.extend({
	isEmpty: true,
	step: 1,
	impassable: true,
	init: function(opts) {
		opts = opts || {};
		this.name = opts.name;
	},

	moveTo: moveTo,
	getPosition: getPosition,
	checkMoveAbility: checkMoveAbility
});

module.exports = Person;

function getPosition() {
	var scene = this.private('scene');
	if(!scene) {
		return false;
	}
	return scene.getElPosition(this);
}

function moveTo(vector) {
	var scene = this.private('scene');
	if(!scene) {
		return false;
	}
	return scene.moveElementTo(vector, this, this.step);
}

function checkMoveAbility(vector) {
	var scene = this.private('scene');
	if(!scene) {
		return false;
	}
	return scene.checkMoveTo(this, vector, this.step);
}