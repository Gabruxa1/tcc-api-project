const connection = require('./connection');
const bcrypt = require('bcrypt');

const getAll = async () => {
	const query = `SELECT pes.nome AS nome, pes.cpf, pes.telefone, func.email, func.senha, func.funcao, func.admin, func.ativo, func.custo_hora 
					FROM funcionarios func 
					JOIN pessoas pes ON func.pessoa_id = pes.id;`
	const funcionarios = await connection.query(query);
	return funcionarios.rows;
};

const getActives = async () => {
	const query = `SELECT pes.nome AS nome, pes.cpf, pes.telefone, func.email, func.senha, func.funcao, func.admin, func.ativo, func.custo_hora 
					FROM funcionarios func 
					JOIN pessoas pes ON func.pessoa_id = pes.id 
					WHERE func.ativo = TRUE;`
	const funcionarios = await connection.query(query);
	return funcionarios.rows;
};

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
	const hashedPassword = await bcrypt.hash(senha, 10);

	const query = 'SELECT inserir_pessoa_funcionario($1, $2, $3, $4, $5, $6, $7, $8, $9) as id_pessoa';
	const createdEmployee = await connection.query(query, [nome, cpf, telefone, email, hashedPassword, funcao, admin, ativo, custo_hora]);
	const id_pessoa = createdEmployee.rows[0]?.id_pessoa;
	return { id_pessoa };
};


const updateEmployee = async (id, employee) => {
	const pessoaFields = ['nome', 'cpf', 'telefone'];
	const funcionarioFields = ['email', 'senha', 'funcao', 'admin', 'ativo', 'custo_hora'];

	const updatePessoaFields = pessoaFields.reduce((acc, field) => {
		if (employee[field] !== undefined && employee[field] !== null && employee[field] !== '') {
			acc[field] = employee[field];
		}
		return acc;
	}, {});

	const updateFuncionarioFields = funcionarioFields.reduce((acc, field) => {
		if (employee[field] !== undefined && employee[field] !== null && employee[field] !== '') {
			acc[field] = employee[field];
		}
		return acc;
	}, {});

	if (updateFuncionarioFields.senha) {
		updateFuncionarioFields.senha = await bcrypt.hash(updateFuncionarioFields.senha, 10);
	}

	const updatePessoaValues = Object.values(updatePessoaFields);
	const updateFuncionarioValues = Object.values(updateFuncionarioFields);

	if (updatePessoaValues.length > 0) {
		const updatePessoaQuery = `
							UPDATE pessoas
							SET ${Object.keys(updatePessoaFields).map((col, index) => `${col} = $${index + 1}`).join(', ')}
							WHERE id = $${updatePessoaValues.length + 1}
					`;
		await connection.query(updatePessoaQuery, [...updatePessoaValues, id]);
	}

	if (updateFuncionarioValues.length > 0) {
		const updateFuncionarioQuery = `
							UPDATE funcionarios
							SET ${Object.keys(updateFuncionarioFields).map((col, index) => `${col} = $${index + 1}`).join(', ')}
							WHERE pessoa_id = $${updateFuncionarioValues.length + 1}
					`;
		await connection.query(updateFuncionarioQuery, [...updateFuncionarioValues, id]);
	}

	const updatedEmployeeQuery = `
					SELECT pes.nome AS nome, pes.cpf, pes.telefone, func.email, func.senha, func.funcao, func.admin, func.ativo, func.custo_hora
					FROM funcionarios func
					JOIN pessoas pes ON func.pessoa_id = pes.id
					WHERE pes.id = $1`;
	const { rows } = await connection.query(updatedEmployeeQuery, [id]);
	const updatedEmployee = rows[0];

	return updatedEmployee;
};

const deleteEmployee = async (id) => {
	const query = 'DELETE FROM pessoas WHERE id = $1'
	const removedEmployee = await connection.query(query, [id]);
	return removedEmployee;
}

const getActivesById = async (id) => {
	const query = `SELECT 
					pes.id AS id_pessoa,
					pes.nome,
					pes.cpf,
					pes.telefone,
					func.email,
					func.senha,
					func.funcao,
					func.admin,
					func.ativo,
					func.custo_hora
					FROM pessoas pes
					JOIN funcionarios func ON pes.id = func.pessoa_id
					WHERE pes.id = $1;`;
	const funcionarios = await connection.query(query, [id]);
	return funcionarios.rows[0];
}

const getUserByEmail = async (email) => {
	const query = `SELECT * 
					FROM funcionarios 
					WHERE email = $1`;
	const user = await connection.query(query, [email]);
	return user.rows[0]
}

module.exports = {
	getAll,
	getActives,
	createEmployee,
	deleteEmployee,
	updateEmployee,
	getActivesById,
	getUserByEmail
};
