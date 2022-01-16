const moment = require("moment");
const knex = require("../config/config.db");
const Response = require("../helpers/response");
const generateUrl = require("../helpers/generateUrl");

const Dashboard = {
  advertisement: async (req, res) => {
    try {
      const { language } = req.body;
      let title = "";
      let description = "";
      if (language == "id") {
        title = "title_id";
        description = "description_id";
      } else {
        title = "title_eng";
        description = "description_eng";
      }
      let advertisement = await knex("advertisement").select(
        knex.ref(title).as("title"),
        knex.ref(description).as("description"),
        "code",
        "created_at",
        "updated_at",
        "target"
      );
      return Response._.clientOk(res, advertisement);
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
module.exports = Dashboard;
