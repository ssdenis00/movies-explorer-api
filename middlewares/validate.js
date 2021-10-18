const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const checkUrl = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }

  throw new Error('URL validation err');
};

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkUrl),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(checkUrl).required(),
    trailer: Joi.string().custom(checkUrl).required(),
    thumbnail: Joi.string().custom(checkUrl).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().required(),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const validateUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).required(),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateCreateMovie,
  validateId,
  validateUserData,
};
