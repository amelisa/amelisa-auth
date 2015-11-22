function strategies () {
  let strategies = this.options.strategies

  for (let name in strategies) {
    let Strategy = strategies[name].strategy
    let strategyOptions = strategies[name].conf

    // Be sure to pass req
    strategyOptions.passReqToCallback = true

    // Add strategy to passport
    this._passport.use(new Strategy(strategyOptions, this.verifyCallback.bind(this)))
  }
}

export default strategies
