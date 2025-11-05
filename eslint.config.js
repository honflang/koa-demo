import vuePlugin from 'eslint-plugin-vue';
import * as vueEslintParser from 'vue-eslint-parser';
import * as espree from 'espree';

// Pull the plugin's recommended rules directly (flat config doesn't support `extends`)
const vueRecommendedRules = (vuePlugin && vuePlugin.configs && vuePlugin.configs['vue3-recommended'] && vuePlugin.configs['vue3-recommended'].rules) || {};

export default [
  // Apply to JS and Vue files
  {
    files: ['**/*.{js,vue}'],
    plugins: { vue: vuePlugin },
    // Use vue-eslint-parser to parse Vue single-file components (.vue)
    languageOptions: {
      // Use the actual parser objects (must provide parse/parseForESLint functions)
      parser: vueEslintParser,
      parserOptions: {
        // parser used to parse the script block inside .vue files
        parser: espree,
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      // include the plugin's recommended rules, then override the one we want off
      ...vueRecommendedRules,
      'vue/no-multiple-template-root': 'off'
    }
  }
];
