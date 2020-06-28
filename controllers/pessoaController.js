var logger = require('../servicos/logger.js');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var login = require('../servicos/login.js');


module.exports = function(app){

	var connection = app.servicos.connectionDB();
	var pessoaModel = new app.models.pessoaModel(connection);

	app.get('/pessoas', function(req, res){

		pessoaModel.lista(function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		})
	});


	app.get('/pessoa/:cpf', function(req, res){
		
		var cpf = req.params.cpf;

		pessoaModel.buscaPorCpf(cpf, function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		});
	});

	app.delete('/pessoa/:cpf', function(req, res){

		var cpf = req.params.cpf;

		pessoaModel.deleta(cpf, function(erro){
			if(erro){
				res.status(500).send(erro);
				return;
			}
			res.status(202).send(cpf);
		});
	});

	app.patch('/pessoa/:cpf', function(req, res){

		var pessoa = req.body;

		pessoaModel.atualizaNome(pessoa, function(erro){
			if(erro){
				res.status(500).send(erro);
				return;
			}
			res.status(200).send(pessoa);
		});

	});

	app.post('/pessoa', function(req, res){
		
		req.assert("cpf", "CPF obrigatorio").notEmpty();
		req.assert("nome", "Nome obrigatorio").notEmpty();
		req.assert("celular", "Celular obrigatorio").notEmpty();
		req.assert("senha", "Senha obrigatoria").notEmpty();

		var erros = req.validationErrors();

		if(erros){
			console.log('Erros de validacao encontrados');
			res.status(400).send(erros);
			return;
		}

		var pessoa = req.body;
		bcrypt.hash(pessoa.senha, 10, function(erroBcrypt, hash){
			if(erroBcrypt){
				console.log('Erro de cripografia ' + erroBcrypt);
				res.status(500).send(erroBcrypt);
				return;
			}
			pessoa.senha = hash;

			pessoaModel.insere(pessoa, function(erro, resultado){
				if(erro){
					console.log('Erro ao inserir no banco' + erro);
					res.status(500).send(erro);
				}else{
					res.status(201).json(pessoa);	
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
		
		pessoaModel.buscaPorEmail(dados.email, function(erro, resultado){
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
						id_usuario : resultado[0].idPessoa,
						email: resultado[0].email
					},
					"Z35I-S8K5-M7AW-1Y36-VH09",
					{
						expiresIn: "12h"
					});
					res.status(200).send({ mensagem: 'Autenticado',
										   token: token });
					return;
				}
				res.status(401).send({ mensagem: 'Falha na autenticacao'});
			});
				
		});
	});
}

