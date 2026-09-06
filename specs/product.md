# Spec de Produto — duo

## Visão Geral

**duo** é um super app para casais que combina organização de lugares, entertainment tracker, planejamento de dates, memórias compartilhadas e descoberta social — tudo em um só lugar.

> "O app que todo casal precisa, mas nenhum outro oferece."

---

## Problema

Casais enfrentam 4 dores principais:

1. **Perda de memórias** — Não lembram onde foram, o que fizeram, perderam fotos e registros
2. **Falta de ideias** — Sempre a mesma rotina, não sabem o que fazer juntos
3. **Desorganização** — Listas espalhadas em WhatsApp, Notes, Google Maps
4. **Falta de conexão social** — Querem compartilhar experiências com outros casais

Nenhum app existente resolve **todas** essas dores de forma integrada.

---

## Público-Alvo

### Primário
- **Casais em qualquer fase** do relacionamento (0 a 50+ anos)
- **Idade:** 18-45 anos
- **Perfil:** Urbanos, classe B/C, smartphone como dispositivo principal
- **Comportamento:** Usam Instagram, WhatsApp, Google Maps, Netflix/Streaming

### Secundário
- Casais prestes a casar (planejamento de lua de mel, lista de presentes)
- Amigos que querem recomendar lugares para casais

---

## Mercado

### TAM (Total Addressable Market)
- **Brasil:** ~40 milhões de casais em relacionamento
- **Global:** ~500 milhões de casais ativos

### SAM (Serviceable Addressable Market)
- **Brasil digital:** ~15 milhões de casais com smartphone + interés em apps de lifestyle

### SOM (Serviceable Obtainable Market)
- **Ano 1:** 50.000 usuários (25.000 casais)
- **Ano 2:** 200.000 usuários (100.000 casais)
- **Ano 3:** 1 milhão de usuários (500.000 casais)

### Concorrentes

| App | Foco | Fraqueza vs duo |
|---|---|---|
| **Google Maps** | Lugares | Sem aspecto social/casal, sem memórias |
| **TripAdvisor** | Viagens | Foco em turismo, não em casais |
| **Foursquare** | Check-in | Sem planejamento, sem movies |
| **Letterboxd** | Filmes | Só filmes, sem lugares |
| **Notion** | Organização | Genérico, não especializado |
| **Couple** | Relacionamento | Foco em mensagens, não em lugares |
| **Between** | Relacionamento | Calendário + mensagens, sem lugares |

### Vantagem Competitiva
- **Nenhum app combina** lugares + filmes + planejamento + memórias + social
- **Foco exclusivo** em casais (não é genérico)
- **Gamificação** engajante (badges, streaks, ranking)
- **Monetização mista** (assinatura + patrocínio contextual)

---

## Produto

### Features do MVP (3-4 meses)

#### Core (Já implementado ✅)
- [x] Autenticação (email/senha)
- [x] Vinculação de casal (código de convite)
- [x] CRUD de lugares (nome, descrição, categoria, endereço, foto, notas)
- [x] Rating de lugares (ambiente, romance, custo, experiência)
- [x] Comentários em lugares
- [x] Tracker de filmes/séries (busca TMDB)
- [x] Status de assistir (não assistiu/assistindo/assistido/pretendo assistir)
- [x] Favoritos individual e rating do casal
- [x] Categorias customizáveis (ícone + cor)
- [x] Dashboard com stats
- [x] Perfil do usuário

#### Fase 1 — Mapa & Exploração (Mês 1)
- [ ] **Mapa interativo** — Visualizar todos os lugares no mapa com pinos
- [ ] **Geolocalização** — Buscar lugares próximos
- [ ] **Filtros no mapa** — Por categoria, visitado/pendente, avaliação
- [ ] **Detalhe no mapa** — Clique no pino mostra card com info
- [ ] **Roteiros** — Criar roteiros com múltiplos lugares (dia de date)

