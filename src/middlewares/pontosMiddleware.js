const connection = require('../../models/connection');

const handleBadRequest = (response, message) => {
	return response.status(400).json({ error: message });
};


const checkPointRecordByIdAndDate = async (request, response, next) => {
	try {
		const { id } = request.params;
		const { data } = request.body;
		const query = `SELECT * 
						FROM registros_pontos 
						WHERE pessoa_id = $1 
						AND data = $2`;
		const result = await connection.query(query, [id, data]);
		const pointRecord = result.rows[0];

		if (pointRecord && pointRecord.entrada && pointRecord.saida) {
			return handleBadRequest(response, 'Registros de entrada e saída já efetuados. Para alteração, favor contatar o administrador.');
		}

		next();

	} catch (error) {
		return response.status(500).json({ error: 'Erro ao verificar usuario e data.', details: error.message });
	}
};

const validateBody = (request, response, next) => {
	try {
		const {
			data,
			entrada,
			saida
		} = request.body;

		const isValidEntrada = /^(0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(entrada);
		const isValidSaida = /^(0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(saida);
		const isValidData = /^\d{4}-\d{2}-\d{2}$/.test(data);

		if (!data) {
			return handleBadRequest(response, ' Informe uma data para registro de pontos.');
		}

		if (entrada && !isValidEntrada) {
			return handleBadRequest(response, 'Formato inválido para a entrada. Utilize HH:MM:SS.');
		}

		if (saida != "" && !isValidSaida) {
			return handleBadRequest(response, 'Formato inválido para a saída. Utilize HH:MM:SS.');
		}

		if (data && !isValidData) {
			return handleBadRequest(response, 'Formato inválido para a data. Utilize YYYY/MM/DD.');
		}

		next();
	} catch (error) {
		return response.status(500).json({ error: 'Erro ao verificar a requisição.', details: error.message });
	}
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
			return handleBadRequest(response, 'ID não encontrado. O ID informado não existe.');
		}
	} catch (error) {
		return response.status(500).json({ error: 'Erro ao verificar a existência do ID.', details: error.message });
	}
};

const checkDate = async (request, response, next) => {
	try {
		const { data } = request.params
		const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(data);

		if (!isValidDate) {
			return handleBadRequest(response, 'Formato inválido para a data. Utilize YYYY/MM/DD.');
		}
		const query = `SELECT * 
						FROM registros_pontos 
						WHERE data = $1`;
		const result = await connection.query(query, [data]);
		if (result.rows.length > 0) {
			next();
		} else {
			return handleBadRequest(response, 'Data não encontrada. a Data informada não existe.');
		}
	} catch (error) {
		return response.status(500).json({ error: 'Erro ao verificar formato e existência da data.', details: error.message });
	}
}

const validatePointCreate = async (request, response, next) => {
	try {
		const { id } = request.params;
		const { data, entrada, saida } = request.body;

		const query = `SELECT * 
						FROM registros_pontos 
						WHERE pessoa_id = $1 
						AND data = $2`;
		const result = await connection.query(query, [id, data]);
		const existingRecord = result.rows[0];

		if (!existingRecord) {
			next();
		}
		if (existingRecord) {
			if (entrada === existingRecord.entrada) {
				if (existingRecord.saida) {
					return handleBadRequest(response, 'Registros de entrada e saída já efetuados. Contate o administrador.');
				} else if (existingRecord.saida === null && saida) {
					const query = `UPDATE registros_pontos 
								SET saida = $1 
								WHERE pessoa_id = $2 
								AND data = $3 
								RETURNING *`;
					const updatedPoint = await connection.query(query, [saida, id, data]);
					return response.status(200).json({ ...updatedPoint.rows[0] });


				} else {

					return handleBadRequest(response, 'Registro já iniciado, saída deve ser informada para efetuar o registro de saída.');
				}
			} else {

				return handleBadRequest(response, 'Hora de entrada diverge da original.');
			}
		}
	} catch (error) {
		return response.status(500).json({ error: 'Erro ao validar registro de pontos.', details: error.message });
	}
};

module.exports = {
	checkPointRecordByIdAndDate,
	validateBody,
	checkId,
	validatePointCreate,
	checkDate
};
