import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const messages = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    return next(new ApiError(400, "Validation error", messages));
  }

  req.validated = result.data;
  next();
};
