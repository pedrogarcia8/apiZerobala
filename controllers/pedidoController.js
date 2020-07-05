var logger = require('../servicos/logger.js');
var login = require('../servicos/login.js');

module.exports = function(app){

	var connection = app.servicos.connectionDB();
	var pedidoModel = new app.models.pedidoModel(connection);

	app.get('/pedidos', function(req, res){

		pedidoModel.lista(function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		})
	});


	app.get('/pedido/:codPedido', function(req, res){
		
		var codPedido = req.params.codPedido;

		pedidoModel.buscaPorCodPedido(codPedido, function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		});
	});

	app.get('/pedidos/:codUsuarioPedido', function(req, res){
		
		var codUsuarioPedido = req.params.codUsuarioPedido;

		pedidoModel.buscaPorCodUsuario(codUsuarioPedido, function(erro, resultado){
			if(erro){
				console.log('erro ao consultar no banco: ' + erro);
				res.status(500).send(erro);
				return;
			}
			res.json(resultado);
			return;
		});
	});

	app.get('/pedidoNF/:codUsuarioPedido', function(req, res){
		
		var codUsuarioPedido = req.params.codUsuarioPedido;

		pedidoModel.buscaPedidoNF(codUsuarioPedido, function(erro, resultado){
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

		pedidoModel.atualizaStatusPedido(pedido, function(erro){
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
		
		pedidoModel.insere(pedido, function(erro, resultado){
			if(erro){
				console.log('Erro ao inserir no banco' + erro);
				res.status(500).send(erro);
			}else{
				res.status(201).json(pedido);	
			}
		});
	});

}
