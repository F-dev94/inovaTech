-- =======================================================
-- SCHEMA SUPABASE AJUSTADO PARA PROJETO INOVATECH / TROCAJÁ
-- Project URL: https://crskevhapqwmnvsvvmwe.supabase.co
-- Senha Padrão de Todos os Usuários: 1a2b3c
-- Executar no SQL Editor do Supabase Dashboard
-- =======================================================

-- Habilitar extensões pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABELA DE PERFIS DE USUÁRIOS (CLIENTES & ADMINS)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT DEFAULT '1a2b3c', -- Senha padrão requerida: 1a2b3c
  user_role TEXT DEFAULT 'locador', -- 'locador', 'locatario', 'lojista', 'suporte', 'seguranca', 'financeiro', 'admin'
  avatar_url TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  pro_subscription_status TEXT DEFAULT 'INATIVA',
  kyc_status TEXT DEFAULT 'APROVADO',
  biometric_hash TEXT,
  cep TEXT,
  city TEXT DEFAULT 'Ribeirão Preto',
  state TEXT DEFAULT 'SP',
  neighborhood TEXT,
  rating NUMERIC(3,2) DEFAULT 5.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INSERIR USUÁRIOS DEMO COM SENHA PADRÃO "1a2b3c"
INSERT INTO public.profiles (name, email, password_hash, user_role, is_pro, city, rating)
VALUES 
  ('Carlos Menezes', 'carlos@trocaja.app', '1a2b3c', 'locador', false, 'Ribeirão Preto', 4.90),
  ('Bianca Ferreira', 'bianca@trocaja.app', '1a2b3c', 'locatario', false, 'Cravinhos', 5.00),
  ('Antenor Silva (Ferragens Silva)', 'antenor@trocaja.app', '1a2b3c', 'lojista', true, 'Ribeirão Preto', 5.00),
  ('Diego Farias', 'diego@trocaja.app', '1a2b3c', 'locatario', false, 'Sertãozinho', 4.80),
  ('Camila Torres', 'camila@trocaja.app', '1a2b3c', 'suporte', false, 'Ribeirão Preto', 5.00),
  ('Lucas Andrade', 'lucas@trocaja.app', '1a2b3c', 'seguranca', false, 'Ribeirão Preto', 5.00),
  ('Patrícia Nogueira', 'patricia@trocaja.app', '1a2b3c', 'financeiro', false, 'Ribeirão Preto', 5.00),
  ('Renata Bicalho', 'renata@trocaja.app', '1a2b3c', 'admin', false, 'Ribeirão Preto', 5.00)
ON CONFLICT (email) DO NOTHING;

-- 2. TABELA DE ITENS / ANÚNCIOS COM CEP E LOCALIDADE
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_day NUMERIC(10,2) NOT NULL,
  deposit_amount NUMERIC(10,2) NOT NULL,
  cep TEXT DEFAULT '14010-000',
  city TEXT NOT NULL DEFAULT 'Ribeirão Preto',
  neighborhood TEXT DEFAULT 'Centro',
  state TEXT DEFAULT 'SP',
  distance_km NUMERIC(5,2) DEFAULT 2.4,
  image_url TEXT NOT NULL,
  is_boosted BOOLEAN DEFAULT FALSE,
  is_sensitive BOOLEAN DEFAULT FALSE,
  sensitive_doc_status TEXT DEFAULT 'ISENTO',
  sensitive_doc_url TEXT,
  rating NUMERIC(3,2) DEFAULT 5.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE ITENS SALVOS / FAVORITOS (CLIENTE & ADMIN)
CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- 4. TABELA DE HISTÓRICO DE ITENS & LOCAÇÕES (CLIENTE & ADMIN)
CREATE TABLE IF NOT EXISTS public.item_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'ANUNCIADO', 'ALUGADO', 'DEVOLVIDO', 'DISPUTADO'
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE ATENDIMENTO DE SUPORTE (CHAT DIRETO ATENDENTE CAMILA <-> CLIENTE)
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  sender_id UUID REFERENCES public.profiles(id),
  sender_name TEXT NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id),
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE DOCUMENTAÇÃO PARA IMPORTADORA & LOGÍSTICA DE COMPONENTES
CREATE TABLE IF NOT EXISTS public.import_export_docs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.profiles(id),
  importer_name TEXT DEFAULT 'Importadora & Logística Brasil S/A',
  customs_code TEXT NOT NULL, -- Código de NCM / Despacho Aduaneiro
  status TEXT DEFAULT 'EM_PROCESSO', -- 'EM_PROCESSO', 'APROVADO_IMPORTADORA'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELA DE RESERVAS & CHECKOUT
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  renter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INT NOT NULL,
  daily_rate NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  insurance_fee NUMERIC(10,2) NOT NULL,
  commission_rate NUMERIC(4,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL,
  deposit_amount NUMERIC(10,2) NOT NULL,
  total_paid NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'CONFIRMADA',
  payout_status TEXT DEFAULT 'PENDENTE_PIX',
  nfe_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- POLÍTICAS RLS (ROW LEVEL SECURITY)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura geral de perfis" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Permitir leitura geral de anúncios" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Permitir favoritos" ON public.saved_items FOR ALL USING (true);
CREATE POLICY "Permitir mensagens de suporte" ON public.support_messages FOR ALL USING (true);
