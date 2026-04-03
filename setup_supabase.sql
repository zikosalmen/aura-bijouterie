-- ============================================================
-- SCHEMA SUPABASE — Mezen Bijouterie
-- À exécuter dans Supabase > SQL Editor > New Query
-- ============================================================

-- ─── 1. TABLE PRODUCTS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id            text PRIMARY KEY,
  reference     text NOT NULL,
  description   text,
  category      text,
  "subCategory" text,
  images        text[],
  "weightGrams" numeric,
  "pricePerGram" numeric,
  "dateAdded"   timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Lecture publique (tout le monde peut lire)
DROP POLICY IF EXISTS "products_public_read" ON public.products;
CREATE POLICY "products_public_read"
  ON public.products FOR SELECT
  USING (true);

-- Écriture réservée au service_role (backend uniquement)
DROP POLICY IF EXISTS "products_service_write" ON public.products;
CREATE POLICY "products_service_write"
  ON public.products FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ─── 2. TABLE ORDERS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  items         jsonb NOT NULL DEFAULT '[]',
  total_price   numeric NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- RLS sur orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Chaque utilisateur ne voit que ses propres commandes
DROP POLICY IF EXISTS "orders_user_select" ON public.orders;
CREATE POLICY "orders_user_select"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Un utilisateur authentifié peut créer une commande pour lui-même
DROP POLICY IF EXISTS "orders_user_insert" ON public.orders;
CREATE POLICY "orders_user_insert"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role : accès total
DROP POLICY IF EXISTS "orders_service_all" ON public.orders;
CREATE POLICY "orders_service_all"
  ON public.orders FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ─── 3. INDEX (performances) ────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category     ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_sub_category ON public.products("subCategory");
CREATE INDEX IF NOT EXISTS idx_products_date_added   ON public.products("dateAdded" DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id        ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at     ON public.orders(created_at DESC);

-- ─── FIN ─────────────────────────────────────────────────────
