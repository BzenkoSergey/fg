var Position = require('./position.js');

var Scene = function(y, x, item) {
	var self = this,
		DefaultItem = {
			isEmpty: true
		},
		scene = [],
		positon = [0, 0];
	
	DefaultItem = item || DefaultItem;

	this.print = function() {
		console.log(scene);
	};

	this.get = function() {
		return scene;
	};

	this.getCurrent = function() {
		return self.getItem(positon);
	};

	this.getItem = function(position) {
		var valid = self.checkNextPosition.apply(self, position);
		if(!valid) {
			return false;
		}

		return this.get()[position[0]][position[1]];
	};

	this.changeCurrentItem = function(item) {
		return self.changeItem(positon, item);
	};

	this.changeItem = function(itemPosition, item) {		
		var valid = self.checkNextPosition.apply(self, itemPosition);
		if(!valid) {
			return false;
		}
		
		scene[itemPosition[0]][itemPosition[1]] = item;
		item.position = itemPosition;
		return true;
	};

	this.setPosition = function(y, x, item) {
		var itemPositon = (item || {}).position || positon;
		var item = item || self.getItem(itemPositon);
		self.cleanCurrentPlace(itemPositon);
		itemPositon[0] = y;
		itemPositon[1] = x;
		scene[y][x] = item;
		item.position = itemPositon;
	};

	this.changeItemPosition = function(item, toPosition) {
		var valid = self.checkNextPosition.apply(self, toPosition);
		if(!valid) {
			return false;
		}
		return self.setPosition(toPosition[0], toPosition[1], item);
	};

	this.moveRight = function(steps) {
		var newPosition = self.genNextPosition('right', steps);
		var valid = self.checkNextPosition.apply(self, newPosition);
		if(!valid) {
			return false;
		}
		self.setPosition.apply(self, newPosition);
	};

	this.moveLeft = function(steps) {
		var newPosition = self.genNextPosition('left', steps);
		var valid = self.checkNextPosition.apply(self, newPosition);
		if(!valid) {
			return false;
		}
		self.setPosition.apply(self, newPosition);
	};

	this.moveBottom = function(steps) {
		var newPosition = self.genNextPosition('bottom', steps);
		var valid = self.checkNextPosition.apply(self, newPosition);
		if(!valid) {
			return false;
		}
		self.setPosition.apply(self, newPosition);
	};

	this.moveTop = function(steps) {
		var newPosition = self.genNextPosition('top', steps);
		var valid = self.checkNextPosition.apply(self, newPosition);
		if(!valid) {
			return false;
		}
		self.setPosition.apply(self, newPosition);
		return true;
	};

	this.cleanCurrentPlace = function(itemPositon) {
		var oldPositon = itemPositon || position;
		scene[oldPositon[0]][oldPositon[1]] = defaultItem;
	}

	this.checkNextPosition = function(y, x) {
		if(!scene[y] || !scene[y][x]) {
			return false;
		}
		var item = scene[y][x];
		if(item.impassable) {
			return false;
		}
		return true;
	};

	this.genNextPosition = function(vector, steps) {
		var y = positon[0],
			x = positon[1];

		if(vector === 'top') {
			y = y - steps;
			return [y, x];
		}

		if(vector === 'bottom') {
			y = y + steps;
			return [y, x];
		}

		if(vector === 'right') {
			x = x + steps;
			return [y, x];
		}

		if(vector === 'left') {
			x = x - steps;
			return [y, x];
		}
	};

	for(var i = 0; y > i; i++) {
		var list = [];
		for(var n = 0; x > n; n++) {
			var defaultItem = new DefaultItem();
			defaultItem.position = [i, n];
			list.push(defaultItem);
		}
		scene.push(list);
	}
	
	this.setPosition.apply(this, positon);
};

Scene.prototype.moveElTo = function(el, vector, step) {
	var position = this.getElPosition(el);
	position = this.changePositionTo(position, vector, step);
	return this.moveElToPosition(position, el);
};

Scene.prototype.checkMoveTo = function(el, vector, step) {
	var position = this.getElPosition(el);
	position = this.changePositionTo(position, vector, step);
	
	return this.checkNextPosition.apply(this, [position.y, position.x]);
};

Scene.prototype.moveElToPosition = function(position, el) {
	var valid = this.checkNextPosition.apply(this, [position.y, position.x]);
	if(!valid) {
		return false;
	}
	return this.setPosition(position.y, position.x, el);
};


Scene.prototype.changePositionTo = function(position, vector, step) {
	switch(vector) {
		case 'up':
			position.y = position.y - step;
			break;
		case 'down':
			position.y = position.y + step;
			break;
		case 'left':
			position.x = position.x- step;
			break;
		case 'right':
			position.x = position.x + step;
			break;
	}
	return position;
};

Scene.prototype.getElPosition = function(El) {
	var status = false,
		places = this.get(),
		position = new Position();

	for(var y_index in places) {
		var x_index = places[y_index].indexOf(El);
		if(!~x_index) {
			continue;
		}
		position.y = y_index;
		position.x = x_index;
		status = true;
		break;
	}
	return status ? position : null;
};

module.exports = Scene;