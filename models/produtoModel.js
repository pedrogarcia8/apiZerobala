function produtoModel(connection){
	this._connection = connection;
}

produtoModel.prototype.insere = function(produto, callback){
	this._connection.query('INSERT INTO Produto SET ?',produto, callback);	
}

produtoModel.prototype.lista = function(ativo,callback){
	this._connection.query('SELECT * FROM Produto WHERE ativo = ?',[ativo],callback);
}

produtoModel.prototype.buscaPorCodUsuario = function(codUsuarioProduto,ativo, callback){
	this._connection.query('SELECT * FROM Produto WHERE codUsuarioProduto = ? AND ativo = ?',[codUsuarioProduto,ativo],callback);
}

produtoModel.prototype.atualizaProduto = function(produto, callback){
	this._connection.query('UPDATE Produto p INNER JOIN Imagem i ON p.codProduto = i.codProduto SET  p.nomeProduto = ? p.descricao = ? p.marca = ? p.preco = ? p.categoria = ?  i.nomeImagem = ? i.imagemBin = ?  WHERE p.codProduto = ?', 						
						   [produto.nomeProduto,produto.descricao,produto.marca,produto.preco, produto.categoria, produto.nomeImagem,produto.imagemBin, produto.codProduto],callback);
}

produtoModel.prototype.deletaProduto = function(produto, callback){
	this._connection.query('UPDATE Produto SET ativo = ? WHERE codProduto = ?',[produto.ativo,produto.codProduto],callback);
}

module.exports = function(){
      return produtoModel;
};