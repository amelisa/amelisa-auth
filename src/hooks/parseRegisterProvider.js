function parseRegisterProvider (user, provider, profile) {
  // you can modify user data by provider data from profile here
  // for example:
  /*
  switch (provider) {
    case 'linkedin':
      user.firstname = profile.name.familyName
      user.lastname = profile.name.givenName
      break;
  } */

  return user
}

export default parseRegisterProvider
