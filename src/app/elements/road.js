var Base = require('./base.js');

var Road = Base.extend({
	impassable: true,
	css: {
		backgroundColor: 'rgb(79, 129, 189)',
		border: 'none'
	},
	conflict: function(element) {
		if(!element.isPerson) {
			return true;
		}
		return false;
	}
});

module.exports = Road;