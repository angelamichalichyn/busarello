# Busarello Estofados — E-commerce Design

Data: 2026-07-07

## Contexto

Site de e-commerce para loja de colchões e estofados (Busarello Estofados). Precisa de
frontend + backend, com integração de pagamento (Mercado Pago), integração com ERP
(Sigecloud) e cálculo/rastreio de frete via transportadoras.

## Decisões

- **Sigecloud**: catálogo próprio no site; pedidos pagos são exportados ao Sigecloud
  (fila assíncrona com retry), Sigecloud não é fonte de verdade de estoque.
- **Mercado Pago**: Checkout Transparente (Bricks) — formulário embutido no site,
  tokenização de cartão no client-side.
- **Frete**: Frenet (agregador de transportadoras), cotação por CEP + dimensões/peso.
- **Stack**: Next.js (App Router) full-stack + TypeScript, PostgreSQL via Prisma.
  Deploy alvo: Vercel + Postgres gerenciado (Neon), mas roda local via Docker Compose.
- **Variações de produto**: apenas tamanho (Solteiro/Casal/Queen/King etc.), sem
  cor/tecido nem kits — cada variação com SKU, preço e estoque próprios.
- **Conta de cliente**: login (NextAuth) com histórico de pedidos e endereços salvos,
  mais opção de checkout como convidado.
- **Credenciais**: usuário fornecerá aos poucos; integrações isoladas em módulos
  (`src/lib/integrations/*`) com sandbox/mocks até termos as chaves reais.

## Arquitetura

Módulos: Catálogo, Carrinho/Checkout, Pedidos, Integração Sigecloud (fila com retry),
Painel Admin. Cada integração externa isolada atrás de uma interface própria.

## Modelo de dados (Prisma)

- `User` (role CUSTOMER/ADMIN), `Address`
- `Product`, `ProductVariant` (size, sku, price, stockQuantity, dimensões/peso p/ frete)
- `Cart`, `CartItem`
- `Order`, `OrderItem` (snapshot de preço/nome no momento da compra)
- `Payment` (provider mercadopago, externalId, status, rawPayload)
- `Shipment` (provider frenet, trackingCode, status, cost)
- `SigecloudSync` (status, attempts, lastError, sigecloudOrderId — fila de retry)

## Fluxo de checkout

1. Carrinho (valida estoque) → 2. Endereço → 3. Cotação de frete (Frenet) →
2. Revisão + criação do `Order` (AGUARDANDO_PAGAMENTO) → 5. Pagamento (MP Bricks,
   tokenização client-side) → 6. Webhook MP confirma pagamento (`Order.status = PAGO`) →
3. Exportação assíncrona para Sigecloud (retry) → 8. Atualização de envio/rastreio (Frenet).

Nunca perder um pedido; nunca travar o checkout por causa de integração externa fora
do ar.

## Páginas

**Site**: `/`, `/colchoes`, `/estofados`, `/produto/[slug]`, `/carrinho`, `/checkout`,
`/pedido/[orderNumber]`, `/conta` (login/pedidos/endereços), páginas institucionais.

**Admin** (`/admin`, role-protected): dashboard, `/admin/produtos` (CRUD + variações),
`/admin/pedidos` (lista + detalhe com reenvio manual ao Sigecloud),
`/admin/configuracoes` (status das integrações, sem expor chaves).

## Fora de escopo (YAGNI)

Cupons/promoções, avaliações de produto, múltiplos vendedores, notificações
WhatsApp/SMS. Podem ser adicionados depois.

## Plano de implementação

1. Setup do projeto (Next.js, Prisma, Docker Compose, auth) + catálogo (produtos/variações)
2. Carrinho, checkout, cálculo de frete (Frenet)
3. Pagamento (Mercado Pago Bricks) + webhook
4. Integração Sigecloud (exportação de pedidos + fila de retry)
5. Painel Admin completo
