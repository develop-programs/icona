/**
 * Demo showing how to use Icona's autocomplete functionality
 * Similar to Lucide icons search capabilities
 */

import { 
  searchIcons,
  getIconSuggestions,
  getAllIconNames,
  getIconsByCategory,
  getCategories,
  IconData,
  IconSearchResult
} from '../utils/search';

// Mock data for demo purposes
const mockIcons: IconData[] = [
  { name: 'chevron-right', component: 'ChevronRight', category: 'Linear' },
  { name: 'chevron-left', component: 'ChevronLeft', category: 'Linear' },
  { name: 'chevron-up', component: 'ChevronUp', category: 'Linear' },
  { name: 'chevron-down', component: 'ChevronDown', category: 'Linear' },
  { name: 'home', component: 'Home', category: 'Hicon' },
  { name: 'search', component: 'Search', category: 'Hicon' },
  { name: 'message-square', component: 'MessageSquare', category: 'Hicon' }
];

// Example 1: Basic autocomplete - type "che" to get chevron suggestions
function demoBasicAutocomplete() {
  console.log('=== Basic Autocomplete Demo ===');
  
  const suggestions = getIconSuggestions(mockIcons, 'che', 5);
  console.log('Typing "che" suggests:', suggestions.map((s: IconSearchResult) => s.name));
  
  // Expected output: ['chevron-right', 'chevron-left', 'chevron-up', 'chevron-down', etc.]
}

// Example 2: Search with keywords
function demoKeywordSearch() {
  console.log('\n=== Keyword Search Demo ===');
  
  const results = searchIcons(mockIcons, {
    query: 'navigation',
    limit: 10
  });
  
  console.log('Searching for "navigation":', results.map((r: IconSearchResult) => r.name));
  // Expected: arrow icons, chevron icons, menu icons, etc.
}

// Example 3: Category-based search
function demoCategorySearch() {
  console.log('\n=== Category Search Demo ===');
  
  const categories = getCategories(mockIcons);
  console.log('Available categories:', categories);
  
  // Get all icons in Linear category
  const linearIcons = getIconsByCategory(mockIcons, 'Linear');
  console.log(`Linear category has ${linearIcons.length} icons`);
}

// Example 4: Advanced search with filters
function demoAdvancedSearch() {
  console.log('\n=== Advanced Search Demo ===');
  
  const results = searchIcons(mockIcons, {
    query: 'message',
    categories: ['Hicon'],
    tags: ['communication'],
    limit: 5,
    minScore: 0.3
  });
  
  console.log('Advanced search results:', results);
}

// Example 5: TypeScript autocomplete demo
function demoTypeScriptAutocomplete() {
  console.log('\n=== TypeScript Autocomplete ===');
  
  // With TypeScript, you get autocompletion for icon names
  const allIcons = getAllIconNames(mockIcons);
  console.log(`Total icons available: ${allIcons.length}`);
  
  // TypeScript will suggest icon names as you type:
  // - IconName type provides all available icon names
  // - IconsStartingWith<'che'> provides icons starting with "che"
  // - IconsContaining<'arrow'> provides icons containing "arrow"
}

// React component example with autocomplete
function ReactIconExample() {
  // In a real React component, you'd have autocomplete for these icon names
  /*
  import { ChevronRight, Home, Search, MessageSquare } from 'icona/react';
  
  return (
    <div>
      <ChevronRight size={24} color="blue" />
      <Home size={32} />
      <Search className="search-icon" />
      <MessageSquare size={20} color="#333" />
    </div>
  );
  */
}

// Vue component example with autocomplete
function VueIconExample() {
  // In a real Vue component:
  /*
  <template>
    <div>
      <ChevronRight :size="24" color="blue" />
      <Home :size="32" />
      <Search class="search-icon" />
      <MessageSquare :size="20" color="#333" />
    </div>
  </template>
  
  <script setup>
  import { ChevronRight, Home, Search, MessageSquare } from 'icona/vue';
  </script>
  */
}

// Run all demos
function runAllDemos() {
  demoBasicAutocomplete();
  demoKeywordSearch();
  demoCategorySearch();
  demoAdvancedSearch();
  demoTypeScriptAutocomplete();
}

// Export for use in examples
export {
  demoBasicAutocomplete,
  demoKeywordSearch,
  demoCategorySearch,
  demoAdvancedSearch,
  demoTypeScriptAutocomplete,
  runAllDemos
};