#### Fase 2 — Timeline & Memórias (Mês 2)
- [ ] **Timeline do casal** — Linha do tempo visual com marcos
- [ ] **Timecapsule** — Foto + nota automática ao marcar como visitado
- [ ] **Memórias** — Adicionar fotos e textos aos lugares visitados
- [ ] **Calendário** — Visualizar lugares visitados por data
- [ ] **Relatório semanal** — Email com resumo da semana

#### Fase 3 — Social & Descoberta (Mês 3)
- [ ] **Lista pública** — Compartilhar URL da lista de lugares
- [ ] **Indicações de amigos** — Amigos sugerem lugares
- [ ] **Explorar** — Lugares populares na região (integração Google Places)
- [ ] **Recomendações IA** — "Baseado nos seus gostos..."
- [ ] **Recomendações contextuais** — Sugestões por data comemorativa/clima
- [ ] **Patrocínio** — Lugares patrocinados nas recomendações (publicidade nativa)
- [ ] **Cupons/Descontos** — Parceiros oferecem descontos para usuários

#### Fase 4 — Gamificação & Engajamento (Mês 4)
- [ ] **Badges** — "Explorador" (10 lugares), "Cinéfilo" (50 filmes), "Viajante"
- [ ] **Streak de dates** — Contador de semanas consecutivas
- [ ] **Nível do casal** — XP por ações
- [ ] **Desafios mensais** — "Visitem 3 lugares novos esse mês"
- [ ] **Ranking** — "Esse mês vocês visitaram mais lugares que 80% dos casais"
- [ ] **Lembretes** — Push notification "Vocês não visitam um lugar há X dias"

### Features Pós-MVP

#### Premium (Assinatura)
- [ ] Export de dados (CSV/PDF)
- [ ] Relatórios avançados (gastos, tendências)
- [ ] Temas customizados
- [ ] Suporte prioritário
- [ ] Backup automático
- [ ] API pública (integrações)
- [ ] Listas temáticas ("10 restaurantes para aniversário")
- [ ] Bucket list compartilhada

#### Social Avançado
- [ ] Timeline do casal pública (opt-in)
- [ ] Seguir outros casais
- [ ] Feed de atividades
- [ ] Grupos de casais
- [ ] Eventos meetup

#### Integrações
- [ ] Google Calendar (sincronizar dates)
- [ ] Notion (exportar listas)
- [ ] Instagram (importar fotos)
- [ ] WhatsApp (compartilhar lugares)
- [ ] iFood/Rappi (pedir comida no lugar)

---

## Monetização

### Modelo: Freemium + Assinatura + IAPs

#### Plano Free
- 20 lugares
- 20 filmes
- 3 categorias customizadas
- 5 uploads/mês
- Mapa básico
- Timeline básica

#### Plano Pro — R$9,90/mês ou R$79,90/ano
- Lugares ilimitados
- Filmes ilimitados
- Categorias ilimitadas
- Uploads ilimitados
- Roteiros
- Timeline avançada
- Badges e gamificação
- Relatórios
- Recomendações IA
- Export de dados
- Temas customizados

#### In-App Purchases
- **Pacote de badges** — R$4,99 (badges premium temáticos)
- **Temas** — R$2,99 cada (dark mode, minimalista, etc.)
- **Destaque** — R$9,99/mês (aparecer nas recomendações)

#### Patrocínio (B2B)
- **Lugares patrocinados** — Restaurantes/lojas pagam para aparecer nas recomendações
- **Cupons/Descontos** — Afiliado com parceiros (comissão por uso)
- **Análise de dados** — Insights agregados para parceiros (sem dados pessoais)

### Receita Projetada

