var app = angular.module("MyApp",[]);
app.controller( "TODOListCtrl", function ($scope, todoService, $http) {

	$scope.taskData = {};

	todoService.get().then(function (data) {
		$scope.tasks = data.data;
	}, function error(err) {
		console.log(err);
	});

	$scope.filterOptions = { 
		filters:[
		{id: 1,name:"Show All"},
		{id: 2,name:"Checked"},
		{id: 3,name:"Unchecked"}
		]};

	$scope.filterItem = {

		filter: $scope.filterOptions.filters[0]
	}

	$scope.customFilter = function (tasks){
		if ($scope.filterItem.filter.id===1){
			return true;
		} 
		else if(tasks.isChecked===true && $scope.filterItem.filter.id===2){
			return true;
		}
		else if (tasks.isChecked===false && $scope.filterItem.filter.id===3){
			return true;
		}
	};

	$scope.addToList = function (){
		
		if ($scope.taskData.name!==""){
			todoService.insert($scope.taskData).then(function(data){
				console.log(data);
				$scope.tasks = data.data;
				$scope.taskData = {};
			},function error(err){
				console.log(err);
				$scope.taskData = {};
			});
		} else {
			alert("no data!");
		}
	};

	$scope.isCheckedChanged = function (id, isChecked){
		todoService.change(id, isChecked).then(function(data){
		},function error(err){
			console.log(err);
		})
	};

	$scope.remove = function (id){
		todoService.delete(id).then(function (data){
			$scope.tasks = data.data;
		}, function error(err){
			console.log(err);
		});
	};

	$scope.onEnterAdd = function (event) {
		if (event.keyCode === 13){
			$scope.addToList();
		}
	};	

	$scope.onEnterUpdate = function (event, id, newName){
		if (event.keyCode === 13){
			$scope.updateName(id, newName);
			return true;
		} else { 
			return false;
		}	
	};

	$scope.updateName = function(id, newName){
		todoService.edit(id, newName).then(function (data){
			$scope.tasks = data.data;
		}, function error(err){
			console.log(err);
		});
	}; 
});

app.factory('todoService',['$http', function($http){
	return {
		get: function(){
			return $http.get('/api/todos');
		},
		insert: function(taskData){
			return $http.post('/api/todos', taskData);
		},
		delete: function(id){
			return $http.delete('/api/todos/' + id); 		
		},
		change: function(id, isChecked){
			var status = {};
			status.id = id;
			status.isChecked = isChecked;
			return $http.post('/api/todos', status);
		},
		edit: function(id, newName){
			var update = {};
			update.id = id;
			update.newName = newName;
			return $http.post('/api/todos', update);
		}
	}
}]);