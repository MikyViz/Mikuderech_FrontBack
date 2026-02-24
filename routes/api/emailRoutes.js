import express from 'express';
import { sendEmail } from '../../services/emailService.js';

const router = express.Router();

/**
 * POST /api/email/send
 * Send email to support
 * Request body:
 * - message (required): Email message body
 * - title (optional): Email title/subject
 * - userName (optional): Sender name
 * - userEmail (optional): Sender email for Reply-To
 */
router.post('/send', async (req, res) => {
  try {
    const { message, title, userName, userEmail } = req.body;

    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(422).json({
        status: 'error',
        error: 'נדרש תוכן הודעה'
      });
    }

    // Check message size
    if (message.length > 100000) {
      return res.status(413).json({
        status: 'error',
        error: 'ההודעה גדולה מדי'
      });
    }

    // Send email
    const result = await sendEmail({
      message,
      title,
      userName,
      userEmail
    });

    res.json({
      status: 'success',
      ok: true,
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Email route error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message || 'שליחת אימייל נכשלה'
    });
  }
});

export default router;
