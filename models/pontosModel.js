const connection = require('./connection');

const getAll = async () => {
	const query = `SELECT p.nome AS pessoa, f.funcao, rp.data, rp.entrada, rp.saida 
					FROM pessoas p 
					JOIN funcionarios f ON p.id = f.pessoa_id 
					JOIN registros_pontos rp ON p.id = rp.pessoa_id 
					ORDER BY p.nome, rp.data;`
	const pontos = await connection.query(query);
	const pontosAgrupados = {};
	pontos.rows.forEach((ponto) => {
		if (!pontosAgrupados[ponto.pessoa]) {
			pontosAgrupados[ponto.pessoa] = { funcao: ponto.funcao, pontos: [] };
		}

		const pontoFormatado = {
			data: ponto.data,
			entrada: ponto.entrada,
			saida: ponto.saida
		};

		pontosAgrupados[ponto.pessoa].pontos.push(pontoFormatado);
	});
	const respostaFormatada = {};
	for (const pessoa in pontosAgrupados) {
		respostaFormatada[pessoa] = {
			funcao: pontosAgrupados[pessoa].funcao,
			pontos: pontosAgrupados[pessoa].pontos
		};
	}

	return respostaFormatada;
};

const getRegisterById = async (id) => {
	const query = `SELECT p.nome AS pessoa, f.funcao, rp.data, rp.entrada, rp.saida 
					FROM pessoas p 
					JOIN funcionarios f ON p.id = f.pessoa_id 
					JOIN registros_pontos rp ON p.id = rp.pessoa_id 
					WHERE p.id = $1 ORDER BY rp.data`
	const pontos = await connection.query(query, [id]);

	const pontosAgrupados = {};
	pontos.rows.forEach((ponto) => {
		if (!pontosAgrupados[ponto.pessoa]) {
			pontosAgrupados[ponto.pessoa] = { funcao: ponto.funcao, pontos: [] };
		}

		const pontoFormatado = {
			data: ponto.data,
			entrada: ponto.entrada,
			saida: ponto.saida
		};

		pontosAgrupados[ponto.pessoa].pontos.push(pontoFormatado);
	});

	const respostaFormatada = {};
	for (const pessoa in pontosAgrupados) {
		respostaFormatada[pessoa] = {
			funcao: pontosAgrupados[pessoa].funcao,
			pontos: pontosAgrupados[pessoa].pontos
		};
	}

	return respostaFormatada;
};

const createRegister = async (id, { data, entrada = null, saida = null }) => {
	try {
		const entradaValue = entrada === '' ? null : entrada;
		const saidaValue = saida === '' ? null : saida;
		const query = `INSERT INTO registros_pontos (pessoa_id, data, entrada, saida) 
						VALUES ($1, $2, $3, $4) 
						RETURNING *`;

		const createdPoint = await connection.query(query, [id, data, entradaValue, saidaValue]);

		return { ...createdPoint.rows[0] };
	} catch (error) {
		throw error;
	}
};


const updatePoint = async (id, point) => {
	const {
		data,
		entrada,
		saida
	} = point;

	let updateQuery = `UPDATE registros_pontos SET`;
	const values = [];
	let index = 1;

	if (entrada) {
		updateQuery += ` entrada = $${index},`;
		values.push(entrada);
		index++;
	}

	if (saida) {
		updateQuery += ` saida = $${index},`;
		values.push(saida);
		index++;
	}

	updateQuery = updateQuery.slice(0, -1);

	updateQuery += ` WHERE pessoa_id = $${index} AND data = $${index + 1} RETURNING *`;
	values.push(id, data);

	const updatedPoint = await connection.query(updateQuery, values);
	return { ...updatedPoint.rows[0] };
};

const deletePoint = async (id, data) => {
	const deleteQuery = `DELETE FROM registros_pontos
					WHERE pessoa_id = $1
					AND data = $2 RETURNING *`;
	const deletedPoint = await connection.query(deleteQuery, [id, data]);
	return { ...deletedPoint.rows[0] };

}

module.exports = {
	getAll,
	getRegisterById,
	createRegister,
	updatePoint,
	deletePoint
};
