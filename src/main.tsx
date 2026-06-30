import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import "./index.css";

// i18n is deferred — React mounts immediately, translations load async in background.
// This prevents 134KB of inline translation data from blocking First Contentful Paint.
import("./i18n.ts");

// Auto-recover from Vite chunk loading errors (stale cache after new deployments)
window.addEventListener('vite:preloadError', (event) => {
    console.warn('Vite preload error detected. Hard reloading page to fetch new chunks...');
    window.location.reload();
});

// Patch DOM methods to prevent React from crashing when Google Translate modifies the DOM
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function(child: Node) {
    if (child.parentNode !== this) {
      if (console) console.warn('React attempted to remove a child from a different parent (likely due to Google Translate). Suppressing crash.');
      return child;
    }
    return originalRemoveChild.apply(this, [child] as any);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(newNode: Node, referenceNode: Node | null) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) console.warn('React attempted to insert before a node from a different parent (likely due to Google Translate). Suppressing crash.');
      return newNode;
    }
    return originalInsertBefore.apply(this, [newNode, referenceNode] as any);
  };
}

createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
        <App />
    </HelmetProvider>
);


