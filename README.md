# Icona

A lightweight, modern SVG icon library designed for web applications. Built with TypeScript support and framework-agnostic architecture for seamless integration across your projects.

## Installation

```bash
npm install @developershre/icona
```

## Quick Start

```typescript
import { Icon } from 'icona';

export default function App() {
  return <Icon name="arrow-right" size={24} />;
}
```

## Features

- **Lightweight SVG Icons** - Minimal file sizes with optimized SVG format
- **TypeScript Support** - Full type definitions for better development experience
- **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JavaScript
- **Customizable** - Control colors, sizes, and stroke widths on the fly
- **Tree-Shakeable** - Import only the icons you need for smaller bundle sizes

## Available Icons

Browse the complete icon collection at the [icon showcase](https://icona.dev/icons).

## Props

| Prop          | Type   | Default      | Description                      |
| ------------- | ------ | ------------ | -------------------------------- |
| `name`        | string | required     | Icon name identifier             |
| `size`        | number | 24           | Icon size in pixels              |
| `color`       | string | currentColor | Icon color (any CSS color value) |
| `strokeWidth` | number | 2            | Stroke width for outlined icons  |

## Browser Support

Compatible with all modern browsers supporting SVG and ES6+.

## Credits

Icon designs created and curated by our Figma design team. We extend our gratitude to the Figma community for their contributions to icon design and refinement.
## Inspiration

The following resources inspired our icon design:

- [Hicon](https://www.figma.com/community/file/1023171235158207826/hicon-free-icon-pack-2700-editable-icons) - Free icon pack with 2700 editable icons
- [Wave Icons](https://www.figma.com/community/file/1200076315140068212/wave-icons-essential-icons-community) - Essential icons community collection


## License

MIT
