// Main API
export { generateIcons } from './index';

// Types
export { IconaConfig, Icon, BuildConfig, IconMetadata } from './types/config';

// Configuration examples
export {
    defaultConfig,
    reactOnlyConfig,
    vueOnlyConfig,
    reactNativeOnlyConfig,
    noOptimizationConfig
} from './examples/configs.js';

// Component generators (for advanced users)
export { generateReactComponent } from './react/maker';
export { generateVueComponent } from './vue/maker';
export { generateReactNativeComponent } from './react-native/maker';

// Search and autocomplete functionality
export {
    searchIcons,
    getIconSuggestions,
    getIconsByCategory,
    getCategories,
    getAllTags,
    getAllIconNames,
    getIconMetadata
} from './utils/search';

// Utility functions
export { generateIconMetadata } from './utils/metadata';
export { generateIconTypes, generateIconRegistry } from './utils/types-generator';
export { toPascalCase } from './utils/pascal';