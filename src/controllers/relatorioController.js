const relatorioModel = require("../../models/relatorioModel"); // Importa o modelo de relatórios

// Função para obter o relatório baseado em um ID e um intervalo de datas
const getReport = async (request, response) => {
	try {
		const { id } = request.params; // Extrai o ID da pessoa do parâmetro da requisição
		const { data_inicio, data_fim } = request.query; // Extrai as datas de início e fim dos query params

		// Chama o modelo para obter o relatório com os dados fornecidos
		const report = await relatorioModel.getReport(id, data_inicio, data_fim);

		return response.status(200).json(report); // Retorna o relatório obtido com status 200
	} catch (error) {
		// Verifica se o erro é relacionado à ausência de pontos registrados
		if (error.message.includes("Não existem pontos registrados para o período selecionado")) {
			return response.status(400).json({ error: error.message }); // Retorna um erro 400 se não houver registros
		} else {
			// Captura outros erros e retorna uma mensagem de erro com detalhes
			return response.status(500).json({ error: "Erro ao obter dados do relatório.", details: error.message });
		}
	}
};

// Exporta a função para uso em outras partes da aplicação
module.exports = {
	getReport
};
