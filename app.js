var express = require('express'),
app = express(),
js2xmlparser = require("js2xmlparser");
xml2js = require('xml2js');
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  req.rawBody = '';
  req.setEncoding('utf8');
	  req.on('data', function(chunk) { 
	req.rawBody += chunk;
  });
	  req.on('end', function() {
	next();
  });
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
};


var employees = [
	{ id: 1, name: 'Martin', salary: 1000 },
	{ id: 2, name: 'Pablo', salary: 2000 },
	{ id: 3, name: 'Federico', salary: 3500 },
	{ id: 4, name: 'Santiago', salary: 2850 },
	{ id: 5, name: 'Marcos', salary: 5500 }
];

var nextEmployeeId = employees.length + 1;

var clients = [
	{ id: 1, name: 'Martin', lastName: 'Perez' },
	{ id: 2, name: 'Pablo', lastName: 'Lopez' },
	{ id: 3, name: 'Federico', lastName: 'Rodriguez' },
	{ id: 4, name: 'Santiago', lastName: 'Gonzalez' },
	{ id: 5, name: 'Marcos', lastName: 'Alvarez' }
];



var nextClientId = employees.length + 1;


// GET /employees
// Returns all employees
app.get('/employees', function (req, res) {
	if(req.accepts('*/*')){
		res.send('You have to specify what you accept from the server', 400);
	}
	else if(req.accepts('xml')){
		res.type('xml');
		var options = {
			wrapArray: {
				enabled: true,
				elementName : 'Employee'
			}	
		};
		res.send(js2xmlparser("Employees", employees, options)); //we need the wrapArray options here to generate valid xml structure
	}else if(req.accepts('json')){
		res.json(employees); //res.send(JSON.stringify(employees)) works as well
	}else{
		res.send('Accept format not allowed', 406);
	}
});

// GET /employees/:id
// Rerturns a single employee by id
app.get('/employees/:id', function (req, res){
	if(req.accepts('*/*')){
		res.send('You have to specify what you accept from the server', 400);
		return;
	}
	
	var employee;

	for (var i = employees.length - 1; i >= 0; i--) {
		if (employees[i].id == req.params.id) {
			employee = employees[i];
			break;
		}
	};

	if (!employee) {
		res.send('Error 404: No employee found', 404);
	}
	else if(req.accepts('xml')){
		res.type('xml');
		res.send(js2xmlparser("Employee", employee)); 
	}else if(req.accepts('json')){
		res.json(employee); //res.send(JSON.stringify(employees)) works as well
	}else{
		res.send('Accept format not allowed', 406);
	}
});

//Reuse code in POST and PUT to obtain the body depending on which Content-Type the client sends
parseBodyDependingOnContentType = function(req, res){
	var body = null;
	if(req.get('Content-Type') == 'application/xml' || req.get('Content-Type') == 'text/xml'){
		try{
			//explicit root and explicit array in false takes out the root node and takes each field out of the default array
			xml2js.parseString(req.rawBody, { explicitRoot: false, explicitArray : false }, function (err, result){ 
			
				if(err != null){ 
					res.send("Malformed xml, cannot parse", 400);
				}else{
					body = result;
				}
			})
		}catch(e){
			res.send("Oops! Error parsing xml request...", 500);
			console.log(e);
		}
	}
	else if (req.get('Content-Type') == 'application/json') {
		try{
			body = JSON.parse(req.rawBody); //JSON.parse is standard in browsers > IE8
		}catch(e){
			res.send("Malformed json, cannot parse", 400);
			console.log(e);
		}
	}
	return body;
}

// POST /employees
// Creates an employee with data contained in the body
app.post('/employees', function (req, res) {
	console.log("save employee - REST_API")
	var newEmployee, body;
	
	body = parseBodyDependingOnContentType(req, res);
	
	if(body === null) {
		res.send('Content-Type format not allowed', 400);
		return;
	};

	if (!body.hasOwnProperty('name') || !body.hasOwnProperty('salary')) {
		res.send('Error: Post syntax incorrect', 400);
		return;
	}

	createAndAddNewEmployee(body.name, body.salary);
	res.send("Employee created successfully", 201); //we could also return 204 as no need to return anything inside the body
});

// PUT /employees/:id
// Updates an employee by its id. As we are delegating ids ownership to the server, we can only create using post, so we won't create using PUT in this case.
app.put('/employees/:id', function (req, res) {

	console.log("UPDATE employee - REST_API")
	var body = parseBodyDependingOnContentType(req, res);
	
	if(body === null) {
		res.send('Content-Type format not allowed', 400);
		return;
	};

	if (!body.hasOwnProperty('name') || !body.hasOwnProperty('salary')) {
		res.send('Error: Put syntax incorrect', 400);
		return;
	}
	
	var employee;

	for (var i = employees.length - 1; i >= 0; i--) {
		if (employees[i].id == req.params.id) {
			employee = employees[i];
			break;
		}
	};

	if (!employee) {
		res.send("The employee you are trying to update does not exist and we cannot create it as the server is owner for giving ids to employees. Sorry", 404);
		return;
	}

	employee.name = body.name;
	employee.salary = body.salary;

	res.send("Employee updated correctly", 200);
});

