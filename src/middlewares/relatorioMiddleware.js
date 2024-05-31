
const handleBadRequest = (response, message) => {
	return response.status(400).json({ error: message });
};

const validateRequest = async (request, response, next) => {
	try {
		const { id } = request.params;
		const { data_inicio, data_fim } = request.query;

		if (!id) {
			return handleBadRequest(response, "id necessário para requisição");
		}

		if (!data_inicio) {
			return handleBadRequest(response, "Informe uma data de ínicio válida.");
		}

		if (!data_fim) {
			return handleBadRequest(response, "Informe uma data fim válida.");
		}
		next();
	} catch (error) {
		return response.status(500).json({ error: "Erro ao verificar a requisição.", details: error.message });
	}
};

module.exports = {
	validateRequest
};