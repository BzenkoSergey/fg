var Position = require('./position.js'),
	Model = require('../libs/model.js');

var Scene = Model.extend({
	init: function(x, y, Element) {
		this.private('Element', Element);

		var world = makeWorld.apply(this, [x, y]);
		this.private('world', world);
	},

	get: get,
	hasElement: hasElement,
	addElement: addElement,
	detectVectorByAxle: detectVectorByAxle,

	getNextStepPosition: getNextStepPosition,
	getElement: getElement,
	getElementPosition: getElementPosition,
	moveElementTo: moveElementTo
});

module.exports = Scene;

function get() {
	return this.private('world');
}

function hasElement(element) {
	return !!this.getElementPosition(element);
}

function createElement() {
	var Element = this.private('Element');
	return new Element({}, this);
}

function getElement(position) {
	var world = this.get(),
		y = position.y,
		x = position.x;

	return world[y][x];
}

function getElementPosition(element) {
	var world = this.get(),
		position = new Position();

	for(var y_index in world) {
		var el_index = world[y_index].indexOf(element);
		if(!~el_index) {
			continue;
		}
		position.setY(y_index);
		position.setX(el_index);
		break;
	}
	return position.isEmpty() ? null : position;
}

function clearCell(position) {
	var element = createElement.apply(this);
	return updateCell.apply(this, [element, position]);
}

function makeWorld(x, y) {
	var world = [];
	for(var y_index = 0; y > y_index; y_index++) {
		var row = [];
		for(var x_index = 0; x > x_index; x_index++) {
			var element = createElement.apply(this),
				position = new Position(x_index, y_index);

			element.private('position', position);
			row.push(element);
		}
		world.push(row);
	}
	return world;
}

function moveElementTo(vector, element, step) {
	step = step || 1;
	var next_position = this.getNextStepPosition(vector, element, step);
	return moveElementToPosition.apply(this, [element, next_position]);
}

function moveElementToPosition(element, position) {
	if(!isExistsCell.apply(this, [position])) {
		return false;
	}
	var old_position = this.getElementPosition(element);
	clearCell.apply(this, [old_position]);
	return setElementToPosition.apply(this, [element, position]);
}

function addElement(element, positionData) {
	var position = new Position(positionData[0], positionData[1]);
	return setElementToPosition.apply(this, [element, position]);
}

function setElementToPosition(element, position) {
	return updateCell.apply(this, [element, position]);
}

function updateCell(element, position) {
	if(!isExistsCell.apply(this, [position])) {
		return false;
	}
	var world = this.get(),
		y = position.y,
		x = position.x;
	var old_element = world[y][x];
	old_element.removeFromScene();
	element.addToScene(this);
	world[y][x] = element;
	return true;
}

function isExistsCell(position) {
	var world = this.get(),
		y = position.y,
		x = position.x;

	if(!world[y] || !world[y][x]) {
		return false;
	}
	return true;
}

function getNextStepPosition(vector, element, step) {
	var axle = detectAxle(vector),
		position = this.getElementPosition(element),
		next_position = new Position(),
		method = axle.axle === 'x' ? 'setX' : 'setY';
	
	next_position.setX(position.x);
	next_position.setY(position.y);

	var axleValue = position[axle.axle];
	axleValue = axle.negative ? axleValue - step : axleValue + step;

	next_position[method](axleValue)
	return next_position;
}

function getAxlesMap() {
	return {
		up: {
			axle: 'y',
			negative: true
		},
		down: {
			axle: 'y',
			negative: false
		},
		left: {
			axle: 'x',
			negative: true
		},
		right: {
			axle: 'x',
			negative: false
		}
	};
}

function detectAxle(vector) {
	var map = getAxlesMap();
	return map[vector];
}

function detectVectorByAxle(axle) {
	var map = getAxlesMap(),
		vectorValue = null;
	for(var vector in map) {
		var axleMap = map[vector];
		if(axleMap.axle !== axle.axle || axleMap.negative !== axle.negative) {
			continue;
		}
		vectorValue = vector;
		break;
	}
	return vectorValue;
}