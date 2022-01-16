const contoh = require("./contoh");
const shortlinkNoPremium = require("./shortlinkNoPremium");
const shortlinkPremium = require("./shortlinkPremium");
const auth = require("./auth");
const dashboard = require("./dashboard");
const routeError = require("../helpers/routeError");

const Router = {
  init: async (app, version = "/v1") => {
    app.use(`${version}/testing`, contoh);
    app.use(`${version}/link-no-premium`, shortlinkNoPremium);
    app.use(`${version}/link-premium`, shortlinkPremium);
    app.use(`${version}/auth`, auth);
    app.use(`${version}/dashboard`, dashboard);
    app.use(routeError);
  },
};

module.exports = Router;
