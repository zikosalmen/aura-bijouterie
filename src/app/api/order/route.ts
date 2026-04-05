import { NextRequest, NextResponse } from 'next/server';
import { transporter, FROM_EMAIL, TO_EMAIL } from '@/lib/mailer';
import { supabaseServer } from '@/lib/supabaseServer';

// ─── Rate limiter ─────────────────────────────────────────────────────────────
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

// ─── Sanitizer (XSS + header injection) ──────────────────────────────────────
function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;').replace(/[\r\n]/g, '')
    .trim().slice(0, 300);
}

function isValidPhone(phone: string): boolean {
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
}

function isValidUUIDv4(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}

// ─── Type ─────────────────────────────────────────────────────────────────────
type OrderItem = {
  reference: string;
  quantity: number;
  pricePerGram: number;
  weightGrams: number;
  itemTotal: number;
};

// ─── Email HTML ───────────────────────────────────────────────────────────────
function buildOrderEmail(
  prenom: string, nom: string, phone: string,
  items: OrderItem[], total: number, locale: string
): string {
  const isFr = locale !== 'ar';
  const fmt = new Intl.NumberFormat(isFr ? 'fr-MA' : 'ar-MA', {
    style: 'currency', currency: 'TND', maximumFractionDigits: 0,
  });

  // Afficher "DT" au lieu de "TND" (identique à formatPrice côté UI)
  const fmt2 = (amount: number) => fmt.format(amount).replace('TND', 'DT');

  const rows = items.map(it => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #f0e8d8;font-family:Georgia,serif;">
        <strong style="color:#b8860b;">${sanitize(it.reference)}</strong>
      </td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0e8d8;text-align:center;">${it.weightGrams}g</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0e8d8;text-align:center;">${it.quantity}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #f0e8d8;text-align:right;color:#b8860b;font-weight:bold;">
        ${fmt2(it.itemTotal)}
      </td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="${isFr ? 'fr' : 'ar'}">
<head><meta charset="UTF-8"/>
<title>${isFr ? 'Nouvelle Commande' : 'طلب جديد'} — Mezen Bijouterie</title></head>
<body style="margin:0;padding:0;background:#faf8f4;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

  <div style="background:linear-gradient(135deg,#b8860b 0%,#d4af37 50%,#b8860b 100%);padding:40px 32px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:28px;letter-spacing:2px;">💎 Mezen Bijouterie</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,.85);font-size:14px;letter-spacing:1px;">
      ${isFr ? 'NOUVELLE DEMANDE DE COMMANDE' : 'طلب جديد'}
    </p>
  </div>

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

  <div style="padding:32px;">
    <h2 style="margin:0 0 20px;color:#1a1209;font-family:Georgia,serif;font-size:18px;">
      🛍️ ${isFr ? 'Articles Commandés' : 'المنتجات المطلوبة'}
    </h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #f0e8d8;">
      <thead>
        <tr style="background:#fdf6e3;">
          <th style="padding:12px 16px;text-align:left;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">${isFr ? 'Référence' : 'المرجع'}</th>
          <th style="padding:12px 16px;text-align:center;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">${isFr ? 'Grammage' : 'الوزن'}</th>
          <th style="padding:12px 16px;text-align:center;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">${isFr ? 'Qté' : 'الكمية'}</th>
          <th style="padding:12px 16px;text-align:right;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">${isFr ? 'Total' : 'المجموع'}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <div style="padding:0 32px 32px;">
    <div style="background:linear-gradient(135deg,#fffde7,#fff8e1);border:1px solid #d4af37;border-radius:12px;padding:20px 24px;">
      <span style="font-size:18px;font-weight:bold;color:#1a1209;">${isFr ? 'Total Général' : 'المجموع الكلي'}</span>
      <span style="font-size:28px;font-weight:bold;color:#b8860b;font-family:Georgia,serif;float:${isFr ? 'right' : 'left'};">
        ${fmt2(total)}
      </span>
    </div>
  </div>

  <div style="background:#1a1209;padding:24px 32px;text-align:center;">
    <p style="margin:0;color:#d4af37;font-family:Georgia,serif;font-size:13px;letter-spacing:1px;">
      Mezen Bijouterie · ${isFr ? 'Création de prestige' : 'إبداع فاخر'}
    </p>
  </div>
</div>
</body></html>`;
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip))
    return NextResponse.json({ error: 'Trop de requêtes. Veuillez patienter.' }, { status: 429 });

  // 2. Parse body
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 }); }

  // 3. Validate inputs
  const prenom      = sanitize(body.prenom);
  const nom         = sanitize(body.nom);
  const phone       = sanitize(body.phone);
  const locale      = sanitize(body.locale) || 'fr';
  const browserUuid = sanitize(body.browserUuid);

  if (!prenom || prenom.length < 2)
    return NextResponse.json({ error: 'Prénom invalide.' }, { status: 422 });
  if (!nom || nom.length < 2)
    return NextResponse.json({ error: 'Nom invalide.' }, { status: 422 });
  if (!phone || !isValidPhone(phone))
    return NextResponse.json({ error: 'Numéro de téléphone invalide.' }, { status: 422 });

  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0)
    return NextResponse.json({ error: 'Panier vide.' }, { status: 422 });

  // 4. Build structured items
  const items: OrderItem[] = rawItems
    .map((item: unknown) => {
      if (typeof item !== 'object' || item === null) return null;
      const i = item as Record<string, unknown>;
      const weightGrams  = parseFloat(String(i.weightGrams))  || 0;
      const pricePerGram = parseFloat(String(i.pricePerGram)) || 0;
      const quantity     = Math.max(1, Math.min(99, parseInt(String(i.quantity)) || 1));
      return {
        reference:   sanitize(i.reference),
        quantity,
        pricePerGram,
        weightGrams,
        itemTotal: weightGrams * pricePerGram * quantity,
      };
    })
    .filter(Boolean) as OrderItem[];

  if (items.length === 0)
    return NextResponse.json({ error: 'Articles invalides.' }, { status: 422 });

  const total = items.reduce((sum, it) => sum + it.itemTotal, 0);

  // ════════════════════════════════════════════════════════════════
  // 5. SUPABASE — Upsert customer (nouveau ou récurrent)
  // ════════════════════════════════════════════════════════════════
  let customerId: number | null = null;
  try {
    const { data: customerData, error: customerError } = await supabaseServer
      .from('customers')
      .upsert(
        {
          ...(isValidUUIDv4(browserUuid) ? { uuid: browserUuid } : {}),
          phone,
          prenom,
          nom,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'phone',  // si même téléphone → UPDATE
          ignoreDuplicates: false,
        }
      )
      .select('id')
      .single();

    if (customerError) {
      console.error('[Order API] ❌ Erreur upsert customer:', customerError.message);
    } else {
      customerId = customerData?.id ?? null;
      console.log(`[Order API] ✅ Customer upserted — id=${customerId} phone=${phone}`);
    }
  } catch (err) {
    console.error('[Order API] ❌ Exception Supabase customer:', err);
  }

  // ════════════════════════════════════════════════════════════════
  // 6. SUPABASE — Insert order (toujours une nouvelle ligne)
  // ════════════════════════════════════════════════════════════════
  let orderDbId: number | null = null;
  try {
    const { data: orderData, error: orderError } = await supabaseServer
      .from('orders')
      .insert({
        customer_id: customerId,
        prenom, nom, phone,
        items: items,
        total_mad: total,
        locale,
        status: 'pending',
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('[Order API] ❌ Erreur insert order:', orderError.message);
    } else {
      orderDbId = orderData?.id ?? null;
      console.log(`[Order API] ✅ Commande enregistrée — order_id=${orderDbId} total=${total} MAD`);
    }
  } catch (err) {
    console.error('[Order API] ❌ Exception Supabase order:', err);
  }

  // ════════════════════════════════════════════════════════════════
  // 7. SMTP — Envoyer l'email (si ça rate → 500, DB est déjà sauvé)
  // ════════════════════════════════════════════════════════════════
  const isFr = locale !== 'ar';
  try {
    await transporter.sendMail({
      from:    `"Mezen Bijouterie" <${FROM_EMAIL}>`,
      to:      TO_EMAIL,
      subject: isFr
        ? `💎 Nouvelle commande — ${prenom} ${nom}`
        : `💎 طلب جديد — ${prenom} ${nom}`,
      html: buildOrderEmail(prenom, nom, phone, items, total, locale),
    });
    console.log(`[Order API] ✅ Email envoyé à ${TO_EMAIL}`);
  } catch (emailErr) {
    console.error('[Order API] ❌ Erreur SMTP:', emailErr);
    // La commande est déjà dans Supabase, on retourne quand même succès
    // mais avec un avertissement pour que l'admin sache
    return NextResponse.json(
      { success: true, warning: 'Commande enregistrée mais email non envoyé. Vérifiez votre config SMTP.' },
      { status: 200 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Commande envoyée et enregistrée avec succès !',
    orderId: orderDbId,
  });
}
