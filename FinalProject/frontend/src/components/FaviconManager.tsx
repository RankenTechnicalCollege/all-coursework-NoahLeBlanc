// src/components/FaviconManager.tsx
import { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Bug } from 'lucide-react';

export function FaviconManager() {
  useEffect(() => {
    // Convert React icon to SVG string
    const svgString = renderToStaticMarkup(<Bug color="white" size={94} />);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    // Find or create <link rel="icon">
    const link =
      document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = url;
    document.head.appendChild(link);

    // Cleanup on unmount
    return () => URL.revokeObjectURL(url);
  }, []);

  return null; // no visible render
}
