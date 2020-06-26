var logger = require('../servicos/logger.js');

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
		})
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
		
		var erros = req.validationErrors();

		if(erros){
			console.log('Erros de validacao encontrados');
			res.status(400).send(erros);
			return;
		}

		var pessoa = req.body;

		pessoaModel.insere(pessoa, function(erro, resultado){
			if(erro){
				console.log('Erro ao inserir no banco' + erro);
				res.status(500).send(erro);
			}else{
				res.status(201).json(pessoa);	
			}
			
		});

	});
}

