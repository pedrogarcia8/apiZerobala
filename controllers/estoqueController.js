var logger = require('../servicos/logger.js');
var login = require('../servicos/login.js');

module.exports = function(app){

	var connection = app.servicos.connectionDB();
	var estoqueModel = new app.models.estoqueModel(connection);

	app.get('/estoque', function(req, res){

		estoqueModel.lista(function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		})
	});

	app.get('/estoque/:codUsuarioProduto', function(req, res){

		var codUsuarioProduto = req.params.codUsuarioProduto;

		estoqueModel.listaEstoqueProduto(codUsuarioProduto, function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		})
	});

	app.post('/estoque', function(req, res){
		
		req.assert("codProdutoEstoque", "Código do produto é obrigatório").notEmpty();
		req.assert("codPlataformaEstoque", "Código da plataforma é obrigatório").notEmpty();
		req.assert("quantidade", "Quantidade é obrigatório").notEmpty();

		var erros = req.validationErrors();

		if(erros){
			console.log('Erros de validação encontrados');
			res.status(400).send(erros);
			return;
		}

		var estoque = req.body;
		
		estoqueModel.insere(estoque, function(erro, resultado){
			if(erro){
				console.log('Erro ao inserir no banco' + erro);
				res.status(500).send(erro);
			}else{
				res.status(201).json(estoque);	
			}
		});
	});

}
