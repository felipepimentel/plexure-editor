# Project Structure

## Directory Structure [P0]

```
src/
├── components/          # Componentes da aplicação
│   ├── ui/             # Componentes UI atômicos/básicos
│   │   ├── Button/     # Botões básicos
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   │   ├── Card/       # Cards básicos
│   │   │   └── Card.tsx
│   │   ├── Form/       # Componentes de formulário básicos
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── TextArea.tsx
│   │   ├── Modal/      # Modais básicos
│   │   │   └── Modal.tsx
│   │   └── Tooltip/    # Tooltips básicos
│   │       └── Tooltip.tsx
│   ├── auth/           # Componentes de domínio - Autenticação
│   │   └── LoginForm.tsx
│   ├── editor/         # Componentes de domínio - Editor
│   │   ├── EditorLayout.tsx
│   │   └── hooks/
│   ├── error/          # Componentes de domínio - Erros
│   │   ├── ErrorPanel.tsx
│   │   └── ValidationPanel.tsx
│   ├── navigation/     # Componentes de domínio - Navegação
│   │   ├── MainNavigation.tsx
│   │   └── NavigationTree.tsx
│   ├── preview/        # Componentes de domínio - Preview
│   │   └── Preview.tsx
│   ├── settings/       # Componentes de domínio - Configurações
│   │   └── SettingsDialog.tsx
│   ├── shortcuts/      # Componentes de domínio - Atalhos
│   │   └── KeyboardShortcuts.tsx
│   └── statusbar/      # Componentes de domínio - Barra de Status
│       └── StatusBar.tsx
├── contexts/           # Contextos React
├── hooks/              # Hooks globais
├── styles/            # Estilos globais
├── types/             # Tipos TypeScript
└── views/             # Páginas da aplicação
```

## Regras de Organização [P0]

1. **Componentes UI (`components/ui/`)**
   - APENAS componentes atômicos/básicos
   - Sem lógica de negócio
   - Altamente reutilizáveis
   - Cada componente em sua própria pasta
   - Inclui testes e stories
   - Exemplos:
     - Botões
     - Inputs
     - Cards
     - Modais básicos
     - Tooltips

2. **Componentes de Domínio (`components/<domain>/`)**
   - Componentes específicos de domínio
   - Podem conter lógica de negócio
   - Compostos por componentes UI
   - Organizados por funcionalidade
   - Exemplo:
     ```
     editor/
     ├── EditorLayout.tsx    # Composição de componentes UI
     └── hooks/              # Lógica específica do editor
     ```

## Anti-Patterns [P0]

❌ **Evitar**
- Colocar lógica de negócio em `ui/`
- Criar componentes UI muito específicos
- Duplicar componentes UI básicos
- Misturar componentes de domínio com UI

✅ **Preferir**
- Manter `ui/` APENAS para componentes atômicos
- Compor componentes de domínio usando componentes UI
- Reutilizar componentes UI
- Separar claramente UI de lógica de negócio

## Importações [P0]

```typescript
// Componentes UI básicos (atômicos)
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Form/Input'

// Componentes de domínio (compostos)
import { EditorLayout } from '@/components/editor/EditorLayout'
import { LoginForm } from '@/components/auth/LoginForm'
```

## Manutenção [P0]

1. **Novos Componentes**
   - Se é um componente atômico/básico → `ui/`
   - Se é específico de domínio → pasta do domínio
   - Sempre considerar reuso de componentes UI

2. **Refatoração**
   - Manter `ui/` puro e simples
   - Extrair lógica de negócio para componentes de domínio
   - Garantir que `ui/` contenha APENAS componentes atômicos
   - Evitar duplicação de componentes UI básicos
``` 