import * as dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;
const DB_HOSTNAME = process.env.DB_HOSTNAME || 'remotemysql.com';
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USERNAME = process.env.DB_USERNAME || 'qHtJYlp09Y';
const DB_PASSWORD = process.env.DB_PASSWORD || 'CCDiKVAI8X';
const DB_NAME = process.env.DB_NAME || 'qHtJYlp09Y';
const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

export { PORT, DB_HOSTNAME, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, SECRET_KEY };
