import Auth from '../Auth'

Auth.prototype.routeChangeEmail = require('./routeChangeEmail')
Auth.prototype.routeChangePassword = require('./routeChangePassword')
Auth.prototype.routeRecoverPassword = require('./routeRecoverPassword')
Auth.prototype.routeResetPassword = require('./routeResetPassword')
Auth.prototype.routeLogin = require('./routeLogin')
Auth.prototype.routeLogout = require('./routeLogout')
Auth.prototype.routeRegister = require('./routeRegister')
Auth.prototype.routeConfirmRegistration = require('./routeConfirmRegistration')
Auth.prototype.routeConfirmEmail = require('./routeConfirmEmail')
Auth.prototype.routeHandleStrategies = require('./routeHandleStrategies')
