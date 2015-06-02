var PersonElement = require('./person.js');


var Hunter = PersonElement.extend({
	impassable: true,
	isHunter: true,
	step: 1,
	init: function(opts) {
		this.name = ':(';
	},
	kill: function(item) {
		var self = this;
		var killing = setInterval(function() {
			self.moveToItem(item);
		}, 500);
		
		this.private('killing', killing);
	},
	moveToItem: function(item) {
		var scena = this.private('scene'),
			myPosition = scena.getElPosition(this),
			itemPosition = scena.getElPosition(item),
			position = this.detectPrimatyVector(myPosition, itemPosition);

		return this.moveTo(position);
	},

	detectPrimatyVector: function(myPos, elPost) {
		var vectorsMap = {
				x: ['left', 'right'],
				y: ['up', 'down']
			},
			vectors = {
				x: elPost.x - myPos.x,
				y: elPost.y - myPos.y
			},
			vectorKey = (vectors.x < vectors.y) ? 'x' : 'y';
			
		if(this.private('wrongVector')) {
			vectorKey = this.private('vectorValue');
			vectors[vectorKey] = - vectors[vectorKey];
		}

		var vectorValue = getValueByKey(vectorKey);

		if(!this.checkMoveAbility(vectorValue)) {
			vectorKey = (vectorKey === 'x') ? 'y' : 'x';
			vectorValue = getValueByKey(vectorKey);
		}

		if(!this.checkMoveAbility(vectorValue)) {
			this.private('wrongVector', true);
		}

		this.private('vectorValue', vectorKey);
		return vectorValue;

		function getValueByKey(key) {
			var value = vectors[key],
				vectorMap = vectorsMap[key],
				isNegative = (value < 0);

			return isNegative ? vectorMap[0] : vectorMap[1];
		}
	},

	
	
	hasBackAbility: function(position) {
		if(position[0] === 0 && position[1] === 0) {
			return false;
		}
		return true;
	}
});

module.exports = Hunter;