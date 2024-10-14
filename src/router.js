const express = require("express");
const funcionariosController = require("./controllers/funcionariosController");
const pontosController = require("./controllers/pontosController");
const funcionariosMiddleware = require("./middlewares/funcionariosMiddleware");
const pontosMiddleware = require("./middlewares/pontosMiddleware");
const authController = require("./controllers/authController");
const authMiddleware = require("./middlewares/authMiddleware");
const relatorioController = require("./controllers/relatorioController");
const relatorioMiddleware = require("./middlewares/relatorioMiddleware");

const router = express.Router();

// Rota para geração de token
router.post("/connect/token",
	authMiddleware.validateLoginBody,  // Middleware para validar o corpo da requisição de login
	authMiddleware.validateLogin,       // Middleware para validar o login
	authController.tokenGenerate         // Controlador que gera o token
);

// Middleware global para validar o token em todas as rotas subsequentes
router.use(authMiddleware.validateToken);

// Rotas protegidas por admin
router.get("/funcionarios",
	authMiddleware.isAdmin,
	funcionariosController.getAll // Apenas admin pode acessar todos os funcionários
);
router.get("/funcionarios/ativos",
	authMiddleware.isAdmin,
	funcionariosController.getActives // Apenas admin pode acessar funcionários ativos
);
router.post("/funcionarios",
	authMiddleware.isAdmin,
	funcionariosMiddleware.validateBody,         // Valida o corpo da requisição
	funcionariosMiddleware.checkDuplicateCPF,   // Verifica se o CPF já está cadastrado
	funcionariosMiddleware.checkDuplicateEmail, // Verifica se o email já está cadastrado
	funcionariosController.createEmployee        // Cria um novo funcionário
);
router.delete("/funcionarios/:id",
	authMiddleware.isAdmin,
	funcionariosMiddleware.checkId, // Verifica se o ID do funcionário existe
	funcionariosController.deleteEmployee // Deleta um funcionário
);
router.put("/funcionarios/:id",
	authMiddleware.isAdmin,
	funcionariosMiddleware.validateBodyUpdate, // Valida o corpo da requisição para atualização
	funcionariosMiddleware.checkDuplicateEmail, // Verifica se o email já está cadastrado
	funcionariosMiddleware.checkDuplicateCPF,   // Verifica se o CPF já está cadastrado
	funcionariosController.updateEmployee        // Atualiza os dados do funcionário
);

// Rotas de funcionários acessíveis por qualquer usuário autenticado
router.get("/funcionarios/:id",
	funcionariosMiddleware.checkId,
	funcionariosController.getActivesById // Acessa funcionário específico por ID
);

// Rotas de pontos
router.get("/pontos",
	authMiddleware.isAdmin,
	pontosController.getAll // Apenas admin pode acessar todos os registros de pontos
);
router.get("/pontos/:id",
	pontosMiddleware.checkId, // Verifica se o ID do registro de ponto existe
	pontosController.getRegisterById // Acessa registro de ponto específico por ID
);
router.post("/pontos/:id",
	pontosMiddleware.checkId,
	pontosMiddleware.validateBody, // Valida o corpo da requisição para criação de registro de ponto
	pontosMiddleware.validatePointCreate, // Valida a criação do ponto
	pontosController.createRegister // Cria um novo registro de ponto
);

// Rotas de pontos restritas a administradores
router.delete("/pontos/:id/:data",
	authMiddleware.isAdmin,
	pontosMiddleware.checkId,
	pontosMiddleware.checkDate, // Verifica se a data do registro existe
	pontosController.deletePoint // Deleta um registro de ponto
);
router.put("/pontos/:id",
	authMiddleware.isAdmin,
	pontosMiddleware.checkId,
	pontosMiddleware.validateBody, // Valida o corpo da requisição para atualização de registro
	pontosController.updateRegister // Atualiza um registro de ponto
);

// Rotas de relatório
router.get("/relatorio/:id",
	relatorioMiddleware.validateRequest, // Valida a requisição para o relatório
	relatorioController.getReport // Obtém o relatório
);

module.exports = router;
