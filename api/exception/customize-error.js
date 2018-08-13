class CustomizeError extends Error {
  constructor(name = "anonymous", status, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomizeError);
    }
    // Custom debugging information
    this.name = name;
    this.status = status || 500;
    this.date = new Date();

  }
}

module.exports = CustomizeError;
