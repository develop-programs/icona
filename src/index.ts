import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import { IconaConfig, Icon, BuildConfig } from "./types/config";
import { generateReactComponent } from "./react/maker";
import { generateVueComponent } from "./vue/maker";
import { generateReactNativeComponent } from "./react-native/maker";
import { generateIconMetadata } from "./utils/metadata";
import { generateIconTypes, generateIconRegistry } from "./utils/types-generator";
import { 
  optimizeSVG, 
  processRemoteSVG,
  fetchGitHubIcons
} from "./utils/remote";

// Load environment variables
dotenv.config();

// Build configuration from environment variables
function getBuildConfig(): BuildConfig {
  const config: BuildConfig = {
    localPath: process.env.ICONS_LOCAL_PATH || './icons',
    timeout: parseInt(process.env.ICONS_TIMEOUT || '30000', 10)
  };

  if (process.env.ICONS_REMOTE_URL) {
    config.remoteUrl = process.env.ICONS_REMOTE_URL;
  }

  if (process.env.ICONS_AUTH_TOKEN) {
    config.authToken = process.env.ICONS_AUTH_TOKEN;
  }

  return config;
}

// Default configuration
function getDefaultConfig(): IconaConfig {
  return {
    output: {
      directory: process.env.BUILD_OUTPUT_DIR || './dist',
      react: process.env.BUILD_REACT !== 'false',
      vue: process.env.BUILD_VUE !== 'false',
      reactNative: process.env.BUILD_REACT_NATIVE !== 'false'
    },
    optimization: {
      enabled: process.env.ENABLE_SVG_OPTIMIZATION !== 'false',
      svgoConfig: {
        plugins: [
          'cleanupAttrs',
          'removeDoctype',
          'removeXMLProcInst',
          'removeComments',
          'removeMetadata',
          'removeTitle',
          'removeDesc',
          'removeUselessDefs',
          'removeEditorsNSData',
          'removeEmptyAttrs',
          'removeHiddenElems',
          'removeEmptyText',
          'removeEmptyContainers',
          'cleanupEnableBackground',
          'convertStyleToAttrs',
          'convertColors',
          'convertPathData',
          'convertTransform',
          'removeUnknownsAndDefaults',
          'removeNonInheritableGroupAttrs',
          'removeUselessStrokeAndFill',
          'removeUnusedNS',
          'cleanupIds',
          'cleanupNumericValues',
          'moveElemsAttrsToGroup',
          'moveGroupAttrsToElems',
          'collapseGroups',
          'removeRasterImages',
          'mergePaths',
          'convertShapeToPath',
          'sortAttrs'
        ],
        multipass: true
      }
    }
  };
}

interface GenerateOptions {
  config?: Partial<IconaConfig>;
}

/**
 * Main function to generate icon components
 * Uses environment variables for source configuration
 */
export async function generateIcons(options: GenerateOptions = {}): Promise<void> {
  const config: IconaConfig = {
    ...getDefaultConfig(),
    ...options.config,
    output: { ...getDefaultConfig().output, ...options.config?.output },
    optimization: { ...getDefaultConfig().optimization, ...options.config?.optimization }
  };

  const buildConfig = getBuildConfig();
  const source = process.env.ICONS_SOURCE || 'local';

  console.log(`🚀 Starting icon generation with ${source} source...`);
  
  const outputDir = config.output.directory;
  const reactDir = path.join(outputDir, "react");
  const vueDir = path.join(outputDir, "vue");
  const reactNativeDir = path.join(outputDir, "react-native");

  // Ensure output directories exist
  if (config.output.react) ensureDirectoryExists(reactDir);
  if (config.output.vue) ensureDirectoryExists(vueDir);
  if (config.output.reactNative) ensureDirectoryExists(reactNativeDir);

  let icons: Icon[] = [];

  try {
    if (source === 'local') {
      icons = await processLocalIcons(buildConfig.localPath, config);
    } else {
      icons = await processRemoteIcons(buildConfig, config);
    }

    // Generate components for each icon
    for (const icon of icons) {
      await generateComponentsForIcon(icon, config, reactDir, vueDir, reactNativeDir);
    }

    // Generate index files for each framework
    if (config.output.react) generateIndexFile(icons, reactDir, 'tsx');
    if (config.output.vue) generateIndexFile(icons, vueDir, 'ts');
    if (config.output.reactNative) generateIndexFile(icons, reactNativeDir, 'tsx');
    
    // Generate TypeScript definitions and icon registry
    const typesDir = path.join(outputDir, "types");
    ensureDirectoryExists(typesDir);
    
    generateIconTypes(buildConfig.localPath, path.join(typesDir, "icons.ts"));
    generateIconRegistry(buildConfig.localPath, path.join(typesDir, "registry.ts"));
    
    // Generate main search API
    generateSearchAPI(icons, typesDir);

    console.log(`\n✅ Successfully processed ${icons.length} icons`);
    console.log(`📈 Categories: ${[...new Set(icons.map(icon => icon.category).filter(Boolean))].length}`);
    
    if (config.output.react) console.log(`📦 React components saved to ${reactDir}/`);
    if (config.output.vue) console.log(`📦 Vue components saved to ${vueDir}/`);
    if (config.output.reactNative) console.log(`📦 React Native components saved to ${reactNativeDir}/`);

  } catch (error) {
    console.error('❌ Error during icon generation:', error);
    throw error;
  }
}

