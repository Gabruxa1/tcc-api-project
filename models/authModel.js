const jwt = require("jsonwebtoken");
const funcionariosModel = require("./funcionariosModel");

// Função de autenticação
const authenticate = async (email) => {
	// Busca o usuário no banco de dados pelo email fornecido
	const user = await funcionariosModel.getUserByEmail(email);

	// Verifica se o usuário foi encontrado
	if (!user) {
		return null; // Retorna null se o usuário não for encontrado
	}

	if (user) {
		// Retorna os dados essenciais do usuário, como ID, email, senha, status de administrador e ativo/inativo
		return {
			id: user.id,
			email: user.email,
			senha: user.senha,
			admin: user.admin,
			ativo: user.ativo
		};
	}
};

// Função para gerar o token JWT com um tempo de expiração configurado no arquivo .env
const generateAuthToken = (user) => {
	// Cria o token JWT usando o método sign, que inclui dados relevantes do usuário
	const token = jwt.sign(
		{
			id: user.id,        // ID do usuário
			email: user.email,  // Email do usuário
			admin: user.admin,  // Status de administrador (true/false)
		},
		process.env.JWT_SECRET, // Chave secreta usada para criptografar o token
		{ expiresIn: process.env.JWT_EXPIRES_IN || "1d" } // Tempo de expiração, podendo ser configurado via .env
	);

	// Retorna o token gerado
	return token;
};

module.exports = {
	authenticate,       // Exporta a função de autenticação
	generateAuthToken   // Exporta a função de geração de token
};
