var Model = require('../../libs/model.js'),
	Size = require('./../size.js'),

	MapUtils = require('./utils.js');

window.MapUtils = MapUtils;
var ArrayModel = Model.extend.apply(Array, [{}, true]),
	Map = ArrayModel.extend({
		init: function(sizeOpts, Element) {
			sizeOpts = sizeOpts || [1,1];
			this.size = new Size(sizeOpts);
			this.Element = Element || null;
			MapUtils.createMap.apply(this, [this.size]);
		},

		get: get,
		add: add,
		remove: remove,
		update: update,
		checkExist: checkExist,
		checkConflict: checkConflict
	});

module.exports = Map;

function get(pos) {
	pos = MapUtils.posNormalizer.apply(this, arguments);

	if(!this.checkExist(pos)) {
		return false;
	}

	return this[pos.y][pos.x];
}

function add(el, pos, noConflict) {
	if(!MapUtils.isEl(el)) {
		return false;
	}

	var result = this.update.apply(this, arguments),
		status = !!(result === null || result);

	if(status) {
		el.owner = el.owner || this;
	}
	return status;
}

function remove(el) {
	if(!MapUtils.isEl(el)) {
		return false;
	}
	var pos = MapUtils.getPosition.apply(this, [el]);
	if(!pos) {
		return false;
	}
	var result = this.update(null, pos);
	return !!(result === null || result);
}

function update(el, pos, noConflict) {
	if(!MapUtils.isEl(el)) {
		return false;
	}
	pos = MapUtils.posNormalizer(pos);
	var el_old = this.get(pos);

	if(!noConflict && !resolveConflict(el, el_old)) {
		return false;
	}

	this[pos.y][pos.x] = el;
	return el_old;
}

function checkExist(pos) {
	pos = MapUtils.posNormalizer.apply(this, arguments);
	return MapUtils.isExists.apply(this, [pos]);
}

function checkConflict(el, pos) {
	if(!MapUtils.isEl(el)) {
		return false;
	}
	pos = MapUtils.posNormalizer(pos);

	var el_old = this.get(pos);
	if(!el_old) {
		return true;
	}
	return el_old.conflict(el, true);
}

function resolveConflict(agressor, prey) {
	if(prey && !prey.conflict(agressor, true)) {
		return false;
	}

	if(agressor && !agressor.conflict(prey)) {
		return false;
	}
	return true;
}