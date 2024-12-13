# Project Structure

## Directory Structure [P0]

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes básicos de UI
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── forms/          # Componentes de formulário
│   │   ├── LoginForm.tsx
│   │   └── SearchForm.tsx
│   └── navigation/     # Componentes de navegação
│       ├── Sidebar.tsx
│       └── Breadcrumb.tsx
├── features/          # Funcionalidades específicas
│   ├── editor/        # Feature do editor
│   │   ├── Editor.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── hooks/     # Hooks específicos da feature
│   │   └── utils/     # Utilitários específicos
│   └── auth/          # Feature de autenticação
│       ├── Login.tsx
│       ├── hooks/
│       └── utils/
└── views/             # Páginas da aplicação
    ├── Editor/
    │   ├── index.tsx  # Composição da página
    │   └── sections/  # Seções específicas
    └── Dashboard/
        ├── index.tsx
        └── sections/
```

## Regras de Organização [P0]

1. **Componentes (`src/components/`)**
   - Componentes reutilizáveis e independentes
   - Estrutura plana, sem subpastas `components`
   - Agrupados por domínio (ui, forms, navigation)
   ```
   ui/
   ├── Button.tsx       # Componente direto
   ├── Input.tsx        # Sem subpastas
   └── types.ts         # Tipos relacionados
   ```

2. **Features (`src/features/`)**
   - Funcionalidades específicas da aplicação
   - Podem ter hooks e utils próprios
   - Estrutura consistente:
   ```
   editor/
   ├── Editor.tsx       # Componente principal
   ├── hooks/           # Hooks da feature
   │   └── useEditor.ts
   └── utils/           # Utilitários
       └── editorUtils.ts
   ```

3. **Views (`src/views/`)**
   - Páginas da aplicação
   - Composição de componentes e features
   - Estrutura clara:
   ```
   Dashboard/
   ├── index.tsx        # Composição principal
   └── sections/        # Seções da página
       ├── Header.tsx
       └── Content.tsx
   ```

## Princípios [P0]

1. **Simplicidade**
   - Estrutura plana sempre que possível
   - Evitar aninhamento desnecessário
   - Nomes claros e descritivos

2. **Organização**
   - Componentes por domínio
   - Features por funcionalidade
   - Views por página

3. **Reusabilidade**
   - Componentes são blocos de construção
   - Features encapsulam lógica
   - Views compõem o todo

## Anti-Patterns [P0]

❌ **Evitar**
- Subpastas `components` dentro de componentes
- Estruturas profundamente aninhadas
- Mistura de responsabilidades
- Duplicação de funcionalidades

✅ **Preferir**
- Estrutura plana e direta
- Organização por domínio
- Separação clara de responsabilidades
- Nomes descritivos e específicos

## Importações [P0]

1. **Componentes**
   ```typescript
   import { Button } from '@/components/ui/Button'
   import { LoginForm } from '@/components/forms/LoginForm'
   ```

2. **Features**
   ```typescript
   import { Editor } from '@/features/editor/Editor'
   import { useEditor } from '@/features/editor/hooks/useEditor'
   ```

3. **Views**
   ```typescript
   import { DashboardHeader } from '@/views/Dashboard/sections/Header'
   ```

## Manutenção [P0]

1. **Novos Componentes**
   - Avaliar se é reutilizável → `components/`
   - Avaliar se é específico → `features/`
   - Avaliar se é página → `views/`

2. **Refatoração**
   - Mover componentes para local apropriado
   - Manter estrutura plana
   - Seguir padrões estabelecidos
``` 