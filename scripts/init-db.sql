-- ============================================
-- SCRIPT DE INICIALIZAÇÃO DO BANCO DE DADOS
-- ============================================
-- Execute este arquivo no seu banco Neon para criar todas as tabelas necessárias
-- Comando: psql -U user -d database -f scripts/init-db.sql
-- Ou copie e cole cada query no console do Neon

-- ============================================
-- TABELAS DO BETTER AUTH
-- ============================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  image TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela de sessões
CREATE TABLE IF NOT EXISTS "session" (
  id TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMP NOT NULL,
  token TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

-- Tabela de contas (para OAuth ou outras provedoras)
CREATE TABLE IF NOT EXISTS "account" (
  id TEXT PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  scope TEXT,
  password TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela de verificação de e-mail
CREATE TABLE IF NOT EXISTS "verification" (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA DA GALERIA
-- ============================================

-- Tabela de itens da galeria (fotos, documentos, desenhos, etc)
CREATE TABLE IF NOT EXISTS "gallery_items" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date_period TEXT,
  tags TEXT[],
  image_url TEXT NOT NULL,
  image_key TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- ÍNDICES (Melhoram performance nas buscas)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_session_userId ON "session"("userId");
CREATE INDEX IF NOT EXISTS idx_session_token ON "session"(token);
CREATE INDEX IF NOT EXISTS idx_account_userId ON "account"("userId");
CREATE INDEX IF NOT EXISTS idx_gallery_category ON "gallery_items"(category);
CREATE INDEX IF NOT EXISTS idx_gallery_createdAt ON "gallery_items"("createdAt" DESC);

-- ============================================
-- COMENTÁRIOS DO SCRIPT
-- ============================================
-- Para executar este arquivo no terminal:
-- psql -U seu_usuario -d seu_banco -f scripts/init-db.sql
--
-- Ou copie cada query (uma de cada vez) e execute no console do Neon
-- https://console.neon.tech/
--
-- Após executar, você pode adicionar um usuário de teste:
-- INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt") 
-- VALUES ('user_1', 'Admin', 'admin@delpino.com', true, NOW(), NOW());
