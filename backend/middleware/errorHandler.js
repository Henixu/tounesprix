function notFound(req, res, next) {
  const error = new Error(`Route introuvable: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Identifiant invalide";
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `Cette valeur existe deja pour le champ "${field}"` : "Ressource dupliquee";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((fieldError) => fieldError.message)
      .join(", ");
  } else if (err.name === "MulterError") {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE" ? "L'image ne doit pas depasser 5 Mo" : err.message;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
