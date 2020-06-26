var mysql = require('mysql');

function createDBConnection(){
	return mysql.createConnection({
		host: '34.95.185.141',
		user: 'zerobala',
		password: 'Z3r0b@l4?',
		database: 'zerobala'
	});
}

module.exports = function(){
	return createDBConnection;
}