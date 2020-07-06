var logger = require('../servicos/logger.js');
var login = require('../servicos/login.js');

module.exports = function(app){

	var connection = app.servicos.connectionDB();
	var fluxoCaixaModel = new app.models.fluxoCaixaModel(connection);

	app.get('/fluxoCaixa', function(req, res){

		fluxoCaixaModel.lista(function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		})
	});

	app.get('/fluxoCaixaEntrada/:codUsuarioFC', function(req, res){

		var codUsuarioFC = req.params.codUsuarioFC;
		var tipo = 'E';

		fluxoCaixaModel.buscaPorTipoComPlataforma(codUsuarioFC, tipo,function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		})
	});

	app.get('/fluxoCaixaSaida/:codUsuario', function(req, res){

		var codUsuario = req.params.codUsuario;
		var tipo = 'S';

		fluxoCaixaModel.buscaPorTipoComPlataforma(codUsuario, tipo,function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		})
	});

	app.get('/fluxoCaixa/:tipo', function(req, res){
		
		var tipo = req.params.tipo;

		fluxoCaixaModel.buscaPorTipo(tipo, function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		});
	});

	app.post('/fluxoCaixa', function(req, res){
		
		req.assert("tipo", "tipo é obrigatório").notEmpty();
		req.assert("data", "data é obrigatório").notEmpty();
		req.assert("valor", "valor é obrigatório").notEmpty();
		req.assert("codUsuarioFC", "codigo do usuario é obrigatório").notEmpty();

		var erros = req.validationErrors();

		if(erros){
			console.log('Erros de validação encontrados');
			res.status(400).send(erros);
			return;
		}

		var transicao = req.body;
		
		fluxoCaixaModel.insere(transicao, function(erro, resultado){
			if(erro){
				console.log('Erro ao inserir no banco' + erro);
				res.status(500).send(erro);
			}else{
				res.status(201).json(transicao);	
			}
		});
	});

}
