const connection = require("./connection");

// Função que gera um relatório de horas trabalhadas para um funcionário entre duas datas
const getReport = async (id, data_inicio, data_fim) => {
	// Consulta SQL para buscar os registros de ponto do funcionário, incluindo nome e custo por hora
	const query = `SELECT 
                    p.nome,
                    f.custo_hora,
                    rp.data,
                    rp.entrada,
                    rp.saida
                FROM 
                    registros_pontos rp
                JOIN 
                    pessoas p ON rp.pessoa_id = p.id
                JOIN 
                    funcionarios f ON p.id = f.pessoa_id
                WHERE 
                    rp.pessoa_id = $1
                AND 
                    rp.data BETWEEN $2 AND $3
				ORDER BY 
    				rp.data ASC;`;

	// Executa a consulta no banco de dados com os parâmetros fornecidos
	const report = await connection.query(query, [id, data_inicio, data_fim]);

	// Verifica se não há registros retornados e lança um erro, se necessário
	if (report.rows.length === 0) {
		throw new Error("Não existem pontos registrados para período selecionado.");
	}

	let totalHoras = 0; // Inicializa a variável para armazenar o total de horas trabalhadas
	// Mapeia os registros de ponto para calcular horas trabalhadas e formatar a resposta
	const pontos = report.rows.map(item => {
		// Cria objetos de data a partir das strings de entrada e saída
		const entrada = new Date(`1970-01-01T${item.entrada}`);
		const saida = new Date(`1970-01-01T${item.saida}`);

		// Verifica se a entrada é maior que a saída
		if (entrada > saida) {
			// Se entrada é maior que saída, consideramos que a entrada é no dia anterior
			entrada.setDate(entrada.getDate() - 1);
		}

		// Calcula as horas trabalhadas subtraindo a entrada da saída
		const horasTrabalhadas = (saida - entrada) / (1000 * 60 * 60); // Conversão de milissegundos para horas
		totalHoras += horasTrabalhadas; // Acumula as horas trabalhadas

		// Retorna um objeto com os dados formatados para o ponto
		return {
			data: item.data,
			entrada: item.entrada,
			saida: item.saida,
			horas_trabalhadas: formatHorasTrabalhadas(horasTrabalhadas) // Formata as horas trabalhadas
		};
	});

	// Obtém o custo por hora do funcionário (assumindo que seja o mesmo para todos os registros)
	const custoHora = report.rows.length > 0 ? report.rows[0].custo_hora : 0;
	// Calcula o total a ser pago com base nas horas trabalhadas e no custo por hora
	const total = totalHoras * custoHora;

	// Formata a resposta para incluir nome, pontos, total de horas e total financeiro
	const formattedResponse = {
		nome: report.rows.length > 0 ? report.rows[0].nome : "",
		pontos,
		total_horas: totalHoras,
		custo_hora: custoHora,
		total
	};

	// Retorna a resposta formatada
	return formattedResponse;
};

// Função auxiliar para formatar as horas trabalhadas no formato HH:MM:SS
const formatHorasTrabalhadas = (horas) => {
	const horasFormatadas = Math.floor(horas); // Obtém a parte inteira das horas
	const minutos = Math.floor((horas - horasFormatadas) * 60); // Calcula os minutos
	const segundos = Math.floor(((horas - horasFormatadas) * 60 - minutos) * 60); // Calcula os segundos
	// Retorna a string formatada com zeros à esquerda
	return `${pad(horasFormatadas)}:${pad(minutos)}:${pad(segundos)}`;
};

// Função auxiliar para adicionar zeros à esquerda
const pad = (num) => {
	return num.toString().padStart(2, "0"); // Converte para string e garante que tenha pelo menos dois dígitos
};

module.exports = {
	getReport // Exporta a função getReport
};
