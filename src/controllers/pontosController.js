const pontosModel = require("../../models/pontosModel");

const getAll = async (_request, response) => {
	try {
		const pontos = await pontosModel.getAll();
		return response.status(200).json(pontos);
	} catch (error) {
		return response.status(500).json({ error: "Erro ao obter todos os registros de pontos.", details: error.message });
	}
};

const getRegisterById = async (request, response) => {
	try {
		const { id } = request.params;
		const { data } = request.query;
		const pontos = await pontosModel.getRegisterById(id, data);
		return response.status(200).json(pontos);
	} catch (error) {
		return response.status(500).json({ error: "Erro ao obter registros de pontos.", details: error.message });
	}
};

const createRegister = async (request, response) => {
	try {
		const { id } = request.params;
		const { data, entrada, saida } = request.body;

		const result = await pontosModel.createRegister(id, { data, entrada, saida });

		return response.status(200).json(result);
	} catch (error) {
		return response.status(500).json({ error: "Erro ao criar registro de ponto.", details: error.message });
	}
};

const updateRegister = async (request, response) => {
	try {
		const { id } = request.params;
		const { data, entrada, saida } = request.body;

		const pointToUpdate = {};
		if (data) pointToUpdate.data = data;
		if (entrada) pointToUpdate.entrada = entrada;
		if (saida) pointToUpdate.saida = saida;

		const result = await pontosModel.updatePoint(id, pointToUpdate);

		return response.status(200).json(result);
	} catch (error) {
		return response.status(500).json({ error: "Erro ao atualizar registro de ponto.", details: error.message });
	}
};

const deletePoint = async (request, response) => {
	try {
		const { id, data } = request.params;
		await pontosModel.deletePoint(id, data);
		return response.status(200).json({ message: "Ponto excluído com sucesso." });
	} catch (error) {
		return response.status(500).json({ error: "Erro ao deletar Ponto." });
	}
};

module.exports = {
	getAll,
	getRegisterById,
	createRegister,
	updateRegister,
	deletePoint
};