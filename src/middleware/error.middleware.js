export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const isMulterError = err.name === "MulterError";
  const status = err.status || (isMulterError ? 400 : 500);
  const message = status === 500 && process.env.NODE_ENV === "production" ? "Server error" : err.message || "Server error";

  res.status(status).json({
    success: false,
    message,
  });
};
