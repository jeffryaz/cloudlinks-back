const loggerQuery = require("../helpers/loggerQuery");
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "cloudlin_links",
    password: "@Rosman1998",
    database: "cloudlin_cloudlink",
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
