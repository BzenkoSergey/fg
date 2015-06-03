var Scene = require('./scene/scene.js');

var BaseElement = require('./elements/base.js');
var BlockElement = require('./elements/block.js');
var PersonElement = require('./elements/persons/person.js');
var VictimElement = require('./elements/persons/victim.js');
var HunterElement = require('./elements/persons/hunter.js');

angular
	.module('a', [])
	.controller('ACtrl', function($scope, $timeout) {
		$scope.scene = new Scene(20, 20, BaseElement);

		var victim = new VictimElement({}, $scope.scene);
		$scope.scene.addElement(victim, [0,0]);

//		$scope.scene.changeItem([0,5], new BlockElement());
//		$scope.scene.changeItem([1,5], new BlockElement());
//		$scope.scene.changeItem([2,5], new BlockElement());
//		$scope.scene.changeItem([3,5], new BlockElement());
//		$scope.scene.changeItem([4,5], new BlockElement());
//		$scope.scene.changeItem([5,5], new BlockElement());

		var hanter = new HunterElement({}, $scope.scene);
		$scope.scene.addElement(hanter, [6,6]);
		hanter.kill(victim);
		
		key('left', function(){
			victim.moveTo('left');
			$scope.$digest();
		});
		key('right', function(){
			victim.moveTo('right');
			$scope.$digest();
		});
		key('up', function(){
			victim.moveTo('up');
			$scope.$digest();
		});
		key('down', function(){
			victim.moveTo('down');
			$scope.$digest();
		});
		window.scene = $scope.scene;
		
		setInterval(function() {
			$scope.$digest();
		}, 500)
	});