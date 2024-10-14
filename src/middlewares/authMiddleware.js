const jwt = require("jsonwebtoken"); // Importa a biblioteca JWT para manipulação de tokens
const authModel = require("../../models/authModel"); // Importa o modelo de autenticação
const bcrypt = require("bcrypt"); // Importa a biblioteca bcrypt para hashing de senhas

// Função para lidar com respostas não autorizadas
const handleUnauthorizedRequest = (response, message) => {
	return response.status(401).json({ error: message });
};

// Função para lidar com requisições inválidas
const handleBadRequest = (response, message) => {
	return response.status(400).json({ error: message });
};

// Middleware para validar o corpo da requisição durante o login
const validateLoginBody = async (request, response, next) => {
	const { email, senha } = request.body; // Extrai email e senha do corpo da requisição

	// Verifica se o email e a senha foram fornecidos
	if (!email || !senha) {
		return handleBadRequest(response, "Email e senha são obrigatórios."); // Retorna erro se faltarem campos
	}

	// Validação do tamanho do email e senha
	if (email.length > 254) {
		return handleBadRequest(response, "Email excede o limite de 254 caracteres."); // Retorna erro se o email for muito longo
	}

	if (senha.length > 254) {
		return handleBadRequest(response, "Senha excede o limite de 254 caracteres."); // Retorna erro se a senha for muito longa
	}

	// Validação do formato do email
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|com\.br)$/;
	if (!emailRegex.test(email)) {
		return handleBadRequest(response, "Formato de email inválido."); // Retorna erro se o email não corresponder ao padrão
	}

	next(); // Prossegue para o próximo middleware se as validações passarem
};

// Middleware para validar credenciais de login
const validateLogin = async (request, response, next) => {
	const { email, senha } = request.body; // Extrai email e senha do corpo da requisição
	try {
		// Autentica o usuário
		const user = await authModel.authenticate(email);

		// Se o usuário não for encontrado
		if (!user) {
			return handleBadRequest(response, "Credenciais inválidas."); // Retorna erro se o usuário não existir
		}

		// Compara a senha fornecida com a armazenada
		const isPasswordValid = await bcrypt.compare(senha, user.senha);

		// Se a senha não for válida
		if (!isPasswordValid) {
			return handleBadRequest(response, "Credenciais inválidas."); // Retorna erro se a senha não corresponder
		}

		next(); // Prossegue se a autenticação for bem-sucedida
	} catch (error) {
		return handleBadRequest(response, `Erro na autenticação: ${error.message}`); // Retorna erro em caso de falha na autenticação
	}
};

// Middleware para validar o token JWT
const validateToken = (request, response, next) => {
	const token = request.header("Authorization")?.split(" ")[1]; // Extrai o token do cabeçalho Authorization

	if (!token) {
		return handleUnauthorizedRequest(response, "Token de acesso não fornecido"); // Retorna erro se o token não for fornecido
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica e decodifica o token
		request.user = decoded; // Armazena os dados decodificados do token no objeto request
		next(); // Prossegue se o token for válido
	} catch (error) {
		return handleUnauthorizedRequest(response, "Token inválido ou expirado."); // Retorna erro se o token for inválido ou expirado
	}
};

// Middleware para verificar se o usuário é admin
const isAdmin = (request, response, next) => {
	const user = request.user; // Obtém o usuário do objeto request

	// Verifica se o usuário é admin
	if (!user || !user.admin) {
		return handleUnauthorizedRequest(response, "Acesso negado. Somente administradores podem acessar."); // Retorna erro se o usuário não for admin
	}

	next(); // Prossegue se o usuário for admin
};

// Exporta os middlewares para uso em outras partes da aplicação
module.exports = {
	validateLogin,
	validateLoginBody,
	validateToken,
	isAdmin,
};
