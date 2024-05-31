const relatorioModel = require("../../models/relatorioModel");

const getReport = async (request, response) => {
	try {
		const { id } = request.params;
		const { data_inicio, data_fim } = request.query;
		const report = await relatorioModel.getReport(id, data_inicio, data_fim);
		return response.status(200).json(report);
	} catch (error) {
		return response.status(500).json({ error: "Erro ao obter dados do relatório.", details: error.message });
	}
};

module.exports = {
	getReport
};