const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

// Generate QR Code for a medicine batch
router.get('/qr/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // The link will point to the frontend verification portal
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${id}`;
    
    const qrDataUrl = await QRCode.toDataURL(verificationUrl);
    res.json({ qrDataUrl, verificationUrl });
  } catch (err) {
    res.status(500).send('Error generating QR code');
  }
});

module.exports = router;
