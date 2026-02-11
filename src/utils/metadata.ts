import { IconMetadata } from "../types/config";

/**
 * Generate metadata for an icon based on its name and category
 */
export function generateIconMetadata(iconName: string, category?: string): IconMetadata {
  const normalizedName = iconName.toLowerCase().replace(/[-_\s]/g, ' ');
  const words = normalizedName.split(' ').filter(w => w.length > 0);
  
  // Generate description based on icon name
  const description = generateDescription(iconName, category);
  
  // Generate keywords from name parts
  const keywords = generateKeywords(iconName, category);
  
  // Generate tags for categorization
  const tags = generateTags(iconName, category);
  
  // Generate aliases
  const aliases = generateAliases(iconName);
  
  // Calculate popularity score
  const popularity = calculatePopularity(iconName, category);

  return {
    description,
    keywords,
    tags,
    aliases,
    popularity
  };
}

function generateDescription(iconName: string, category?: string): string {
  const name = iconName.replace(/[-_]/g, ' ').toLowerCase();
  const words = name.split(' ').filter(w => w.length > 0);
  
  // Create a more natural description
  const capitalizedName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  if (category) {
    return `${capitalizedName} icon from ${category} collection`;
  }
  
  return `${capitalizedName} icon`;
}

function generateKeywords(iconName: string, category?: string): string[] {
  const keywords = new Set<string>();
  
  // Add the exact name
  keywords.add(iconName.toLowerCase());
  
  // Add individual words from the name
  const words = iconName.toLowerCase()
    .replace(/[-_\s]/g, ' ')
    .split(' ')
    .filter(w => w.length > 0);
  
  words.forEach(word => keywords.add(word));
  
  // Add category as keyword
  if (category) {
    keywords.add(category.toLowerCase());
  }
  
  // Add semantic keywords based on common patterns
  const semanticKeywords = getSemanticKeywords(iconName);
  semanticKeywords.forEach(keyword => keywords.add(keyword));
  
  return Array.from(keywords);
}

function generateTags(iconName: string, category?: string): string[] {
  const tags = new Set<string>();
  
  // Add category as primary tag
  if (category) {
    tags.add(category.toLowerCase());
  }
  
  // Add semantic tags based on icon purpose
  const semanticTags = getSemanticTags(iconName);
  semanticTags.forEach(tag => tags.add(tag));
  
  return Array.from(tags);
}

function generateAliases(iconName: string): string[] {
  const aliases = new Set<string>();
  
  // Add common variations
  const variations = getNameVariations(iconName);
  variations.forEach(alias => aliases.add(alias));
  
  return Array.from(aliases);
}

function calculatePopularity(iconName: string, category?: string): number {
  // Define popularity based on common icon usage patterns
  const popularIcons = {
    'home': 95,
    'search': 90,
    'menu': 90,
    'user': 85,
    'heart': 85,
    'star': 85,
    'message': 80,
    'mail': 80,
    'phone': 80,
    'calendar': 75,
    'camera': 75,
    'settings': 75,
    'edit': 70,
    'delete': 70,
    'add': 70,
    'close': 70,
    'arrow': 65,
    'chevron': 65,
    'play': 60,
    'pause': 60,
    'stop': 60,
    'volume': 55,
    'lock': 55,
    'unlock': 55
  };

  const name = iconName.toLowerCase();
  
  // Check for exact matches first
  for (const [popular, score] of Object.entries(popularIcons)) {
    if (name.includes(popular)) {
      return score;
    }
  }
  
  // Default popularity based on category
  const categoryPopularity = {
    'hicon': 50,
    'waveicons': 45,
    'linear': 60,
    'bold': 55
  };
  
  if (category) {
    return categoryPopularity[category.toLowerCase() as keyof typeof categoryPopularity] || 40;
  }
  
  return 40; // Default popularity
}

