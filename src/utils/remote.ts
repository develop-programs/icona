import fetch from 'node-fetch';
import { optimize, Config as SVGOConfig } from 'svgo';
import { IconaConfig, Icon } from '../types/config';

/**
 * Optimize SVG content using SVGO
 */
export async function optimizeSVG(content: string, config?: any): Promise<string> {
  const defaultConfig: SVGOConfig = {
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
      'removeViewBox',
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
    multipass: true,
    ...config
  };

  try {
    const result = optimize(content, defaultConfig);
    return result.data;
  } catch (error) {
    console.error('SVG optimization failed:', error);
    return content; // Return original content if optimization fails
  }
}

/**
 * Fetch content from URL with timeout and headers support
 */
export async function fetchWithConfig(
  url: string, 
  headers?: Record<string, string>, 
  timeout: number = 10000
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...(headers && { headers }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch GitHub repository icons
 */
export async function fetchGitHubIcons(
  repoUrl: string,
  authToken?: string
): Promise<Array<{ url: string; name: string; category: string }>> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Icona-Library'
    };
    
    if (authToken) {
      headers['Authorization'] = `token ${authToken}`;
    }

    const response = await fetchWithConfig(repoUrl, headers);
    const files = JSON.parse(response) as Array<{
      name: string;
      type: 'file' | 'dir';
      download_url?: string;
      url: string;
    }>;

    const svgFiles = files
      .filter(file => file.type === 'file' && file.name.endsWith('.svg'))
      .map(file => ({
        url: file.download_url || file.url,
        name: file.name.replace('.svg', ''),
        category: ''
      }));

    return svgFiles;
  } catch (error) {
    console.error('Failed to fetch GitHub icons:', error);
    return [];
  }
}

/**
 * Download and process SVG from remote URL (updated signature)
 */
export async function processRemoteSVG(
  url: string,
  name: string,
  category: string,
  buildConfig: any,
  iconaConfig: any
): Promise<any> {
  try {
    // Fetch SVG content
    const headers = buildConfig.authToken 
      ? { 'Authorization': `Bearer ${buildConfig.authToken}` }
      : undefined;
      
    const svgContent = await fetchWithConfig(
      url, 
      headers,
      buildConfig.timeout
    );

    // Optimize SVG if enabled
    let optimizedContent = svgContent;
    if (iconaConfig.optimization.enabled) {
      optimizedContent = await optimizeSVG(svgContent, iconaConfig.optimization.svgoConfig);
    }

    // Extract SVG attributes and content
    const attributes = extractSVGAttributes(optimizedContent);
    const content = extractSVGContent(optimizedContent);

    return {
      name,
      path: url,
      content,
      category: category || undefined,
      optimized: iconaConfig.optimization.enabled,
      ...(attributes.viewBox && { viewBox: attributes.viewBox }),
      ...(attributes.width && { width: attributes.width }),
      ...(attributes.height && { height: attributes.height })
    };
  } catch (error) {
    console.error(`Failed to process SVG from ${url}:`, error);
    throw error;
  }
}

/**
 * Extract SVG attributes from content
 */
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

/**
 * Extract inner SVG content (remove outer svg tags)
 */
function extractSVGContent(svgContent: string): string {
  const match = svgContent.match(/<svg[^>]*>(.*)<\/svg>/s);
  return match?.[1]?.trim() || svgContent.trim();
}