function response (err, info, methodOrProvider, req, res, additionalData = {}) {
  // Some operation just finished and we should send response
  // It can differ based on arguments:
  // err - if it's absent, operation was successful, otherwise it failed
  // methodOrProvider - it shows type of operation: 'login', 'logout',
  // 'changepassword', 'recoverpassword', 'resetpassword', 'register',
  // or provider's name for OAuth operations: 'google', 'github', etc
  // req.xhr - shows if request was XmlHttpRequest or not

  let urls = this.options.urls

  // Parse error message
  if (err && err.toString) {
    err = err.toString()
  }

  let successUrl = (req.query && req.query.redirect) || this.options.successUrl

  // Built-in components send xhr requests and wait
  // for {error: errorMessage} JSON in case of error
  // and {success: true, url: redirectUrl} JSON in case of success
  if (req.xhr) {
    if (err) return res.json({error: err})

    switch (methodOrProvider) {
      case urls.register:
        let url = successUrl

        if (this.options.confirmRegistration) {
          url = this.options.confirmRegistrationUrl
        }

        return res.json(Object.assign({success: true, url}, additionalData))
      // do not send redirect url, to emit component success event
      case urls.changeemail:
      case urls.changepassword:
      case urls.recoverpassword:
      case urls.resetpassword:
        return res.json(Object.assign({success: true}, additionalData))
      default:
        return res.json(Object.assign({success: true, url: successUrl}, additionalData))
    }
  }

  if (methodOrProvider === 'confirmemailchange') {
    if (err) return res.send(err)
    return res.redirect(this.options.emailChangeConfirmedUrl)
  }

  if (methodOrProvider === 'confirmregistration') {
    if (err) return res.send(err)
    return res.redirect(this.options.registrationConfirmedUrl)
  }

  if (err) {
    if (req.isProvider) {
      return res.redirect(this.options.providerErrorUrl)
    } else {
      return res.redirect(req.get('Referrer'))
    }
  } else {
    return res.redirect(successUrl)
  }
}

export default response