function getSemanticKeywords(iconName: string): string[] {
  const name = iconName.toLowerCase();
  const keywords: string[] = [];
  
  // Navigation
  if (/arrow|chevron|left|right|up|down|back|forward|next|previous/.test(name)) {
    keywords.push('navigation', 'direction', 'arrow');
  }
  
  // Actions
  if (/add|plus|create|new/.test(name)) {
    keywords.push('action', 'add', 'create');
  }
  
  if (/delete|remove|trash|close|cross/.test(name)) {
    keywords.push('action', 'delete', 'remove');
  }
  
  if (/edit|pen|write/.test(name)) {
    keywords.push('action', 'edit', 'modify');
  }
  
  if (/search|find|magnify/.test(name)) {
    keywords.push('search', 'find', 'lookup');
  }
  
  // Communication
  if (/message|mail|envelope|send|chat/.test(name)) {
    keywords.push('communication', 'message', 'contact');
  }
  
  if (/phone|call|mobile/.test(name)) {
    keywords.push('communication', 'phone', 'call');
  }
  
  // Media
  if (/play|pause|stop|music|video|media/.test(name)) {
    keywords.push('media', 'player', 'control');
  }
  
  if (/camera|photo|image|picture/.test(name)) {
    keywords.push('media', 'photo', 'image');
  }
  
  if (/volume|sound|audio|speaker/.test(name)) {
    keywords.push('audio', 'sound', 'volume');
  }
  
  // Interface
  if (/menu|hamburger|burger/.test(name)) {
    keywords.push('interface', 'menu', 'navigation');
  }
  
  if (/settings|gear|config/.test(name)) {
    keywords.push('interface', 'settings', 'configuration');
  }
  
  // Status
  if (/check|tick|done|success|complete/.test(name)) {
    keywords.push('status', 'success', 'complete');
  }
  
  if (/warning|alert|danger|error/.test(name)) {
    keywords.push('status', 'warning', 'alert');
  }
  
  if (/info|information|help|question/.test(name)) {
    keywords.push('status', 'information', 'help');
  }
  
  return keywords;
}

function getSemanticTags(iconName: string): string[] {
  const name = iconName.toLowerCase();
  const tags: string[] = [];
  
  // UI Categories
  if (/arrow|chevron|left|right|up|down/.test(name)) tags.push('navigation');
  if (/add|edit|delete|remove|search/.test(name)) tags.push('actions');
  if (/message|mail|phone|call/.test(name)) tags.push('communication');
  if (/play|pause|music|video|camera/.test(name)) tags.push('media');
  if (/home|user|profile|settings/.test(name)) tags.push('interface');
  if (/heart|star|like|favorite/.test(name)) tags.push('social');
  if (/calendar|time|clock|date/.test(name)) tags.push('time');
  if (/lock|unlock|security|shield/.test(name)) tags.push('security');
  if (/folder|file|document|paper/.test(name)) tags.push('files');
  if (/bag|cart|shop|buy|dollar/.test(name)) tags.push('commerce');
  
  return tags;
}

function getNameVariations(iconName: string): string[] {
  const variations: string[] = [];
  
  // Common abbreviations and expansions
  const commonVariations: Record<string, string[]> = {
    'msg': ['message'],
    'doc': ['document'],
    'pic': ['picture', 'image'],
    'vid': ['video'],
    'tel': ['telephone', 'phone'],
    'cal': ['calendar'],
    'cam': ['camera'],
    'mic': ['microphone'],
    'vol': ['volume'],
    'info': ['information'],
    'config': ['configuration', 'settings'],
    'prefs': ['preferences', 'settings'],
    'fav': ['favorite', 'favourite'],
    'del': ['delete'],
    'rem': ['remove']
  };
  
  const name = iconName.toLowerCase();
  
  // Check for exact matches
  if (commonVariations[name]) {
    variations.push(...commonVariations[name]);
  }
  
  // Check for partial matches
  for (const [abbrev, expansions] of Object.entries(commonVariations)) {
    if (name.includes(abbrev)) {
      expansions.forEach(expansion => {
        const variant = name.replace(abbrev, expansion);
        variations.push(variant);
      });
    }
  }
  
  return variations;
}