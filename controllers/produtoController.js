var logger = require('../servicos/logger.js');
var login = require('../servicos/login.js');

module.exports = function(app){

	var connection = app.servicos.connectionDB();
	var produtoModel = new app.models.produtoModel(connection);

	app.get('/produtos', function(req, res){

		var ativo = 'S';

		produtoModel.lista(ativo,function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		})
	});


	app.get('/produtos/:codUsuarioProduto', function(req, res){
		
		var codUsuarioProduto = req.params.codUsuarioProduto;
		var ativo = 'S';

		produtoModel.buscaPorCodUsuario(codUsuarioProduto, ativo, function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		});
	});

	app.put('/atualizaProduto', function(req, res){

		var produto = req.body;

		produtoModel.atualizaStatusPedido(produto, function(erro){
			if(erro){
				res.status(500).send(erro);
				return;
			}
			res.status(200).send(produto);
		});

	});

	app.post('/produto', function(req, res){
		
		req.assert("codProduto", "código do produto obrigatório").notEmpty();
		req.assert("nomeProduto", "nome do produto obrigatório").notEmpty();
		req.assert("preco", "Preço do produto obrigatório").notEmpty();

		var erros = req.validationErrors();

		if(erros){
			console.log('Erros de validação encontrados');
			res.status(400).send(erros);
			return;
		}

		var produto = req.body;
			produto.ativo = 'S';
		
		produtoModel.insere(produto, function(erro, resultado){
			if(erro){
				console.log('Erro ao inserir no banco' + erro);
				res.status(500).send(erro);
			}else{
				res.status(201).json(produto);	
			}
		});
	});

}
