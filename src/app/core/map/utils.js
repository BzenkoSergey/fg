var VectorsUtils = require('./../vectors-utils.js'),
	BaseElement = require('../../elements/base.js'),
	Position = require('./../position.js');

var utils = {
	isExists: isExists,
	createEl: createEl,
	mapIterator: mapIterator,
	createMap: createMap,
	posNormalizer: posNormalizer,
	isEl: isEl,
	getPosition: getPosition
};


module.exports = utils;

function createMap(size) {
	for(var y = 0; size.y > y; y++) {
		var row = [];
		this.push(row);

		for(var x = 0; size.x > x; x++) {
			var el = createEl.apply(this);
			row.push(el);
		}
	}
	return this;
}

function createEl(params) {
	var el = this.Element || null;
	if(el) {
		el = new this.Element(params, this);
		el.owner = this; // TODO!!!!
	}
	return el;
}

function isEl(el) {
	return (el === null || el instanceof BaseElement);
}

function posNormalizer(pos, posY) {
	var isPos = (pos instanceof Position);
	if(isPos) {
		return pos;
	}
	return new Position(pos, posY);
}

function isExists(pos) {
	var y = pos.y,
		x = pos.x;

	if(this.length <= y) {
		return false;
	}

	if(this[y].length <= x) {
		return false;
	}
	return true;
}

function getPosition(fromEl) {
	var el_pos;
	mapIterator(this, function(el, pos) {
		if(fromEl !== el) {
			return true;
		}
		el_pos = pos;
		return false;
	});
	return el_pos || false;
}

function mapIterator(map, mapPos, cb) {
	if(typeof mapPos === 'function') {
		cb = mapPos;
		mapPos = undefined;
	}
	if(typeof cb !== 'function') {
		return false;
	}
	if(mapPos) {
		mapPos = VectorsUtils.normalizePosition(mapPos);
	}

	var size = map.size,
		status = true;

	for(var y = 0; size.y > y; y++) {
		for(var x = 0; size.x > x; x++) {
			var el = map[y][x],
				el_pos = VectorsUtils.normalizePosition(x, y),
				parent_pos;

			if(mapPos) {
				parent_pos = VectorsUtils.normalizePosition([mapPos.x + x, mapPos.y + y]);
			}

			var result = cb.apply(this, [el, el_pos, parent_pos]);
			if(typeof result === 'boolean') {
				status = result;
			}
			
			if(!status) {
				break;
			}
		}
		if(!status) {
			break;
		}
	}
	return status;
}