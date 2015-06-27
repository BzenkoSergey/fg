var BlockElement = require('./elements/block.js');
var RoadElement = require('./elements/road.js');
var PersonElement = require('./persons/person.js');
var VictimElement = require('./persons/victim.js');
var HunterElement = require('./persons/hunter.js');
var Figure = require('./core/figure.js');

angular
	.module('a', [])
	.controller('Map', function($scope, $timeout) {
		var renderMap = new Figure([60, 50]);
		$scope.map = renderMap;

		var figure = new Figure([20,20], HunterElement);
		renderMap.add(figure, [6,6]);

		var E = HunterElement.extend({
			css: {
				backgroundColor: 'red'
			}
		});
		var figure2 = new Figure([10,10], E);
		figure.add(figure2, [1,1], true);



		window.asd = true;
		var victim = new VictimElement({}, renderMap);

		var start = performance.now();
		console.log(renderMap.add(victim, [6,6], true));
		var end = performance.now();
		console.log(end - start);

		setInterval(function() {
			$scope.$digest();
		}, 500);

	});