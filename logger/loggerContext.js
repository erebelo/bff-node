class LoggerContext {
  constructor(requestId, filename, method) {
    this.requestId = requestId || 'Undefined';
    this.filename = filename || 'Undefined';
    this.method = method || 'Undefined';
  }
}

module.exports = LoggerContext;
