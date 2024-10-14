const connection = require("../../models/connection"); // Importa o modelo de conexão ao banco de dados

// Função para lidar com requisições inválidas
const handleBadRequest = (response, message) => {
	return response.status(400).json({ error: message });
};

// Verifica se o email já está em uso e se o usuário está ativo
const checkDuplicateByEmail = async (email) => {
	const query = `
					SELECT func.ativo
					FROM funcionarios func
					JOIN pessoas pes ON func.pessoa_id = pes.id
					WHERE func.email = $1;
			`;
	const result = await connection.query(query, [email]);

	if (result.rows.length > 0) {
		const isActive = result.rows[0].ativo;
		return isActive; // Retorna true se o email estiver ativo
	}
	return false; // Retorna false se o email não estiver em uso
};

// Middleware para verificar se o email já está cadastrado
const checkDuplicateEmail = async (request, response, next) => {
	try {
		const { email } = request.body; // Extrai o email do corpo da requisição
		const isActive = await checkDuplicateByEmail(email); // Verifica se o email já está em uso

		if (isActive) {
			return handleBadRequest(response, "Email já utilizado. Não é possível efetuar registros duplicados.");
		}

		next(); // Prossegue se o email não estiver em uso
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar a duplicidade de email.", details: error.message });
	}
};

// Middleware para verificar se o CPF já está cadastrado
const checkDuplicateCPF = async (request, response, next) => {
	try {
		const { cpf } = request.body; // Extrai o CPF do corpo da requisição
		let isActive;
		const query = `SELECT func.ativo
					FROM funcionarios func
					JOIN pessoas pes ON func.pessoa_id = pes.id
					WHERE pes.cpf = $1;`;
		const result = await connection.query(query, [cpf]); // Verifica se o CPF já está em uso
		if (result.rows.length > 0) {
			isActive = result.rows[0].ativo; // Obtém o status do CPF
		}

		if (isActive) {
			return handleBadRequest(response, "CPF já cadastrado. Não é possível efetuar registros duplicados.");
		}

		next(); // Prossegue se o CPF não estiver em uso
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar a duplicidade de CPF.", details: error.message });
	}
};

// Middleware para validar o corpo da requisição ao criar um funcionário
const validateBody = async (request, response, next) => {
	const { body } = request;
	const { cpf, email, nome, telefone, funcao } = body;

	// Verifica se há valores vazios ou não definidos no corpo da requisição
	const hasEmptyValues = Object.values(body).some(value => value === undefined || value === "");
	const isValidCPF = /^\d{11}$/.test(cpf); // Verifica se o CPF tem 11 dígitos
	const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Verifica se o email é válido

	// Validações de campos vazios
	if (hasEmptyValues) {
		return handleBadRequest(response, "O corpo da requisição contém valores vazios ou não definidos.");
	}

	// Validações de CPF e Email
	if (!isValidCPF) {
		return handleBadRequest(response, "CPF inválido. Deve conter somente números e ter 11 dígitos.");
	}

	if (!isValidEmail) {
		return handleBadRequest(response, "Email inválido.");
	}

	// Validações de comprimento dos campos
	if (email.length > 254) {
		return handleBadRequest(response, "Email excede o limite de 254 caracteres.");
	}

	if (telefone && telefone.length > 15) {
		return handleBadRequest(response, "Telefone excede o limite de 15 caracteres.");
	}

	if (funcao && funcao.length > 50) {
		return handleBadRequest(response, "Função excede o limite de 50 caracteres.");
	}

	if (nome && nome.length > 100) {
		return handleBadRequest(response, "Nome excede o limite de 100 caracteres.");
	}

	next(); // Prossegue se todas as validações passarem
};

// Middleware para validar o corpo da requisição ao atualizar um funcionário
const validateBodyUpdate = async (request, response, next) => {
	const { body } = request;
	const { cpf, email, nome, telefone, funcao } = body;

	const isValidCPF = /^\d{11}$/.test(cpf); // Verifica se o CPF é válido

	if (cpf && !isValidCPF) {
		return handleBadRequest(response, "CPF inválido. Deve conter somente números e ter 11 dígitos.");
	}

	const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Verifica se o email é válido

	if (email && !isValidEmail) {
		return handleBadRequest(response, "Email inválido.");
	}

	// Validações de comprimento dos campos
	if (email && email.length > 254) {
		return handleBadRequest(response, "Email excede o limite de 254 caracteres.");
	}

	if (telefone && telefone.length > 15) {
		return handleBadRequest(response, "Telefone excede o limite de 15 caracteres.");
	}

	if (funcao && funcao.length > 50) {
		return handleBadRequest(response, "Função excede o limite de 50 caracteres.");
	}

	if (nome && nome.length > 100) {
		return handleBadRequest(response, "Nome excede o limite de 100 caracteres.");
	}

	next(); // Prossegue se todas as validações passarem
};

// Middleware para verificar se o ID do funcionário existe no banco de dados
const checkId = async (request, response, next) => {
	try {
		const { id } = request.params; // Obtém o ID da requisição
		const query = `SELECT * 
						FROM funcionarios 
						WHERE pessoa_id = $1`;
		const result = await connection.query(query, [id]); // Verifica se o ID existe

		if (result.rows.length > 0) {
			next(); // Prossegue se o ID existir
		} else {
			return handleBadRequest(response, "ID não encontrado. O ID informado não existe.");
		}
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar a existência do ID.", details: error.message });
	}
};

// Exporta os middlewares para uso em outras partes da aplicação
module.exports = {
	validateBody,
	validateBodyUpdate,
	checkDuplicateEmail,
	checkDuplicateCPF,
	checkId
};
