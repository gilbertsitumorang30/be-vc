type ValidationError = {
  field: string;
  message: string;
  code: string;
};

type AppErrorOptions = {
  code?: string | null;
  errors?: ValidationError[] | null;
};

class AppError extends Error {
  statusCode: number;
  code: string | null;
  errors: ValidationError[] | null;

  constructor(
    message: string,
    statusCode: number,
    options: AppErrorOptions = {},
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;

    const { code = null, errors = null } = options;

    this.code = code;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
