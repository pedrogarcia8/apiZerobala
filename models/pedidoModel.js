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

pedidoModel.prototype.atualizaStatusPedido = function(pedido, callback){
	this._connection.query('UPDATE Pedido SET status = ? WHERE codPedido = ?',[pedido.status,pedido.codPedido],callback);
}


module.exports = function(){
      return pedidoModel;
};