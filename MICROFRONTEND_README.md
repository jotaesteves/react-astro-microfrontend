# Astro Microfrontend Demo

This project demonstrates how to build microfrontend-like functionality using Astro's server islands feature with React components. Each React component acts as an independent microfrontend that can be developed, tested, and deployed separately.

## 🚀 Features

- **Independent React Microfrontends**: User Profile, Product Catalog, and Chat Widget components
- **Server Islands Architecture**: Using Astro's server-side rendering with selective client-side hydration
- **Multiple Loading Strategies**: Demonstrate different ways to load microfrontends (immediate, lazy, idle)
- **Isolated Development**: Each microfrontend can be developed independently
- **Performance Optimized**: Only hydrate components when needed

## 🏗️ Project Structure

```
src/
├── components/
│   ├── react/                    # React microfrontend components
│   │   ├── UserProfile.tsx       # User management microfrontend
│   │   ├── ProductCatalog.tsx    # E-commerce microfrontend
│   │   └── ChatWidget.tsx        # Customer support microfrontend
│   └── islands/                  # Astro island wrappers
│       ├── UserProfile.astro     # Wraps UserProfile component
│       ├── ProductCatalog.astro  # Wraps ProductCatalog component
│       └── ChatWidget.astro      # Wraps ChatWidget component
├── layouts/
│   └── Layout.astro              # Base layout
└── pages/
    ├── index.astro               # Main demo page
    └── loading-strategies.astro  # Loading strategies demo
```

## 🧩 Microfrontend Components

### 1. User Profile Microfrontend

- **Purpose**: User management and profile display
- **Features**: Async data loading, loading states, error handling
- **Use Case**: Can be owned by the User Management team

### 2. Product Catalog Microfrontend

- **Purpose**: E-commerce product display and filtering
- **Features**: Category filtering, responsive grid, product cards
- **Use Case**: Can be owned by the E-commerce team

### 3. Chat Widget Microfrontend

- **Purpose**: Customer support chat interface
- **Features**: Real-time messaging UI, minimize/maximize, typing indicators
- **Use Case**: Can be owned by the Customer Support team

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command          | Action                                           |
| :--------------- | :----------------------------------------------- |
| `pnpm install`   | Installs dependencies                            |
| `pnpm dev`       | Starts local dev server at `localhost:4321`      |
| `pnpm build`     | Build your production site to `./dist/`          |
| `pnpm preview`   | Preview your build locally, before deploying     |
| `pnpm astro ...` | Run CLI commands like `astro add`, `astro check` |

## 🎯 Microfrontend Benefits Demonstrated

### Independent Development

- Each React component can be developed in isolation
- Teams can work on different microfrontends simultaneously
- Different deployment cycles for each component

### Performance Optimization

- **Server-Side Rendering**: Initial HTML is rendered on the server
- **Selective Hydration**: Only interactive components are hydrated
- **Code Splitting**: Each microfrontend loads its own JavaScript bundle
- **Lazy Loading**: Components can load only when needed

### Loading Strategies

The project demonstrates different loading strategies:

- **`client:load`**: Immediate hydration when page loads
- **`client:visible`**: Hydrate when component enters viewport
- **`client:idle`**: Hydrate when browser is idle
- **`client:media`**: Hydrate based on media queries

## 🔧 How It Works

### Astro Islands

Astro's "Islands Architecture" allows you to:

1. Render most of your page as static HTML
2. Create interactive "islands" of functionality
3. Choose when and how each island hydrates

### React Integration

```astro
---
import UserProfileComponent from '../react/UserProfile';
const { userId = 1 } = Astro.props;
---

<UserProfileComponent client:load userId={userId} />
```

## 🚀 Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development server**

   ```bash
   pnpm dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:4321`

## 📈 Performance Benefits

- **Reduced Initial Bundle Size**: Only critical JavaScript loads initially
- **Better Core Web Vitals**: Improved FCP, LCP, and CLS scores
- **Progressive Enhancement**: Site works even without JavaScript
- **Faster Development**: Teams can work independently

## 👀 Want to learn more?

- [Astro Documentation](https://docs.astro.build)
- [Astro Islands](https://docs.astro.build/en/concepts/islands/)
- [React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Microfrontend Architecture](https://martinfowler.com/articles/micro-frontends.html)

## 🤝 Contributing

This is a demonstration project. Feel free to:

1. Fork the repository
2. Add new microfrontend examples
3. Experiment with different loading strategies
4. Submit pull requests with improvements
