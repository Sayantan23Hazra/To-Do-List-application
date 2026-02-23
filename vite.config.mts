import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    // Build as a micro-frontend style library (optional)
    lib: {
      entry: 'src/main.ts',
      name: 'AiGeneratedTodo',
      fileName: 'ai-generated-todo',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'pinia', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          'element-plus': 'ElementPlus'
        }
      }
    }
  },
  server: {
    port: 5173
  }
});
