function pedidoModel(connection){
	this._connection = connection;
}

pedidoModel.prototype.insere = function(pedido, callback){
	this._connection.query('INSERT INTO Pedido SET ?',pedido, callback);	
}

pedidoModel.prototype.lista = function(callback){
	this._connection.query('SELECT * FROM Pedido',callback);
}

pedidoModel.prototype.buscaPorCodPedido = function(codPedido, callback){
	this._connection.query('SELECT * FROM Pedido WHERE codPedido = ?',[codPedido],callback);
}

pedidoModel.prototype.buscaPorCodUsuario = function(codUsuarioPedido, callback){
	this._connection.query('SELECT * FROM Pedido WHERE codUsuarioPedido = ?',[codUsuarioPedido],callback);
}

pedidoModel.prototype.buscaPedidoNF = function(codUsuarioPedido, callback){
	this._connection.query('SELECT a.codPedido, a.dataCriado, a.codCliente, b.nomePlataforma, a.total, a.codNFPedido, c.dataEmissao, a.etiquetaGerada, d.nomeProduto, d.preco, e.imagemBin, f.quantidade FROM Pedido a INNER JOIN ProdutoPedido f ON (a.codPedido = f.codPedidoPP) INNER JOIN Produto d ON (f.codProdutoPP = d.codProduto) INNER JOIN Plataforma b ON (a.codPlataformaPedido = b.codPlataforma) LEFT JOIN NotaFiscal c ON (a.codNFPedido = c.codNF) LEFT JOIN Imagem e ON (d.codProduto = e.codProduto) WHERE codUsuarioPedido = ?',
						   [codUsuarioPedido],callback);
}


pedidoModel.prototype.atualizaStatusPedido = function(pedido, callback){
	this._connection.query('UPDATE Pedido SET status = ? WHERE codPedido = ?',[pedido.status,pedido.codPedido],callback);
}



module.exports = function(){
      return pedidoModel;
};