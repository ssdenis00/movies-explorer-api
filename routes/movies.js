const router = require('express').Router();
const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');
const { validateCreateMovie, validateId } = require('../middlewares/validate');

router.get('/', getMovies);
router.delete('/:id', validateId, deleteMovie);
router.post('/', validateCreateMovie, createMovie);

module.exports = router;
