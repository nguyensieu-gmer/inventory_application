class DuplicateKeyValueError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = "DuplicateError";
  }
}

module.exports = DuplicateKeyValueError;
