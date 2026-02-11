import { IconMetadata } from "../types/config";
import { generateIconMetadata } from "./metadata";

export interface IconSearchResult {
    name: string;
    component: string;
    description?: string;
    keywords?: string[];
    tags?: string[];
    category?: string;
    score: number;
}

export interface IconSearchOptions {
    /** Search query */
    query: string;
    /** Maximum number of results to return */
    limit?: number;
    /** Categories to search within */
    categories?: string[];
    /** Tags to filter by */
    tags?: string[];
    /** Minimum score threshold */
    minScore?: number;
}

export interface IconData {
    name: string;
    component: string;
    category?: string;
    metadata?: IconMetadata;
}

/**
 * Search for icons based on query with fuzzy matching and scoring
 */
export function searchIcons(icons: IconData[], options: IconSearchOptions): IconSearchResult[] {
    const { query, limit = 20, categories, tags, minScore = 0.1 } = options;

    if (!query.trim()) {
        return [];
    }

    const results: IconSearchResult[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    for (const icon of icons) {
        const metadata = icon.metadata || generateIconMetadata(icon.name, icon.category);

        // Apply category filter
        if (categories && categories.length > 0) {
            if (!icon.category || !categories.includes(icon.category)) {
                continue;
            }
        }

        // Apply tags filter
        if (tags && tags.length > 0) {
            const iconTags = metadata.tags || [];
            if (!tags.some((tag: string) => iconTags.includes(tag))) {
                continue;
            }
        }

        const score = calculateMatchScore(normalizedQuery, icon, metadata);

        if (score >= minScore) {
            results.push({
                name: icon.name,
                component: icon.component,
                ...(metadata.description && { description: metadata.description }),
                ...(metadata.keywords && { keywords: metadata.keywords }),
                ...(metadata.tags && { tags: metadata.tags }),
                ...(icon.category && { category: icon.category }),
                score
            });
        }
    }

    // Sort by score (highest first) and take top results
    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

/**
 * Calculate match score for an icon against a search query
 */
function calculateMatchScore(query: string, icon: IconData, metadata: IconMetadata): number {
    const name = icon.name.toLowerCase();
    const keywords = metadata.keywords || [];
    const tags = metadata.tags || [];
    const aliases = metadata.aliases || [];
    const description = metadata.description?.toLowerCase() || '';

    let score = 0;

    // Exact name match (highest score)
    if (name === query) {
        return 1.0;
    }

    // Name starts with query (very high score)
    if (name.startsWith(query)) {
        score += 0.9;
    }

    // Name contains query
    if (name.includes(query)) {
        score += 0.7;
    }

    // Check for fuzzy match in name
    const fuzzyScore = fuzzyMatch(query, name);
    score += fuzzyScore * 0.6;

    // Keyword matches
    for (const keyword of keywords) {
        const keywordLower = keyword.toLowerCase();
        if (keywordLower === query) {
            score += 0.8;
        } else if (keywordLower.startsWith(query)) {
            score += 0.6;
        } else if (keywordLower.includes(query)) {
            score += 0.4;
        } else {
            score += fuzzyMatch(query, keywordLower) * 0.3;
        }
    }

    // Tag matches
    for (const tag of tags) {
        const tagLower = tag.toLowerCase();
        if (tagLower === query) {
            score += 0.5;
        } else if (tagLower.startsWith(query)) {
            score += 0.4;
        } else if (tagLower.includes(query)) {
            score += 0.3;
        }
    }

    // Alias matches
    for (const alias of aliases) {
        const aliasLower = alias.toLowerCase();
        if (aliasLower === query) {
            score += 0.7;
        } else if (aliasLower.startsWith(query)) {
            score += 0.5;
        } else if (aliasLower.includes(query)) {
            score += 0.3;
        }
    }

    // Description matches
    if (description.includes(query)) {
        score += 0.2;
    }

    // Boost popular icons
    if (metadata.popularity) {
        score += (metadata.popularity / 100) * 0.1;
    }

    // Boost exact word matches in multi-word queries
    const queryWords = query.split(/\s+/);
    const nameWords = name.split(/[-_\s]+/);

    for (const queryWord of queryWords) {
        for (const nameWord of nameWords) {
            if (nameWord === queryWord) {
                score += 0.3;
            } else if (nameWord.startsWith(queryWord)) {
                score += 0.2;
            }
        }
    }

    // Normalize score to be between 0 and 1
    return Math.min(score, 1.0);
}

/**
 * Simple fuzzy matching algorithm
 * Returns a score between 0 and 1 based on character similarity
 */
function fuzzyMatch(pattern: string, text: string): number {
    const patternLength = pattern.length;
    const textLength = text.length;

    if (patternLength === 0) return 1;
    if (textLength === 0) return 0;

    let matches = 0;
    let patternIndex = 0;

    for (let textIndex = 0; textIndex < textLength && patternIndex < patternLength; textIndex++) {
        if (pattern[patternIndex] === text[textIndex]) {
            matches++;
            patternIndex++;
        }
    }

    // Calculate match ratio
    const matchRatio = matches / patternLength;

    // Penalize for length difference
    const lengthPenalty = Math.abs(patternLength - textLength) / Math.max(patternLength, textLength);

    return Math.max(0, matchRatio - lengthPenalty * 0.5);
}

/**
 * Get icons by category
 */
export function getIconsByCategory(icons: IconData[], category: string): IconData[] {
    return icons.filter(icon => icon.category === category);
}

/**
 * Get all available categories
 */
export function getCategories(icons: IconData[]): string[] {
    const categories = new Set<string>();

    for (const icon of icons) {
        if (icon.category) {
            categories.add(icon.category);
        }
    }

    return Array.from(categories).sort();
}

/**
 * Get all available tags
 */
export function getAllTags(icons: IconData[]): string[] {
    const tags = new Set<string>();

    for (const icon of icons) {
        const metadata = icon.metadata || generateIconMetadata(icon.name, icon.category);
        if (metadata.tags) {
            metadata.tags.forEach(tag => tags.add(tag));
        }
    }

    return Array.from(tags).sort();
}

/**
 * Get icon suggestions based on partial input (for autocomplete)
 */
export function getIconSuggestions(
    icons: IconData[],
    partial: string,
    limit: number = 10
): IconSearchResult[] {
    if (!partial.trim()) {
        // Return most popular icons when no query
        return icons
            .map(icon => {
                const metadata = icon.metadata || generateIconMetadata(icon.name, icon.category);
                return {
                    name: icon.name,
                    component: icon.component,
                    ...(metadata.description && { description: metadata.description }),
                    ...(metadata.keywords && { keywords: metadata.keywords }),
                    ...(metadata.tags && { tags: metadata.tags }),
                    ...(icon.category && { category: icon.category }),
                    score: (metadata.popularity || 40) / 100
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    return searchIcons(icons, {
        query: partial,
        limit,
        minScore: 0.05
    });
}

/**
 * Create an index for faster searching
 */
export function createSearchIndex(icons: IconData[]): Map<string, IconData[]> {
    const index = new Map<string, IconData[]>();

    for (const icon of icons) {
        const metadata = icon.metadata || generateIconMetadata(icon.name, icon.category);
        const searchTerms = [
            icon.name,
            ...(metadata.keywords || []),
            ...(metadata.tags || []),
            ...(metadata.aliases || []),
            icon.category
        ].filter(term => term);

        for (const term of searchTerms) {
            const normalizedTerm = term!.toLowerCase();

            // Index by full term and prefixes
            for (let i = 1; i <= normalizedTerm.length; i++) {
                const prefix = normalizedTerm.substring(0, i);

                if (!index.has(prefix)) {
                    index.set(prefix, []);
                }

                const iconList = index.get(prefix)!;
                if (!iconList.find(existing => existing.name === icon.name)) {
                    iconList.push(icon);
                }
            }
        }
    }

    return index;
}

/**
 * Search using pre-built index for faster results
 */
export function searchWithIndex(
    index: Map<string, IconData[]>,
    query: string,
    limit: number = 20
): IconData[] {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
        return [];
    }

    const candidates = index.get(normalizedQuery) || [];

    // If we have fewer candidates than the limit, try shorter prefixes
    if (candidates.length < limit && normalizedQuery.length > 1) {
        for (let i = normalizedQuery.length - 1; i >= 1; i--) {
            const prefix = normalizedQuery.substring(0, i);
            const prefixCandidates = index.get(prefix) || [];

            // Add new candidates that aren't already included
            for (const candidate of prefixCandidates) {
                if (!candidates.find(existing => existing.name === candidate.name)) {
                    candidates.push(candidate);

                    if (candidates.length >= limit) {
                        break;
                    }
                }
            }

            if (candidates.length >= limit) {
                break;
            }
        }
    }

    return candidates.slice(0, limit);
}

/**
 * Get all available icon names
 */
export function getAllIconNames(icons: IconData[]): string[] {
    return icons.map(icon => icon.name);
}

/**
 * Get metadata for a specific icon
 */
export function getIconMetadata(icons: IconData[], iconName: string): IconMetadata | undefined {
    const icon = icons.find(i => i.name === iconName);
    if (!icon) return undefined;
    
    return icon.metadata || generateIconMetadata(icon.name, icon.category);
}