const express = require('express');
const router = express.Router();
const { runDailyAutomation } = require('../services/automationService');

router.get('/run-automation', async (req, res) => {
  try {
    await runDailyAutomation();
    res.json({ message: 'Automation run completed' });
  } catch (error) {
    console.error('Error running automation:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const invoices = await require('../models/Invoice').find();
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
