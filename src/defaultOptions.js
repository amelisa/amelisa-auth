let defaultOptions = {
  // Data
  collection: 'auths',
  publicCollection: 'users',
  user: {
    id: true,
    email: true
  },

  // Urls
  urls: {
    base: 'auth',
    changeemail: 'changeemail',
    changepassword: 'changepassword',
    recoverpassword: 'recoverpassword',
    resetpassword: 'resetpassword',
    login: 'login',
    logout: 'logout',
    register: 'register',
    confirmregistration: 'confirmregistration',
    confirmemail: 'confirmemail'
  },

  // Local provider
  encryption: 'bcryptjs', // 'bcryptjs' (js) or 'bcrypt' (native) or 'sha-1'
  encryptionStrength: 10,
  localField: 'local',
  emailField: 'email',
  emailChangeField: 'emailChange',
  hashField: 'hash',
  saltField: 'salt',
  confirmEmailTimeLimit: '3d', // ms formats possible: 0.5y, 1d, 10h, etc
  resetPasswordTimeLimit: '3d', // 3 days
  confirmRegistration: true, // should we send email to confirm address or login user immediately

  // Passport
  passport: {
    userProperty: 'userId'
  },
  strategies: {},

  queryCookieField: '__query',

  // Some values to use in hooks
  confirmEmailUrl: '/confirmemail',
  confirmRegistrationUrl: '/confirmregistration',
  emailConfirmedUrl: '/emailconfirmed',
  loginUrl: '/login',
  recoverPasswordUrl: '/recoverpassword',
  registrationConfirmedUrl: '/registrationconfirmed',
  providerErrorUrl: '/providererror',
  successUrl: '/',

  errors: {
    alreadyConfirmed: 'Already confirmed',
    confirmationExpired: 'Confirmation is expired',
    equalEmails: 'Old and new emails are equal',
    noLocal: 'User is not registered with email/password',
    noUser: 'User is not registered',
    noUserByEmail: 'No user with this email',
    noUserBySecret: 'Wrong secret. Maybe your reset password link is out of date',
    providerExists: 'User is already registered with this provider',
    resetPasswordExpired: 'Reset password is expired',
    userExists: 'User already exists',
    wrongOldPassword: 'Old password is wrong',
    wrongPassword: 'Password is wrong'
  },

  emailRegex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
}

export default defaultOptions
