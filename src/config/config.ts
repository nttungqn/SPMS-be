import * as dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;
const DB_HOSTNAME = process.env.DB_HOSTNAME || 'remotemysql.com';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USERNAME = process.env.DB_USERNAME || 'qHtJYlp09Y';
const DB_PASSWORD = process.env.DB_PASSWORD || 'CCDiKVAI8X';
const DB_NAME = process.env.DB_NAME || 'qHtJYlp09Y';
const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';
const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';
const FE_ROUTE = process.env.FE_ROUTE || 'http://localhost:3000';
const EMAIL_MAIL = process.env.EMAIL_MAIL || '';
const PASSWORD_MAIL = process.env.PASSWORD_MAIL || '';
const PATH_STORE_IMAGE = process.env.PATH_STORE_IMAGE || 'src/assets/images';
const DB_POOL_CONNECTION = +process.env.DB_POOL_CONNECTION || 5;

const FIREBASECONFIG = {
  apiKey: 'AIzaSyAg9kS0xBK9GagQy98fX_nSzN9Eg9SjDL8',
  authDomain: 'spms-f664f.firebaseapp.com',
  projectId: 'spms-f664f',
  storageBucket: 'spms-f664f.appspot.com',
  messagingSenderId: '106291459378',
  appId: '1:106291459378:web:159476d3c4fdf5e51ad32b',
  measurementId: 'G-B0QRZVC2GM',
  databaseURL: 'https://spms-f664f.firebaseio.com'
};
const REDIS_CONFIG = {
  HOST: process.env.REDIS_HOST || 'redis-18872.c1.ap-southeast-1-1.ec2.cloud.redislabs.com',
  PORT: +process.env.REDIS_PORT || 18872,
  PASSWORD: 'A7yzKrnkLM8vN3w6G1nzn5MozR9YIOsD',
  TTL: 600,
  MAX: 256
};
export {
  PORT,
  DB_HOSTNAME,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  SECRET_KEY,
  JWT_SECRET,
  EMAIL_MAIL,
  PASSWORD_MAIL,
  FE_ROUTE,
  PATH_STORE_IMAGE,
  DB_POOL_CONNECTION,
  FIREBASECONFIG,
  REDIS_CONFIG
};
