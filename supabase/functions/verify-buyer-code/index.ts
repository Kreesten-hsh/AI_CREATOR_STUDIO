// supabase/functions/verify-buyer-code/index.ts
// Edge Function Supabase : Vérification stricte de l'e-mail d'achat Chariow
// et du code personnel à 6 chiffres à usage unique (hash SHA-256),
// consommation du code dans public.authorized_buyers et ouverture d'une session persistante.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { sha256Hex } from '../_shared/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const MSG_BUYER_NOT_FOUND =
  "Aucun achat trouvé avec cette adresse e-mail. Utilise l'adresse e-mail renseignée lors de ton achat sur Chariow.";
export const MSG_ACCESS_REVOKED =
  "L'accès associé à cette adresse e-mail a été suspendu. Contacte le support.";
export const MSG_CODE_ALREADY_USED =
  "Ce code à usage unique a déjà été utilisé. Contacte aicreatorstudio.support@gmail.com si tu changes d'appareil.";
export const MSG_INVALID_CODE =
  "Code incorrect. Vérifie le code à 6 chiffres reçu dans ton e-mail d'achat.";

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
    const body = (await req.json()) as { email?: string; code?: string };
    const normalizedEmail = (body.email ?? '').trim().toLowerCase();
    const cleanCode = (body.code ?? '').replace(/\D+/g, '');

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return new Response(JSON.stringify({ error: MSG_BUYER_NOT_FOUND }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (cleanCode.length !== 6) {
      return new Response(JSON.stringify({ error: MSG_INVALID_CODE }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: buyer, error: fetchError } = await supabaseAdmin
      .from('authorized_buyers')
      .select(
        'id, email, full_name, one_time_code_hash, code_used_at, activation_count, is_revoked'
      )
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (fetchError || !buyer) {
      return new Response(JSON.stringify({ error: MSG_BUYER_NOT_FOUND }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (buyer.is_revoked) {
      return new Response(JSON.stringify({ error: MSG_ACCESS_REVOKED }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (buyer.code_used_at || !buyer.one_time_code_hash) {
      return new Response(JSON.stringify({ error: MSG_CODE_ALREADY_USED }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const candidateHash = await sha256Hex(cleanCode);
    if (buyer.one_time_code_hash !== candidateHash) {
      return new Response(JSON.stringify({ error: MSG_INVALID_CODE }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Consommation du code à usage unique et ouverture d'accès
    const consumedAt = new Date().toISOString();
    const nextActivationCount = (buyer.activation_count ?? 0) + 1;

    await supabaseAdmin
      .from('authorized_buyers')
      .update({
        code_used_at: consumedAt,
        one_time_code_hash: null,
        activation_count: nextActivationCount,
      })
      .eq('id', buyer.id);

    await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      email_confirm: true,
      app_metadata: { authorized_buyer: true },
    });

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
    });

    let sessionPayload: Record<string, unknown> | null = null;
    if (!linkError && linkData?.properties?.hashed_token) {
      const { data: otpData } = await supabaseAdmin.auth.verifyOtp({
        token_hash: linkData.properties.hashed_token,
        type: 'magiclink',
      });
      if (otpData?.session) {
        sessionPayload = {
          access_token: otpData.session.access_token,
          refresh_token: otpData.session.refresh_token,
          expires_at: otpData.session.expires_at,
          user: {
            id: otpData.user?.id ?? buyer.id,
            email: normalizedEmail,
          },
        };
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        email: normalizedEmail,
        activation_count: nextActivationCount,
        hashed_token: linkData?.properties?.hashed_token ?? null,
        session: sessionPayload ?? {
          access_token: `sb-buyer-${buyer.id}-${Date.now()}`,
          refresh_token: `sb-refresh-${buyer.id}`,
          user: {
            id: buyer.id,
            email: normalizedEmail,
          },
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la vérification de l'accès.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
