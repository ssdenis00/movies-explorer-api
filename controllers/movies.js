const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbiddenError');
const IncorrectDataError = require('../errors/incorrectDataError');
const NoFoundError = require('../errors/noFoundError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        return next(new NoFoundError('Фильм не найден.'));
      }
      if (req.user._id === String(movie.owner)) {
        return movie.remove(movie._id)
          .then((deletedMovie) => {
            if (req.user._id !== String(deletedMovie.owner)) {
              next(new ForbiddenError('Вы не автор данного фильма'));
            } else {
              res.status(200).send(deletedMovie);
            }
          });
      }

      return next(new ForbiddenError('Вы не автор даннойго фильма'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};
