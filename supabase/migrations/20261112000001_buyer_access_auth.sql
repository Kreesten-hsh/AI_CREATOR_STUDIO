-- ============================================================================
-- Migration : 20261112000001_buyer_access_auth.sql
-- Objectif  : Système d'authentification acheteur par E-mail d'achat +
--             Code personnel à usage unique (6 chiffres, hash SHA-256)
--             pour AI CREATOR Studio (Mini-Cours Interactif Claude).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Table des acheteurs autorisés
CREATE TABLE IF NOT EXISTS public.authorized_buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL CHECK (email = lower(btrim(email)) AND length(email) > 3),
  full_name text,
  chariow_order_id text,
  one_time_code_hash text,
  code_used_at timestamptz,
  code_generated_at timestamptz DEFAULT now(),
  activation_count integer NOT NULL DEFAULT 0 CHECK (activation_count >= 0),
  is_revoked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Normalisation automatique de l'adresse e-mail avant INSERT / UPDATE
CREATE OR REPLACE FUNCTION public.normalize_authorized_buyer_email()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.email := lower(btrim(NEW.email));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_authorized_buyer_email ON public.authorized_buyers;
CREATE TRIGGER trg_normalize_authorized_buyer_email
BEFORE INSERT OR UPDATE OF email ON public.authorized_buyers
FOR EACH ROW
EXECUTE FUNCTION public.normalize_authorized_buyer_email();

-- Index pour recherche rapide par e-mail normalisé
CREATE UNIQUE INDEX IF NOT EXISTS idx_authorized_buyers_email_lower
  ON public.authorized_buyers (lower(btrim(email)));

-- 2. Verrouillage RLS strict : aucune lecture ni écriture publique (anon / authenticated)
ALTER TABLE public.authorized_buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorized_buyers FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.authorized_buyers FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.authorized_buyers TO service_role;

-- 3. Fonction utilitaire d'administration (SQL Editor Supabase / service_role)
--    Ajoute ou réinitialise un acheteur ou bêta-testeur en 1 ligne et retourne
--    le code à 6 chiffres en clair pour envoi ou test immédiat.
CREATE OR REPLACE FUNCTION public.register_buyer_with_code(
  p_email text,
  p_order_id text DEFAULT NULL
)
RETURNS TABLE (
  buyer_id uuid,
  email text,
  one_time_code text,
  chariow_order_id text,
  code_generated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_normalized_email text;
  v_raw_code text;
  v_code_hash text;
  v_buyer_id uuid;
  v_order_id text;
  v_generated_at timestamptz := now();
BEGIN
  v_normalized_email := lower(btrim(coalesce(p_email, '')));
  IF v_normalized_email = '' OR position('@' IN v_normalized_email) = 0 THEN
    RAISE EXCEPTION 'Adresse e-mail invalide : %', p_email;
  END IF;

  -- Génère un code aléatoire à 6 chiffres entre 100000 et 999999
  v_raw_code := lpad(
    ((100000 + floor(( ('x' || substr(encode(gen_random_bytes(4), 'hex'), 1, 8))::bit(32)::bigint % 900000 + 900000 ) % 900000))::bigint)::text,
    6,
    '0'
  );
  v_code_hash := encode(digest(v_raw_code, 'sha256'), 'hex');

  INSERT INTO public.authorized_buyers (
    email,
    chariow_order_id,
    one_time_code_hash,
    code_used_at,
    code_generated_at,
    is_revoked
  )
  VALUES (
    v_normalized_email,
    p_order_id,
    v_code_hash,
    NULL,
    v_generated_at,
    false
  )
  ON CONFLICT (email) DO UPDATE
    SET chariow_order_id = COALESCE(EXCLUDED.chariow_order_id, public.authorized_buyers.chariow_order_id),
        one_time_code_hash = EXCLUDED.one_time_code_hash,
        code_used_at = NULL,
        code_generated_at = EXCLUDED.code_generated_at,
        is_revoked = false
  RETURNING
    public.authorized_buyers.id,
    public.authorized_buyers.chariow_order_id
  INTO v_buyer_id, v_order_id;

  RETURN QUERY
  SELECT
    v_buyer_id,
    v_normalized_email,
    v_raw_code,
    v_order_id,
    v_generated_at;
END;
$$;

REVOKE ALL ON FUNCTION public.register_buyer_with_code(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_buyer_with_code(text, text) TO service_role;
