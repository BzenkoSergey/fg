var Model = require('../../libs/model.js');
var BaseElement = require('../../elements/base.js');
var Size = require('./../size.js');
var Position = require('./../position.js');
var VectorsUtils = require('./../vectors-utils.js');

var MapUtils = require('./utils.js');

var ArrayModel = Model.extend.apply(Array, [{}, true]);

var Map = ArrayModel.extend({
	isMap: true,
	init: function(sizeOpts, Element) {
		sizeOpts = sizeOpts || [1,1];
		this.size = new Size(sizeOpts);
		this.Element = Element || null;
		createMap.apply(this, [this.size]);
	},
	add: addToMapTree
});

module.exports = Map;


function createMap(size) {
	for(var y = 0; size.y > y; y++) {
		var row = [];
		this.push(row);

		for(var x = 0; size.x > x; x++) {
			var el = MapUtils.createEl.apply(this),
				pos = [x, y];

			row.push(el);
			if(!el) {
				continue;
			}

			addToMapTree.apply(this, [el, pos]);
		}
	}
	return this;
}

function addToMapTree(el, pos, forcibly) {
	pos = VectorsUtils.normalizePosition(pos);
	var args = [el, pos, forcibly];

	if(el.isMap) {
		return injectMap.apply(this, args);
	}

	if(!forcibly && !addIsPossible.apply(this, args)) {
		return false;
	}

	var adding = add.apply(this, args);
	if(!adding) {
		return false;
	}

	var parent = this.parentMap;
	if(parent) {
		var parent_pos = this.position;
		pos = VectorsUtils.normalizePosition(pos.x + parent_pos.x, pos.y + parent_pos.y);
		args = [el, pos];
		adding = addToMapTree.apply(parent, args);
	}
	return adding;
}

function addIsPossible(el, pos) {
	var victim = MapUtils.get.apply(this, [pos]);
	if(!victim) {
		return true;
	}
	return (el.hardness > victim.hardness);
}

function add(el, pos) {
	return updateCell.apply(this, arguments);
}

function injectMap(map, pos, forcibly) {
	if(!forcibly && !injectMapPossibility.apply(this, arguments)) {
		return false;
	}

	map.position = pos;
	map.parentMap = this;
	
	var self = this;
	MapUtils.mapIterator(map, pos, function(el, el_pos, inMapPos) {
		if(!el) {
			return true;
		}
		addToMapTree.apply(self, [el, inMapPos, forcibly]);
	});
	return true;
}


function injectMapPossibility(map, pos) {
	var status = true,
		self = this;

	MapUtils.mapIterator(map, pos, function(el, el_pos, inMapPos) {
		if(!el) {
			return true;
		}
		status = addIsPossible.apply(self, [el, inMapPos]);

		if(!status) {
			return false;
		}
	});

	return status;
}

function updateCell(el, pos) {
	var y = pos.y, x = pos.x,
		cellExists = MapUtils.isExistsCell.apply(this, [pos]);

	if(!cellExists) {
		return false;
	}
	this[y][x] = el;
	return true;
}