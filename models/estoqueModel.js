function estoqueModel(connection){
	this._connection = connection;
}

estoqueModel.prototype.insere = function(estoque, callback){
	this._connection.query('INSERT INTO Estoque SET ?',[estoque], callback);	
}


estoqueModel.prototype.lista = function(callback){
	this._connection.query('SELECT * FROM Estoque',callback);
}

estoqueModel.prototype.listaEstoqueProduto = function(codUsuarioProduto, callback){
	this._connection.query('SELECT a.codProdutoEstoque, a.quantidade, b.nomeProduto, b.preco, c.nomePlataforma FROM Estoque a INNER JOIN Produto b ON (a.codProdutoEstoque = b.codProduto) INNER JOIN Plataforma c ON (a.codPlataformaEstoque = c.codPlataforma) WHERE b.codUsuarioProduto = ?',
		[codUsuarioProduto],callback);
}


module.exports = function(){
      return estoqueModel;
};