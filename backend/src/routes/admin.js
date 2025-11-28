const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      firstName: true, lastName: true, phone: true, omang: true,
      referralCode: true, createdAt: true,
      loans: { select: { amount: true, repayAmount: true, status: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(users);
});

module.exports = router;