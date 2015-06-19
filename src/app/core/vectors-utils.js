var Position = require('./position.js');
var Size = require('./size.js');
var VectorsUtils = require('./vectors-utils.js');

module.exports = {
	axisMap: axisMap,
	vectorsMap: vectorsMap,
	genPosition: genPosition,
	genSizePositions: genSizePositions,
	oppositeVector: oppositeVector,
	oppositeAxis: oppositeAxis,
	normalizePosition: normalizePosition
};

function normalizePosition(position, positionY) {
	var isPosition = (position instanceof Position);
	if(isPosition) {
		return position;
	}
	return new Position(position, positionY);
}

function vectorsMap(vector) {
	var map = {
		up: {
			axis: 'y',
			vector: false
		},
		down: {
			axis: 'y',
			vector: true
		},
		left: {
			axis: 'x',
			vector: false
		},
		right: {
			axis: 'x',
			vector: true
		}
	};
	return map[vector];
}

function axisMap(axis) {
	var map = {
		x: {
			'true': 'right',
			'false': 'left'
		},
		y: {
			'true': 'down',
			'false': 'up'
		}
	};
	return map[axis];
}

function oppositeAxis(axis) {
	var map = {
		x: 'y',
		y: 'x'
	};
	return map[axis];
}

function oppositeVector(vector) {
	var vectorMap = vectorsMap(vector),
		axis = axisMap(vectorMap.axis);
	return axis[!vectorMap.vector];
}

function genPosition(vector, position, step) {
	var map = vectorsMap(vector);
	var value = position[map.axis];
	var newPosition = new Position(position);
	
	value = map.vector? value + step : value - step;
	if(value < 0) {
		return false;
	}
	newPosition[map.axis] = value;
	return newPosition;
}

function genSizePositions(size, position) {
	var positions = [];

	for(var i_y = 0; size.y > i_y; i_y++) {
		for(var i_x = 0; size.x > i_x; i_x++) {
			var y = position.y + i_y,
				x = position.x + i_x,
				new_position = new Position(x, y),
				size_position = new Size(i_x, i_y);

			positions.push({
				position: new_position,
				size_position: size_position
			});
		}
	}

	return positions;
}