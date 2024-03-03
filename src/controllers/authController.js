const authModel = require('../../models/authModel');

const tokenGenerate = async (request, response) => {
	try {
		const { email, senha } = request.body;

		const user = await authModel.authenticate(email, senha);

		if (!user) {
			return response.status(401).json({ error: 'Credenciais inválidas' });
		}

		const token = await authModel.generateAuthToken(user);
		response.status(200).json({ token });
	} catch (error) {
		response.status(500).json({ error: 'Erro ao gerar token' });
	}
}


module.exports = {
	tokenGenerate
};
