const connection = require("../../models/connection"); // Importa a conexão com o banco de dados

// Função para lidar com requisições inválidas
const handleBadRequest = (response, message) => {
	return response.status(400).json({ error: message });
};

// Middleware para verificar se já existem registros de ponto para um ID e data específicos
const checkPointRecordByIdAndDate = async (request, response, next) => {
	try {
		const { id } = request.params; // Obtém o ID da requisição
		const { data } = request.body; // Obtém a data do corpo da requisição
		const query = `SELECT * 
						FROM registros_pontos 
						WHERE pessoa_id = $1 
						AND data = $2`;
		const result = await connection.query(query, [id, data]); // Faz a consulta no banco de dados
		const pointRecord = result.rows[0];

		// Verifica se já há registros de entrada e saída
		if (pointRecord && pointRecord.entrada && pointRecord.saida) {
			return handleBadRequest(response, "Registros de entrada e saída já efetuados. Para alteração, favor contatar o administrador.");
		}

		next(); // Prossegue se não houver registros conflitantes
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar usuario e data.", details: error.message });
	}
};

// Middleware para validar o corpo da requisição ao registrar pontos
const validateBody = (request, response, next) => {
	try {
		const { data, entrada, saida } = request.body;

		// Valida os formatos de entrada, saída e data
		const isValidEntrada = /^(0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(entrada);
		const isValidSaida = /^(0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(saida);
		const isValidData = /^\d{4}-\d{2}-\d{2}$/.test(data);

		if (!data) {
			return handleBadRequest(response, "Informe uma data para registro de pontos.");
		}

		if (entrada && !isValidEntrada) {
			return handleBadRequest(response, "Formato inválido para a entrada. Utilize HH:MM:SS.");
		}

		if (saida !== "" && !isValidSaida) {
			return handleBadRequest(response, "Formato inválido para a saída. Utilize HH:MM:SS.");
		}

		if (data && !isValidData) {
			return handleBadRequest(response, "Formato inválido para a data. Utilize YYYY-MM-DD.");
		}

		if (entrada && entrada.length > 8) {
			return handleBadRequest(response, "Entrada excede o limite de 8 caracteres.");
		}

		if (saida && saida.length > 8) {
			return handleBadRequest(response, "Saída excede o limite de 8 caracteres.");
		}

		if (data.length !== 10) {
			return handleBadRequest(response, "Data deve ter exatamente 10 caracteres.");
		}

		next(); // Prossegue se todas as validações passarem
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar a requisição.", details: error.message });
	}
};

// Middleware para verificar se o ID do funcionário existe
const checkId = async (request, response, next) => {
	try {
		const { id } = request.params; // Obtém o ID da requisição
		const query = `SELECT * 
						FROM funcionarios 
						WHERE pessoa_id = $1`;
		const result = await connection.query(query, [id]); // Faz a consulta no banco de dados

		if (result.rows.length > 0) {
			next(); // Prossegue se o ID existir
		} else {
			return handleBadRequest(response, "ID não encontrado. O ID informado não existe.");
		}
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar a existência do ID.", details: error.message });
	}
};

// Middleware para verificar se a data é válida e existe no banco de dados
const checkDate = async (request, response, next) => {
	try {
		const { data } = request.params; // Obtém a data da requisição
		const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(data); // Valida o formato da data

		if (!isValidDate) {
			return handleBadRequest(response, "Formato inválido para a data. Utilize YYYY-MM-DD.");
		}

		const query = `SELECT * 
						FROM registros_pontos 
						WHERE data = $1`;
		const result = await connection.query(query, [data]); // Verifica se a data existe no banco
		if (result.rows.length > 0) {
			next(); // Prossegue se a data existir
		} else {
			return handleBadRequest(response, "Data não encontrada. A data informada não existe.");
		}
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar formato e existência da data.", details: error.message });
	}
};

// Middleware para validar a criação de registros de ponto
const validatePointCreate = async (request, response, next) => {
	try {
		const { id } = request.params; // Obtém o ID da requisição
		const { data, entrada, saida } = request.body; // Obtém os dados do corpo da requisição

		const query = `SELECT * 
						FROM registros_pontos 
						WHERE pessoa_id = $1 
						AND data = $2`;
		const result = await connection.query(query, [id, data]); // Verifica se já existe um registro para o ID e data
		const existingRecord = result.rows[0];

		if (!existingRecord) {
			next(); // Prossegue se não houver registro existente
		}
		if (existingRecord) {
			if (entrada === existingRecord.entrada) {
				if (existingRecord.saida) {
					return handleBadRequest(response, "Registros de entrada e saída já efetuados. Contate o administrador.");
				} else if (existingRecord.saida === null && saida) {
					const query = `UPDATE registros_pontos 
								SET saida = $1 
								WHERE pessoa_id = $2 
								AND data = $3 
								RETURNING *`;
					const updatedPoint = await connection.query(query, [saida, id, data]); // Atualiza o registro de saída
					return response.status(200).json({ ...updatedPoint.rows[0] });
				} else {
					return handleBadRequest(response, "Registro já iniciado, saída deve ser informada para efetuar o registro de saída.");
				}
			} else {
				return handleBadRequest(response, "Hora de entrada diverge da original.");
			}
		}
	} catch (error) {
		return response.status(500).json({ error: "Erro ao validar registro de pontos.", details: error.message });
	}
};

// Exporta os middlewares para uso em outras partes da aplicação
module.exports = {
	checkPointRecordByIdAndDate,
	validateBody,
	checkId,
	validatePointCreate,
	checkDate
};
