# Spec Design System — duo

## 1. Visão Geral

O design system do duo é construído sobre **shadcn/ui** (estilo `base-nova`) com **Tailwind CSS v4** e primitivas customizadas. O objetivo é garantir consistência visual, acessibilidade e velocidade de desenvolvimento.

### Princípios

1. **Consistência** — Mesmos tokens, mesmasombrios, mesmos componentes
2. **Acessibilidade** — WCAG 2.1 AA como mínimo
3. **Mobile-first** — Design responsivo, celular primeiro
4. **Simplicidade** — Menos é mais, evitar complexidade visual
5. **ZERO div** — Nunca usar `<div>` em views e componentes (ver Seção 3)

---

## 2. Tokens

### 2.1 Cores

#### Brand

| Token | Hex | Uso |
|---|---|---|
| `duo-rose` | `#FF6B6B` | Cor primária da marca |
| `duo-rose-light` | `#FF8E8E` | Variante clara do rose |
| `duo-rose-dark` | `#E85555` | Variante escura do rose |
| `duo-teal` | `#4ECDC4` | Cor secundária da marca |
| `duo-teal-light` | `#7EDDD6` | Variante clara do teal |
| `duo-teal-dark` | `#3BA89F` | Variante escura do teal |
| `duo-dark` | `#1A1A2E` | Navy escuro |
| `duo-dark-light` | `#2D2D44` | Navy claro |

#### Gradiente da Marca

```css
background: linear-gradient(to right, #FF6B6B, #4ECDC4);
/* Tailwind: bg-gradient-to-r from-duo-rose to-duo-teal */
```

Usado em:
- Botões CTA (submit, ação principal)
- Logo text "duo"
- Badges premium

#### Semânticas (Light Theme)

| Token | Valor | Tailwind |
|---|---|---|
| `background` | `oklch(0.99 0.002 340)` | `bg-background` |
| `foreground` | `oklch(0.145 0 0)` | `text-foreground` |
| `card` | `oklch(1 0 0)` | `bg-card` |
| `card-foreground` | `oklch(0.145 0 0)` | `text-card-foreground` |
| `primary` | `oklch(0.72 0.19 18)` | `bg-primary` |
| `primary-foreground` | `oklch(1 0 0)` | `text-primary-foreground` |
| `secondary` | `oklch(0.72 0.15 170)` | `bg-secondary` |
| `secondary-foreground` | `oklch(1 0 0)` | `text-secondary-foreground` |
| `muted` | `oklch(0.96 0.005 340)` | `bg-muted` |
| `muted-foreground` | `oklch(0.556 0 0)` | `text-muted-foreground` |
| `accent` | `oklch(0.96 0.005 340)` | `bg-accent` |
| `destructive` | `oklch(0.577 0.245 27.325)` | `text-destructive` |
| `border` | `oklch(0.90 0.005 340)` | `border-border` |
| `input` | `oklch(0.90 0.005 340)` | `border-input` |
| `ring` | `oklch(0.72 0.19 18)` | `ring-ring` |

#### Semânticas (Dark Theme)

| Token | Valor |
|---|---|
| `background` | `oklch(0.145 0 0)` |
| `foreground` | `oklch(0.985 0 0)` |
| `card` | `oklch(0.205 0 0)` |
| `muted` | `oklch(0.269 0 0)` |
| `border` | `oklch(1 0 0 / 10%)` |
| `input` | `oklch(1 0 0 / 15%)` |

#### Cores de Categoria

| Categoria | Gradiente |
|---|---|
| Restaurante | `#fb923c` → `#f87171` (orange → red) |
| Praia | `#60a5fa` → `#22d3ee` (blue → cyan) |
| Museu | `#a78bfa` → `#818cf8` (violet → indigo) |
| Parque | `#4ade80` → `#34d399` (green → emerald) |
| Cafeteria | `#fbbf24` → `#facc15` (amber → yellow) |
| Bar | `#f472b6` → `#fb7185` (pink → rose) |
| Loja | `#a78bfa` → `#c084fc` (violet → purple) |

---

### 2.2 Tipografia

#### Fonte

| Propriedade | Valor |
|---|---|
| Família | Inter |
| Fonte | `--font-sans` (via `next/font/google`) |
| Heading | `--font-heading` = `--font-sans` (Inter) |
| Mono | `--font-mono` (Geist Mono) |

#### Hierarquia

