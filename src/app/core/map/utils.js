var VectorsUtils = require('./../vectors-utils.js');

var utils = {
	isExistsCell: isExistsCell,
	createEl: createEl,
	get: get,
	mapIterator: mapIterator
};


module.exports = utils;

function isExistsCell(pos) {
	var y = pos.y, x = pos.x;

	if(this.length <= y) {
		return false;
	}

	if(this[y].length <= x) {
		return false;
	}
	return true;
}

function createEl(params) {
	var el = this.Element;
	if(el) {
		el = new this.Element(params, this);
	}
	return el;
}

function get(pos) {
	pos = VectorsUtils.normalizePosition(pos);

	var cellExists = isExistsCell.apply(this, [pos]);
	if(!cellExists) {
		return false;
	}

	return this[pos.y][pos.x];
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
}