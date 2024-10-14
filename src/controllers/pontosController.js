const pontosModel = require("../../models/pontosModel"); // Importa o modelo de registros de pontos

// Função para obter todos os registros de pontos
const getAll = async (_request, response) => {
	try {
		// Chama o modelo para obter todos os registros de pontos
		const pontos = await pontosModel.getAll();
		return response.status(200).json(pontos); // Retorna todos os pontos com status 200
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro com detalhes
		return response.status(500).json({ error: "Erro ao obter todos os registros de pontos.", details: error.message });
	}
};

// Função para obter um registro de ponto específico pelo ID e data
const getRegisterById = async (request, response) => {
	try {
		const { id } = request.params; // Extrai o ID do registro a ser buscado
		const { data } = request.query; // Extrai a data do query params
		const pontos = await pontosModel.getRegisterById(id, data); // Chama o modelo para obter o registro de ponto
		return response.status(200).json(pontos); // Retorna o registro de ponto com status 200
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro com detalhes
		return response.status(500).json({ error: "Erro ao obter registros de pontos.", details: error.message });
	}
};

// Função para criar um novo registro de ponto
const createRegister = async (request, response) => {
	try {
		const { id } = request.params; // Extrai o ID da pessoa para o registro
		const { data, entrada, saida } = request.body; // Obtém os dados do corpo da requisição

		// Chama o modelo para criar um novo registro de ponto
		const result = await pontosModel.createRegister(id, { data, entrada, saida });

		return response.status(200).json(result); // Retorna o registro criado com status 200
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro com detalhes
		return response.status(500).json({ error: "Erro ao criar registro de ponto.", details: error.message });
	}
};

// Função para atualizar um registro de ponto existente
const updateRegister = async (request, response) => {
	try {
		const { id } = request.params; // Extrai o ID do registro a ser atualizado
		const { data, entrada, saida } = request.body; // Obtém os novos dados do corpo da requisição

		const pointToUpdate = {}; // Objeto para armazenar os dados a serem atualizados
		if (data) pointToUpdate.data = data; // Adiciona a data se fornecida
		if (entrada) pointToUpdate.entrada = entrada; // Adiciona a entrada se fornecida
		if (saida) pointToUpdate.saida = saida; // Adiciona a saída se fornecida

		// Chama o modelo para atualizar o registro de ponto
		const result = await pontosModel.updatePoint(id, pointToUpdate);

		return response.status(200).json(result); // Retorna o registro atualizado com status 200
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro com detalhes
		return response.status(500).json({ error: "Erro ao obter funcionários ativos.", details: error.message });
	}

};

// Função para deletar um registro de ponto
const deletePoint = async (request, response) => {
	try {
		const { id, data } = request.params; // Extrai o ID e a data do registro a ser deletado
		await pontosModel.deletePoint(id, data); // Chama o modelo para deletar o registro
		return response.status(200).json({ message: "Ponto excluído com sucesso." }); // Retorna mensagem de sucesso
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro sem detalhes
		return response.status(500).json({ error: "Erro ao deletar Ponto." });
	}
};

// Exporta as funções para uso em outras partes da aplicação
module.exports = {
	getAll,
	getRegisterById,
	createRegister,
	updateRegister,
	deletePoint
};
