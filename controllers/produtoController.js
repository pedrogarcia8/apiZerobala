var logger = require('../servicos/logger.js');
var login = require('../servicos/login.js');

module.exports = function(app){

	var connection = app.servicos.connectionDB();
	var produtoModel = new app.models.produtoModel(connection);

	app.get('/produtos', function(req, res){

		produtoModel.lista(function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		})
	});


	app.get('/produto/:codProduto', function(req, res){
		
		var codProduto = req.params.codProduto;

		produtoModel.buscaPorCodProduto(codProduto, function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		});
	});

	app.get('/produtos/:codUsuarioProduto', function(req, res){
		
		var codUsuarioProduto = req.params.codUsuarioProduto;

		produtoModel.buscaPorCodUsuario(codUsuarioProduto, function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		});
	});

	app.patch('/atualizaStatusPedido', function(req, res){

		var pedido = req.body;

		produtoModel.atualizaStatusPedido(pedido, function(erro){
			if(erro){
				res.status(500).send(erro);
				return;
			}
			res.status(200).send(pedido);
		});

	});

	app.post('/pedido', function(req, res){
		
		req.assert("codCliente", "código do cliente obrigatório").notEmpty();
		req.assert("dataCriado", "data de criação obrigatório").notEmpty();
		req.assert("total", "Total do pedido obrigatório").notEmpty();
		req.assert("status", "Status do pedido obrigatório").notEmpty();
		req.assert("etiquetaGerada", "Etiqueta gerada obrigatório").notEmpty();
		req.assert("codUsuarioPedido", "Código do usuário obrigatório").notEmpty();

		var erros = req.validationErrors();

		if(erros){
			console.log('Erros de validação encontrados');
			res.status(400).send(erros);
			return;
		}

		var pedido = req.body;
		
		produtoModel.insere(pedido, function(erro, resultado){
			if(erro){
				console.log('Erro ao inserir no banco' + erro);
				res.status(500).send(erro);
			}else{
				res.status(201).json(pedido);	
			}
		});
	});

}
