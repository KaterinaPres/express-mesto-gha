const userMy = require('../models/user');
const { ERROR_BAD, ERROR_NOTFOUND, SOME_ERROR } = require('../err');

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(ERROR_BAD.code).send({ message: ERROR_BAD.messageUser });
  }
  userMy.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOTFOUND.code).send({ message: ERROR_NOTFOUND.messageUser });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD.code).send({ message: ERROR_BAD.messageUser });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.getUser = (req, res) => {
  userMy.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userMy.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD.code).send({ message: ERROR_BAD.messageUser });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.getUserByID = (req, res) => {
  userMy.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOTFOUND.code).send({ message: ERROR_NOTFOUND.messageUser });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD.code).send({ message: ERROR_BAD.messageUser });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  userMy.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_BAD.code).send({ message: ERROR_BAD.messageUser });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD.code).send({ message: ERROR_BAD.messageUser });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};
