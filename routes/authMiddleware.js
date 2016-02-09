var jwt = require('express-jwt');

module.exports = jwt({secret: "secret", userProperty: "payload"})