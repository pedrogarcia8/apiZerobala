function fluxoCaixaModel(connection){
	this._connection = connection;
}

fluxoCaixaModel.prototype.insere = function(transicao, callback){
	this._connection.query('INSERT INTO FluxoCaixa SET ?',[transicao], callback);	
}

fluxoCaixaModel.prototype.buscaPorTipo = function(tipo,callback){
	this._connection.query('SELECT * FROM FluxoCaixa WHERE tipo = ?',[tipo],callback);
}

fluxoCaixaModel.prototype.lista = function(callback){
	this._connection.query('SELECT * FROM FluxoCaixa',callback);
}

fluxoCaixaModel.prototype.buscaPorTipoComPlataforma = function(codUsuarioFluxoCaixa, tipo, callback){
	if( tipo == 'E'){
		this._connection.query('SELECT a.data, a.valor, a.codPedidoFC, a.descricao, b.nomePlataforma FROM FluxoCaixa a INNER JOIN Pedido c ON (a.codPedidoFC = c.codPedido)  INNER JOIN Plataforma b ON (c.codPlataformaPedido = b.codPlataforma) WHERE a.codUsuarioFC = ? AND a.tipo = ?',
		[codUsuarioFluxoCaixa,tipo],callback);
	}
		
}

module.exports = function(){
      return fluxoCaixaModel;
};