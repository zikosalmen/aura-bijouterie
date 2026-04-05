import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Rate limiter (shared pattern with order route) ──────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '60') * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ─── Input sanitizer ────────────────────────────────────────────────────────
function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/[\r\n]/g, ' ') // Allow newlines in message (as space, not injection)
    .trim()
    .slice(0, 1000);
}

function sanitizeName(value: unknown): string {
  return sanitize(value).slice(0, 100).replace(/[\r\n]/g, '');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length < 200;
}

function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Optional in contact form
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
}

function buildContactEmail(
  nom: string,
  email: string,
  phone: string,
  message: string,
  locale: string
): string {
  const isFr = locale !== 'ar';
  return `<!DOCTYPE html>
<html lang="${isFr ? 'fr' : 'ar'}">
<head><meta charset="UTF-8"/><title>${isFr ? 'Nouveau message Contact' : 'رسالة جديدة'}</title></head>
<body style="margin:0;padding:0;background:#faf8f4;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
    <div style="background:linear-gradient(135deg,#b8860b 0%,#d4af37 50%,#b8860b 100%);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:28px;letter-spacing:2px;">💎 Mezen Bijouterie</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,.85);font-size:14px;letter-spacing:1px;">
        ${isFr ? 'NOUVEAU MESSAGE DE CONTACT' : 'رسالة تواصل جديدة'}
      </p>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;color:#888;font-size:13px;width:35%;">${isFr ? 'Nom' : 'الاسم'}</td>
          <td style="padding:10px 0;font-weight:bold;color:#1a1209;">${nom}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#888;font-size:13px;">Email</td>
          <td style="padding:10px 0;font-weight:bold;color:#1a1209;">${email}</td>
        </tr>
        ${phone ? `
        <tr>
          <td style="padding:10px 0;color:#888;font-size:13px;">${isFr ? 'Téléphone' : 'الهاتف'}</td>
          <td style="padding:10px 0;font-weight:bold;color:#1a1209;">${phone}</td>
        </tr>` : ''}
      </table>
      <div style="margin-top:24px;padding:20px;background:#fffdf9;border:1px solid #f0e8d8;border-radius:12px;">
        <p style="margin:0 0 8px;color:#888;font-size:12px;letter-spacing:1px;text-transform:uppercase;">
          ${isFr ? 'Message' : 'الرسالة'}
        </p>
        <p style="margin:0;color:#1a1209;line-height:1.7;white-space:pre-wrap;">${message}</p>
      </div>
    </div>
    <div style="background:#1a1209;padding:24px 32px;text-align:center;">
      <p style="margin:0;color:#d4af37;font-family:Georgia,serif;font-size:13px;letter-spacing:1px;">
        Mezen Bijouterie · ${isFr ? 'Création de prestige' : 'إبداع فاخر'}
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  // Rate limit
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Trop de requêtes. Veuillez patienter.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const nom = sanitizeName(body.nom);
  const email = sanitize(body.email).replace(/[\r\n]/g, '');
  const phone = sanitizeName(body.phone);
  const message = sanitize(body.message);
  const locale = sanitize(body.locale) || 'fr';

  if (!nom || nom.length < 2) {
    return NextResponse.json({ error: 'Nom invalide.' }, { status: 422 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Email invalide.' }, { status: 422 });
  }
  if (phone && !isValidPhone(phone)) {
    return NextResponse.json({ error: 'Numéro de téléphone invalide.' }, { status: 422 });
  }
  if (!message || message.length < 5) {
    return NextResponse.json({ error: 'Message trop court.' }, { status: 422 });
  }

  const toEmail = process.env.ORDER_TO_EMAIL || 'salmenzekri680@gmail.com';
  const fromEmail = process.env.ORDER_FROM_EMAIL || 'onboarding@resend.dev';
  const isFr = locale !== 'ar';

  try {
    const { error: emailError } = await resend.emails.send({
      from: `Mezen Bijouterie <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: isFr ? `✉️ Message de ${nom}` : `✉️ رسالة من ${nom}`,
      html: buildContactEmail(nom, email, phone, message, locale),
    });

    if (emailError) {
      console.error('[Contact API] Resend error:', emailError);
      return NextResponse.json({ error: 'Erreur lors de l\'envoi.' }, { status: 500 });
    }
  } catch (err) {
    console.error('[Contact API] Exception:', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Message envoyé avec succès !' });
}
