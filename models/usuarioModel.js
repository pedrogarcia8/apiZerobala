function usuarioModel(connection){
	this._connection = connection;
}

usuarioModel.prototype.insere = function(usuario, callback){
	this._connection.query('INSERT INTO Usuario SET ?',usuario, callback);	
}

usuarioModel.prototype.atualizaNome = function(usuario, callback){
	this._connection.query('UPDATE Usuario SET nome = ? WHERE cpf = ?',[usuario.nome, usuario.cpf], callback);	
}

usuarioModel.prototype.lista = function(callback){
	this._connection.query('SELECT * FROM Usuario',callback);
}

usuarioModel.prototype.buscaPorCpf = function(cpf, callback){
	this._connection.query('SELECT * FROM Usuario WHERE cpf = ?',[cpf],callback);
}

usuarioModel.prototype.buscaPorEmail = function(email, callback){
	this._connection.query('SELECT * FROM Usuario WHERE email = ?',[email],callback);
}


module.exports = function(){
      return usuarioModel;
};