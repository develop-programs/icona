import { toPascalCase } from "../utils/pascal";
import { Icon } from "../types/config";
import { generateIconMetadata } from "../utils/metadata";

/**
 * Generate a React Native component from an icon
 */
export function generateReactNativeComponent(icon: Icon): string {
    const componentName = toPascalCase(icon.name);
    const categoryPrefix = icon.category ? toPascalCase(icon.category) : "";
    const fullComponentName = categoryPrefix ? `${categoryPrefix}${componentName}` : componentName;
    
    // Generate metadata for documentation
    const metadata = icon.metadata || generateIconMetadata(icon.name, icon.category);
    const description = metadata.description || `${componentName} icon`;
    const keywords = metadata.keywords || [];
    const tags = metadata.tags || [];

    return `import React from 'react';
import Svg, { Path, Polygon, Circle, Line, Polyline, Rect, Ellipse, G } from 'react-native-svg';

/**
 * ${description}
 * 
 * @param size - Size of the icon (default: 24)
 * @param color - Color of the icon (default: 'currentColor')
 * @param style - Additional styles for the SVG
 * @param testID - Test identifier for testing frameworks
 * 
 * @keywords \${keywords.join(', ')}
 * @tags \${tags.join(', ')}
 * @category \${icon.category || 'General'}
 * 
 * @example
 * \`\`\`tsx
 * import { \${fullComponentName} } from 'icona/react-native';
 * 
 * function MyScreen() {
 *   return (
 *     <View>
 *       <\${fullComponentName} size={24} color="#007AFF" />
 *     </View>
 *   );
 * }
 * \`\`\`
 */
interface \${fullComponentName}Props {
  /** Size of the icon (width and height) */
  size?: number | string;
  /** Color of the icon */
  color?: string;
  /** Additional styles for the SVG */
  style?: any;
  /** Test identifier for testing frameworks */
  testID?: string;
}

const \${fullComponentName}: React.FC<\${fullComponentName}Props> = ({ 
  size = 24, 
  color = 'currentColor',
  style,
  testID
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="\${icon.viewBox || '0 0 24 24'}"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    testID={testID}
    accessibilityLabel="\${description}"
  >
    \${icon.content}
  </Svg>
);

\${fullComponentName}.displayName = '\${fullComponentName}';

export default \\${fullComponentName}`;
}