| Elemento | Classe | Tamanho | Peso |
|---|---|---|---|
| Page title (h1) | `text-2xl md:text-3xl font-bold tracking-tight` | 24-30px | 700 |
| Section (h2) | `font-semibold text-lg` | 18px | 600 |
| Subsection (h3) | `font-semibold text-sm` | 14px | 600 |
| Card title | `font-medium text-sm` | 14px | 500 |
| Label | `text-sm font-medium text-muted-foreground` | 14px | 500 |
| Body | `text-sm` | 14px | 400 |
| Caption | `text-xs text-muted-foreground` | 12px | 400 |
| Error | `text-xs text-destructive` | 12px | 500 |
| Success | `text-xs text-green-600` | 12px | 500 |
| Nav mobile | `text-[10px]` | 10px | 500 |

---

### 2.3 Espaçamento

#### Escala

| Token | Valor | Uso |
|---|---|---|
| `1` | 0.25rem (4px) | Gap mínimo |
| `2` | 0.5rem (8px) | Padding interno cards |
| `3` | 0.75rem (12px) | Cards sm |
| `4` | 1rem (16px) | Padding padrão |
| `5` | 1.25rem (20px) | — |
| `6` | 1.5rem (24px) | Space-y padrão |
| `8` | 2rem (32px) | — |

#### Padrões

| Contexto | Espaçamento |
|---|---|
| PageContainer | `px-4 pt-4 space-y-6` |
| Card padding | `p-4` |
| Card sm | `p-3` |
| Form spacing | `space-y-4` |
| List spacing | `space-y-3` |
| Stat grid | `gap-4` |
| Button gap | `gap-1.5` |

---

### 2.4 Border Radius

| Token | Cálculo | Valor | Uso |
|---|---|---|---|
| `radius` | base | 0.75rem (12px) | — |
| `radius-sm` | `radius * 0.6` | 0.45rem | — |
| `radius-md` | `radius * 0.8` | 0.6rem | — |
| `radius-lg` | `radius` | 0.75rem | Buttons, Inputs |
| `radius-xl` | `radius * 1.4` | 1.05rem | Cards |
| `radius-2xl` | `radius * 1.8` | 1.35rem | — |
| `radius-3xl` | `radius * 2.2` | 1.65rem | — |
| `radius-4xl` | `radius * 2.6` | 1.95rem | Badges |

#### Uso por Componente

| Componente | Radius |
|---|---|
| Button | `rounded-lg` |
| Input | `rounded-lg` |
| Card | `rounded-xl` |
| Dialog | `rounded-xl` |
| Badge | `rounded-4xl` (pill) |
| Avatar | `rounded-full` |
| Tabs (pill) | `rounded-full` |

---

### 2.5 Sombras

| Contexto | Classes |
|---|---|
| Card | `ring-1 ring-foreground/10` |
| Dialog/Modal | `shadow-md` |
| Skeleton card | `shadow-sm` |
| Hover card | `ring-1 ring-foreground/10 shadow-lg` |

---

### 2.6 Bordas

