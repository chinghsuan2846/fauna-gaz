

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/stories/foundation/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/stories/component/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/stories/patterns/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "staticDirs": ["../public"],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite"
};
export default config;
