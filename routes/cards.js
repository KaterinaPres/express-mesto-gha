const router = require('express').Router();
const {getCard, createCard, deleteCard, likeCard, dislikeCard,} = require('../controllers/cards');

router.post('/cards', createCard);
router.get('/cards', getCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;