# Icona - Modern Icon Library

Beautiful, customizable icon components for React, React Native, and Vue. Pre-optimized SVG icons with intelligent naming and zero configuration needed.

## ✨ Features

- 🎨 **Multi-Framework Support**: Use the same icons across React, React Native, and Vue
- ⚛️ **Framework Components**: Pre-built TypeScript components ready to drop into your project
- 📦 **Fully Typed**: Complete TypeScript support with strict type checking
- 🎭 **Customizable**: Control size, color, and styling on every icon
- ⚡ **Optimized**: Pre-optimized SVGs for best performance
- 🔧 **Zero Config**: Install and use immediately

## 🚀 Quick Start

### Installation

```bash
npm install icona
```

### Usage - React

```tsx
import { TablerOutlineHome, FeatherHeart } from "icona/react";

export default function App() {
  return (
    <div>
      <TablerOutlineHome size={32} color="blue" />
      <FeatherHeart size={24} className="text-red-500" />
    </div>
  );
}
```

### Usage - React Native

```tsx
import { TablerOutlineHome, FeatherHeart } from "icona/react-native";

export default function App() {
  return (
    <View>
      <TablerOutlineHome size={32} color="blue" />
      <FeatherHeart size={24} color="red" />
    </View>
  );
}
```

### Usage - Vue 3

```vue
<template>
  <div>
    <TablerOutlineHome :size="32" />
    <FeatherHeart :size="24" class="text-red-500" />
  </div>
</template>

<script setup>
import { TablerOutlineHome, FeatherHeart } from "icona/vue";
</script>
```

## 🎨 Customize Icons

All icons support these customization options:

### React & Vue

```tsx
<TablerOutlineHome
  size={32} // width and height
  color="blue" // icon color
  className="my-class" // CSS classes
  style={{ opacity: 0.8 }} // inline styles
  title="Home" // accessibility
/>
```

### React Native

```tsx
<TablerOutlineHome
  size={32} // width and height
  color="blue" // icon color
  style={{ opacity: 0.8 }} // React Native styles
/>
```

## 📦 Available Icon Collections

- **Tabler Icons** - Minimal outline and solid design system
- **Feather Icons** - Simple, elegant line icons
- Additional modern icon sets included

Browse all available icons in our [collection explorer](#).

## 🙏 Attribution

Icons sourced from:

- **Hicons** - https://www.figma.com/community/file/1023171235158207826/hicon-free-icon-pack-2700-editable-icons
- **Wave-icons** - https://www.figma.com/community/file/1200076315140068212/wave-icons-essential-icons-community

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ for modern web development.
