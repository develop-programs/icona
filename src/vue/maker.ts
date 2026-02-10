import { toPascalCase } from "../utils/pascal";

/**
 * Generate a Vue component from an icon
 */
export function generateVueComponent(icon: Icon): string {
    const componentName = toPascalCase(icon.name);
    const categoryPrefix = icon.category ? toPascalCase(icon.category) : "";
    const fullComponentName = categoryPrefix ? `${categoryPrefix}${componentName}` : componentName;

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
    :aria-label="ariaLabel || '${componentName}'"
  >
    <title v-if="title">{{ title }}</title>
    ${icon.content}
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string;
  className?: string;
  style?: Record<string, any>;
  title?: string;
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