/**
 * Process icons from local filesystem
 */
async function processLocalIcons(localPath: string, config: IconaConfig): Promise<Icon[]> {
  const icons: Icon[] = [];

  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) {
      console.log(`Icons directory '${dir}' does not exist. Creating...`);
      fs.mkdirSync(dir, { recursive: true });
      return;
    }

    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith(".svg")) {
        try {
          const svgContent = fs.readFileSync(fullPath, "utf-8");
          const iconName = file.replace(".svg", "");
          const category = path.relative(localPath, path.dirname(fullPath));
          
          processLocalSVG(svgContent, iconName, category, fullPath, config, icons);
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error);
        }
      }
    });
  }

  walkDir(localPath);
  return icons;
}

/**
 * Process single local SVG file
 */
async function processLocalSVG(
  svgContent: string, 
  iconName: string, 
  category: string, 
  fullPath: string, 
  config: IconaConfig, 
  icons: Icon[]
): Promise<void> {
  try {
    // Optimize SVG if enabled
    let optimizedContent = svgContent;
    if (config.optimization.enabled) {
      optimizedContent = await optimizeSVG(svgContent, config.optimization.svgoConfig);
    }

    const attributes = extractSVGAttributes(optimizedContent);
    const content = extractSVGContent(optimizedContent);
    
    // Generate metadata for the icon
    const metadata = generateIconMetadata(iconName, category);

    const icon: Icon = {
      name: iconName,
      path: fullPath,
      content,
      optimized: config.optimization.enabled,
      metadata,
      ...(category && { category }),
      ...(attributes.viewBox && { viewBox: attributes.viewBox }),
      ...(attributes.width && { width: attributes.width }),
      ...(attributes.height && { height: attributes.height })
    };

    icons.push(icon);
    console.log(`📁 Processed ${icon.category ? icon.category + "/" : ""}${iconName}`);
  } catch (error) {
    console.error(`Error processing local SVG ${iconName}:`, error);
  }
}

/**
 * Process icons from remote source
 */
async function processRemoteIcons(buildConfig: BuildConfig, config: IconaConfig): Promise<Icon[]> {
  const icons: Icon[] = [];
  
  if (!buildConfig.remoteUrl) {
    throw new Error('ICONS_REMOTE_URL environment variable is required for remote source');
  }

  try {
    let svgUrls: Array<{ url: string; name: string; category: string }> = [];

    console.log('🔍 Discovering remote icon structure...');
    svgUrls = await fetchGitHubIcons(buildConfig.remoteUrl, buildConfig.authToken);
    console.log(`📥 Found ${svgUrls.length} remote SVG files`);

    // Process each remote SVG
    for (const { url, name, category } of svgUrls) {
      try {
        const icon = await processRemoteSVG(url, name, category, buildConfig, config);
        icons.push(icon);
        console.log(`🌐 Downloaded ${icon.category ? icon.category + "/" : ""}${name}`);
      } catch (error) {
        console.error(`Failed to process remote SVG ${name} from ${url}:`, error);
      }
    }

  } catch (error) {
    console.error('Failed to process remote icons:', error);
    throw error;
  }

  return icons;
}

/**
 * Generate components for a single icon
 */
async function generateComponentsForIcon(
  icon: Icon, 
  config: IconaConfig, 
  reactDir: string, 
  vueDir: string, 
  reactNativeDir: string
): Promise<void> {
  try {
    // Generate React component
    if (config.output.react) {
      const reactComponent = generateReactComponent(icon);
      const reactCategory = icon.category ? path.join(reactDir, icon.category) : reactDir;
      ensureDirectoryExists(reactCategory);
      fs.writeFileSync(path.join(reactCategory, `${icon.name}.tsx`), reactComponent);
    }

    // Generate Vue component
    if (config.output.vue) {
      const vueComponent = generateVueComponent(icon);
      const vueCategory = icon.category ? path.join(vueDir, icon.category) : vueDir;
      ensureDirectoryExists(vueCategory);
      fs.writeFileSync(path.join(vueCategory, `${icon.name}.vue`), vueComponent);
    }

    // Generate React Native component
    if (config.output.reactNative) {
      const reactNativeComponent = generateReactNativeComponent(icon);
      const reactNativeCategory = icon.category ? path.join(reactNativeDir, icon.category) : reactNativeDir;
      ensureDirectoryExists(reactNativeCategory);
      fs.writeFileSync(path.join(reactNativeCategory, `${icon.name}.tsx`), reactNativeComponent);
    }

  } catch (error) {
    console.error(`Error generating components for ${icon.name}:`, error);
  }
}

