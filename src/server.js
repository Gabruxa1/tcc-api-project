const app = require("./app"); // Importa a instância do aplicativo Express configurada no arquivo app.js
require("dotenv").config(); // Carrega variáveis de ambiente do arquivo .env para process.env

const PORT = process.env.PORT; // Obtém a porta definida nas variáveis de ambiente

// Inicia o servidor na porta especificada e exibe uma mensagem no console quando estiver em execução
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
