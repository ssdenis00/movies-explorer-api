const express = require('express');

require('dotenv').config();

const { port = 3000 } = process.env;
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  validateCreateUser,
  validateLogin,
} = require('./middlewares/validate');
const {
  login,
  createUser,
} = require('./controllers/users');
const NoFoundError = require('./errors/noFoundError');

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb',
  {
    useNewUrlParser: true,
  });

app.use(helmet());

const allowedCors = [
  'https://mesto-denis-l.nomoredomains.club',
  'http://mesto-denis-l.nomoredomains.club',
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

app.use(express.json());

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use('/users', auth, usersRoutes);
app.use('/movies', auth, moviesRoutes);

app.use('*', auth, () => {
  throw new NoFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(port);
