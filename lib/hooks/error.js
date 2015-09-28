function error(key) {
  // User errors by key for localization support, though I'm still not sure
  // how to get user's session here to know the language

  let errors = this.options.errors || {};
  let message = errors[key] || 'Unknown Error';
  return new Error(message);
}

export default error;
