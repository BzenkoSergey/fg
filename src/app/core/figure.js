var Map = require('./map/map.js');
var VectorsUtils = require('./vectors-utils.js');

var Figure = Map.extend({
	isFigure: true,
	parentFigure: null,
	addFigure: addFigure,
	conflict: conflict,
	moveToSide: moveToSide,
	moveFigureTo: moveFigureTo
});

module.exports = Figure;

function moveFigureTo(vector, step) {
	var vectorMap = VectorsUtils.vectorsMap(vector);

	var y_position = true;
	if(vectorMap.axis === 'y') {
		y_position = vectorMap.vector;
	}
	
	var x_position = true;
	if(vectorMap.axis === 'x') {
		x_position = vectorMap.vector;
	}

	if(y_position) {
		for(var y = 0; this.length > y; y++) {
			if(x_position) {
				for(var x = 0; this[y].length > x; x++) {
					var element = this[y][x]
					
					if(element.isVictim) {
						console.log('element.moveTo', arguments.callee.caller);
					}
	
					element.moveTo(vector);
					//console.log(element);
					if(element.isVictim) {
						debugger;
					}
				}
			} else {
				for(var x = this[y].length -1; 0 <= x; x--) {
					var element = this[y][x];
					element.moveTo(vector);
				}
			}
		}
	} else {
		for(var y = this.length -1 ; 0 <= y; y--) {
			if(x_position) {
				for(var x = 0; this[y].length > x; x++) {
					var element = this[y][x];
					element.moveTo(vector);
				}
			} else {
				for(var x = this[y].length -1; 0 <= x; x--) {
					var element = this[y][x];
					element.moveTo(vector);
				}
			}
		}
	}
}

function moveToSide(vector, element, step) {
	if(element.isVictim) {
		console.log(arguments.callee.caller);
	}

	if(this.parentMap) {
		 var status = Map.prototype.moveToSide.apply(this, arguments);
		 return status ? this.parentMap.moveToSide(vector, element, step) : status;
	}

	return Map.prototype.moveToSide.apply(this, arguments);
}

function addFigure(figure, position) {
	if(!isFigure(figure)) {
		return false;
	}

	position = VectorsUtils.normalizePosition(position);
	figure.position = position;
	figure.parentMap = this;

	var size = figure.size,
		positions = VectorsUtils.genSizePositions(size, position);

	return true || addFigureToPositions.apply(this, [figure, positions]);
}

function conflict(element, isAttack) {
	debugger;
	return !isAttack;
}

/**
 * Helpers methods
 */
function isFigure(figure) {
	return (figure instanceof Figure);
}

function addFigureToPositions(figure, positions) {
	if(!positions) {
		return false;
	}
	var allowed = checkFigurePositions.apply(this, [figure, positions]);
	if(!allowed) {
		return false;
	}

	var status = true;
	for(var key in positions) {
		var position = positions[key].position,
			size_position = positions[key].size_position,
			adding = true || this.add(figure, position);
		
		if(!adding) {
			status = false;
			break;
		}
	}
	return status ? figure : false;
}

function checkFigurePositions(figure, positions) {
	var status = true;
	for(var key in positions) {
		var position = positions[key].position,
			element = this.get(position);

		if(!element.conflict(figure, true)) {
			status = false;
			break;
		}
	}
	return status;
}
