require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createLogger, transports } = require('winston');
require('winston-daily-rotate-file');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();
const app = express();

// Logging (clean, no sensitive data)
const logger = createLogger({
  level: 'info',
  format: require('winston').format.combine(
    require('winston').format.timestamp(),
    require('winston').format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: 'logs/%DATE%-app.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

// Routes will go here (next message)
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.json({ message: "Pula Loans API – Live & Clean 🇧🇼" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Pula Loans Backend running on port ${PORT}`);
});