| Contexto | Classes |
|---|---|
| Padrão | `border-border` |
| Nav separator | `border-border/50` |
| Card border | `border-border/60` |
| Input focus | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` |

---

## 3. Regra ZERO div — Uso Obrigatório do Design System

### Regra

**PROIBIDO** o uso de `<div>` em qualquer arquivo de UI:
- `page.tsx`
- `views/*.view.tsx`
- `components/*.component.tsx`

**TODA** interface deve ser construída exclusivamente com componentes do design system.

### Substituições Obrigatórias

| Em vez de... | Use... |
|---|---|
| `<div className="flex ...">` | `<Flex>` |
| `<div className="grid ...">` | `<Grid>` |
| `<div className="space-y-...">` | `<Stack gap={...}>` |
| `<div className="p-...">` | `<Box p={...}>` ou `<Card>` |
| `<div className="text-center">` | `<Center>` |
| `<div className="relative ...">` | `<Position>` |
| `<div className="hidden ...">` | `<Show>` ou `<VisuallyHidden>` |
| Container genérico | `<Box>` |

### Componentes do Design System para Layout

| Componente | Arquivo | Uso |
|---|---|---|
| `<Box>` | `components/ui/box.tsx` | Container genérico (substitui div) |
| `<Stack>` | `components/ui/stack.tsx` | Layout vertical/horizontal com gap |
| `<Flex>` | `components/ui/flex.tsx` | Flex wrapper |
| `<Grid>` | `components/ui/grid.tsx` | Grid wrapper |
| `<Center>` | `components/ui/center.tsx` | Centralizar conteúdo |
| `<Position>` | `components/ui/position.tsx` | Posicionamento absoluto/relativo |

### Exemplo — Antes vs Depois

**ERRADO (com div):**
```tsx
<div className="px-4 pt-4 space-y-6 max-w-lg mx-auto">
  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-bold">Timeline</h1>
  </div>
  <div className="space-y-4">
    <div className="p-4 ring-1 ring-foreground/10 rounded-xl">
      <div className="flex gap-3">
        <img className="h-16 w-16 rounded-lg object-cover" />
        <div className="flex-1">
          <h3 className="font-medium text-sm">Pizzaria Augusta</h3>
        </div>
      </div>
    </div>
  </div>
</div>
```

**CORRETO (com design system):**
```tsx
<PageContainer>
  <PageHeader title="Timeline" />
  <Stack gap={4}>
    <Card>
      <CardContent className="p-4">
        <Flex gap={3}>
          <img className="h-16 w-16 rounded-lg object-cover" />
          <Box className="flex-1">
            <Heading variant="card">Pizzaria Augusta</Heading>
          </Box>
        </Flex>
      </CardContent>
    </Card>
  </Stack>
</PageContainer>
```

### Verificação

Antes de commitar, rodar:

```bash
grep -r "<div" src/app/\(protected\)/ --include="*.tsx" | grep -v "node_modules"
```

Deve retornar **ZERO** resultados em pages/views/components.

### Exceções

Únicos casos onde `<div>` é permitido:
- Internamente em componentes shadcn/ui que já usam div
- `<Separator>`, `<Skeleton>` — wrappers de terceiros
- `<img>` tags (até criar componente Image)
- `jest.Mock` casts em testes

---

## 4. Componentes

### 4.1 Primitivas UI (`components/ui/`)

| Componente | Primitiva | Exports |
|---|---|---|
| `button.tsx` | `@base-ui/react/button` + CVA | `Button`, `buttonVariants` |
| `badge.tsx` | `@base-ui/react` + CVA | `Badge`, `badgeVariants` |
| `card.tsx` | React puro | `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`, `CardContent`, `CardAction` |
| `input.tsx` | `@base-ui/react/input` | `Input` |
| `textarea.tsx` | React puro | `Textarea` |
| `select.tsx` | `@base-ui/react/select` | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` |
| `dialog.tsx` | `@base-ui/react/dialog` | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`, `DialogOverlay` |
| `dropdown-menu.tsx` | `@base-ui/react/menu` | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` |
| `tooltip.tsx` | `@base-ui/react/tooltip` | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` |
| `tabs.tsx` | `@base-ui/react/tabs` + CVA | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `separator.tsx` | `@base-ui/react/separator` | `Separator` |
| `avatar.tsx` | `@base-ui/react/avatar` | `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarBadge` |
| `label.tsx` | React puro | `Label` |
| `skeleton.tsx` | React puro | `Skeleton`, `SkeletonCircle`, `SkeletonSquare`, `SkeletonLine`, `SkeletonCard`, `SkeletonMenuItem` |
| `form.tsx` | `@radix-ui/react-label` + RHF | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` |
| `text.tsx` | Custom | `Text` |
| `heading.tsx` | Custom | `Heading` |
| `box.tsx` | Custom | `Box` |
| `flex.tsx` | Custom | `Flex` |
| `stack.tsx` | Custom | `Stack` |
| `link.tsx` | Custom | `Link` |
| `icon.tsx` | Custom | `Icon` |

### 4.2 Layout (`components/layout/`)

| Componente | Caminho | Descrição |
|---|---|---|
| `PageContainer` | `page-container/` | Wrapper centralizado `max-w-lg mx-auto px-4 pt-4 space-y-6` |
| `PageHeader` | `page-header/` | Título h1 + action slot |
| `MobileNav` | `mobile-nav/` | Nav inferior (mobile) + nav superior (desktop) |
| `Header` | `header/` | Header desktop com nav pills |
| `Logo` | `logo/` | SVG com dois círculos + arco |

### 4.3 Features (`components/features/`)

| Componente | Caminho | Descrição |
|---|---|---|
| `PlaceCard` | `place-card/` | Card de lugar com foto, nome, categoria, rating |
| `StatsCard` | `stats-card/` | Card de estatística numérica |
| `StarRating` | `star-rating/` | Rating 4 dimensões com estrelas |
| `PlaceForm` | `place-form/` | Formulário de criar/editar lugar |
| `PlaceList` | `place-list/` | Lista de lugares com tabs |
| `ConfirmDialog` | `confirm-dialog/` | Dialog de confirmação |

---

## 5. Botões

### Variantes

| Variante | Classes | Uso |
|---|---|---|
| `default` | `bg-primary text-primary-foreground hover:bg-primary/80` | Ação principal |
| `outline` | `border-border bg-background hover:bg-muted` | Ação secundária |
| `secondary` | `bg-secondary text-secondary-foreground` | Alternativa |
| `ghost` | `hover:bg-muted hover:text-foreground` | Ícone, nav |
| `destructive` | `bg-destructive/10 text-destructive hover:bg-destructive/20` | Excluir |
| `link` | `text-primary underline-offset-4 hover:underline` | Link estilizado |
| **Gradient** | `bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90 rounded-xl` | CTA principal |

### Tamanhos

| Tamanho | Dimensões | Uso |
|---|---|---|
| `xs` | `h-6 gap-1 px-2 text-xs` | Tags, inline |
| `sm` | `h-7 gap-1 px-2.5 text-[0.8rem]` | Cards, ações secundárias |
| `default` | `h-8 gap-1.5 px-2.5` | Padrão |
| `lg` | `h-9 gap-1.5 px-2.5` | Formulários |
| `icon` | `size-8` | Botão de ícone |
| `icon-xs` | `size-6` | Ícone pequeno |
| `icon-sm` | `size-7` | Ícone médio |
| `icon-lg` | `size-9` | Ícone grande |

### Padrão de Botão CTA

```tsx
<Button
  type="submit"
  className="w-full h-12 rounded-xl bg-gradient-to-r from-duo-rose to-duo-teal hover:opacity-90"
>
  Salvar
</Button>
```

---

## 6. Cards

### Padrão

```tsx
<Card className="ring-1 ring-foreground/10">
  <CardContent className="p-4">
    {/* conteúdo */}
  </CardContent>
