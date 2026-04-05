/**
 * Shared Nodemailer SMTP transporter
 * Config is read from environment variables — never exposed to the client.
 *
 * Required .env.local variables:
 *   SMTP_HOST        e.g. smtp.gmail.com
 *   SMTP_PORT        e.g. 587
 *   SMTP_USER        e.g. auramezen@gmail.com
 *   SMTP_PASS        Gmail App Password (NOT your regular password)
 *   ORDER_FROM_EMAIL e.g. auramezen@gmail.com
 *   ORDER_TO_EMAIL   e.g. salmenzekri680@gmail.com
 */

import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for port 465 (SSL), false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: true, // enforce valid certificates
  },
});

export const FROM_EMAIL = process.env.ORDER_FROM_EMAIL || process.env.SMTP_USER || '';
export const TO_EMAIL   = process.env.ORDER_TO_EMAIL   || '';
