const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Task Schema
const taskSchema = new mongoose.Schema({
  description: String,
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Home route - display tasks
app.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.render('index', { tasks });
});

// Add a new task
app.post('/add', async (req, res) => {
  const newTask = new Task({
    description: req.body.description,
  });
  await newTask.save();
  res.redirect('/');
});

// Edit task
app.post('/edit/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.description = req.body.description;
  await task.save();
  res.redirect('/');
});

// Mark task as completed
app.post('/complete/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.redirect('/');
});

// Delete task
app.post('/delete/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
