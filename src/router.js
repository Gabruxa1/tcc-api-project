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

router.get("/funcionarios", funcionariosController.getAll);
router.get("/funcionarios/ativos", funcionariosController.getActives);
router.get("/funcionarios/:id", funcionariosMiddleware.checkId, funcionariosController.getActivesById);
router.post("/funcionarios", funcionariosMiddleware.validateBody, funcionariosMiddleware.checkDuplicateCPF, funcionariosMiddleware.checkDuplicateEmail, funcionariosController.createEmployee);
router.delete("/funcionarios/:id", funcionariosMiddleware.checkId, funcionariosController.deleteEmployee);
router.put("/funcionarios/:id", funcionariosMiddleware.validateBodyUpdate, funcionariosMiddleware.checkDuplicateEmail, funcionariosMiddleware.checkDuplicateCPF, funcionariosController.updateEmployee);

router.get("/pontos", pontosController.getAll);
router.get("/pontos/:id", pontosMiddleware.checkId, pontosController.getRegisterById);
router.post("/pontos/:id", pontosMiddleware.checkId, pontosMiddleware.validateBody, pontosMiddleware.validatePointCreate, pontosController.createRegister);
router.delete("/pontos/:id/:data", pontosMiddleware.checkId, pontosMiddleware.checkDate, pontosController.deletePoint);
router.put("/pontos/:id", pontosMiddleware.checkId, pontosMiddleware.validateBody, pontosController.updateRegister);

router.post("/connect/token", authController.tokenGenerate);
router.post("/login", authMiddleware.validateToken, authMiddleware.isActive, authController.tokenGenerate);
router.post("/login/adm", authMiddleware.validateToken, authMiddleware.isActive, authMiddleware.isAdmin, authController.tokenGenerate);

router.get("/relatorio/:id", relatorioMiddleware.validateRequest, relatorioController.getReport);

module.exports = router;