| Métrica | Ano 1 | Ano 2 | Ano 3 |
|---|---|---|---|
| Usuários totais | 50.000 | 200.000 | 1.000.000 |
| Casais ativos | 25.000 | 100.000 | 500.000 |
| Conversão Pro | 5% | 8% | 10% |
| Assinantes Pro | 1.250 | 8.000 | 50.000 |
| MRR (Pro) | R$12.500 | R$80.000 | R$500.000 |
| ARR (Pro) | R$150.000 | R$960.000 | R$6.000.000 |
| Receita patrocínio | R$5.000/mês | R$30.000/mês | R$200.000/mês |
| Receita IAP | R$2.000/mês | R$15.000/mês | R$100.000/mês |

---

## Tech Stack

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | Next.js 16 + React 19 | SSR/SSG, performance, SEO |
| Backend | Next.js API Routes | Simples, serverless |
| Banco | MongoDB + Mongoose | Flexibilidade, schema evolves |
| Auth | NextAuth.js | JWT, múltiplos providers |
| UI | shadcn/ui + Tailwind | Acessibilidade, customização |
| Mapa | Leaflet + OpenStreetMap | Gratuito, sem API key |
| Filmes | TMDB API | Gratuito, dados completos |
| Upload | Cloudinary | Gratuito tier generoso |
| IA | OpenAI / Claude | Recomendações (pós-MVP) |
| Pagamentos | Stripe | Padrão de mercado |
| Notificações | Firebase Cloud Messaging | Push notifications |
| Email | Resend / SendGrid | Transacional + marketing |
| Analytics | PostHog / Mixpanel | Product analytics |
| Monitoring | Sentry | Error tracking |
| CI/CD | GitHub Actions | Gratuito para open source |

---

## Roadmap

### Trimestre 1 — MVP Completo
- [x] Core features (lugares, filmes, categorias)
- [ ] Mapa interativo
- [ ] Geolocalização
- [ ] Roteiros básicos

### Trimestre 2 — Engajamento
- [ ] Timeline do casal
- [ ] Memórias e timecapsule
- [ ] Gamificação (badges, streaks)
- [ ] Push notifications

### Trimestre 3 — Social & Monetização
- [ ] Lista pública compartilhável
- [ ] Recomendações IA
- [ ] Sistema de patrocínio
- [ ] Stripe integration (Pro plan)
- [ ] IAPs

### Trimestre 4 — Escala
- [ ] App nativo (React Native)
- [ ] Expansão global (multi-idioma)
- [ ] API pública
- [ ] Parcerias com restaurantes/lojas

---

## Métricas de Sucesso

### Engagement
- **DAU/MAU** > 30% (sticky product)
- **Sessões por semana** > 3 por casal
- **Tempo por sessão** > 5 minutos
- **Streak médio** > 2 semanas

### Retenção
- **D1** > 40%
- **D7** > 25%
- **D30** > 15%
- **M3** > 10%

### Monetização
- **Conversão Free → Pro** > 5%
- **Churn mensal** < 5%
- **LTV/CAC** > 3
- **Payback period** < 6 meses

### Growth
- **Viral coefficient** > 1 (cada casal convida outro)
- **NPS** > 50
- **App Store rating** > 4.5

---

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Baixa retenção | Alto | Gamificação, lembretes, conteúdo relevante |
| Dificuldade de monetização | Alto | Freemium generoso, valor claro no Pro |
| Concorrentes maiores | Médio | Foco em nicho (casais), features únicas |
| Custo de infra | Médio | Serverless, tiers gratuitos, escalar com receita |
| LGPD/GDPR | Alto | Privacy by design, opt-in para dados |
| churn alto | Alto | Onboarding guiado, valor imediato |

---

## Próximos Passos

1. **Criar landing page** — Página de conversão com waitlist
2. **Definir branding** — Logo, cores, identidade visual
3. **Prototipar mapa** — Validar UX do mapa interativo
4. **Integrar Stripe** — Setup de billing
5. **Setup Firebase** — Push notifications
6. **Criar estilo guia** — Design system documentado
7. **Métricas** — Setup de analytics (PostHog/Mixpanel)
