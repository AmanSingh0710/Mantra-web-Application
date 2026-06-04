const mongoSanitize = require("mongo-sanitize");

module.exports = (req, res, next) => {
  if (req.body) req.body = mongoSanitize(req.body);
  if (req.params) req.params = mongoSanitize(req.params);
  if (req.query) req.query = mongoSanitize(req.query);

  next();
};