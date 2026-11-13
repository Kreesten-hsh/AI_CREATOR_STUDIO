// supabase/functions/chariow-webhook/index.ts
// Edge Function Supabase : Réception du webhook / Pulse Chariow,
// génération d'un code personnel à 6 chiffres à usage unique (SHA-256),
// enregistrement dans public.authorized_buyers, préparation auth.users
// et envoi immédiat de l'e-mail d'accès ("Bonjour Boss,") via Gmail SMTP.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { generateSixDigitCode, sha256Hex } from '../_shared/crypto.ts';
import {
  DEFAULT_SMTP_USER,
  DEFAULT_STUDIO_URL,
  sendBuyerCodeEmail,
} from '../_shared/sendBuyerEmail.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-chariow-secret, x-webhook-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const DEFAULT_CHARIOW_SECRET = 'mon_secret_chariow_2026';

function extractBuyerPayload(body: Record<string, unknown>): {
  email: string;
  fullName: string | null;
  orderId: string | null;
} {
  const data =
    body.data && typeof body.data === 'object'
      ? (body.data as Record<string, unknown>)
      : body;
  const customer =
    data.customer && typeof data.customer === 'object'
      ? (data.customer as Record<string, unknown>)
      : body.customer && typeof body.customer === 'object'
      ? (body.customer as Record<string, unknown>)
      : {};

  const rawEmail =
    (typeof data.email === 'string' && data.email) ||
    (typeof customer.email === 'string' && customer.email) ||
    (typeof body.email === 'string' && body.email) ||
    (typeof data.buyer_email === 'string' && data.buyer_email) ||
    '';

  const rawName =
    (typeof customer.full_name === 'string' && customer.full_name) ||
    (typeof customer.name === 'string' && customer.name) ||
    (typeof data.full_name === 'string' && data.full_name) ||
    (typeof body.full_name === 'string' && body.full_name) ||
    null;

  const rawOrderId =
    (typeof data.id === 'string' && data.id) ||
    (typeof data.order_id === 'string' && data.order_id) ||
    (typeof body.order_id === 'string' && body.order_id) ||
    (typeof body.id === 'string' && body.id) ||
    null;

  return {
    email: rawEmail.trim().toLowerCase(),
    fullName: rawName ? rawName.trim() : null,
    orderId: rawOrderId ? rawOrderId.trim() : null,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée.' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const webhookSecret = Deno.env.get('CHARIOW_WEBHOOK_SECRET') || DEFAULT_CHARIOW_SECRET;
  const providedSecret =
    req.headers.get('x-chariow-secret') ||
    req.headers.get('x-webhook-secret') ||
    url.searchParams.get('secret') ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  const isChariowPulse =
    Boolean(req.headers.get('x-pulse-event')) ||
    Boolean(req.headers.get('x-pulse-id')) ||
    Boolean(req.headers.get('x-chariow-signature')) ||
    (req.headers.get('user-agent')?.includes('Chariow') ?? false);

  const isAuthorized =
    isChariowPulse ||
    (webhookSecret && providedSecret === webhookSecret);

  if (!isAuthorized) {
    return new Response(JSON.stringify({ error: 'Signature webhook Chariow invalide.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const rawBody = (await req.json()) as Record<string, unknown>;
    const { email, fullName, orderId } = extractBuyerPayload(rawBody);

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Adresse e-mail de l'acheteur manquante ou invalide." }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const oneTimeCode = generateSixDigitCode();
    const oneTimeCodeHash = await sha256Hex(oneTimeCode);
    const nowIso = new Date().toISOString();

    const { error: upsertError } = await supabaseAdmin.from('authorized_buyers').upsert(
      {
        email,
        full_name: fullName,
        chariow_order_id: orderId,
        one_time_code_hash: oneTimeCodeHash,
        code_used_at: null,
        code_generated_at: nowIso,
        is_revoked: false,
      },
      { onConflict: 'email' }
    );

    if (upsertError) {
      return new Response(
        JSON.stringify({ error: "Impossible d'enregistrer l'acheteur.", details: upsertError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: fullName ? { full_name: fullName } : undefined,
      app_metadata: { authorized_buyer: true, chariow_order_id: orderId },
    });

    const emailResult = await sendBuyerCodeEmail({
      recipientEmail: email,
      oneTimeCode,
      studioUrl: Deno.env.get('STUDIO_PUBLIC_URL') || DEFAULT_STUDIO_URL,
      smtpUser: Deno.env.get('SMTP_USER') || Deno.env.get('SMTP_USERNAME') || DEFAULT_SMTP_USER,
      smtpPassword:
        Deno.env.get('SMTP_PASSWORD') || Deno.env.get('GMAIL_APP_PASSWORD') || '',
      resendApiKey: Deno.env.get('RESEND_API_KEY') || '',
    });

    return new Response(
      JSON.stringify({
        ok: true,
        email,
        emailSent: emailResult.sent,
        emailProvider: emailResult.provider,
        ...(emailResult.error ? { emailError: emailResult.error } : {}),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur interne du webhook.';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
