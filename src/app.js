const express = require("express"); // Importa o framework Express
const router = require("./router"); // Importa as rotas definidas no arquivo router
const swaggerUi = require("swagger-ui-express"); // Importa o middleware para Swagger UI
const swaggerDocs = require("./swagger.json"); // Importa a documentação Swagger em formato JSON

const app = express(); // Cria uma nova instância do aplicativo Express

// Configura o Swagger UI para servir a documentação da API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para permitir que o Express processe requisições JSON
app.use(express.json());

// Usa o roteador importado para gerenciar as rotas da aplicação
app.use(router);

// Exporta o aplicativo para ser utilizado em outros arquivos, como o servidor
module.exports = app;
