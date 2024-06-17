import dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
   secretAccess: process.env.SECRET_KEY_ACCESS_TOKEN || 'staging-secret-A',
   secretRefresh: process.env.SECRET_KEY_REFRESH_TOKEN || 'staging-secret-R',
   accessExpiresIn: process.env.ACCESS_TOKEN_LIVE_TIME || '5m',
   refreshExpiresIn: process.env.REFRESH_TOKEN_LIVE_TIME || '30d',
}

export const basicConstants = {
   loginSa: process.env.LOGIN_SA || 'login',
   passwordSa: process.env.PASSWORD_SA || 'password'
}

export const mailerConstants = {
   login: process.env.MAILER_LOGIN || 'auth-mail-login',
   password: process.env.MAILER_PASSWORD || 'auth-mail-password',
   host: process.env.MAILER_HOST || 'smtp.mail.ru',
}

export const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/blog-nest"
export const MONGO_URI_FOR_TESTS = process.env.MONGO_URL_FOR_TESTS || "mongodb://localhost:27017/blog-nest-test"
export const PORT = process.env.PORT || 3000;