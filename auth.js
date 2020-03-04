var rp = require("request-promise");

module.exports = async token => {
  var options = {
    uri: "http://oauth.infralabs.cs.ui.ac.id/oauth/resource",
    headers: {
      Authorization: token
    }
  };
  if (!token) {
    throw {
      statusCode: 401,
      response: {
        body: {
          error_description: "Authentication credentials were not provided"
        }
      }
    };
  }
  return rp(options).then(data => {
    console.log("Success =>", data);
  });
};
