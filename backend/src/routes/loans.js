const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bundles = [
  { amount: 100, repay: 130, label: "Quick Cash" },
  { amount: 500, repay: 650, label: "Salary Boost" },
  { amount: 1000, repay: 1300, label: "Weekend Fix" },
  { amount: 2000, repay: 2700, label: "Big Move" },
  { amount: 3500, repay: 4700, label: "Business Lift" },
  { amount: 5000, repay: 6800, label: "Major Support" }
];

router.get('/bundles', (req, res) => res.json(bundles));

router.post('/apply', protect, async (req, res) => {
  const { amount, repayAmount } = req.body;
  await prisma.loanRequest.create({
    data: { userId: req.user.id, amount, repayAmount }
  });
  require('winston').createLogger().info(`LOAN APPLIED | ${req.user.phone} | P${amount} → P${repayAmount}`);
  res.json({ message: 'Loan request submitted! We’ll review within 24hrs.' });
});

module.exports = router;