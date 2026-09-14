# TrocaJá — Marketplace de Aluguel P2P & Lojistas

![TrocaJá Banner](https://img.shields.io/badge/TrocaJá-Marketplace%20P2P-6366f1?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8?style=for-the-badge&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)

---

## 📦 Sobre o Projeto

A **TrocaJá** é um marketplace de aluguel de itens e equipamentos (ferramentas, eletrônicos, itens para eventos) que conecta locadores P2P e lojistas parceiros a locatários, com:

- **Comissão automática** 18% (P2P) / 9% (Lojista PRO)
- **Vistoria Digital** com fotos no check-in e check-out
- **Caução garantida** com motor de regras de retenção
- **Repasse PIX automático** + emissão de NF-e para parceiros PRO
- **Chat anti-vazamento** com detecção de pagamento externo
- **KYC Fast-Track** com biometria facial simulada
- **PWA instalável** no celular (sem App Store)

---

## 🚀 Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | UI Components |
| Vite | 8 | Build Tool |
| Tailwind CSS | 4 | Estilização |
| Supabase | 2 | Autenticação & Banco |
| Lucide React | 1.45 | Ícones |
| QRCode | - | QR Code PWA |

---

## 🔐 Segurança & Autenticação

- Login **obrigatório** antes de acessar qualquer conteúdo
- Portal separado para **Clientes** e **Gestores/Admin**
- Senha individual por usuário (padrão demonstração: `1a2b3c`)
- Confirmação de email via **Supabase Auth**
- QR Code **real** para instalação PWA no celular

---

## 👥 Personas do Sistema

### Clientes / Locadores
| ID | Nome | Perfil |
|---|---|---|
| carlos | Carlos Menezes | Locador P2P |
| bianca | Bianca Rocha | Locatária Eventual |
| antenor | Antenor Lopes | Lojista PRO |

### Equipe Gestora / Admin
| ID | Nome | Função |
|---|---|---|
| camila | Camila Torres | Atendente de Suporte |
| lucas | Lucas Andrade | Trust & Safety |
| patricia | Patrícia Nogueira | Financeiro |
| renata | Renata Bicalho | Head Produto & Ops |
| marina | Marina Souza | CTO |
| thiago | Thiago Drummond | CEO |

---

## ⚙️ Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/F-dev94/inovaTech.git
cd inovaTech

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves do Supabase

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: `http://localhost:5173`

---

## 🌍 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz:

```env
VITE_SUPABASE_URL=https://crskevhapqwmnvsvvmwe.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

---

## 📱 Instalar como PWA (App no Celular)

1. Acesse o app no celular pelo navegador
2. Na tela inicial, clique em **"Ver QR Code"**
3. Escaneie o QR Code com a câmera do celular
4. Toque em **"Adicionar à Tela de Início"**
5. O TrocaJá abrirá como app nativo! 🎉

---

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── admin/          # Painel Administrativo
│   ├── auth/           # AuthModal (Login / Cadastro)
│   ├── chat/           # Chat Anti-Bypass
│   ├── layout/         # Navbar, Footer, PWA, Welcome
│   ├── marketplace/    # ItemGrid, ItemDetail, Checkout
│   └── user/           # KYC, Vistoria, Disputas, Locações
├── services/
│   ├── kycService.js   # Verificação KYC simulada
│   ├── mockData.js     # Dados iniciais de demonstração
│   ├── rulesEngine.js  # Motor de regras de negócio
│   ├── store.js        # Estado global (hook customizado)
│   └── supabaseClient.js
└── App.jsx             # Roteamento e controle de autenticação
```

---

## 🚀 Deploy no Vercel

Este projeto está configurado para deploy automático no Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/F-dev94/inovaTech)

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos — UniBarretos, Engenharia de Software 4º Período.

**TrocaJá © 2026 — InovaTech**
