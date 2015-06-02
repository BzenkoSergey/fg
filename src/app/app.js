var Scene = require('./scene/scene.js');

var BaseElement = require('./elements/base.js');
var BlockElement = require('./elements/block.js');
var PersonElement = require('./elements/persons/person.js');
var VictimElement = require('./elements/persons/victim.js');
var HunterElement = require('./elements/persons/hunter.js');

angular
	.module('a', [])
	.controller('ACtrl', function($scope, $timeout) {
		$scope.scene = new Scene(15, 25, BaseElement);

		var victim = new VictimElement({}, $scope.scene);
		$scope.scene.changeCurrentItem(victim);

		$scope.scene.changeItem([0,5], new BlockElement());
		$scope.scene.changeItem([1,5], new BlockElement());
		$scope.scene.changeItem([2,5], new BlockElement());
		$scope.scene.changeItem([3,5], new BlockElement());
		$scope.scene.changeItem([4,5], new BlockElement());
		$scope.scene.changeItem([5,5], new BlockElement());
		$scope.scene.changeItem([6,5], new BlockElement());
		$scope.scene.changeItem([7,5], new BlockElement());
		$scope.scene.changeItem([8,5], new BlockElement());

		var hanter = new HunterElement({}, $scope.scene);
		$scope.scene.changeItem([9,9], hanter);
		hanter.kill(victim);
		
		victim.runFrom(hanter);
		
		var person = new PersonElement({
			name: 'Boss'
		}, $scope.scene);
		$scope.scene.changeItem([5, 1], person);
		
		key('left', function(){
			person.moveTo('left');
			$scope.$digest();
		});
		key('right', function(){
			person.moveTo('right');
			$scope.$digest();
		});
		key('up', function(){
			person.moveTo('up');
			$scope.$digest();
		});
		key('down', function(){
			person.moveTo('down');
			$scope.$digest();
		});
		window.scene = $scope.scene;
		
		setInterval(function() {
			$scope.$digest();
		}, 500)
	});