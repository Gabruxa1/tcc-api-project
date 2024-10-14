const connection = require("./connection"); // Importa a conexão com o banco de dados
const bcrypt = require("bcrypt"); // Importa bcrypt para criptografia de senhas

// Função para obter todos os funcionários
const getAll = async () => {
	const query = `
		SELECT pes.id, pes.nome AS nome, pes.cpf, pes.telefone, func.email, func.funcao, func.admin, func.ativo, func.custo_hora
		FROM funcionarios func
		JOIN pessoas pes ON func.pessoa_id = pes.id;`; // Consulta que une as tabelas 'pessoas' e 'funcionarios'

	const funcionarios = await connection.query(query); // Executa a consulta
	// Remove o campo 'senha' antes de retornar os dados
	return funcionarios.rows.map(({ senha, ...rest }) => rest);
};

// Função para obter apenas os funcionários ativos
const getActives = async () => {
	const query = `
		SELECT pes.id, pes.nome AS nome, pes.cpf, pes.telefone, func.email, func.funcao, func.admin, func.ativo, func.custo_hora
		FROM funcionarios func
		JOIN pessoas pes ON func.pessoa_id = pes.id
		WHERE func.ativo = TRUE;`; // Filtra apenas os funcionários ativos

	const funcionarios = await connection.query(query); // Executa a consulta
	return funcionarios.rows.map(({ senha, ...rest }) => rest); // Remove o campo 'senha'
};

// Função para criar um novo funcionário
const createEmployee = async (employee) => {
	const {
		nome,
		cpf,
		telefone,
		email,
		senha,
		funcao,
		admin,
		ativo,
		custo_hora
	} = employee;

	// Criptografa a senha do funcionário
	const hashedPassword = await bcrypt.hash(senha, 10);

	// Chama uma função no banco para inserir uma pessoa e um funcionário ao mesmo tempo
	const query = "SELECT inserir_pessoa_funcionario($1, $2, $3, $4, $5, $6, $7, $8, $9) as id_pessoa";
	const createdEmployee = await connection.query(query, [
		nome, cpf, telefone, email, hashedPassword, funcao, admin, ativo, custo_hora
	]); // Passa os dados como parâmetros para a função SQL

	const id_pessoa = createdEmployee.rows[0]?.id_pessoa; // Retorna o id da pessoa criada
	return { id_pessoa };
};

// Função para atualizar um funcionário existente
const updateEmployee = async (id, employee) => {
	// Campos que pertencem à tabela 'pessoas'
	const pessoaFields = ["nome", "cpf", "telefone"];
	// Campos que pertencem à tabela 'funcionarios'
	const funcionarioFields = ["email", "senha", "funcao", "admin", "ativo", "custo_hora"];

	// Prepara os campos para atualização, ignorando valores indefinidos ou nulos
	const updatePessoaFields = pessoaFields.reduce((acc, field) => {
		if (employee[field] !== undefined && employee[field] !== null && employee[field] !== "") {
			acc[field] = employee[field];
		}
		return acc;
	}, {});

	const updateFuncionarioFields = funcionarioFields.reduce((acc, field) => {
		if (employee[field] !== undefined && employee[field] !== null && employee[field] !== "") {
			acc[field] = employee[field];
		}
		return acc;
	}, {});

	// Se a senha for atualizada, ela será criptografada novamente
	if (updateFuncionarioFields.senha) {
		updateFuncionarioFields.senha = await bcrypt.hash(updateFuncionarioFields.senha, 10);
	}

	const updatePessoaValues = Object.values(updatePessoaFields);
	const updateFuncionarioValues = Object.values(updateFuncionarioFields);

	// Atualiza os dados da tabela 'pessoas', se necessário
	if (updatePessoaValues.length > 0) {
		const updatePessoaQuery = `
			UPDATE pessoas
			SET ${Object.keys(updatePessoaFields).map((col, index) => `${col} = $${index + 1}`).join(", ")}
			WHERE id = $${updatePessoaValues.length + 1}`;

		await connection.query(updatePessoaQuery, [...updatePessoaValues, id]); // Executa a consulta com os valores
	}

	// Atualiza os dados da tabela 'funcionarios', se necessário
	if (updateFuncionarioValues.length > 0) {
		const updateFuncionarioQuery = `
			UPDATE funcionarios
			SET ${Object.keys(updateFuncionarioFields).map((col, index) => `${col} = $${index + 1}`).join(", ")}
			WHERE pessoa_id = $${updateFuncionarioValues.length + 1}`;

		await connection.query(updateFuncionarioQuery, [...updateFuncionarioValues, id]);
	}

	// Consulta os dados atualizados do funcionário
	const updatedEmployeeQuery = `
		SELECT pes.nome AS nome, pes.cpf, pes.telefone, func.email, func.funcao, func.admin, func.ativo, func.custo_hora
		FROM funcionarios func
		JOIN pessoas pes ON func.pessoa_id = pes.id
		WHERE pes.id = $1`;

	const { rows } = await connection.query(updatedEmployeeQuery, [id]);
	const updatedEmployee = rows[0]; // Retorna o funcionário atualizado

	return updatedEmployee;
};

// Função para deletar um funcionário
const deleteEmployee = async (id) => {
	const query = "DELETE FROM pessoas WHERE id = $1"; // Deleta o registro da pessoa
	const removedEmployee = await connection.query(query, [id]); // Executa a exclusão
	return removedEmployee;
};

// Função para obter um funcionário ativo pelo ID
const getActivesById = async (id) => {
	const query = `
		SELECT pes.id AS id_pessoa, pes.nome, pes.cpf, pes.telefone, func.email, func.funcao, func.admin, func.ativo, func.custo_hora
		FROM pessoas pes
		JOIN funcionarios func ON pes.id = func.pessoa_id
		WHERE pes.id = $1;`; // Consulta específica para buscar o funcionário pelo ID

	const funcionarios = await connection.query(query, [id]);
	return funcionarios.rows[0]; // Retorna o funcionário correspondente
};

// Função para buscar um usuário pelo email (usada na autenticação)
const getUserByEmail = async (email) => {
	const query = `
		SELECT * 
		FROM funcionarios 
		WHERE email = $1`; // Busca o funcionário pelo email

	const user = await connection.query(query, [email]); // Executa a consulta
	return user.rows[0]; // Retorna o funcionário encontrado
};

module.exports = {
	getAll,
	getActives,
	createEmployee,
	deleteEmployee,
	updateEmployee,
	getActivesById,
	getUserByEmail
};
