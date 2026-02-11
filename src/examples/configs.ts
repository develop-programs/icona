import { IconaConfig } from '../types/config';

/**
 * Simple configuration examples for the library
 * The source is now configured via environment variables
 */

// Default configuration - can be customized
export const defaultConfig: IconaConfig = {
    output: {
        directory: './dist',
        react: true,
        vue: true,
        reactNative: true
    },
    optimization: {
        enabled: true,
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

// React-only configuration
export const reactOnlyConfig: IconaConfig = {
    output: {
        directory: './dist',
        react: true,
        vue: false,
        reactNative: false
    },
    optimization: {
        enabled: true
    }
};

// Vue-only configuration
export const vueOnlyConfig: IconaConfig = {
    output: {
        directory: './dist',
        react: false,
        vue: true,
        reactNative: false
    },
    optimization: {
        enabled: true
    }
};

// React Native only configuration
export const reactNativeOnlyConfig: IconaConfig = {
    output: {
        directory: './dist',
        react: false,
        vue: false,
        reactNative: true
    },
    optimization: {
        enabled: true
    }
};

// No optimization configuration
export const noOptimizationConfig: IconaConfig = {
    output: {
        directory: './dist',
        react: true,
        vue: true,
        reactNative: true
    },
    optimization: {
        enabled: false
    }
};