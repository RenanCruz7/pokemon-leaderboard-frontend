# Pokémon Runs Leaderboard

Uma aplicação moderna de leaderboard para speedruns de jogos Pokémon, construída com React 19, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **React 19.2.0** - Última versão com as novas features
- **TypeScript 5.9.3** - Tipagem estática forte
- **Vite 7.2.4** - Build tool ultrarrápido
- **React Router 7.9.6** - Roteamento moderno
- **Tailwind CSS 3.4** - Estilização utilitária
- **ESLint** - Linting configurado para React 19

## ✨ Melhores Práticas Implementadas

### React 19
- ✅ **Named Exports** - Todos os componentes usam named exports para melhor tree-shaking
- ✅ **React.memo** - Componentes otimizados com memoização onde apropriado
- ✅ **Type Safety** - Tipagem completa com TypeScript e interfaces centralizadas
- ✅ **Component Optimization** - Componentes funcionais puros e performáticos
- ✅ **Strict Mode** - Habilitado para detectar problemas potenciais

### Arquitetura
- 📁 **Organização por Features** - Estrutura modular e escalável
- 🎯 **Single Responsibility** - Cada componente tem uma única responsabilidade
- 🔒 **Type-only Imports** - Uso correto de `import type` para tipos TypeScript
- 🎨 **Design System** - Cores e estilos consistentes via Tailwind
- ♿ **Acessibilidade** - Labels semânticas e ARIA attributes

### Performance
- ⚡ **Code Splitting** - Lazy loading automático via Vite
- 🎯 **Tree Shaking** - Eliminação de código morto
- 💾 **Build Otimizado** - Bundle minificado e comprimido
- 🔥 **HMR** - Hot Module Replacement para desenvolvimento

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   └── layout/       # Componentes de layout (NavBar, Footer)
├── features/         # Features organizadas por domínio
│   ├── leaderboard/ # Tabela de leaderboard
│   ├── run-details/ # Detalhes de uma run
│   └── submit-run/  # Formulário de submissão
├── types/           # Tipos TypeScript compartilhados
├── App.tsx          # Componente raiz
├── main.tsx         # Entry point
└── index.css        # Estilos globais (Tailwind)
```

## 🎯 Features

- 📊 **Leaderboard** - Visualização de melhores tempos
- 🔍 **Busca e Filtros** - Pesquisa por usuário ou Pokémon
- 📝 **Submissão de Runs** - Formulário completo para envio
- 👁️ **Detalhes** - Visualização detalhada de cada run
- 🌙 **Dark Mode** - Suporte a tema escuro
- 📱 **Responsivo** - Design adaptado para mobile

## 🔄 Melhorias Recentes

- Removido código não utilizado (Header.tsx)
- Padronizado todos exports para named exports
- Adicionado React.memo em componentes apropriados
- Centralizado tipos TypeScript em `/types`
- Atualizado ESLint para React 19
- Melhorado validação de tipos com `import type`
- Otimizado performance geral da aplicação

## 📝 Licença

MIT
```
