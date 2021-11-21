const contoh = require("./contoh");
const shortlinkNoPremium = require("./shortlinkNoPremium");
const routeError = require("../helpers/routeError");

const Router = {
  init: async (app, version = "/v1") => {
    app.use(`${version}/testing`, contoh);
    app.use(`${version}/link-no-premium`, shortlinkNoPremium);
    app.use(routeError);
  },
};

module.exports = Router;
