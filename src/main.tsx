import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import "./index.css";
import "./i18n.ts";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <App />
            <SpeedInsights />
        </ThemeProvider>
    </HelmetProvider>
);
