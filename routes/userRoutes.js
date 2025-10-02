const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  activateUser
} = require('../controllers/userController');

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.get('/username/:username', getUserByUsername);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

router.post('/activate', activateUser);

module.exports = router;
