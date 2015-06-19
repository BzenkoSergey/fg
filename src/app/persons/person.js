var Base = require('../elements/base.js');
var VectorsUtils = require('./../core/vectors-utils.js');

var Person = Base.extend({
	isPerson: true,
	isEmpty: true,
	step: 1,
	impassable: true,
	init: function(opts) {
		opts = opts || {};
		this.name = opts.name;
		this.vectors = {};
	},
	css: {
		backgroundColor: 'yellow'	
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
					if(this.isVictim) {
	console.log('moveTo', arguments.callee.caller);
					}
			
	var scene = this.private('scene');
	if(!scene) {
		return false;
	}

	var map = VectorsUtils.vectorsMap(vector);
	this.vectors[map.axis] = vector;
	
	var oppositeAxis = VectorsUtils.oppositeAxis(map.axis);
	this.vectors[oppositeAxis] = null;

	return scene.moveToSide(vector, this, this.step);
}

function checkMoveAbility(vector) {
	var scene = this.private('scene');
	if(!scene) {
		return false;
	}
	return scene.checkMoveTo(this, vector, this.step);
}