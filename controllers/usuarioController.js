var logger = require('../servicos/logger.js');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var login = require('../servicos/login.js');


module.exports = function(app){

	var connection = app.servicos.connectionDB();
	var usuarioModel = new app.models.usuarioModel(connection);

	app.get('/usuarios', function(req, res){

		usuarioModel.lista(function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		})
	});


	app.get('/usuario/:cpf', function(req, res){
		
		var cpf = req.params.cpf;

		usuarioModel.buscaPorCpf(cpf, function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		});
	});


	app.patch('/usuario', function(req, res){

		var usuario = req.body;

		usuarioModel.atualizaNome(usuario, function(erro){
			if(erro){
				res.status(500).send(erro);
				return;
			}
			res.status(200).send(usuario);
		});

	});

	app.post('/usuario', function(req, res){
		
		req.assert("cpf", "CPF obrigatorio").notEmpty();
		req.assert("nome", "Nome obrigatorio").notEmpty();
		req.assert("email", "Email obrigatorio").notEmpty();
		req.assert("senha", "Senha obrigatoria").notEmpty();

		var erros = req.validationErrors();

		if(erros){
			console.log('Erros de validacao encontrados');
			res.status(400).send(erros);
			return;
		}

		var usuario = req.body;
		bcrypt.hash(usuario.senha, 10, function(erroBcrypt, hash){
			if(erroBcrypt){
				console.log('Erro de cripografia ' + erroBcrypt);
				res.status(500).send(erroBcrypt);
				return;
			}
			usuario.senha = hash;

			usuarioModel.insere(usuario, function(erro, resultado){
				if(erro){
					console.log('Erro ao inserir no banco' + erro);
					res.status(500).send(erro);
				}else{
					res.status(201).json(usuario);	
				}
			
			});
		});
	});

	app.post('/login', function(req, res, next){

		req.assert("email", "Email obrigatorio").notEmpty();
		req.assert("senha", "Senha obrigatoria").notEmpty();

		var erros = req.validationErrors();

		if(erros){
			console.log('Erros de validacao encontrados');
			res.status(400).send(erros);
			return;
		}

		var dados = req.body;
		
		usuarioModel.buscaPorEmail(dados.email, function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}

			bcrypt.compare(dados.senha, resultado[0].senha, function(exception, result){	
				if(exception){
					res.status(401).send({ mensagem: 'Falha na autenticacao'});
					return;
				}
				if(result){
					const token = jwt.sign({
						codUsuario : resultado[0].codUsuario,
						email: resultado[0].email
					},
					"Z35I-S8K5-M7AW-1Y36-VH09",
					{
						expiresIn: "12h"
					});
					res.status(200).set('x-access-token', token).send({ mensagem: 'Autenticado',token: token });
					return;
				}
				res.status(401).send({ mensagem: 'Falha na autenticacao'});
			});
				
		});
	});
}

