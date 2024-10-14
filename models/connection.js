const pg = require("pg");           // Importa o módulo pg para conectar ao PostgreSQL
require("dotenv").config();          // Carrega as variáveis de ambiente do arquivo .env

const connectionString = process.env.DATABASE_URL;  // Obtém a URL de conexão ao banco de dados do arquivo .env

// Cria uma pool de conexões para o banco de dados
const connection = new pg.Pool({
	connectionString: connectionString, // Usa a URL de conexão fornecida no .env
});

// Exporta a conexão para que possa ser usada em outros arquivos do projeto
module.exports = connection;
