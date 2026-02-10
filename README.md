# Icona - Modern Icon Library

A TypeScript-powered icon library that generates React, React Native, and Vue components from SVG files with support for nested folder structures.

## ✨ Features

- 🎨 **Nested Folder Support**: Organize icons in nested directories (e.g., `icons/tabler/outline/`)
- ⚛️ **React Components**: Auto-generated TypeScript React components
- � **React Native Components**: Auto-generated React Native components with react-native-svg
- �🟢 **Vue Components**: Auto-generated Vue 3 components with TypeScript
- 📦 **TypeScript**: Full TypeScript support with strict type checking
- 🎭 **SVG Optimization**: Automatic SVG parsing and optimization
- 🔧 **Component Naming**: Smart PascalCase naming from folder structure

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Adding Icons

1. Create your folder structure in the `icons/` directory:
```
icons/
├── tabler/
│   └── outline/
│       ├── home.svg
│       ├── user.svg
│       └── search.svg
└── feather/
    ├── heart.svg
    └── star.svg
```

2. Generate components:
```bash
npm run build
npm run generate
```

3. Use the generated components in your projects!

## 📁 Project Structure

```
icona/
├── icons/                    # Source SVG files (nested folders supported)
├── src/
│   ├── index.ts             # Main icon processor
│   ├── react/maker.ts       # React component generator
│   ├── react-native/maker.ts # React Native component generator
│   ├── vue/maker.ts         # Vue component generator
│   └── utils/pascal.ts      # PascalCase converter
├── dist/
│   ├── react/               # Generated React components
│   ├── react-native/        # Generated React Native components
│   └── vue/                 # Generated Vue components
└── types/index.d.ts         # TypeScript definitions
```

## 🛠️ Usage

### React Components

```tsx
import { TablerOutlineHome } from './dist/react/tabler/outline/home';
import { FeatherHeart } from './dist/react/feather/heart';

function App() {
  return (
    <div>
      <TablerOutlineHome size={32} color="blue" />
      <FeatherHeart size={24} className="text-red-500" />
    </div>
  );
}
```

### React Native Components

```tsx
import { TablerOutlineHome } from './dist/react-native/tabler/outline/home';
import { FeatherHeart } from './dist/react-native/feather/heart';

function App() {
  return (
    <View>
      <TablerOutlineHome size={32} color="blue" />
      <FeatherHeart size={24} color="red" />
    </View>
  );
}
```

> **Note**: React Native components require `react-native-svg` to be installed in your project:
> ```bash
> npm install react-native-svg
> # For iOS
> cd ios && pod install
> ```

### Vue Components

```vue
<template>
  <div>
    <TablerOutlineHome :size="32" />
    <FeatherHeart :size="24" className="text-red-500" />
  </div>
</template>

<script setup>
import TablerOutlineHome from './dist/vue/tabler/outline/home.vue';
import FeatherHeart from './dist/vue/feather/heart.vue';
</script>
```

### Direct SVG Usage

```html
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  <polyline points="9,22 9,12 15,12 15,22"/>
</svg>
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Watch mode for development |
| `npm run generate` | Process SVG files and generate components |
| `npm run clean` | Remove dist directory |
| `npm run release:patch` | Local release with patch version bump |
| `npm run release:minor` | Local release with minor version bump |
| `npm run release:major` | Local release with major version bump |

## 🚀 Automated Publishing

This project is configured for automatic npm publishing via GitHub Actions:

- **Auto-publish**: Every push to `main` branch automatically publishes to npm
- **Auto-versioning**: If the current version already exists on npm, it auto-bumps to the next patch version
- **GitHub Releases**: Automatically creates GitHub releases with generated components
- **Component Generation**: All React, Vue, and React Native components are generated before publishing

### Manual Release (Local)

```bash
# Set your NPM token in .env file
echo "NPM_TOKEN=your_npm_token_here" > .env

# Release with version bump
npm run release:patch  # 1.0.0 → 1.0.1
npm run release:minor  # 1.0.0 → 1.1.0
npm run release:major  # 1.0.0 → 2.0.0
```

## 🎨 Component Props

### React Components

```tsx
interface IconProps {
  size?: number | string;          // Default: 24
  color?: string;                  // Default: 'currentColor'
  className?: string;              // CSS classes
  title?: string;                  // Accessibility title
  'aria-label'?: string;          // Accessibility label
  style?: React.CSSProperties;    // Inline styles
}
```

### React Native Components

```tsx
interface IconProps {
  size?: number | string;          // Default: 24
  color?: string;                  // Default: 'currentColor'
  style?: any;                     // React Native styles
  testID?: string;                 // Test identifier
}
```

### Vue Components

```typescript
interface Props {
  size?: number | string;          // Default: 24
  className?: string;              // CSS classes
  style?: Record<string, any>;     // Inline styles
  title?: string;                  // Accessibility title
  ariaLabel?: string;              // Accessibility label
}
```

## 📦 Icon Data Structure

Generated icons have the following structure:

```typescript
interface Icon {
  name: string;                    // Icon name (filename without .svg)
  path: string;                    // Full path to SVG file
  category?: string;               // Nested folder path (e.g., "tabler/outline")
  content: string;                 // SVG inner content (paths, circles, etc.)
  viewBox?: string;               // SVG viewBox attribute
  width?: number;                 // SVG width attribute
  height?: number;                // SVG height attribute
}
```

## 🔧 Configuration

### TypeScript Configuration

The project uses strict TypeScript settings in `tsconfig.json`:

- `exactOptionalPropertyTypes: true` - Strict optional property handling
- `strictNullChecks: true` - Strict null checking
- `noImplicitAny: true` - No implicit any types

### Folder Structure Rules

- Icons must be `.svg` files
- Nested folders become categories (e.g., `icons/tabler/outline/` → `category: "tabler/outline"`)
- Component names use PascalCase (e.g., `tabler/outline/home.svg` → `TablerOutlineHome`)
- Empty categories are handled gracefully

## 🙏 Contributing

1. Add your SVG files to the appropriate nested folders in `icons/`
2. Run `npm run generate` to create components
3. Ensure TypeScript compilation succeeds with `npm run build`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

**Important Attribution Requirement**: When using this library in production or replicating this project, you must provide full credits to the original icon developers. This includes:

- **Tabler Icons** - https://tabler-icons.io/
- **Feather Icons** - https://feathericons.com/
- **Figma Community Icons** - Credit the original Figma creators/designers with their name and profile link
- Any other icon libraries whose work you include

Please include proper attribution in your app's credits, README, or footer section.

## 🔗 Related

- [Tabler Icons](https://tabler-icons.io/)
- [Feather Icons](https://feathericons.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

Built with ❤️ using TypeScript, React, React Native, and Vue.