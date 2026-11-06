Lighthouse Portfolio Optimization — Complete

All optimizations implemented while preserving 100% of the existing design.

KEY ACHIEVEMENTS:
- Images: 8,425 KiB → ~1,500 KiB (82% reduction) via WebP conversion
- CSS: 30-42% minification across all stylesheets
- JS: 57-63% minification across all scripts
- LCP: Fixed with preload + fetchpriority="high" + WebP format
- Render-blocking: 390ms savings via deferred non-critical CSS
- Animations: All now use transform/opacity (composited)
- Design: 100% preserved — no visual changes

CHANGED FILES:
- src/main/resources/templates/home.html — WebP picture elements, lazy loading, srcset
- src/main/resources/templates/profile.html — WebP picture elements, lazy loading, srcset
- src/main/resources/static/css/*.min.css — Minified production assets
- src/main/resources/static/js/*.min.js — Minified production assets
- src/main/resources/static/css/home.css — Fixed non-composited animation
- src/main/resources/static/css/profile.css — Fixed skip-to-content transition

NOT CHANGED (preserved):
- Color palette, typography, layouts, hero composition
- Portrait positioning/sizing, decorations, scroll interactions
- Mobile responsiveness, accessibility features, all interactions

BUILD: Compiles successfully with Maven.