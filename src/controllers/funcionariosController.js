const funcionariosModel = require("../../models/funcionariosModel"); // Importa o modelo de funcionários

// Função para obter todos os funcionários
const getAll = async (_request, response) => {
	try {
		// Chama o modelo para obter todos os funcionários
		const funcionarios = await funcionariosModel.getAll();
		return response.status(200).json(funcionarios); // Retorna a lista de funcionários com status 200
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro com detalhes
		return response.status(500).json({ error: "Erro ao obter todos os funcionários.", details: error.message });
	}
};

// Função para obter apenas os funcionários ativos
const getActives = async (_request, response) => {
	try {
		// Chama o modelo para obter os funcionários ativos
		const funcionarios = await funcionariosModel.getActives();
		return response.status(200).json(funcionarios); // Retorna a lista de funcionários ativos com status 200
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro com detalhes
		return response.status(500).json({ error: "Erro ao obter funcionários ativos.", details: error.message });
	}
};

// Função para criar um novo funcionário
const createEmployee = async (request, response) => {
	try {
		// Chama o modelo para criar um novo funcionário com os dados do corpo da requisição
		const createdEmployee = await funcionariosModel.createEmployee(request.body);
		return response.status(200).json(createdEmployee); // Retorna o funcionário criado com status 200
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro com detalhes
		return response.status(500).json({ error: "Erro ao criar um novo funcionário.", details: error.message });
	}
};

// Função para deletar um funcionário pelo ID
const deleteEmployee = async (request, response) => {
	try {
		const { id } = request.params; // Extrai o ID do funcionário a ser deletado
		await funcionariosModel.deleteEmployee(id); // Chama o modelo para deletar o funcionário
		return response.status(200).json({ message: "Funcionário excluído com sucesso." }); // Retorna mensagem de sucesso
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro com detalhes
		return response.status(500).json({ error: "Erro ao deletar funcionário.", details: error.message });
	}
};

// Função para atualizar os dados de um funcionário
const updateEmployee = async (request, response) => {
	try {
		const { id } = request.params; // Extrai o ID do funcionário a ser atualizado
		const updatedData = request.body; // Obtém os novos dados do corpo da requisição

		// Chama o modelo para atualizar o funcionário
		const updatedEmployee = await funcionariosModel.updateEmployee(id, updatedData);

		return response.status(200).json(updatedEmployee); // Retorna os dados do funcionário atualizado com status 200
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro com detalhes
		return response.status(500).json({ error: "Erro ao atualizar funcionário.", details: error.message });
	}
};

// Função para obter um funcionário ativo pelo ID
const getActivesById = async (request, response) => {
	try {
		const { id } = request.params; // Extrai o ID do funcionário a ser buscado
		const employee = await funcionariosModel.getActivesById(id); // Chama o modelo para obter o funcionário ativo
		return response.status(200).json(employee); // Retorna os dados do funcionário com status 200
	} catch (error) {
		// Captura erros e retorna uma mensagem de erro com detalhes
		return response.status(500).json({ error: "Erro ao obter funcionário.", details: error.message });
	}
};

// Exporta as funções para uso em outras partes da aplicação
module.exports = {
	getAll,
	getActives,
	createEmployee,
	deleteEmployee,
	updateEmployee,
	getActivesById
};
