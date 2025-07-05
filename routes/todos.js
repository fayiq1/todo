const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Todo = require('../models/Todo');

// Todos Page
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.render('todos/index', { todos });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// Add Todo Page
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('todos/add');
});

// Create Todo
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    req.body.user = req.user.id;
     req.body.deadline = req.body.deadline || null;
    await Todo.create(req.body);
    req.flash('success_msg', 'Todo added successfully');
    res.redirect('/todos');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// Toggle Todo Completion
router.put('/:id', ensureAuthenticated, async (req, res) => {
 try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.redirect('/todos');
  } catch (err) {
    console.error(err);
    res.redirect('/todos');
  }
});

// Delete Todo
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.render('error/404');
    }

    if (todo.user.toString() !== req.user.id) {
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/todos');
    }

    await Todo.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Todo removed successfully');
    res.redirect('/todos');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;