import { MemoryStorage, Store } from 'engine';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
let MemoryStore = session.MemoryStore;
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

function getApp() {
  return new Promise((resolve, reject) => {
    getAuth()
      .then((auth) => {
        let store = auth.store;
        let sessionOptions = {
          secret: 'secret',
          store: new MemoryStore(),
          resave: false,
          saveUninitialized: false
        }
        let app = express();
        app.use(session(sessionOptions));
        app.use(bodyParser.json());
        app.use(store.modelMiddleware());
        app.use(auth.middleware(store));
        app.auth = auth;
        resolve(app);
      });
  });
}

function getRequest() {
  return new Promise((resolve, reject) => {
    getApp()
      .then((app) => {
        let request = supertest(app);
        request.app = app;
        resolve(request);
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
  getApp,
  getRequest,
  generateEmail,
  generatePassword,
  makeHash,
  compare: bcrypt.compareSync,
  clone
}
