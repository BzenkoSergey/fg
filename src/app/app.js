var BlockElement = require('./elements/block.js');
var RoadElement = require('./elements/road.js');
var PersonElement = require('./persons/person.js');
var VictimElement = require('./persons/victim.js');
var HunterElement = require('./persons/hunter.js');
var Figure = require('./core/figure.js');

angular
	.module('a', [])
	.controller('Map', function($scope, $timeout) {
		var renderMap = new Figure([35, 30]);
		window.renderMap = renderMap;

		var victim = new VictimElement({}, renderMap);
		window.victim = $scope.victim;
		renderMap.add(victim, [5,5]);

		// genBaseMap(renderMap);

		var figure = new Figure([5,5], HunterElement);
		window.figure = figure;
		console.log(renderMap.add(figure, [0,1]));

		var victim2 = new VictimElement({}, figure);
		figure.add(victim2, [1,1]);



		var figure2 = new Figure([3,2], HunterElement);
		window.figure2 = figure2;
		console.log(renderMap.add(figure2, [6,6]));

		// key('left', function(){
		// 	figure.moveFigureTo('left');
		// 	$scope.$digest();
		// });
		// key('right', function(){
		// 	figure.moveFigureTo('right');
		// 	$scope.$digest();
		// });
		// key('up', function(){
		// 	figure.moveFigureTo('up');
		// 	$scope.$digest();
		// });
		// key('down', function(){
		// 	figure.moveFigureTo('down');
		// 	$scope.$digest();
		// });

		setInterval(function() {
			$scope.$digest();
		}, 500);

		$scope.map = renderMap;
	});


function genBaseMap(renderMap) {
	renderMap.add(new BlockElement({}, renderMap), [26,24]);
	renderMap.add(new BlockElement({}, renderMap), [25,25]);
	renderMap.add(new BlockElement({}, renderMap), [24,26]);
	renderMap.add(new BlockElement({}, renderMap), [23,27]);

	renderMap.add(new RoadElement({}, renderMap), [0,28]);
	renderMap.add(new RoadElement({}, renderMap), [1,28]);
	renderMap.add(new RoadElement({}, renderMap), [2,28]);
	renderMap.add(new RoadElement({}, renderMap), [3,28]);
	renderMap.add(new RoadElement({}, renderMap), [4,28]);	
	renderMap.add(new RoadElement({}, renderMap), [5,28]);
	renderMap.add(new RoadElement({}, renderMap), [6,28]);
	renderMap.add(new RoadElement({}, renderMap), [7,28]);
	renderMap.add(new RoadElement({}, renderMap), [8,28]);
	renderMap.add(new RoadElement({}, renderMap), [9,28]);
	renderMap.add(new RoadElement({}, renderMap), [10,28]);
	renderMap.add(new RoadElement({}, renderMap), [11,28]);
	renderMap.add(new RoadElement({}, renderMap), [12,28]);
	renderMap.add(new RoadElement({}, renderMap), [13,28]);
	renderMap.add(new RoadElement({}, renderMap), [14,28]);
	renderMap.add(new RoadElement({}, renderMap), [15,28]);
	renderMap.add(new RoadElement({}, renderMap), [16,28]);
	renderMap.add(new RoadElement({}, renderMap), [17,28]);
	renderMap.add(new RoadElement({}, renderMap), [18,28]);
	renderMap.add(new RoadElement({}, renderMap), [19,28]);
	renderMap.add(new RoadElement({}, renderMap), [20,28]);
	renderMap.add(new RoadElement({}, renderMap), [21,28]);
	renderMap.add(new RoadElement({}, renderMap), [22,28]);
}
