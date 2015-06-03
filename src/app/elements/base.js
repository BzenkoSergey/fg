var Model = require('../libs/model.js');

var Base = Model.extend({
	isEmpty: true,
	impassable: false,
	init: function(opts, scene) {
		if(!scene) {
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
	}
});

module.exports = Base;