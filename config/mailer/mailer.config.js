require("dotenv").config();
const configMailer = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  pool: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const configFrom = process.env.EMAIL_USER;

module.exports = { configMailer, configFrom };
