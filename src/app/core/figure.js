var Map = require('./map/map.js'),
	MapUtils = require('./map/utils.js');

// for methods decoration
var mapProto = Map.prototype,

	Figure = Map.extend({
		isFigure: true,

		add: add,
		remove: remove
	});

module.exports = Figure;

function checkConflicts(map, pos, inMap, removeOnConflict) {
	return MapUtils.mapIterator(map, pos, function(el, el_pos, posInParent) {
		return checkConflict.apply(inMap, [el, posInParent, removeOnConflict]);
	});
}

function checkConflict(el, posInParent, removeOnConflict) {
	var status = this.checkConflict(el, posInParent);

	if(window.asd) console.log('checkConflict');

	if(removeOnConflict && !status) {
		var conflict_el = this.get(posInParent),
			owner = conflict_el.owner,
			isGlobal = !owner.figureParent,
			removeSelf = this === owner;

		if(!isGlobal && !removeSelf) {
			conflict_el = owner;
		}

		this.remove(conflict_el);	
		status = this.checkConflict(el, posInParent);
	}
	return status;
}

// Adding
function add(el, pos, noConflict) {
	pos = MapUtils.posNormalizer(pos);
	if(!this.checkExist(pos)) {
		return false;
	}

	var args = [el, pos, noConflict];

	if(el.isFigure) {
		return addFigure.apply(this, args);
	}
	return addEl.apply(this, args);
}

function addFigure(figure, pos, noConflict) {
	if(window.asd) {
		//console.log('addFigure', figure, pos, noConflict);
	}

	var hasConflicts = !checkConflicts.apply(this, [figure, pos, this, noConflict]);
	if(!noConflict && hasConflicts) {
		return false;
	}

	var figureParent = this;
	figure.figurePos = pos;
	figure.figureParent = figureParent;

	MapUtils.mapIterator(figure, pos, function(el, el_pos, posInParent) {
		figureParent.add(el, posInParent, noConflict);
	});
	return true;
}

function addEl(el, pos, noConflict) {
	if(window.asd) {
		//console.log('addEl', el, pos, noConflict);
	}
	var hasConflict = !checkConflict.apply(this,  [el, pos, noConflict]);
	if(!noConflict && hasConflict) {
		return false;
	}

	var result = mapProto.add.apply(this, arguments);
	if(!result) {
		return false;
	}
	return addElToTree.apply(this, arguments);
}

function addElToTree(el, pos, noConflict) {
	var figureParent = this.figureParent;
	if(!figureParent) {
		return true;
	}

	var parent_pos = this.figurePos,
		new_pos = [
			pos.x + parent_pos.x,
			pos.y + parent_pos.y
		];

	return figureParent.add(el, new_pos, noConflict);
}


// Removing
function remove(el) {

	if(window.asd) console.log('remove');

	if(el && el.isFigure) {
		return removeFigure.apply(this, arguments);
	}
	return removeEl.apply(this, arguments);
}

function detectFigureToRemove(figure, removeFrom) {
	debugger;
	if(window.asd) console.log('detectFigureToRemove');
	var figureParent = figure.figureParent;
	if(figureParent === removeFrom) {
		return figure;
	}

	return detectFigureToRemove(figureParent, removeFrom);
}

function removeFigure(figure) {
	if(window.asd) console.log('removeFigure');

	figure = detectFigureToRemove(figure, this);
	
	

	var self = this,
		figureParent = figure.figureParent,
		isGlobal = !figureParent.figureParent;

	MapUtils.mapIterator(figure, function(el) {
		self.remove(el);
	});
	
	if(!isGlobal && figureParent && figureParent !== this) {
		console.log(figureParent === this);
		removeFigure.apply(figureParent.figureParent, [figureParent]);
	}

	return true;
}

function removeEl(el) {
	if(window.asd) console.log('removeEl');

	var result = mapProto.remove.apply(this, arguments);
	if(!result) {
		return false;
	}

	return removeElFromTree.apply(this, arguments);
}

function removeElFromTree(el) {
	if(window.asd) console.log('removeElFromTree');

	var figureParent = this.figureParent;
	if(!figureParent) {
		return true;
	}
	return figureParent.remove(el);
}