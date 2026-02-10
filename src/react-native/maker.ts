import { toPascalCase } from "../utils/pascal";

/**
 * Generate a React Native component from an icon
 */
export function generateReactNativeComponent(icon: Icon): string {
    const componentName = toPascalCase(icon.name);
    const categoryPrefix = icon.category ? toPascalCase(icon.category) : "";
    const fullComponentName = categoryPrefix ? `${categoryPrefix}${componentName}` : componentName;

    return `import React from 'react';
import Svg, { Path, Polygon, Circle, Line, Polyline, Rect, Ellipse, G } from 'react-native-svg';

interface ${fullComponentName}Props {
  size?: number | string;
  color?: string;
  style?: any;
  testID?: string;
}

const ${fullComponentName}: React.FC<${fullComponentName}Props> = ({ 
  size = 24, 
  color = 'currentColor',
  style,
  testID
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="${icon.viewBox || '0 0 24 24'}"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    testID={testID}
  >
    ${icon.content}
  </Svg>
);

${fullComponentName}.displayName = '${fullComponentName}';

export default ${fullComponentName};`;
}