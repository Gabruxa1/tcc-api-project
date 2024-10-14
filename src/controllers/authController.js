const authModel = require("../../models/authModel"); // Importa o modelo de autenticação

// Função que gera um token de autenticação para o usuário
const tokenGenerate = async (request, response) => {
	try {
		// Extrai email e senha do corpo da requisição
		const { email, senha } = request.body;

		// Autentica o usuário usando o modelo de autenticação
		const user = await authModel.authenticate(email, senha);

		// Se o usuário não for encontrado ou as credenciais forem inválidas
		if (!user) {
			return response.status(401).json({ error: "Credenciais inválidas" }); // Retorna erro 401 para credenciais inválidas
		}

		// Verifica se o usuário está desativado (ativo: false)
		if (!user.ativo) {
			return response.status(403).json({ error: "Erro ao obter token: usuário desativado." }); // Retorna erro 403 se o usuário estiver desativado
		}

		// Gera o token de autenticação para o usuário autenticado
		const token = authModel.generateAuthToken(user);

		// Retorna o token no formato JSON com status 200 (OK)
		return response.status(200).json({ token });
	} catch (error) {
		// Erro inesperado no servidor, captura e retorna um erro genérico
		return response.status(500).json({ error: "Erro ao gerar token" });
	}
};

module.exports = {
	tokenGenerate // Exporta a função tokenGenerate para uso em outras partes da aplicação
};
