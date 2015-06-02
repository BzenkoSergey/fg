var PersonElement = require('./person.js');


var Victim = PersonElement.extend({
	impassable: false,
	isVictim: true,
	init: function(opts) {
		this.name = ':)';
	},
	runFrom: function(item) {
		var self = this;
		var killing = setInterval(function() {
			self.moveToItem(item);
		}, 1500);
		
		this.private('killing', killing);
	},
	moveToItem: function(item) {
		var scena = this.private('scene'),
			ds = this.private('ds'),
			myPosition = scena.getElPosition(this),
			itemPosition = scena.getElPosition(item),
			newPosition = [myPosition[0], myPosition[1]];
			
			
//					if(self.hasBackAbility(myPosition)) {
//						newPosition = self.genBackPosition();
//						return self.moveTo(newPosition);
//					}
			
			if(myPosition[0] < itemPosition[0]) {
				if(myPosition[0] !== 0) {
					if(ds === 'x') {
						newPosition[0] = myPosition[0] + 1;
					} else {
						newPosition[0] = myPosition[0] - 1;
					}
				}
			} else {
				newPosition[0] = myPosition[0] + 1;
			}	

			if(myPosition[1] < itemPosition[1]) {
				if(myPosition[1] !== 0) {
					if(ds === 'y') {
						newPosition[1] = myPosition[1] + 1;
					} else {
						newPosition[1] = myPosition[1] - 1;
					}
				}
			} else {
				newPosition[1] = myPosition[1] + 1;
			}
			
		if(!newPosition[0] && newPosition[0] !== itemPosition[0]) {
			newPosition[0] = 1;
		}

		if(!newPosition[1] && newPosition[1] !== itemPosition[1]) {
			newPosition[1] = 1;
		}

		if(newPosition[0] === myPosition[0] && newPosition[0] !== itemPosition[0]) {
			newPosition[0] = newPosition[0] + 1;
		}

		if(newPosition[1] === myPosition[1] && newPosition[1] !== itemPosition[1]) {
			newPosition[1] = newPosition[1] + 1;
		}

		if(!newPosition[0] && !newPosition[1]) {
			if(itemPosition[0] > itemPosition[1]) {
				newPosition[1] = 1;
				this.private('ds', 'x');
			} else {
				newPosition[0] = 1;
				this.private('ds', 'y');
			}
		}
		
		if(newPosition[0] === itemPosition[0] && 
			newPosition[1] === itemPosition[1]) {
			clearInterval(self.killing);
		}
		
		return self.moveTo(newPosition);
	},
	
	hasBackAbility: function(position) {
		if(position[0] === 0 && position[1] === 0) {
			return false;
		}
		return true;
	},

	moveTo: function(position) {
		var scena = this.private('scene');
		scena.changeItemPosition(self, position);
	}
});

module.exports = Victim;