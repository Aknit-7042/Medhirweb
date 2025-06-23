import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#E6F6FF' },
          100: { value: '#BAE3FF' },
          200: { value: '#7CC4FA' },
          300: { value: '#47A3F3' },
          400: { value: '#2186EB' },
          500: { value: '#0967D2' },
          600: { value: '#0552B5' },
          700: { value: '#03449E' },
          800: { value: '#01337D' },
          900: { value: '#002159' },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: 'gray.50',
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
export default system; 