</Card>
```

### Tamanhos

| Tamanho | Spacing | Uso |
|---|---|---|
| `default` | `p-4` | Cards padrão |
| `sm` | `p-3` | Cards compactos |

### Bordas e Sombras

- Bordas: `ring-1 ring-foreground/10` (não `border`)
- Hover: `ring-1 ring-foreground/10 shadow-lg`
- Radius: `rounded-xl`

---

## 7. Formulários

### Padrão

```tsx
<form className="space-y-4">
  <FormField htmlFor="name" label="Nome" error={errors.name}>
    <Input
      id="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      aria-invalid={!!errors.name}
      aria-describedby={errors.name ? "name-error" : undefined}
    />
  </FormField>

  <Button
    type="submit"
    className="w-full h-12 rounded-xl bg-gradient-to-r from-duo-rose to-duo-teal"
  >
    Salvar
  </Button>
</form>
```

### States

| State | Classe |
|---|---|
| Default | `border-input` |
| Focus | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` |
| Error | `border-destructive focus-visible:border-destructive` |
| Disabled | `opacity-50 cursor-not-allowed` |

### Alturas

| Contexto | Altura |
|---|---|
| Input padrão | `h-8` |
| Input formulário | `h-12` |
| Textarea | `min-h-[80px]` |

---

## 8. Navegação

### Mobile (Bottom Nav)

```
┌─────────────────────────────┐
│           App               │
├─────────────────────────────┤
│                             │
│         Conteúdo            │
│                             │
├─────────────────────────────┤
│ 🏠    📍    🎬    💑       │  ← h-16, fixed bottom
│ Início Lugares Filmes Duo   │
└─────────────────────────────┘
```

- Altura: `h-16`
- Posição: `fixed bottom-0`
- Item ativo: `text-duo-rose`
- Separator: `border-t border-border/50`
- Safe area: `.safe-area-bottom`

### Desktop (Header)

