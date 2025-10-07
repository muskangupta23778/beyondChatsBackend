const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// auth routes
const authRoutes = require('./routes/loginRoute');
app.use('/api/auth', authRoutes);

// activity routes
const userActivityRoutes = require('./routes/userActivityRoute');
app.use('/api', userActivityRoutes);

// admin routes
const adminRoutes = require('./routes/adminRoute');
app.use('/apiAdmin', adminRoutes);

// placeholder for protected routes using middleware in future

async function start() {
  try {
    if (MONGODB_URI) {
      await mongoose.connect(MONGODB_URI, {
        // modern mongoose uses a simple connect signature; options retained for clarity
      });
      console.log('Connected to MongoDB');
    } else {
      console.warn('MONGODB_URI not set. Server will start without DB connection.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
