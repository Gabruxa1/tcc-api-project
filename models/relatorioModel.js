const connection = require("./connection");

const getReport = async (id, data_inicio, data_fim) => {
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
                    rp.data BETWEEN $2 AND $3;`;
	const report = await connection.query(query, [id, data_inicio, data_fim]);

	if (report.rows.length === 0) {
		throw new Error("Não existem pontos registrados para o período selecionado, verifique data de inicio e fim");
	}

	let totalHoras = 0;
	const pontos = report.rows.map(item => {
		const entrada = new Date(`1970-01-01T${item.entrada}`);
		const saida = new Date(`1970-01-01T${item.saida}`);
		const horasTrabalhadas = (saida - entrada) / (1000 * 60 * 60);
		totalHoras += horasTrabalhadas;

		return {
			data: item.data,
			entrada: item.entrada,
			saida: item.saida,
			horas_trabalhadas: formatHorasTrabalhadas(horasTrabalhadas) // Formatando as horas trabalhadas
		};
	});
	const custoHora = report.rows.length > 0 ? report.rows[0].custo_hora : 0;
	const total = totalHoras * custoHora;

	const formattedResponse = {
		nome: report.rows.length > 0 ? report.rows[0].nome : "",
		pontos,
		total_horas: totalHoras,
		custo_hora: custoHora,
		total
	};

	return formattedResponse;
};

const formatHorasTrabalhadas = (horas) => {
	const horasFormatadas = Math.floor(horas);
	const minutos = Math.floor((horas - horasFormatadas) * 60);
	const segundos = Math.floor(((horas - horasFormatadas) * 60 - minutos) * 60);
	return `${pad(horasFormatadas)}:${pad(minutos)}:${pad(segundos)}`;
};

const pad = (num) => {
	return num.toString().padStart(2, "0");
};

module.exports = {
	getReport
};