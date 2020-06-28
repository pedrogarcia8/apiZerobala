function pessoaModel(connection){
	this._connection = connection;
}

pessoaModel.prototype.insere = function(pessoa, callback){
	this._connection.query('INSERT INTO pessoa SET ?',pessoa, callback);	
}

pessoaModel.prototype.atualizaNome = function(pessoa, callback){
	this._connection.query('UPDATE pessoa SET nome = ? WHERE cpf = ?',[pessoa.nome, pessoa.cpf], callback);	
}

pessoaModel.prototype.lista = function(callback){
	this._connection.query('SELECT * FROM pessoa',callback);
}

pessoaModel.prototype.buscaPorCpf = function(cpf, callback){
	this._connection.query('SELECT * FROM pessoa WHERE cpf = ?',[cpf],callback);
}

pessoaModel.prototype.buscaPorEmail = function(email, callback){
	this._connection.query('SELECT * FROM pessoa WHERE email = ?',[email],callback);
}


pessoaModel.prototype.deleta = function(cpf, callback){
	this._connection.query('DELETE FROM pessoa WHERE cpf = ?',[cpf],callback);
}

module.exports = function(){
      return pessoaModel;
};