var controllers = angular.module('myAppModule_CEP4.controllers',[],function(){});

// Clients 
controllers.controller('ClientController',function($scope, $location, ClientService){
	$scope.clients = ClientService.getClientList();

	$scope.save = function(){
		console.log($scope.name + " - " + $scope.lastName);
		(ClientService.saveClient($scope.name, $scope.lastName))
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


	$scope.getClients = function(id){
		(ClientService.getClient(id))
		.then(function(client){
			$location.path('/editNew/' + id);
		});
	};

});