const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/todos', apiController.getTodos);
router.post('/todos', apiController.addTodo);
router.patch('/todos/:id', apiController.toggleTodo);
router.delete('/todos/:id', apiController.deleteTodo);

module.exports = router;