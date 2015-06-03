var PersonElement = require('./person.js');


var Victim = PersonElement.extend({
	impassable: false,
	isVictim: true,
	init: function(opts) {
		this.name = ':)';
	}
});

module.exports = Victim;