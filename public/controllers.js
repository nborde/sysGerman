var controllers = angular.module('myAppModule_CEP4.controllers',[],function(){});

controllers.controller('EmpleadosController',function($scope, $location, EmpleadosService){
	if($scope.empleados == null){
		$scope.empleados = EmpleadosService.getEmpleadosList();
	};


	$scope.initList = function(id){
		$scope.empleados = EmpleadosService.getEmpleadosList();
	};

	$scope.save = function(){
		console.log($scope.name + " - " + $scope.salary);
		(EmpleadosService.saveEmployee($scope.name, $scope.salary))
		.then(function(){
			$location.path('/listEmployee');
		});
	};

	$scope.delete = function(id){
		console.log("id to remove:"+id);
		(EmpleadosService.deleteEmployee(id))
		.then(function(){
			$scope.empleados = EmpleadosService.getEmpleadosList();
		});
	};


	$scope.getEmployee = function(id){
		$scope.empleados = EmpleadosService.getEmpleadosList();
		$location.path('/editNew/' + id);
	};

});


controllers.controller('EmpleadosControllerEdit', function($scope, $location, $routeParams,  EmpleadosService){
	EmpleadosService.getEmpleado($routeParams.id).then(function (empleado) {
		$scope.empleado = empleado;
	});
	
	$scope.update = function(){
		console.log($routeParams.id + " - " + $scope.empleado.name + " - " + $scope.empleado.salary);
		(EmpleadosService.updateEmployee($routeParams.id, $scope.empleado.name , $scope.empleado.salary))
		.then(function(){
			//$scope.empleados = EmpleadosService.getEmpleadosList();
			$location.path('/listEmployee');
		});
	};
});


// Clients 
controllers.controller('clientController',function($scope, $location, $routeParams, ClientService){
	if ($scope.clients == null) {
		$scope.clients = ClientService.getClientList();		
	};


	$scope.save = function(){
		console.log($scope.name + " - " + $scope.lastName);
		(ClientService.saveClient($scope.name, $scope.lastName))
		.then(function(){
			$location.path('/listClients');
		});
	};

	$scope.update = function(){
		$scope.client = ClientService.getClient($routeParams.id);
		console.log($routeParams.id + " - " + $scope.client.name + " - " + $scope.client.lastName);
		(ClientService.updateClient($routeParams.id,"Cliente", "Editado"))
		.then(function(){
			$location.path('/listClients');
		});
	};

	$scope.delete = function(id){
		console.log("id to remove:"+id);
		(ClientService.deleteClient(id))
		.then(function(){
			$scope.clients = ClientService.getClientList();
		});
	};

	$scope.getClient = function(id){
		$location.path('/editClient/' + id);
	};

});

controllers.controller('clientControllerEdit', function($scope, $location, $routeParams,  ClientService){
	ClientService.getClient($routeParams.id).then(function (client) {
		$scope.client = client;
	});
	
	$scope.update = function(){
		console.log($routeParams.id + " - " + $scope.client.name + " - " + $scope.client.lastName);
		(ClientService.updateClient($routeParams.id, $scope.client.name , $scope.client.lastName))
		.then(function(){
			$location.path('/listClients');
		});
	};
});
