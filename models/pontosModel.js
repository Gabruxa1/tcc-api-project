const connection = require("./connection"); // Importa a conexão com o banco de dados

// Função para obter todos os registros de ponto agrupados por pessoa e função
const getAll = async () => {
	const query = `
		SELECT p.nome AS pessoa, f.funcao, rp.data, rp.entrada, rp.saida
		FROM pessoas p
		JOIN funcionarios f ON p.id = f.pessoa_id
		JOIN registros_pontos rp ON p.id = rp.pessoa_id
		ORDER BY p.nome, rp.data;`; // Consulta para buscar registros de ponto e informações dos funcionários

	const pontos = await connection.query(query); // Executa a consulta
	const pontosAgrupados = {}; // Objeto para armazenar os dados agrupados por pessoa

	// Itera sobre os registros e agrupa por pessoa
	pontos.rows.forEach((ponto) => {
		if (!pontosAgrupados[ponto.pessoa]) {
			pontosAgrupados[ponto.pessoa] = { funcao: ponto.funcao, pontos: [] }; // Inicializa a pessoa no objeto
		}

		// Formata os dados do ponto e os adiciona ao array da pessoa
		const pontoFormatado = {
			data: ponto.data,
			entrada: ponto.entrada,
			saida: ponto.saida
		};
		pontosAgrupados[ponto.pessoa].pontos.push(pontoFormatado);
	});

	// Formata a resposta para retornar as informações agrupadas de forma estruturada
	const respostaFormatada = {};
	for (const pessoa in pontosAgrupados) {
		respostaFormatada[pessoa] = {
			funcao: pontosAgrupados[pessoa].funcao,
			pontos: pontosAgrupados[pessoa].pontos
		};
	}

	return respostaFormatada; // Retorna os registros agrupados
};

// Função para obter um registro de ponto por ID (e opcionalmente por data)
const getRegisterById = async (id, data) => {
	let query = `
		SELECT p.nome AS pessoa, f.funcao, rp.data, rp.entrada, rp.saida
		FROM pessoas p
		JOIN funcionarios f ON p.id = f.pessoa_id
		JOIN registros_pontos rp ON p.id = rp.pessoa_id
		WHERE p.id = $1`; // Consulta básica para buscar registros por ID


	const queryParams = [id]; // Parametros da consulta

	if (data) {
		query += " AND rp.data = $2"; // Adiciona filtro de data se fornecido
		queryParams.push(data); // Adiciona a data nos parâmetros da consulta
	}

	query += " ORDER BY rp.data"; // Ordena por data

	const pontos = await connection.query(query, queryParams); // Executa a consulta

	const pontosAgrupados = {}; // Objeto para armazenar dados agrupados por pessoa
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

	return respostaFormatada; // Retorna os registros de pontos agrupados
};

// Função para criar um novo registro de ponto
const createRegister = async (id, { data, entrada = null, saida = null }) => {
	// Trata valores vazios para entrada e saída, convertendo-os para null
	const entradaValue = entrada === "" ? null : entrada;
	const saidaValue = saida === "" ? null : saida;

	// Query para inserir um novo registro de ponto
	const query = `INSERT INTO registros_pontos (pessoa_id, data, entrada, saida)
		VALUES ($1, $2, $3, $4) 
		RETURNING *`; // Retorna o registro inserido

	const createdPoint = await connection.query(query, [id, data, entradaValue, saidaValue]); // Executa a inserção

	return { ...createdPoint.rows[0] }; // Retorna o registro criado
};

// Função para atualizar um registro de ponto
const updatePoint = async (id, point) => {
	const { data, entrada, saida } = point;

	let updateQuery = "UPDATE registros_pontos SET"; // Query base para atualizar
	const values = [];
	let index = 1; // Índice para parâmetros da query

	// Adiciona os campos que serão atualizados
	if (entrada) {
		updateQuery += ` entrada = $${index},`; // Adiciona entrada se fornecida
		values.push(entrada);
		index++;
	}

	if (saida) {
		updateQuery += ` saida = $${index},`; // Adiciona saída se fornecida
		values.push(saida);
		index++;
	}

	updateQuery = updateQuery.slice(0, -1); // Remove a última vírgula extra

	// Adiciona a cláusula WHERE para identificar o registro a ser atualizado
	updateQuery += ` WHERE pessoa_id = $${index} AND data = $${index + 1} RETURNING *`;
	values.push(id, data); // Adiciona o ID e a data nos parâmetros

	const updatedPoint = await connection.query(updateQuery, values); // Executa a atualização

	if (updatedPoint.rows.length === 0) {
		throw new Error("Registro de ponto não encontrado para a data e ID fornecidos."); // Lança erro se não encontrou registro
	}

	return { ...updatedPoint.rows[0] }; // Retorna o registro atualizado
};

// Função para deletar um registro de ponto
const deletePoint = async (id, data) => {
	// Query para deletar um registro de ponto específico
	const deleteQuery = `DELETE FROM registros_pontos
		WHERE pessoa_id = $1
		AND data = $2 RETURNING *`; // Retorna o registro deletado

	const deletedPoint = await connection.query(deleteQuery, [id, data]); // Executa a exclusão
	return { ...deletedPoint.rows[0] }; // Retorna o registro deletado
};

module.exports = {
	getAll,          // Exporta a função para obter todos os registros de ponto
	getRegisterById, // Exporta a função para obter registros de ponto por ID
	createRegister,  // Exporta a função para criar um registro de ponto
	updatePoint,     // Exporta a função para atualizar um registro de ponto
	deletePoint      // Exporta a função para deletar um registro de ponto
};
