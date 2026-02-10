import { toPascalCase } from "../utils/pascal";

/**
 * Generate a React component from an icon
 */
export function generateReactComponent(icon: Icon): string {
    const componentName = toPascalCase(icon.name);
    const categoryPrefix = icon.category ? toPascalCase(icon.category) : "";
    const fullComponentName = categoryPrefix ? `${categoryPrefix}${componentName}` : componentName;

    return `import React from 'react';

interface ${fullComponentName}Props {
  size?: number | string;
  color?: string;
  className?: string;
  title?: string;
  'aria-label'?: string;
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
      aria-label={ariaLabel || '${componentName}'}
    >
      {title && <title>{title}</title>}
      ${icon.content}
    </svg>
  )
);

${fullComponentName}.displayName = '${fullComponentName}';

export default ${fullComponentName};`;
}