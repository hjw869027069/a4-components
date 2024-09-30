const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const session = require('express-session');

const app = express();
const PORT = 3000;

const uri = "mongodb+srv://rileyyu8:xusY9tpSCYJRzWNB@cluster0.lsc6n.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let usersCollection, tasksCollection;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    const db = client.db("taskApp");
    usersCollection = db.collection("users");
    tasksCollection = db.collection("tasks");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectDB();


// Login route
app.post('/login', async (req, res) => {
  const { username } = req.body;

  let user = await usersCollection.findOne({ username });

  if (!user) {
    // Create a new user if they don't exist
    await usersCollection.insertOne({ username });
    req.session.username = username;
    return res.json({ success: true, message: 'New account created. Welcome!' });
  } else {
    // Log the user in if they exist
    req.session.username = username;
    return res.json({ success: true, message: 'Login successful!' });
  }
});

// If session doesn't exist and user tries to access protected routes, redirect to login
function requireLogin(req, res, next) {
  if (!req.session.username) {
    // Don't return HTML for API requests
    if (req.path.startsWith('/api')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    // Otherwise, redirect to login page
    return res.redirect('/');
  }
  next();
}

// Add Task Route (User-specific)
app.post('/add', requireLogin, async (req, res) => {
  const { taskName, dueDate, priority } = req.body;
  const daysRemaining = calculateDaysRemaining(dueDate);

  const newTask = { taskName, dueDate, priority, daysRemaining, username: req.session.username };

  try {
    await tasksCollection.insertOne(newTask);
    const tasks = await tasksCollection.find({ username: req.session.username }).toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Error adding task.");
  }
});

// Modify Task Route (User-specific)
app.post('/modify', requireLogin, async (req, res) => {
  const { oldTaskName, newTaskName, dueDate, priority } = req.body;
  const daysRemaining = calculateDaysRemaining(dueDate);

  try {
    await tasksCollection.updateOne(
      { taskName: oldTaskName, username: req.session.username },
      { $set: { taskName: newTaskName, dueDate, priority, daysRemaining } }
    );
    const tasks = await tasksCollection.find({ username: req.session.username }).toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Error modifying task.");
  }
});

// Delete Task Route (User-specific)
app.post('/delete', requireLogin, async (req, res) => {
  const { taskName } = req.body;

  try {
    await tasksCollection.deleteOne({ taskName, username: req.session.username });
    const tasks = await tasksCollection.find({ username: req.session.username }).toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Error deleting task.");
  }
});

// Fetch User-specific Tasks
app.get('/results', requireLogin, async (req, res) => {
  try {
    const tasks = await tasksCollection.find({ username: req.session.username }).toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Error fetching tasks.");
  }
});

// Function to calculate the number of days remaining
function calculateDaysRemaining(dueDate) {
  const due = new Date(dueDate);
  const today = new Date();
  const timeDifference = due - today;
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
