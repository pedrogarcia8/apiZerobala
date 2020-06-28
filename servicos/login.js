const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) =>{
	
	try{
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.verify(token, "Z35I-S8K5-M7AW-1Y36-VH09");
		req.usuario = decode;
		next();
	}catch(error){
		res.status(401).send({ mensagem: 'Falha na autenticacao'});
	}
}

exports.opcional = (req, res, next) =>{
	
	try{
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.verify(token, "Z35I-S8K5-M7AW-1Y36-VH09");
		req.usuario = decode;
		next();
	}catch(error){
		next();
	}
}