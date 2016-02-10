var jwt = require('express-jwt');

module.exports = jwt({secret: process.env.SUPER_SECRET, userProperty: "payload"})