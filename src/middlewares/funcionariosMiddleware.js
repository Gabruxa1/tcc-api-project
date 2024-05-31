const connection = require("../../models/connection");

const handleBadRequest = (response, message) => {
	return response.status(400).json({ error: message });
};

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
		return isActive;
	}
	return false;

};

const checkDuplicateEmail = async (request, response, next) => {
	try {
		const { email } = request.body;
		const isActive = await checkDuplicateByEmail(email);

		if (isActive) {
			return handleBadRequest(response, "Email já utilizado. Não é possível efetuar registros duplicados.");
		}

		next();
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar a duplicidade de email.", details: error.message });
	}
};

const checkDuplicateCPF = async (request, response, next) => {
	try {
		const { cpf } = request.body;
		let isActive;
		const query = `SELECT func.ativo
					FROM funcionarios func
					JOIN pessoas pes ON func.pessoa_id = pes.id
					WHERE pes.cpf = $1;`;
		const result = await connection.query(query, [cpf]);
		if (result.rows.length > 0) {
			isActive = result.rows[0].ativo;
		}

		if (isActive) {
			return handleBadRequest(response, "CPF já cadastrado. Não é possível efetuar registros duplicados.");
		}

		next();
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar a duplicidade de CPF.", details: error.message });
	}
};

const validateBody = async (request, response, next) => {
	const { body } = request;
	const { cpf, email } = body;

	const hasEmptyValues = Object.values(body).some(value => value === undefined || value === "");
	const isValidCPF = /^\d{11}$/.test(cpf);

	if (hasEmptyValues) {
		return handleBadRequest(response, "O corpo da requisição contém valores vazios ou não definidos.");
	}

	if (!isValidCPF) {
		return handleBadRequest(response, "CPF inválido. Deve conter somente números e ter 11 dígitos.");
	}

	const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	if (!isValidEmail) {
		return handleBadRequest(response, "Email inválido.");
	}

	next();
};

const validateBodyUpdate = async (request, response, next) => {
	const { body } = request;
	const { cpf, email } = body;

	const isValidCPF = /^\d{11}$/.test(cpf);


	if (cpf && !isValidCPF) {
		return handleBadRequest(response, "CPF inválido. Deve conter somente números e ter 11 dígitos.");
	}

	const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	if (email && !isValidEmail) {
		return handleBadRequest(response, "Email inválido.");
	}

	next();
};

const checkId = async (request, response, next) => {
	try {
		const { id } = request.params;
		const query = `SELECT * 
						FROM funcionarios 
						WHERE pessoa_id = $1`;
		const result = await connection.query(query, [id]);

		if (result.rows.length > 0) {
			next();

		} else {
			return handleBadRequest(response, "ID não encontrado. O ID informado não existe.");
		}
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar a existência do ID.", details: error.message });
	}
};

module.exports = {
	validateBody,
	validateBodyUpdate,
	checkDuplicateEmail,
	checkDuplicateCPF,
	checkId
};
