var services = angular.module('myAppModule_CEP4.services',[]);
services.service('EmpleadosService',function($http, $q){
	var EmpleadosService = {};
	EmpleadosService.getEmpleadosList = function(){
		var deferred = $q.defer();
		$http.get("/employees",{"headers" : {"Accept" : "application/json"}})
		.success(function(data){
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occured while fetching status");
		});
		
		return deferred.promise;
	}

	EmpleadosService.getEmpleado = function(id){
		var deferred = $q.defer();
		$http.get("/employees/"+id,{"headers" : {"Accept" : "application/json"}})
		.success(function(data){
			//console.warn(data);
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occured while fetching status");
		});
		
		return deferred.promise;
	}

	EmpleadosService.saveEmployee = function(name, salary){
		console.log("EmpleadosService.saveEmployee");
		var deferred = $q.defer();
		$http.post(
			"/employees", 
			{'name': name,'salary': salary}, 
			{"headers" : 
				{"Accept" : "application/json", "Content-Type":"application/json"}
			})
		.success(function(data){
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occured while fetching status");
		});

		
		return deferred.promise;
	}

	EmpleadosService.deleteEmployee = function(id){
		console.log("EmpleadosService.deleteEmployee");
		var deferred = $q.defer();
		$http.delete(
			"/employees/"+id, 
			{"headers" : 
				{"Accept" : "application/json", "Content-Type":"application/json"}
			})
		.success(function(data){
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occured while fetching status");
		});

		
		return deferred.promise;
	}

	EmpleadosService.updateEmployee = function(id, name, salary){
		console.log("EmpleadosService.updateEmployee");
		var deferred = $q.defer();
		$http.put(
			"/employees/"+id,
			{'name': name,'salary': salary}, 
			{"headers" : 
				{"Accept" : "application/json", "Content-Type":"application/json"}
			})
		.success(function(data){
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occured while fetching status");
		});

		
		return deferred.promise;
	}

	
	return EmpleadosService;
});


services.service('ClientService',function($http, $q){
	var ClientService = {};
	ClientService.getClientList = function(){
		var deferred = $q.defer();
		$http.get("/clients",{"headers" : {"Accept" : "application/json"}})
		.success(function(data){
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occured while fetching status");
		});
		
		return deferred.promise;
	}

	ClientService.getClient = function(id){

		var deferred = $q.defer();
		$http.get("/clients/"+id,{"headers" : {"Accept" : "application/json"}})
		.success(function(data){
			console.warn(data);
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occured while fetching status");
		});
		
		return deferred.promise;
	}

	ClientService.saveClient = function(name, lastName){
		console.log("ClientService.saveClient");
		var deferred = $q.defer();
		$http.post(
			"/clients", 
			{'name': name,'lastName': lastName}, 
			{"headers" : 
				{"Accept" : "application/json", "Content-Type":"application/json"}
			})
		.success(function(data){
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occured while fetching status");
		});

		
		return deferred.promise;
	}

	ClientService.deleteClient = function(id){
		console.log("ClientService.deleteClient");
		var deferred = $q.defer();
		$http.delete(
			"/clients/"+id, 
			{"headers" : 
				{"Accept" : "application/json", "Content-Type":"application/json"}
			})
		.success(function(data){
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occured while fetching status");
		});

		
		return deferred.promise;
	}

	ClientService.updateClient = function(id, name, lastName){
		console.log("ClientService.updateClient");
		var deferred = $q.defer();
		$http.put(
			"/clients/"+id,
			{'name': name,'lastName': lastName}, 
			{"headers" : 
				{"Accept" : "application/json", "Content-Type":"application/json"}
			})
		.success(function(data){
			deferred.resolve(data);
		})
		.error(function(){
			deferred.reject("An error occured while fetching status");
		});

		
		return deferred.promise;
	}

	
	return ClientService;
});