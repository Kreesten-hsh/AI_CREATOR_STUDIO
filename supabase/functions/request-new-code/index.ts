// supabase/functions/request-new-code/index.ts
// Edge Function Supabase : Permet à un acheteur autorisé existant
// de recevoir un nouveau code personnel à 6 chiffres à usage unique par mail
// (avec rate-limit anti-abus), envoyé via Gmail SMTP ("Bonjour Boss,").

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { generateSixDigitCode, sha256Hex } from '../_shared/crypto.ts';
import {
  DEFAULT_SMTP_USER,
  DEFAULT_STUDIO_URL,
  sendBuyerCodeEmail,
} from '../_shared/sendBuyerEmail.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const RATE_LIMIT_SECONDS = 60;
const CONFIRMATION_MESSAGE =
  "Si un achat est associé à cet e-mail, un nouveau code à usage unique vient de t'être envoyé.";

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

  try {
    const body = (await req.json()) as { email?: string };
    const normalizedEmail = (body.email ?? '').trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return new Response(
        JSON.stringify({
          error: "Saisis d'abord l'adresse e-mail utilisée lors de ton achat.",
        }),
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

    const { data: buyer } = await supabaseAdmin
      .from('authorized_buyers')
      .select('id, email, full_name, code_generated_at, is_revoked')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (!buyer || buyer.is_revoked) {
      return new Response(
        JSON.stringify({
          ok: true,
          message: CONFIRMATION_MESSAGE,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (buyer.code_generated_at) {
      const elapsedSeconds =
        (Date.now() - new Date(buyer.code_generated_at).getTime()) / 1000;
      if (elapsedSeconds < RATE_LIMIT_SECONDS) {
        return new Response(
          JSON.stringify({
            error: 'Un code vient déjà de t’être envoyé. Patiente une minute avant de réessayer.',
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    const newCode = generateSixDigitCode();
    const newCodeHash = await sha256Hex(newCode);
    const nowIso = new Date().toISOString();

    await supabaseAdmin
      .from('authorized_buyers')
      .update({
        one_time_code_hash: newCodeHash,
        code_used_at: null,
        code_generated_at: nowIso,
      })
      .eq('id', buyer.id);

    const emailResult = await sendBuyerCodeEmail({
      recipientEmail: normalizedEmail,
      oneTimeCode: newCode,
      studioUrl: Deno.env.get('STUDIO_PUBLIC_URL') || DEFAULT_STUDIO_URL,
      smtpUser: Deno.env.get('SMTP_USER') || Deno.env.get('SMTP_USERNAME') || DEFAULT_SMTP_USER,
      smtpPassword:
        Deno.env.get('SMTP_PASSWORD') || Deno.env.get('GMAIL_APP_PASSWORD') || '',
      resendApiKey: Deno.env.get('RESEND_API_KEY') || '',
      isRenewal: true,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        emailSent: emailResult.sent,
        message: CONFIRMATION_MESSAGE,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de l'envoi du nouveau code.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
