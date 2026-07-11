# System Design - Biblioteca Online ETEC

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MongoDB
- NextAuth

## Design Principles
- Interface limpa, institucional e moderna.
- Muito espaço em branco.
- Componentes reutilizáveis.
- Dark Mode completo.

## Color Tokens

Primary:
- 50  #fdf2f2
- 100 #fde8e8
- 500 #991b1b
- 600 #7f1d1d
- 700 #6b0f0f

Neutral Light:
- Background: #f8fafc
- Surface: #ffffff
- Border: #e5e7eb
- Text: #111827
- Secondary: #6b7280

Neutral Dark:
- Background: #0f172a
- Surface: #111827
- Surface 2: #1f2937
- Border: #374151
- Text: #f9fafb
- Secondary: #9ca3af

Status:
Success #16a34a
Warning #f59e0b
Error #dc2626
Info #2563eb

## Radius
Button: 12px
Input: 12px
Card: 16px
Modal: 20px
Hero: 24px

## Shadows
sm
md
lg

## Typography
Font: Inter
H1 48
H2 36
H3 30
Title 24
Body 16
Small 14

## Spacing (8pt)
4 8 12 16 24 32 48 64

## Components

### Button
Height 48px
Radius 12px
Primary vermelho
Secondary branco
Ghost transparente

### Input
48px
Ícone opcional
Focus ring vermelho

### Cards de livros
- Capa
- Título
- Autor
- Categoria
- Disponibilidade
- CTA

### Navbar
72px altura

### Sidebar
280px desktop
80px recolhida

### Footer
Institucional

## Motion
150ms
ease-in-out

## Icons
Lucide React

## Dark Mode
Troca automática via Tailwind class.

## Tailwind Tokens

rounded-xl
rounded-2xl
shadow-sm
shadow-md
shadow-lg

max-w-7xl
container mx-auto

transition-all duration-200

## Acessibilidade

Contraste AA
Focus visível
Estados hover/focus/disabled

## Organização

components/
ui/
layout/
books/
catalog/

lib/
hooks/
services/

## Padrão Visual

- Muito parecido com as telas enviadas.
- Vermelho institucional como cor principal.
- Branco predominante.
- Cards elevados.
- Barra de pesquisa central.
- Hero com imagem escurecida.
- Bordas suaves.
- Componentização completa.
