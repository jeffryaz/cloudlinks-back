require("dotenv").config();
const loggerQuery = require("../helpers/loggerQuery");
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const knex = require("knex")({
  client: "pg",
  connection: {
    host,
    user,
    password,
    database,
    port: 5432,
    connectionTimeoutMillis: 5000,
  },
  pool: {
    min: 0,
    max: 7,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 10000,
  },
  log: {
    async warn(message) {
      console.log("warn: ", message);
    },
    async error(message) {
      await loggerQuery.error(message);
      console.log("error: ", message);
    },
    async deprecate(message) {
      console.log("deprecate: ", message);
    },
    async debug(message) {
      console.log("debug: ", message);
    },
  },
});

module.exports = knex;
