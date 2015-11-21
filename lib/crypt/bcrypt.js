import bcrypt from 'bcrypt'

function bcryptModule (costFactor) {
  return {
    compare: (password, hash, salt) => {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
          if (err) return reject(err)

          resolve(res)
        })
      })
    },
    hash: (password) => {
      return new Promise((resolve, reject) => {
        bcrypt.hash(password, costFactor, (err, hash) => {
          if (err) return reject(err)

          resolve({hash})
        })
      })
    }
  }
}

export default bcryptModule
