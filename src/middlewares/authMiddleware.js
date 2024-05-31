// authMiddleware.js

const jwt = require("jsonwebtoken");

const handleUnauthorizedRequest = (response, message) => {
	return response.status(401).json({ error: message });
};


const validateToken = async (request, response, next) => {
	const token = request.header("Authorization");
	if (!token) {
		return handleUnauthorizedRequest(response, "Token de acesso não fornecido");
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		request.user = decoded;
		next();
	} catch (error) {
		return handleUnauthorizedRequest(response, "Token de acesso inválido");
	}
};

const isAdmin = async (request, response, next) => {
	const user = request.user;
	if (!user.admin) {
		return handleUnauthorizedRequest(response, "Acesso negado. Acesso permitido somente para administradores");
	}
	next();
};

const isActive = async (request, response, next) => {
	const user = request.user;
	if (!user.ativo) {
		return handleUnauthorizedRequest(response, "Acesso negado. Usuário desativado");
	}
	next();
};


module.exports = {
	validateToken,
	isAdmin,
	isActive
};
