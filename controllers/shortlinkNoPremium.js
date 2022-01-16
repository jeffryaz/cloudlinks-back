const moment = require("moment");
const knex = require("../config/config.db");
const Response = require("../helpers/response");
const generateUrl = require("../helpers/generateUrl");

const ShortlinkNoPremium = {
  create: async (req, res) => {
    try {
      const { original_link } = req.body;
      let numberNewLink = 1;
      let new_link = "";
      let checkUrl = await knex("shortlink")
        .where({
          original_link,
          premium: false,
          actived: true,
        })
        .select("id", "new_link", "original_link", "created_at");
      if (checkUrl.length > 0) return Response._.clientOk(res, checkUrl[0]);
      while (1) {
        switch (numberNewLink) {
          case 1:
            new_link = await generateUrl.generate(5);
            numberNewLink = 2;
            continue;
          case 2:
            let checkNewLink = await knex("shortlink")
              .where({
                new_link,
              })
              .select("id", "new_link", "original_link", "created_at");
            if (checkNewLink.length > 0) {
              numberNewLink = 1;
              continue;
            }
            break;
          default:
            break;
        }
        break;
      }
      let item = {
        new_link,
        original_link,
        premium: false,
        created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      };
      let respons = await knex
        .transaction(function (trx) {
          knex("shortlink")
            .transacting(trx)
            .insert(item)
            .returning(["id", "new_link", "original_link", "created_at"])
            .then(function (resp) {
              return resp[0];
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .then(function (resp) {
          return resp;
        });
      return Response._.clientOk(res, respons);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
  go: async (req, res) => {
    try {
      const { new_link } = req.body;
      let checkUrl = await knex("shortlink")
        .where({
          new_link,
          actived: true,
        })
        .select("id", "new_link", "original_link", "created_at");
      if (checkUrl.length === 0)
        return Response._.clientError(res, null, "page not found");
      return Response._.clientOk(res, checkUrl[0]);
    } catch (error) {
      return Response._.clientError(res, null, error.toString());
    }
  },
};
module.exports = ShortlinkNoPremium;
