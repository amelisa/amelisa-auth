# Amelisa Auth
Auth for [Amelisa](https://github.com/amelisa/amelisa)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

### Features

- Email/Password and [Passport](http://passportjs.org/) OAuth providers
- All routes start with '/auth/*'
- Custom components (forms) are supported by parse-request hooks
- Routes for confirmation of registration and email change
- Hooks (sending emails, parse-request, request, response, error)
- Bcrypt (Scrypt and Sha-1 encryption are planned)
- Powerful server-side API
- Tests

### Inspired by
- [derby-login](https://github.com/derbyparty/derby-login)

### Installation

```
$ npm install amelisa-auth
```

## Tests

Run the tests with

```
$ npm test
```

### Setting

#### Step 1. Require
```js
import auth from 'amelisa-auth'
```
#### Step 2. Options (take a look at [default options](https://github.com/amelisa/amelisa-auth/blob/master/src/defaultOptions.js))
```js
const options = {}
```

#### Step 3. Middleware
```js
  .use(auth.middleware(store, options))
```

### Example
- [amelisa-crud-example](https://github.com/amelisa/amelisa-crud-example) example app with auth

### MIT License
Copyright (c) 2015 by Vladimir Makhaev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
