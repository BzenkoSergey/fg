var Base = require('../base.js');

var Person = Base.extend({
	isEmpty: true,
	step: 1,
	impassable: true,
	init: function(opts, scene) {
		if(!scene) {
			return false;
		}

		opts = opts || {};
		this.private('scene', scene);
		this.name = opts.name;
	},

	moveTo: moveTo,
	getPosition: getPosition,
	checkMoveAbility: checkMoveAbility
});

module.exports = Person;

function getPosition() {
	var scene = this.private('scene');
	return scene.getElPosition(this);
}

function moveTo(vector) {
	var scene = this.private('scene');
	return scene.moveElTo(this, vector, this.step);
}

function checkMoveAbility(vector) {
	var scene = this.private('scene');
	return scene.checkMoveTo(this, vector, this.step);
}