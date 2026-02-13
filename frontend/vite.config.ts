import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true
  },
  build: {
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 调整 chunk 大小警告限制为 600 kB
    chunkSizeWarningLimit: 600,
    // Rollup 配置
    rollupOptions: {
      output: {
        // 手动分割代码块
        manualChunks(id) {
          // React 核心库
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // Markdown 渲染相关
          if (id.includes('node_modules/markdown-it') || id.includes('node_modules/dompurify')) {
            return 'markdown-vendor';
          }
          // UI 组件库
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/sonner')) {
            return 'ui-vendor';
          }
          // 其他 node_modules 依赖
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // 优化 chunk 文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    },
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除 console
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 启用 source map（可选，开发调试用）
    sourcemap: false,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'markdown-it', 'dompurify', 'lucide-react', 'sonner'],
  },
})