// DELETE /employees/:id
// Deletes an employee by its id
app.delete('/employees/:id', function (req, res) {
	var employeeIndex = -1;

	for (var i = employees.length - 1; i >= 0; i--) {
		if (employees[i].id == req.params.id) {
			employeeIndex = i;
			break;
		}
	};
	if (employeeIndex === -1) {
		res.statusCode = 404;
		res.send('Error: No employee found');
		return;
	}

	employees.splice(employeeIndex, 1);
	res.statusCode = 204 //No content in the response, it's a delete
	res.send("This text will not be sent but we need to send something in order to let the client know the response status code");
});


// Employee Functions

//code to save a new employee
createAndAddNewEmployee = function(name, salary){
	console.log("createAndAddNewEmployee: " +name + " : "+salary)
	var newEmployee = {
		id : nextEmployeeId++,
		name : name,
		salary : salary
	};

	employees.push(newEmployee);
	console.log("employees push ok ")
	return;
}

// ############################## Clients ##############################

app.get('/clients', function (req, res) {
	if(req.accepts('*/*')){
		res.send('You have to specify what you accept from the server', 400);
	}
	else if(req.accepts('xml')){
		res.type('xml');
		var options = {
			wrapArray: {
				enabled: true,
				elementName : 'Client'
			}	
		};
		res.send(js2xmlparser("Clients", clients, options)); //we need the wrapArray options here to generate valid xml structure
	}else if(req.accepts('json')){
		res.json(clients); //res.send(JSON.stringify(employees)) works as well
	}else{
		res.send('Accept format not allowed', 406);
	}
});


// GET /clients/:id
// Rerturns a single client by id
app.get('/clients/:id', function (req, res){
	if(req.accepts('*/*')){
		res.send('You have to specify what you accept from the server', 400);
		return;
	}
	
	var client;

	for (var i = clients.length - 1; i >= 0; i--) {
		if (clients[i].id == req.params.id) {
			client = clients[i];
			break;
		}
	};

	if (!client) {
		res.send('Error 404: No client found', 404);
	}
	else if(req.accepts('xml')){
		res.type('xml');
		res.send(js2xmlparser("Client", client)); 
	}else if(req.accepts('json')){
		res.json(client); //res.send(JSON.stringify(employees)) works as well
	}else{
		res.send('Accept format not allowed', 406);
	}
});


// Creates an employee with data contained in the body
app.post('/clients', function (req, res) {
	console.log("save Client - REST_API")
	var newEmployee, body;
	
	body = parseBodyDependingOnContentType(req, res);
	
	if(body === null) {
		res.send('Content-Type format not allowed', 400);
		return;
	};

	// Valido que vengan todas las props desde el form.
	if (!body.hasOwnProperty('name') || !body.hasOwnProperty('lastName')) {
		res.send('Error: Post syntax incorrect', 400);
		return;
	}

	createAndAddNewClient(body.name, body.lastName);
	
	res.send("Client created successfully", 201); //we could also return 204 as no need to return anything inside the body
});

// PUT /clients/:id
// Updates an Client by its id. As we are delegating ids ownership to the server, we can only create using post, so we won't create using PUT in this case.
app.put('/clients/:id', function (req, res) {

	console.log("UPDATE client - REST_API")
	var body = parseBodyDependingOnContentType(req, res);
	
	if(body === null) {
		res.send('Content-Type format not allowed', 400);
		return;
	};

	if (!body.hasOwnProperty('name') || !body.hasOwnProperty('lastName')) {
		res.send('Error: Put syntax incorrect', 400);
		return;
	}
	
	var client;

	for (var i = clients.length - 1; i >= 0; i--) {
		if (clients[i].id == req.params.id) {
			client = clients[i];
			break;
		}
	};

	if (!client) {
		res.send("The client you are trying to update does not exist and we cannot create it as the server is owner for giving ids to clients. Sorry", 404);
		return;
	}

	client.name = body.name;
	client.lastName = body.lastName;

	res.send("Client updated correctly", 200);
});

// DELETE /clients/:id
// Deletes an client by its id
app.delete('/clients/:id', function (req, res) {
	var clientIndex = -1;

	for (var i = clients.length - 1; i >= 0; i--) {
		if (clients[i].id == req.params.id) {
			clientIndex = i;
			break;
		}
	};
	if (clientIndex === -1) {
		res.statusCode = 404;
		res.send('Error: No cliens found');
		return;
	}

	clients.splice(clientIndex, 1);
	res.statusCode = 204 //No content in the response, it's a delete
	res.send("This text will not be sent but we need to send something in order to let the client know the response status code");
});

//code to save a new client
createAndAddNewClient = function(name, lastName){
	console.log("createAndAddNewClient: " +name + " : "+lastName)
	var newClient = {
		id : nextClientId++,
		name : name,
		lastName : lastName
	};

	clients.push(newClient);
	return;
}

// #####################################################################

app.listen(3000);
console.log('Listening on port 3000...');