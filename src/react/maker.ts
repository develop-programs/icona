import { toPascalCase } from "../utils/pascal";
import { Icon } from "../types/config";
import { generateIconMetadata } from "../utils/metadata";

/**
 * Generate a React component from an icon
 */
export function generateReactComponent(icon: Icon): string {
    const componentName = toPascalCase(icon.name);
    const categoryPrefix = icon.category ? toPascalCase(icon.category) : "";
    const fullComponentName = categoryPrefix ? `${categoryPrefix}${componentName}` : componentName;
    
    // Generate metadata for JSDoc
    const metadata = icon.metadata || generateIconMetadata(icon.name, icon.category);
    const description = metadata.description || `${componentName} icon`;
    const keywords = metadata.keywords || [];
    const tags = metadata.tags || [];

    return `import React from 'react';

/**
 * ${description}
 * 
 * @param size - Size of the icon (default: 24)
 * @param color - Color of the icon (default: 'currentColor')
 * @param className - Additional CSS classes
 * @param title - Accessibility title
 * @param aria-label - Accessibility label
 * @param style - Additional CSS styles
 * 
 * @keywords ${keywords.join(', ')}
 * @tags ${tags.join(', ')}
 * @category ${icon.category || 'General'}
 * 
 * @example
 * \`\`\`tsx
 * import { ComponentName } from 'icona/react';
 * 
 * function MyComponent() {
 *   return <ComponentName size={24} color="blue" />;
 * }
 * \`\`\`
 */
interface ${fullComponentName}Props {
  /** Size of the icon (width and height) */
  size?: number | string;
  /** Color of the icon */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility title */
  title?: string;
  /** Accessibility label */
  'aria-label'?: string;
  /** Additional CSS styles */
  style?: React.CSSProperties;
}

const ${fullComponentName} = React.forwardRef<SVGSVGElement, ${fullComponentName}Props>(
  ({ 
    size = 24, 
    color = 'currentColor', 
    className,
    title,
    'aria-label': ariaLabel,
    style
  }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="${icon.viewBox || '0 0 24 24'}"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      role="img"
      aria-label={ariaLabel || '${description}'}
    >
      {title && <title>{title}</title>}
      ${icon.content}
    </svg>
  )
);

${fullComponentName}.displayName = '${fullComponentName}';

export default ${fullComponentName};`;
}