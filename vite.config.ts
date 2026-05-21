import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    hmr: { clientPort: 8080 },
  },
  plugins: [
    react(),
    {
      name: 'platform-portals-rewrite',
      configureServer(server: any) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          const url = (req.url || '').split('?')[0].replace(/\/$/, '') || '/';
          
          if (
            url.includes('manifest.webmanifest') || 
            url.includes('manifest.json') ||
            url.includes('registerSW.js') ||
            url.includes('sw.js') ||
            url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2)$/)
          ) {
            return next();
          }

          const rewrites: Record<string, string> = {
            '/': 'index.html',
            '/it': 'index.html',
            '/tr': 'index.html',
            '/status': 'status.html',
            '/roadmap': 'roadmap.html',
            '/updates': 'updates.html',
            '/method': 'method.html',
            '/imat': 'imat.html',
            '/cent-s': 'cent-s.html',
            '/exams': 'exams.html',
            '/contact': 'contact.html',
            '/blog': 'blog.html',
            '/resources': 'resources.html',
            '/cent-s-exam-preparation-book-pdf-free-download': 'cent-s-exam-preparation-book-pdf-free-download.html',
            '/cent-s-mock': 'cent-s-mock.html',
            '/imat-mock': 'imat-mock.html'
          };
          
          let targetFile = rewrites[url];
          
          // Fallback dynamic detection
          if (!targetFile && url.length > 1) {
            const fileName = url.startsWith('/') ? url.slice(1) : url;
            const potentialFile = fileName.endsWith('.html') ? fileName : fileName + '.html';
            
            const pathsToTry = [
              path.resolve(__dirname, potentialFile),
              path.resolve(__dirname, 'public', potentialFile)
            ];

            for (const p of pathsToTry) {
              if (fs.existsSync(p)) {
                targetFile = potentialFile;
                break;
              }
            }
          }
          
          if (targetFile) {
            const pathsToTry = [
              path.resolve(__dirname, targetFile),
              path.resolve(__dirname, 'public', targetFile)
            ];
            
            let finalPath = null;
            for (const p of pathsToTry) {
              if (fs.existsSync(p)) {
                finalPath = p;
                break;
              }
            }

            if (finalPath) {
              const html = fs.readFileSync(finalPath, 'utf8');
              const transformedHtml = await server.transformIndexHtml(url, html);
              res.setHeader('Content-Type', 'text/html');
              return res.end(transformedHtml);
            }
          }
          next();
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  // Drop console/debugger statements from production builds only
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks(id) {
          // ─── Core React runtime ───────────────────────────────────────────
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) return 'chunk-react';

          // ─── Routing ──────────────────────────────────────────────────────
          if (id.includes('react-router-dom') ||
              id.includes('react-router/')) return 'chunk-router';

          // ─── Supabase ─────────────────────────────────────────────────────
          if (id.includes('@supabase')) return 'chunk-supabase';

          // ─── UI Primitives — Radix UI ─────────────────────────────────────
          if (id.includes('@radix-ui')) return 'chunk-radix';

          // ─── Animations ───────────────────────────────────────────────────
          if (id.includes('framer-motion')) return 'chunk-motion';

          // ─── Charts ───────────────────────────────────────────────────────
          if (id.includes('recharts') ||
              id.includes('d3-')) return 'chunk-charts';

          // ─── i18n ─────────────────────────────────────────────────────────
          if (id.includes('i18next') ||
              id.includes('react-i18next')) return 'chunk-i18n';

          // ─── KaTeX — math renderer ────────────────────────────────────────
          if (id.includes('node_modules/katex') ||
              id.includes('react-katex') ||
              id.includes('rehype-katex') ||
              id.includes('remark-math')) return 'chunk-katex';

          // ─── Markdown ─────────────────────────────────────────────────────
          if (id.includes('react-markdown') ||
              id.includes('remark-') ||
              id.includes('rehype-') ||
              id.includes('unified') ||
              id.includes('micromark') ||
              id.includes('mdast')) return 'chunk-markdown';

          // ─── Utility libraries ────────────────────────────────────────────
          if (id.includes('date-fns') ||
              id.includes('clsx') ||
              id.includes('class-variance-authority') ||
              id.includes('tailwind-merge') ||
              id.includes('lucide-react')) return 'chunk-utils';

          // ─── Everything else in node_modules ─────────────────────────────
          if (id.includes('node_modules')) return 'chunk-vendor';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    },
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    target: ['es2020', 'chrome96', 'safari15', 'firefox95'],
    cssMinify: true,
  },
  optimizeDeps: {
    include: [
      'react', 'react-dom', 'react-router-dom',
      '@supabase/supabase-js', 'framer-motion',
      'clsx', 'tailwind-merge',
    ],
  },
}));
