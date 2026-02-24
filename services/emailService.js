import nodemailer from 'nodemailer';

/**
 * Email service for sending emails
 * Based on fromMKBack/mailHandler.js
 */

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_USER || 'username',
    pass: process.env.SMTP_PASS || 'password',
  },
});

/**
 * Escape HTML special characters
 */
const escapeHtml = (unsafe) => {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Send email with message
 * @param {Object} params - Email parameters
 * @param {string} params.message - Email message body
 * @param {string} params.title - Email title/subject
 * @param {string} params.userName - Sender name (optional)
 * @param {string} params.userEmail - Sender email for Reply-To (optional)
 * @returns {Promise<Object>} - Send result
 */
export const sendEmail = async ({ message, title, userName, userEmail }) => {
  try {
    // Validate message
    if (typeof message !== 'string' || message.length === 0) {
      throw new Error('נדרש תוכן הודעה');
    }

    if (message.length > 100000) {
      throw new Error('ההודעה גדולה מדי');
    }

    // Process message and title
    let cleanMessage = message.trim();
    let emailTitle = title || '';

    // If title not provided, try to extract from first line of message
    if (!emailTitle || !emailTitle.trim()) {
      const firstLine = cleanMessage.split(/\n/)[0].trim();
      if (firstLine && firstLine.length > 0 && firstLine.length < 200) {
        emailTitle = firstLine;
        cleanMessage = cleanMessage.substring(firstLine.length).trim();
        cleanMessage = cleanMessage.replace(/^[\n\r\s]+/, '').trim();
      }
    } else {
      // If title is provided separately, remove it from message start if present
      const titleTrimmed = emailTitle.trim();
      const titleEscaped = titleTrimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const titleRegex = new RegExp(`^\\s*${titleEscaped}\\s*[\n\r]+`, 'i');
      const titleRegexStart = new RegExp(`^\\s*${titleEscaped}\\s*`, 'i');

      if (titleRegex.test(cleanMessage)) {
        cleanMessage = cleanMessage.replace(titleRegex, '').trim();
      } else if (cleanMessage.startsWith(titleTrimmed)) {
        cleanMessage = cleanMessage.replace(titleRegexStart, '').trim();
      }

      const lines = cleanMessage.split(/\n/);
      if (lines.length > 0 && lines[0].trim() === titleTrimmed) {
        cleanMessage = lines.slice(1).join('\n').trim();
      }
    }

    // Format current date and time
    const now = new Date();
    const dateTimeString = now.toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jerusalem'
    });

    // Use provided userName or default
    const senderName = userName || 'משתמש';

    // Format plain text content
    let textContent = `שם הפונה: ${senderName}\n`;
    textContent += `כותרת: ${emailTitle || ''}\n`;
    textContent += `זמן פניה: ${dateTimeString}\n\n`;
    textContent += cleanMessage;

    // Format HTML content
    let htmlContent = '<div dir="rtl" style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">';
    htmlContent += `<div style="direction: rtl; text-align: right; padding-bottom: 15px; margin-bottom: 20px; border-bottom: 2px solid #e0e0e0; color: #333; font-size: 14px; line-height: 1.8;">`;
    htmlContent += `<div><strong>שם הפונה:</strong> ${escapeHtml(senderName)}</div>`;
    htmlContent += `<div><strong>כותרת:</strong> ${escapeHtml(emailTitle || '')}</div>`;
    htmlContent += `<div><strong>זמן פניה:</strong> ${dateTimeString}</div>`;
    htmlContent += `</div>`;
    htmlContent += `<div style="direction: rtl; text-align: right; line-height: 1.6; margin-top: 20px;">${escapeHtml(cleanMessage).replace(/\n/g, '<br/>')}</div>`;
    htmlContent += '</div>';

    // Prepare mail options
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@mikuderech.local',
      to: process.env.SMTP_TO || 'test@example.com',
      subject: emailTitle || process.env.SMTP_SUBJECT || 'פניה לתמיכה מאתר מיקודרך',
      text: textContent,
      html: htmlContent,
    };

    // Add Reply-To if user email is provided
    if (userEmail) {
      mailOptions.replyTo = userEmail;
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', {
      messageId: info.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Email send failed:', error.message);
    throw error;
  }
};

export default {
  sendEmail
};
