const Movie = require('../models/movie');
const CheckOwnerMovieError = require('../errors/checkOwnerMovieError');
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
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;
  const owner = req.user._id;

  if (
    country !== false
    || director !== false
    || duration !== false
    || year !== false
    || description !== false
    || image !== false
    || trailer !== false
    || nameRU !== false
    || nameEN !== false
    || thumbnail !== false
  ) {
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
  } else {
    next(new IncorrectDataError('Переданы некорректные данные.'));
  }
};

module.exports.deleteMovie = (req, res, next) => {
  const movieId = req.params.id;
  Movie.findOne({ movieId })
    .then((movie) => {
      if (!movie) {
        next(new NoFoundError('Фильм не найден.'));
      } else if (req.user._id === String(movie.owner)) {
        Movie.findByIdAndDelete(movie._id)
          .then((deletedMovie) => {
            if (req.user._id !== String(deletedMovie.owner)) {
              next(new CheckOwnerMovieError('Вы не автор данного фильма'));
            } else {
              res.status(200).send(deletedMovie);
            }
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new IncorrectDataError('Переданы некорректные данные.'));
            } else {
              next(err);
            }
          });
      } else {
        next(new CheckOwnerMovieError('Вы не автор даннойго фильма'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};
