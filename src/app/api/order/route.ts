import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseServer } from '@/lib/supabaseServer';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── In-memory rate limiter (per IP) ─────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3; // max requests
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

// ─── Input sanitizer (prevent XSS / header injection) ──────────────────────
function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Prevent email header injection
    .replace(/[\r\n]/g, '')
    .trim()
    .slice(0, 300);
}

// ─── Phone validator ────────────────────────────────────────────────────────
function isValidPhone(phone: string): boolean {
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
}

// ─── HTML email template ────────────────────────────────────────────────────
function buildOrderEmail(
  prenom: string,
  nom: string,
  phone: string,
  items: Array<{ reference: string; quantity: number; pricePerGram: number; weightGrams: number }>,
  total: number,
  locale: string
): string {
  const isFr = locale !== 'ar';
  const currency = new Intl.NumberFormat(isFr ? 'fr-MA' : 'ar-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  });

  const itemsHTML = items
    .map((item) => {
      const itemTotal = item.weightGrams * item.pricePerGram * item.quantity;
      return `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #f0e8d8;font-family:Georgia,serif;letter-spacing:.5px;">
            <strong style="color:#b8860b;">${sanitize(item.reference)}</strong>
          </td>
          <td style="padding:10px 16px;border-bottom:1px solid #f0e8d8;text-align:center;">${item.weightGrams}g</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f0e8d8;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f0e8d8;text-align:right;color:#b8860b;font-weight:bold;">
            ${currency.format(itemTotal)}
          </td>
        </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="${isFr ? 'fr' : 'ar'}">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${isFr ? 'Nouvelle Commande' : 'طلب جديد'} — Mezen Bijouterie</title></head>
<body style="margin:0;padding:0;background:#faf8f4;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#b8860b 0%,#d4af37 50%,#b8860b 100%);padding:40px 32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:28px;letter-spacing:2px;">
        💎 Mezen Bijouterie
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,.85);font-size:14px;letter-spacing:1px;">
        ${isFr ? 'NOUVELLE DEMANDE DE COMMANDE' : 'طلب جديد'}
      </p>
    </div>

    <!-- Customer info -->
    <div style="padding:32px;background:#fffdf9;border-bottom:1px solid #f0e8d8;">
      <h2 style="margin:0 0 20px;color:#1a1209;font-family:Georgia,serif;font-size:18px;">
        ${isFr ? '👤 Informations Client' : '👤 معلومات العميل'}
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;width:40%;">${isFr ? 'Nom complet' : 'الاسم الكامل'}</td>
          <td style="padding:8px 0;font-weight:bold;color:#1a1209;">${prenom} ${nom}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;">${isFr ? 'Téléphone' : 'الهاتف'}</td>
          <td style="padding:8px 0;font-weight:bold;color:#1a1209;">${phone}</td>
        </tr>
      </table>
    </div>

    <!-- Order items -->
    <div style="padding:32px;">
      <h2 style="margin:0 0 20px;color:#1a1209;font-family:Georgia,serif;font-size:18px;">
        🛍️ ${isFr ? 'Articles Commandés' : 'المنتجات المطلوبة'}
      </h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #f0e8d8;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#fdf6e3;">
            <th style="padding:12px 16px;text-align:left;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">${isFr ? 'Référence' : 'المرجع'}</th>
            <th style="padding:12px 16px;text-align:center;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">${isFr ? 'Grammage' : 'الوزن'}</th>
            <th style="padding:12px 16px;text-align:center;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">${isFr ? 'Qté' : 'الكمية'}</th>
            <th style="padding:12px 16px;text-align:right;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">${isFr ? 'Total' : 'المجموع'}</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
    </div>

    <!-- Total -->
    <div style="padding:0 32px 32px;">
      <div style="background:linear-gradient(135deg,#fffde7,#fff8e1);border:1px solid #d4af37;border-radius:12px;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:18px;font-weight:bold;color:#1a1209;">${isFr ? 'Total Général' : 'المجموع الكلي'}</span>
        <span style="font-size:28px;font-weight:bold;color:#b8860b;font-family:Georgia,serif;">${currency.format(total)}</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#1a1209;padding:24px 32px;text-align:center;">
      <p style="margin:0;color:#d4af37;font-family:Georgia,serif;font-size:13px;letter-spacing:1px;">
        Mezen Bijouterie · ${isFr ? 'Création de prestige' : 'إبداع فاخر'}
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── POST Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // --- Rate limiting ---
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  // --- Parse & validate body ---
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const prenom = sanitize(body.prenom);
  const nom = sanitize(body.nom);
  const phone = sanitize(body.phone);
  const locale = sanitize(body.locale) || 'fr';
  const browserUuid = sanitize(body.browserUuid);
  // Validate UUID format (must be v4 style)
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(browserUuid);

  if (!prenom || prenom.length < 2) {
    return NextResponse.json({ error: 'Prénom invalide.' }, { status: 422 });
  }
  if (!nom || nom.length < 2) {
    return NextResponse.json({ error: 'Nom invalide.' }, { status: 422 });
  }
  if (!phone || !isValidPhone(phone)) {
    return NextResponse.json({ error: 'Numéro de téléphone invalide.' }, { status: 422 });
  }

  // Validate items
  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ error: 'Panier vide.' }, { status: 422 });
  }

  const items = rawItems
    .map((item: unknown) => {
      if (typeof item !== 'object' || item === null) return null;
      const i = item as Record<string, unknown>;
      return {
        reference: sanitize(i.reference),
        quantity: Math.max(1, Math.min(99, parseInt(String(i.quantity)) || 1)),
        pricePerGram: parseFloat(String(i.pricePerGram)) || 0,
        weightGrams: parseFloat(String(i.weightGrams)) || 0,
      };
    })
    .filter(Boolean) as Array<{
      reference: string;
      quantity: number;
      pricePerGram: number;
      weightGrams: number;
    }>;

  if (items.length === 0) {
    return NextResponse.json({ error: 'Articles invalides.' }, { status: 422 });
  }

  const total = items.reduce(
    (sum, item) => sum + item.weightGrams * item.pricePerGram * item.quantity,
    0
  );

  // --- Upsert customer in Supabase ---
  try {
    const { error: dbError } = await supabaseServer
      .from('customers')
      .upsert(
        {
          // uuid: stored if valid, otherwise DB generates one
          ...(isValidUUID ? { uuid: browserUuid } : {}),
          phone,
          prenom,
          nom,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'phone' }
      );

    if (dbError) {
      console.error('[Order API] Supabase upsert error:', dbError);
      // Non-fatal: continue with email even if DB fails
    }
  } catch (dbErr) {
    console.error('[Order API] Supabase exception:', dbErr);
  }

  // --- Send email ---
  const fromEmail = process.env.ORDER_FROM_EMAIL || 'onboarding@resend.dev';
  const toEmail = process.env.ORDER_TO_EMAIL || 'salmenzekri680@gmail.com';

  const isFr = locale !== 'ar';
  const emailHtml = buildOrderEmail(prenom, nom, phone, items, total, locale);

  try {
    const { error: emailError } = await resend.emails.send({
      from: `Mezen Bijouterie <${fromEmail}>`,
      to: [toEmail],
      subject: isFr
        ? `💎 Nouvelle commande — ${prenom} ${nom}`
        : `💎 طلب جديد — ${prenom} ${nom}`,
      html: emailHtml,
      replyTo: undefined,
    });

    if (emailError) {
      console.error('[Order API] Resend error:', emailError);
      return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email.' }, { status: 500 });
    }
  } catch (emailErr) {
    console.error('[Order API] Email exception:', emailErr);
    return NextResponse.json({ error: 'Erreur serveur. Réessayez.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Commande envoyée avec succès !' });
}
