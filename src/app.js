const express = require("express");
const router = require("./router");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger.json");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

app.use(router);

module.exports = app;