/**
 * Generate index.ts/js file that exports all icons
 */
function generateIndexFile(icons: Icon[], outputDir: string, extension: string): void {
  const exports: string[] = [];
  const iconsByCategory = new Map<string, Icon[]>();
  
  // Group icons by category
  icons.forEach(icon => {
    const category = icon.category || 'root';
    if (!iconsByCategory.has(category)) {
      iconsByCategory.set(category, []);
    }
    iconsByCategory.get(category)!.push(icon);
  });

  // Generate exports
  iconsByCategory.forEach((categoryIcons, category) => {
    categoryIcons.forEach(icon => {
      const relativePath = category === 'root' 
        ? `./${icon.name}`
        : `./${category}/${icon.name}`;
      
      exports.push(`export { default as ${toPascalCase(icon.name)} } from '${relativePath}';`);
    });
  });

  const indexContent = exports.join('\n') + '\n';
  fs.writeFileSync(path.join(outputDir, `index.${extension === 'tsx' ? 'ts' : 'ts'}`), indexContent);
}

function extractSVGAttributes(content: string): { viewBox?: string; width?: number; height?: number } {
  const viewBoxMatch = content.match(/viewBox=["']([^"']*)["']/);
  const widthMatch = content.match(/width=["']([^"']*)["']/);
  const heightMatch = content.match(/height=["']([^"']*)["']/);

  const result: { viewBox?: string; width?: number; height?: number } = {};
  
  if (viewBoxMatch?.[1]) {
    result.viewBox = viewBoxMatch[1];
  }
  
  if (widthMatch?.[1]) {
    result.width = parseInt(widthMatch[1], 10);
  }
  
  if (heightMatch?.[1]) {
    result.height = parseInt(heightMatch[1], 10);
  }
  
  return result;
}

function extractSVGContent(svgContent: string): string {
  // Remove the outer <svg> tags and get inner content
  const match = svgContent.match(/<svg[^>]*>(.*)<\/svg>/s);
  return match?.[1]?.trim() || svgContent.trim();
}

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function toPascalCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[-_\s\/]+(.)?/g, (_, char?: string): string =>
      char?.toUpperCase() ?? ''
    )
    .replace(/^[a-z]/, (char: string): string => char.toUpperCase());
}

/**
 * Generate search API for runtime icon searching
 */
function generateSearchAPI(icons: Icon[], outputDir: string): void {
  const searchAPIContent = `// Auto-generated search API
// Do not edit this file manually

import { 
  searchIcons as searchIconsUtil, 
  getIconsByCategory as getIconsByCategoryUtil, 
  getCategories as getCategoriesUtil, 
  getAllTags as getAllTagsUtil, 
  getIconSuggestions as getIconSuggestionsUtil, 
  createSearchIndex, 
  IconSearchOptions, 
  IconSearchResult, 
  IconData 
} from '../utils/search';
import { toPascalCase } from '../utils/pascal';

// Convert icons to search format
const iconData: IconData[] = [
${icons.map(icon => `  {
    name: '${icon.name}',
    component: '${toPascalCase(icon.name)}',
    category: '${icon.category || ''}',
    metadata: ${JSON.stringify(icon.metadata, null, 6)}
  }`).join(',\n')}
];

// Create search index for faster lookups
const searchIndex = createSearchIndex(iconData);

/**
 * Search for icons by query with fuzzy matching
 */
export function searchIcons(options: IconSearchOptions): IconSearchResult[] {
  return searchIconsUtil(iconData, options);
}

/**
 * Get icon suggestions for autocomplete (similar to Lucide)
 */
export function getIconSuggestions(partial: string, limit?: number): IconSearchResult[] {
  return getIconSuggestionsUtil(iconData, partial, limit);
}

/**
 * Get all icons in a specific category
 */
export function getIconsByCategory(category: string): IconData[] {
  return getIconsByCategoryUtil(iconData, category);
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  return getCategoriesUtil(iconData);
}

/**
 * Get all available tags
 */
export function getAllTags(): string[] {
  return getAllTagsUtil(iconData);
}

/**
 * Get all available icon names
 */
export function getAllIconNames(): string[] {
  return iconData.map(icon => icon.name);
}

/**
 * Get icon metadata by name
 */
export function getIconMetadata(name: string): IconSearchResult | undefined {
  const icon = iconData.find(i => i.name === name);
  if (!icon || !icon.metadata) return undefined;
  
  return {
    name: icon.name,
    component: icon.component,
    description: icon.metadata.description,
    keywords: icon.metadata.keywords,
    tags: icon.metadata.tags,
    category: icon.category,
    score: 1.0
  };
}
`;

  fs.writeFileSync(path.join(outputDir, 'search.ts'), searchAPIContent);
  console.log('✅ Generated search API');
}

// For backwards compatibility / CLI usage - run with default config
if (require.main === module) {
  (async () => {
    try {
      await generateIcons();
    } catch (error) {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    }
  })();
}