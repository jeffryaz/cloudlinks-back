const moment = require("moment");
const nodemailer = require("nodemailer");
const fs = require("fs");
const Response = require("../../helpers/response");
const { configMailer, configFrom } = require("./mailer.config");
const path = require("path");
const pathSaveDoc = path.dirname(require.main.filename) + "/document/";

const Mail = {
  reader: async (type) => {
    return fs.readFileSync("./contentEmail/" + type + ".ejs", "utf8");
  },
  send: async (to, subject, html, res) => {
    try {
      const transporter = nodemailer.createTransport(configMailer);
      const mailOptions = {
        from: configFrom,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject: `Cloudlinks - ${subject}`,
        html,
      };
      const result = await transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      return Response._.clientError(
        res,
        null,
        "error -> sendMail ->" + error.toString()
      );
    }
  },
  sendAttach: async (to, subject, html, attachmentName, res) => {
    try {
      const transporter = nodemailer.createTransport(configMailer);
      const mailOptions = {
        from: configFrom,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject: `Cloudlinks - ${subject}`,
        html,
        attachments: [
          {
            filename: attachmentName,
            path: pathSaveDoc + attachmentName,
          },
        ],
      };
      const result = await transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      return Response._.clientError(
        res,
        null,
        "error -> sendAttachMail ->" + error.toString()
      );
    }
  },
};

module.exports._ = Mail;
