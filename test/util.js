import { MemoryStorage, Store } from 'engine';
import bcrypt from 'bcrypt';
import auth from '../lib';

let minFactor = 4;
let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function gen()
{
  let text = '';
  for(let i=0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function getStore() {
  let storage = new MemoryStorage();

  return new Promise((resolve, reject) => {
    storage
      .init()
      .then(() => {
        let store = new Store(storage);
        let model = store.createModel();

        resolve(store);
      });
  });
}

function getAuth() {
  return new Promise((resolve, reject) => {
    getStore()
      .then((store) => {
        auth.middleware(store);
        resolve(auth);
      });
  });
}

function generateEmail() {
  return (gen() + '@' + gen() + '.com').toLowerCase();
}

function generatePassword() {
  return gen();
}

function makeHash(password) {
  return bcrypt.hashSync(password, minFactor);
}

function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

export default {
  getStore,
  getAuth,
  generateEmail,
  generatePassword,
  makeHash,
  compare: bcrypt.compareSync,
  clone
}
