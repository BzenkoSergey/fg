var Base = require('./base.js');

var Block = Base.extend({
	impassable: true,
	isBlock: true,
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

module.exports = Block;