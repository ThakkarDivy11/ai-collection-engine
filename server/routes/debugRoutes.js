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

router.get('/test-email', async (req, res) => {
  try {
    const sendEmail = require('../utils/emailService');
    await sendEmail({
      to: process.env.SMTP_USER,
      subject: 'Test Email from CollectAI',
      text: 'If you see this, your SMTP configuration is working perfectly!',
      html: '<h3>Success!</h3><p>Your SMTP configuration is working perfectly on Render.</p>'
    });
    res.json({ message: 'Test email sent successfully to ' + process.env.SMTP_USER });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ 
        error: 'Email failed', 
        details: error.message,
        hint: 'Check if App Password is correct and 2FA is enabled.' 
    });
  }
});

module.exports = router;
