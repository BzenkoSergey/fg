var Model = require('../libs/model.js');

var Base = Model.extend({
	isEmpty: true,
	impassable: false,
	hardness: 0.5,
	css: {
		backgroundColor: 'gray',
	},
	render: function() {
		return this;
	},
	init: function(opts, scene) {
		if(!scene) {
			debugger;
			return false;
		}
		this.addToScene(scene);
		this.name = '';
	},
	removeFromScene: function() {
		this.private('scene', undefined);
	},
	addToScene: function(scene) {
		this.private('scene', scene);
	},
	conflict: function(element) {
		return true;
	}
});

module.exports = Base;