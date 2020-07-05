var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var logger = require('../servicos/logger.js');


module.exports = function(){
	var app = express();

	app.use(morgan("common", {
		stream: {
			write: function(mensagem){
				logger.info(mensagem);
			}
		}
	}));

	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	

	app.use(function(req, res, next) {
    	res.header("Access-Control-Allow-Origin", "*");
     	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
     	res.header('Access-Control-Allow-Credentials', "*");
     	res.header('Access-Control-Expose-Headers', 'x-access-token');
     	next();
 	});
	
	app.use(expressValidator());

	

	consign()
	.include('servicos')
	.then('models')
	.then('controllers')
	.into(app);

	return app;
}