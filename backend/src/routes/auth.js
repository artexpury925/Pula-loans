const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// FIXED: Create a local logger instance here (or move to a shared file later)
const winston = require('winston');
require('winston-daily-rotate-file');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: 'logs/%DATE%-app.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

// Register
router.post('/register', async (req, res) => {
  const { firstName, secondName, lastName, phone, omang, pin, referredBy } = req.body;

  if (!/^\d{4}$/.test(pin)) return res.status(400).json({ error: 'PIN must be 4 digits' });
  if (!/^\+267\d{8}$/.test(phone)) return res.status(400).json({ error: 'Invalid phone' });
  if (!/^\d{9}$/.test(omang)) return res.status(400).json({ error: 'Omang must be 9 digits' });

  const exists = await prisma.user.findFirst({
    where: { OR: [{ phone }, { omang }] }
  });
  if (exists) return res.status(400).json({ error: 'User already exists' });

  const pinHash = await bcrypt.hash(pin, 10);
  const referralCode = phone.slice(-8);

  const user = await prisma.user.create({
    data: {
      firstName,
      secondName,
      lastName,
      phone,
      omang,
      pinHash,
      referralCode,
      referredBy: referredBy || null,
      isAdmin: phone === '+26777777777'
    }
  });

  logger.info(`NEW USER | ${firstName} ${lastName} | ${phone} | Omang: ${omang} | Ref: ${referredBy || 'none'}`);

  // Email alert (NO PIN EVER)
  if (process.env.SMTP_USER) {
    require('nodemailer').createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    }).sendMail({
      from: '"Pula Loans" <no-reply@pulaloans.com>',
      to: 'arnoldkipruto193@gmail.com',
      subject: 'New Registration – Pula Loans',
      text: `New user registered!\nName: ${firstName} ${lastName}\nPhone: ${phone}\nOmang: ${omang}\nReferral: ${referredBy || 'Direct'}`
    });
  }

  res.json({ message: 'Registered successfully!', referralLink: `https://pulaloans.onrender.com/r/${referralCode}` });
});

// Login with 4-digit PIN
router.post('/login', async (req, res) => {
  const { phone, pin } = req.body;
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user || !(await bcrypt.compare(pin, user.pinHash))) {
    return res.status(401).json({ error: 'Invalid phone or PIN' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  logger.info(`LOGIN SUCCESS | ${user.phone}`);
  res.json({ message: 'Logged in', user: { name: `${user.firstName} ${user.lastName}`, phone: user.phone } });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

module.exports = router;