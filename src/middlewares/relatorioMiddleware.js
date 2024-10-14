// Função para enviar uma resposta de erro com status 400
const handleBadRequest = (response, message) => {
	return response.status(400).json({ error: "Não foi possível efetuar a requisição", details: message });
};

// Middleware para validar requisições
const validateRequest = async (request, response, next) => {
	try {
		// Extrai o ID e as datas da requisição
		const { id } = request.params;
		const { data_inicio, data_fim } = request.query;

		// Valida se o ID está presente e se é um número
		if (!id || isNaN(id)) {
			return handleBadRequest(response, "ID necessário para requisição e deve ser um número.");
		}

		// Valida se as datas de início e fim estão presentes
		if (!data_inicio) {
			return handleBadRequest(response, "Informe uma data de início válida.");
		}

		if (!data_fim) {
			return handleBadRequest(response, "Informe uma data de fim válida.");
		}

		// Valida o formato das datas usando expressões regulares
		const isValidDataInicio = /^\d{4}-\d{2}-\d{2}$/.test(data_inicio);
		const isValidDataFim = /^\d{4}-\d{2}-\d{2}$/.test(data_fim);

		// Verifica se a data de início é válida
		if (!isValidDataInicio || data_inicio.length !== 10) {
			return handleBadRequest(response, "Data de início inválida. Utilize o formato YYYY-MM-DD.");
		}

		// Verifica se a data de fim é válida
		if (!isValidDataFim || data_fim.length !== 10) {
			return handleBadRequest(response, "Data de fim inválida. Utilize o formato YYYY-MM-DD.");
		}

		// Validação para garantir que data_inicio é anterior a data_fim
		const inicio = new Date(data_inicio);
		const fim = new Date(data_fim);

		// Se a data de início não for anterior à data de fim, retorna erro
		if (inicio > fim) {
			return handleBadRequest(response, "A data de início deve ser anterior à data de fim.");
		}

		// Se todas as validações passarem, chama o próximo middleware
		next();
	} catch (error) {
		// Em caso de erro, retorna um status 500 com detalhes do erro
		return response.status(500).json({ error: "Erro ao verificar a requisição.", details: error.message });
	}
};

module.exports = {
	validateRequest
};
