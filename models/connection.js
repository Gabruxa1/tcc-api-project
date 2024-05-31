const pg = require("pg");
require("dotenv").config();
const connectionString = process.env.DATABASE_URL;

const connection = new pg.Pool({
	connectionString: connectionString,
});

module.exports = connection;