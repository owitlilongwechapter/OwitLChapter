const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const contentRoutes = require('./routes/contentRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/membership', membershipRoutes);
app.use("/api/testimonials", testimonialRoutes);


app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/about', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'about.html'));
});

app.get('/join-us', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'join-us.html'));
});

app.get('/events-programs', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'events-programs.html'));
});

app.get('/news', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'news.html'));
});

app.get('/partners-sponsors', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'partners-sponsors.html'));
});

app.get('/contact', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'contact.html'));
});

const START_PORT = Number(process.env.PORT) || 5000;
const MAX_PORT_ATTEMPTS = 10;

const startServer = (port, attemptsLeft) => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Retrying on ${nextPort}...`);
      startServer(nextPort, attemptsLeft - 1);
      return;
    }

    console.error('Server failed to start:', error.message);
    process.exit(1);
  });
};

startServer(START_PORT, MAX_PORT_ATTEMPTS);
