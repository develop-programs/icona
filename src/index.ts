import fs from "fs"
import path from "path"

const iconsDir = "./icons";
const outputDir = "./dist";
const reactDir = path.join(outputDir, "react");
const vueDir = path.join(outputDir, "vue");
const reactNativeDir = path.join(outputDir, "react-native");

import { generateReactComponent } from "./react/maker";
import { generateVueComponent } from "./vue/maker";
import { generateReactNativeComponent } from "./react-native/maker";

interface Icon {
  name: string;
  path: string;
  category?: string;
  content: string;
  viewBox?: string;
  width?: number;
  height?: number;
}

const allIcons: Icon[] = [];

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
        const category = path.relative(iconsDir, path.dirname(fullPath));
        const attributes = extractSVGAttributes(svgContent);
        const content = extractSVGContent(svgContent);

        const icon: Icon = {
          name: iconName,
          path: fullPath,
          content,
          ...(category && { category }),
          ...(attributes.viewBox && { viewBox: attributes.viewBox }),
          ...(attributes.width && { width: attributes.width }),
          ...(attributes.height && { height: attributes.height })
        };

        // Add to global icons array
        allIcons.push(icon);

        // Generate React component
        const reactComponent = generateReactComponent(icon);
        const reactCategory = icon.category ? path.join(reactDir, icon.category) : reactDir;
        ensureDirectoryExists(reactCategory);
        fs.writeFileSync(path.join(reactCategory, `${iconName}.tsx`), reactComponent);

        // Generate Vue component
        const vueComponent = generateVueComponent(icon);
        const vueCategory = icon.category ? path.join(vueDir, icon.category) : vueDir;
        ensureDirectoryExists(vueCategory);
        fs.writeFileSync(path.join(vueCategory, `${iconName}.vue`), vueComponent);

        // Generate React Native component
        const reactNativeComponent = generateReactNativeComponent(icon);
        const reactNativeCategory = icon.category ? path.join(reactNativeDir, icon.category) : reactNativeDir;
        ensureDirectoryExists(reactNativeCategory);
        fs.writeFileSync(path.join(reactNativeCategory, `${iconName}.tsx`), reactNativeComponent);

        console.log(`Generated components for ${icon.category ? icon.category + "/" : ""}${iconName}`);
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error);
      }
    }
  });
}

// Ensure output directories exist
ensureDirectoryExists(reactDir);
ensureDirectoryExists(vueDir);
ensureDirectoryExists(reactNativeDir);

// Process all icons
walkDir(iconsDir);

console.log(`\nProcessed ${allIcons.length} icons across ${[...new Set(allIcons.map(icon => icon.category).filter(Boolean))].length} categories`);
console.log("React components saved to dist/react/");
console.log("Vue components saved to dist/vue/");
console.log("React Native components saved to dist/react-native/");