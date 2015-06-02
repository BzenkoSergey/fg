var Model = require('../libs/model.js');

var Base = Model.extend({
	isEmpty: true,
	impassable: false,
	init: function() {
		this.name = '';
	}
});

module.exports = Base;