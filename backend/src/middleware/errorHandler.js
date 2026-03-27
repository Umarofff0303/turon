export const errorHandler = (err, _req, res, _next) => {
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Noto'g'ri identifikator (id)" });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Bu qiymat allaqachon mavjud" });
  }

  const statusCode = err.statusCode || 500;
  const payload = {
    message: err.message || "Internal server error",
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
