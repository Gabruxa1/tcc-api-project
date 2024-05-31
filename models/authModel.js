const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const funcionariosModel = require("./funcionariosModel");


const authenticate = async (email, senha) => {
	const user = await funcionariosModel.getUserByEmail(email);

	if (!user || !(await bcrypt.compare(senha, user.senha))) {
		return null;
	}

	return {
		id: user.id,
		email: user.email,
		admin: user.admin,
		ativo: user.ativo
	};
};

const generateAuthToken = (userData) => {
	const token = jwt.sign(userData, process.env.JWT_SECRET);
	return token;
};

module.exports = {
	authenticate,
	generateAuthToken
};
