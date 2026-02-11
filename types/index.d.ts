interface IconMetadata {
    /** Human-readable description of the icon */
    description?: string;
    /** Keywords for search functionality */
    keywords?: string[];
    /** Tags for categorization */
    tags?: string[];
    /** Popularity/usage score for better autocomplete ordering */
    popularity?: number;
    /** Alternative names for the icon */
    aliases?: string[];
}

interface Icon {
    name: string;
    path: string;
    category?: string;
    content: string;
    viewBox?: string;
    width?: number;
    height?: number;
    /** Metadata for enhanced autocomplete and search */
    metadata?: IconMetadata;
}