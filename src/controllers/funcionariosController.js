const funcionariosModel = require("../../models/funcionariosModel");


const getAll = async (_request, response) => {
	try {
		const funcionarios = await funcionariosModel.getAll();
		return response.status(200).json(funcionarios);
	} catch (error) {
		return response.status(500).json({ error: "Erro ao obter todos os funcionários.", details: error.message });
	}
};

const getActives = async (_request, response) => {
	try {
		const funcionarios = await funcionariosModel.getActives();
		return response.status(200).json(funcionarios);
	} catch (error) {
		return response.status(500).json({ error: "Erro ao obter funcionários ativos.", details: error.message });
	}
};

const createEmployee = async (request, response) => {
	try {
		const createdEmployee = await funcionariosModel.createEmployee(request.body);
		return response.status(200).json(createdEmployee);
	} catch (error) {
		return response.status(500).json({ error: "Erro ao criar um novo funcionário.", details: error.message });
	}
};

const deleteEmployee = async (request, response) => {
	try {
		const { id } = request.params;
		await funcionariosModel.deleteEmployee(id);
		return response.status(200).json({ message: "Funcionário excluído com sucesso." });
	} catch (error) {
		return response.status(500).json({ error: "Erro ao deletar funcionário.", details: error.message });
	}
};

const updateEmployee = async (request, response) => {
	try {
		const { id } = request.params;
		const updatedData = request.body;

		const updatedEmployee = await funcionariosModel.updateEmployee(id, updatedData);

		return response.status(200).json(updatedEmployee);
	} catch (error) {
		return response.status(500).json({ error: "Erro ao atualizar funcionário.", details: error.message });
	}
};

const getActivesById = async (request, response) => {
	try {
		const { id } = request.params;
		const employee = await funcionariosModel.getActivesById(id);
		return response.status(200).json(employee);
	} catch (error) {
		return response.status(500).json({ error: "Erro ao obter funcionário.", details: error.message });
	}
};

module.exports = {
	getAll,
	getActives,
	createEmployee,
	deleteEmployee,
	updateEmployee,
	getActivesById
};
