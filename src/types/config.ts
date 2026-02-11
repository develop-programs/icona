export interface IconaConfig {
  /**
   * Output directory configuration
   */
  output: {
    directory: string;
    react: boolean;
    vue: boolean;
    reactNative: boolean;
  };
  
  /**
   * SVG optimization configuration using SVGO
   */
  optimization: {
    enabled: boolean;
    /**
     * SVGO configuration options
     */
    svgoConfig?: {
      plugins?: string[];
      multipass?: boolean;
      precision?: number;
    };
  };
}

export interface BuildConfig {
  /**
   * Source configuration from environment
   */
  remoteUrl?: string;
  localPath: string;
  authToken?: string;
  timeout: number;
}

export interface IconMetadata {
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

export interface Icon {
  name: string;
  path: string;
  category?: string;
  content: string;
  viewBox?: string;
  width?: number;
  height?: number;
  optimized?: boolean;
  /** Metadata for enhanced autocomplete and search */
  metadata?: IconMetadata;
}