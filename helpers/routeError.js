const Response = require("./response");

const routeError = (err, req, res, next) => {
  if (typeof err === "object") {
    return Response._.clientError(res, null, err.message);
  } else {
    return Response._.clientError(res, null, err);
  }
};

module.exports = routeError;
