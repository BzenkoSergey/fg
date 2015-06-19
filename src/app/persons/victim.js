var PersonElement = require('./person.js');


var Victim = PersonElement.extend({
	step: 1,
	impassable: true,
	isVictim: true,
	hardness: 0.6,
	init: function(opts) {
		this.name = '';
	},
	css: {
		backgroundColor: 'green'
	},
	conflict: function(element, isAttack) {
		if(isAttack) {
			return false;
		}
		return true;
	}
});

module.exports = Victim;