module.exports = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const err = new Error(error.details.map((d) => d.message).join(', '));
    err.status = 400;
    return next(err);
  }
  req.body = value;
  return next();
};