```
┌─────────────────────────────────────────────────────┐
│  💑 duo    Início  Lugares  Filmes  Duo    [Avatar] │  ← h-16, sticky
├─────────────────────────────────────────────────────┤
│                                                     │
│                     Conteúdo                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Altura: `h-16`
- Posição: `sticky top-0 z-50`
- Nav item ativo: `bg-duo-rose/10 text-duo-rose rounded-full`
- Separator: `border-b border-border/50`

---

## 9. Ícones

### Biblioteca

**lucide-react** exclusivamente.

### Tamanhos

| Contexto | Tamanho | Classes |
|---|---|---|
| Nav item | 20px | `h-5 w-5` |
| Button icon | 16px | `h-4 w-4` |
| Card icon | 20px | `h-5 w-5` |
| Badge icon | 16px | `h-4 w-4` |
| Small UI | 14px | `h-3.5 w-3.5` |

### Cores

| Contexto | Cor |
|---|---|
| Nav ativo | `text-duo-rose` |
| Nav inativo | `text-muted-foreground` |
| Categoria | Cor da categoria (ex: `text-orange-500`) |
| Destructive | `text-destructive` |
| Success | `text-green-600` |

---

## 10. Estados

### Loading

```tsx
// Skeleton card
<SkeletonCard>
  <Skeleton className="h-40 rounded-none" />
  <div className="p-4 space-y-2">
    <SkeletonLine className="h-5 w-40" />
    <SkeletonLine className="h-4 w-full" />
  </div>
</SkeletonCard>

// Skeleton menu item
<SkeletonMenuItem />
```

### Estado Vazio

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
    <Icon className="h-8 w-8 text-muted-foreground" />
  </div>
  <Heading variant="section">Título</Heading>
  <Text variant="muted">Descrição do estado vazio</Text>
</div>
```

### Erro

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
    <AlertCircle className="h-8 w-8 text-destructive" />
  </div>
  <Heading variant="section">Erro</Heading>
  <Text variant="error">Mensagem de erro</Text>
  <Button variant="outline" onClick={retry}>Tentar novamente</Button>
</div>
```

---

## 11. Acessibilidade

### Regras

| Regra | Implementação |
|---|---|
| Labels em inputs | `<Label htmlFor>` + `<Input id>` |
| Imagens com alt | `<img alt="...">` |
| Botões semânticos | `<Button>` nunca `<div onClick>` |
| Hierarquia de headings | h1 > h2 > h3 |
| Focus visible | `focus-visible:ring-3 focus-visible:ring-ring/50` |
| aria-invalid | Em campos com erro |
| aria-describedby | Ligando erro ao input |

### Contraste

| Par | Razão mínima |
|---|---|
| Texto normal | 4.5:1 |
| Texto grande | 3:1 |
| Componentes UI | 3:1 |

---

## 12. Animações

### Padrões

| Contexto | Classes |
|---|---|
| Dialog/Select/Tooltip | `animate-in fade-in-0 zoom-in-95` |
| Skeleton | `animate-pulse` |
| Loading spinner | `animate-spin` |
| Hover card | `transition-all duration-200` |

### Redução de Movimento

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 13. Responsividade

### Breakpoints

| Breakpoint | Largura | Comportamento |
|---|---|---|
| Default | < 768px | Mobile: bottom nav, layout compacto |
| `md` | ≥ 768px | Desktop: header nav, layout amplo |

### Padrões

| Elemento | Mobile | Desktop |
|---|---|---|
| Nav | Bottom tab | Header horizontal |
| PageContainer | `px-4 max-w-lg` | `px-4 max-w-lg` (mantém) |
| Cards | 1 coluna | 1-2 colunas |
| Grid | `grid-cols-1` | `md:grid-cols-2` |
| Form inputs | `h-12` | `h-10` |

---

## 14. Tema Escuro

### Ativação

```css
@custom-variant dark (&:is(.dark *));
```

### Diferenças vs Light

| Token | Light | Dark |
|---|---|---|
| `background` | `oklch(0.99 0.002 340)` | `oklch(0.145 0 0)` |
| `card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `muted` | `oklch(0.96 0.005 340)` | `oklch(0.269 0 0)` |
| `border` | `oklch(0.90 0.005 340)` | `oklch(1 0 0 / 10%)` |
| `destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |

---

## 15. Arquitetura de Arquivos

```
components/
├── ui/                          # Primitivas base
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── skeleton.tsx
│   ├── heading.tsx
│   ├── text.tsx
│   ├── box.tsx
│   ├── stack.tsx
│   ├── flex.tsx
│   └── ...
├── layout/                      # Layout components
│   ├── page-container/
│   ├── page-header/
│   ├── mobile-nav/
│   ├── header/
│   └── logo/
└── features/                    # Componentes de domínio
    ├── place-card/
    ├── stats-card/
    ├── star-rating/
    ├── place-form/
    └── confirm-dialog/
```

### Convenções

| Local | Arquivo | Export |
|---|---|---|
| `ui/` | Flat, sem sufixo | Named |
| `layout/` | `*.component.tsx` em pasta | Named |
| `features/` | `*.component.tsx` em pasta | Named |
