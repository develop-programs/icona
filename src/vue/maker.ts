import { toPascalCase } from "../utils/pascal";
import { Icon } from "../types/config";
import { generateIconMetadata } from "../utils/metadata";

/**
 * Generate a Vue component from an icon
 */
export function generateVueComponent(icon: Icon): string {
    const componentName = toPascalCase(icon.name);
    const categoryPrefix = icon.category ? toPascalCase(icon.category) : "";
    const fullComponentName = categoryPrefix ? `${categoryPrefix}${componentName}` : componentName;
    
    // Generate metadata for documentation
    const metadata = icon.metadata || generateIconMetadata(icon.name, icon.category);
    const description = metadata.description || `${componentName} icon`;
    const keywords = metadata.keywords || [];
    const tags = metadata.tags || [];

    return `<template>
  <svg
    :width="size"
    :height="size"
    viewBox="${icon.viewBox || '0 0 24 24'}"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
    :style="style"
    role="img"
    :aria-label="ariaLabel || '${description}'"
  >
    <title v-if="title">{{ title }}</title>
    ${icon.content}
  </svg>
</template>

<script setup lang="ts">
/**
 * ${description}
 * 
 * @param size - Size of the icon (default: 24)
 * @param className - Additional CSS classes
 * @param style - Additional CSS styles
 * @param title - Accessibility title
 * @param ariaLabel - Accessibility label
 * 
 * @keywords ${keywords.join(', ')}
 * @tags ${tags.join(', ')}
 * @category ${icon.category || 'General'}
 * 
 * @example
 * \`\`\`vue
 * <template>
 *   <ComponentName :size="24" class="my-icon" />
 * </template>
 * 
 * <script setup>
 * import { ComponentName } from 'icona/vue';
 * </script>
 * \`\`\`
 */
interface Props {
  /** Size of the icon (width and height) */
  size?: number | string;
  /** Additional CSS classes */
  className?: string;
  /** Additional CSS styles */
  style?: Record<string, any>;
  /** Accessibility title */
  title?: string;
  /** Accessibility label */
  ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  size: 24,
  className: '',
  style: () => ({}),
  title: '',
  ariaLabel: ''
});
</script>

<script lang="ts">
export default {
  name: '${fullComponentName}'
};
</script>`;
}
