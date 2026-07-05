# Guia de Configuração - Marco Digital de Delpino

Este guia ajudará você a configurar o projeto localmente com todas as integrações necessárias.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL (Neon) configurado
- Conta AWS com S3 bucket criado
- Git

## 🚀 Passo 1: Clonar e Instalar Dependências

```bash
git clone <seu-repositorio>
cd marco-digital-delpino
pnpm install
# ou: npm install / yarn install
```

## 🗄️ Passo 2: Configurar Banco de Dados (Neon)

### 2.1 Criar um projeto no Neon
1. Acesse [console.neon.tech](https://console.neon.tech/)
2. Crie um novo projeto
3. Copie a connection string (formato: `postgresql://user:password@host/database`)

### 2.2 Executar as queries de criação de tabelas
Você tem 3 opções:

**Opção A: Executar arquivo SQL localmente (recomendado)**
```bash
psql -U seu_usuario -d seu_banco -f scripts/init-db.sql
```

**Opção B: Copiar e colar no console do Neon**
1. Abra o console SQL do Neon
2. Copie todo o conteúdo de `scripts/init-db.sql`
3. Cole no console e execute

**Opção C: Executar query por query (se tiver erro)**
- Abra `scripts/init-db.sql`
- Execute cada `CREATE TABLE` separadamente no console do Neon

## 📝 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Copiar arquivo de exemplo
```bash
cp .env.example .env.local
```

### 3.2 Preencher as variáveis

Abra `.env.local` e preencha:

```env
# Banco de dados
DATABASE_URL=postgresql://seu_user:seu_password@seu_host/seu_banco

# Better Auth (gere com: openssl rand -base64 32)
BETTER_AUTH_SECRET=sua_chave_secreta_com_32_caracteres

# AWS S3
AWS_ACCESS_KEY_ID=sua_chave_de_acesso
AWS_SECRET_ACCESS_KEY=sua_chave_secreta
AWS_REGION=sa-east-1  # ou sua região
AWS_S3_BUCKET_NAME=seu-nome-do-bucket
```

## 🔑 Passo 4: Gerar BETTER_AUTH_SECRET

Execute no terminal:
```bash
openssl rand -base64 32
```

Copie o resultado e cole em `.env.local` no campo `BETTER_AUTH_SECRET`

## 👤 Passo 5: Criar Usuário de Teste

### 5.1 Iniciar o servidor
```bash
pnpm dev
```

### 5.2 Acessar a rota de seed
Abra no navegador:
```
http://localhost:3000/api/seed
```

A página deve retornar algo como:
```json
{
  "message": "Usuário de teste criado com sucesso",
  "email": "admin@delpino.com",
  "password": "delpino2024"
}
```

### 5.3 Fazer login
1. Acesse `http://localhost:3000/sign-in`
2. Use as credenciais:
   - **E-mail:** `admin@delpino.com`
   - **Senha:** `delpino2024`

## 🎨 Passo 6: Acessar o Painel Admin

Após fazer login, você será redirecionado para:
```
http://localhost:3000/admin
```

Aqui você pode:
- ✅ Adicionar novas imagens
- ✏️ Editar imagens existentes
- 🗑️ Deletar imagens
- 🔍 Filtrar por categoria
- 🚪 Logout no canto superior direito

## 🐛 Troubleshooting

### Erro: "E-mail ou senha incorretos"
1. Verifique se `.env.local` está preenchido corretamente
2. Certifique-se de que `BETTER_AUTH_SECRET` tem pelo menos 32 caracteres
3. Tente deletar a tabela `user` e rodar novamente a rota `/api/seed`

### Erro: "Connection refused" no banco
1. Verifique se a `DATABASE_URL` está correta
2. Tente conectar diretamente ao Neon: `psql <sua-connection-string>`
3. Se usar VPN, desative-a temporariamente

### Erro: "Access Denied" no S3
1. Verifique as credenciais AWS (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
2. Certifique-se de que o bucket existe e está na região especificada
3. Verifique as permissões de CORS e bucket policy no console AWS

### Imagens não aparecem
1. Verifique se `AWS_S3_BUCKET_NAME` e `AWS_REGION` estão corretos
2. Confirme que o next.config.mjs permite imagens do S3 (já configurado)

## 📦 Estrutura Importante

```
├── .env.example           # Template de variáveis de ambiente
├── .env.local            # Suas variáveis (nunca commitar!)
├── scripts/
│   └── init-db.sql       # Queries de criação das tabelas
├── lib/
│   ├── auth.ts           # Configuração do Better Auth
│   ├── auth-client.ts    # Cliente React do auth
│   └── db/
│       ├── index.ts      # Drizzle ORM setup
│       └── schema.ts     # Definição das tabelas
├── app/
│   ├── api/
│   │   ├── auth/         # Rotas de autenticação
│   │   ├── upload/       # Rota de upload para S3
│   │   └── seed/         # Rota de criar usuário de teste
│   ├── admin/            # Painel administrativo
│   ├── sign-in/          # Página de login
│   └── page.tsx          # Galeria pública
└── components/
    ├── admin/            # Componentes do painel
    └── ...
```

## 🔒 Notas de Segurança

⚠️ **NUNCA commite `.env.local`** - contém credenciais sensíveis

Para produção em Vercel:
1. Adicione as variáveis em Settings → Environment Variables
2. Não adicione no `.env.local`
3. Use a rota `/api/seed` apenas em desenvolvimento

## ✅ Próximos Passos

Após a configuração básica:
1. Teste o upload de uma imagem no painel admin
2. Verifique se a imagem aparece na galeria pública
3. Edite e delete imagens para validar todas as funções
4. Customize as categorias conforme necessário

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no console (terminal onde rodar `pnpm dev`)
2. Abra as DevTools do navegador (F12) e veja a aba Console
3. Verifique a aba Network para ver requisições para `/api/upload`
