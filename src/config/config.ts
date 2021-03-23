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
const EMAIL_MAIL = process.env.EMAIL_MAIL || 'ttpro2015@gmail.com';
const PASSWORD_MAIL = process.env.PASSWORD_MAIL || 'sulropcniqutyenq';

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
  FE_ROUTE
};
