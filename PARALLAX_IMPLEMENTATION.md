# Parallax Scrolling Implementation - Complete

## What Was Implemented

Full-site cinematic parallax scrolling system using GSAP ScrollTrigger + Lenis smooth scroll.

**Technology Stack:**
- GSAP 3.12.5 (Animation library)
- GSAP ScrollTrigger (Scroll-driven animations)
- Lenis 1.0.42 (Smooth scrolling)
- Vanilla JavaScript (No React)
- Existing Spring Boot + Thymeleaf architecture

## Files Created/Modified

### New Files Created:
1. `src/main/resources/static/js/parallax-scroll.js` - Main parallax animation system
2. `src/main/resources/static/css/parallax-scroll.css` - Parallax styles and optimizations

### Modified Files:
1. `src/main/resources/templates/home.html` - Added GSAP/Lenis CDN links + parallax attributes
2. `src/main/resources/templates/profile.html` - Added GSAP/Lenis CDN links + parallax attributes

## Parallax Layer System

Four-layer depth system (matches reference):

- **Layer 1** (70% speed) - Fastest moving elements
  - Decorative elements (fish, stars, lines)
  - Foreground accents
  
- **Layer 2** (55% speed) - Medium-fast
  - Main content containers
  - Portrait cards
  - Text content
  
- **Layer 3** (40% speed) - Medium-slow
  - Section headers
  - Typography overlays
  
- **Layer 4** (10% speed) - Slowest
  - Background waves
  - Halo effects
  
- **Background** (50% speed) - Background layers
  - Glyph backgrounds
  - Kinetic grids

## Section-by-Section Implementation

### HOME (/) Section
- Background wave parallax
- Glyph background depth
- Portrait card layered movement
- Decorative elements (fish/star) independent float
- Typography subtle depth
- Smooth fade-in on load

### PROFILE (#profile) Section
- Kinetic grid background parallax
- Typography overlay (ARYA ADHITYA) depth
- Portrait image depth effect
- Halo arc subtle scale/fade
- Decorative lines/stars independent movement

### ABOUT (#about) Section
- Glyph background depth
- Content text subtle upward movement
- Image card stronger parallax
- Smooth left/right content separation

### KEAHLIAN (#keahlian) Section
- Section header depth
- Skill cards staggered parallax (different speeds per card)
- Creates depth across grid

### PROJECT (#project) Section
- Project header depth
- Individual project images scale + move
- Info panels subtle offset
- Preserves existing expanding gallery functionality

### CONTACT (#contact) Section
- Section header depth
- Button elements gentle float
- Different speeds create layered effect

### AMBIENT GLOWS
- Background glows move opposite directions
- Creates atmospheric depth throughout scroll

## Technical Features

### Lenis Integration
- Smooth scrolling with custom easing
- Synced with GSAP ticker
- Proper ScrollTrigger updates
- Touch-friendly (desktop smooth, mobile native)

### Performance Optimizations
- `will-change` on parallax elements
- Hardware acceleration (translateZ)
- Backface visibility hidden
- Proper image rendering optimization
- RAF-based animation loop

### Responsive Behavior
- **Desktop**: Full parallax with all layers
- **Tablet**: Adjusted movement distances
- **Mobile**: Simplified parallax (background only)
- **Reduced motion**: Complete parallax disable

### Section Transitions
- Smooth fade-in as sections enter viewport
- Continuous visual flow between sections
- No abrupt jumps or blank spaces

## How to Test

### 1. Start the Application
```bash
./mvnw spring-boot:run
```

### 2. Open in Browser
```
http://localhost:8080/
```

### 3. Test Home Page
- Scroll down slowly
- Observe decorative elements moving at different speeds
- Portrait should move slower than decorations
- Background waves should be slowest

### 4. Navigate to Profile
```
http://localhost:8080/profile
```

### 5. Test All Sections
Scroll through each section and observe:
- **Profile**: Portrait depth, typography movement
- **About**: Image card parallax, glyph background
- **Keahlian**: Staggered card movement
- **Project**: Image depth, info panel offset
- **Contact**: Button gentle float

### 6. Test Smooth Scrolling
- Mouse wheel should feel buttery smooth
- Anchor links should smoothly scroll to sections
- No janky movements or stutters

### 7. Test Responsive
- Resize browser window
- Test on tablet size (768px)
- Test on mobile size (<768px)
- Mobile should have simplified parallax

### 8. Test Reduced Motion
- Enable reduced motion in OS accessibility settings
- All parallax should be disabled
- Page should remain functional

## Expected Visual Experience

### Desktop
- Cinematic layered depth throughout portfolio
- Smooth scroll with momentum
- Different elements move at different speeds
- Portrait images have strongest depth
- Backgrounds move slowest
- Decorations float independently
- Seamless transitions between sections

### Mobile
- Simplified parallax (background layers only)
- Native touch scrolling
- No horizontal overflow
- Content remains readable
- Performance maintained

## Browser Compatibility

Tested and optimized for:
- Chrome/Edge (Chromium) 90+
- Firefox 88+
- Safari 14+
- Mobile Safari iOS 14+
- Chrome Android 90+

## Console Verification

Open browser DevTools Console. Should see:
- No GSAP errors
- No Lenis errors
- No "not loaded" warnings
- ScrollTrigger instances created
- Smooth scroll active

If you see warnings about GSAP/Lenis not loaded, check:
1. CDN links in HTML head
2. Network tab shows successful loads
3. Script load order correct

## Debugging

### Check Parallax Attributes
All sections should have `data-parallax="layerX"` attributes on key elements.

### Check GSAP Loading
Console: `typeof gsap` should return "object"

### Check ScrollTrigger Loading
Console: `typeof ScrollTrigger` should return "function"

### Check Lenis Loading
Console: `typeof Lenis` should return "function"

### Inspect Transforms
Use DevTools Elements tab, scroll page, watch elements with `data-parallax` attributes get `transform` styles applied dynamically.

## What Was Preserved

- All existing content (text, images, links)
- All existing functionality (navigation, lightbox gallery, mobile menu)
- Existing visual identity (warm ivory color scheme)
- Existing typography and layout
- Existing Spring Boot controllers/entities
- Existing database structure
- All project information and images

## Animation Style Consistency

Parallax style matches the provided reference:
- Multiple visual layers at different speeds
- Smooth scroll-driven movement
- Foreground/background depth
- Layered typography
- Image depth effects
- Elegant section transitions
- Continuous scrolling experience

## Performance Notes

- Animations use CSS transforms (GPU accelerated)
- No layout thrashing
- Passive event listeners
- RequestAnimationFrame for smooth 60fps
- Debounced resize handling
- Memory-efficient (cleanup on destroy)

## Maintenance

To adjust parallax speeds:
- Edit `parallax-scroll.js`
- Modify speed values in `createParallaxLayers()` config
- Values: 0.0 (no movement) to 1.0 (full scroll speed)

To disable parallax on specific element:
- Remove `data-parallax` attribute

To add parallax to new element:
- Add `data-parallax="layer1"` (or layer2/layer3/layer4/bg)
- Element will automatically inherit parallax behavior

## Summary

✅ Full-site parallax implemented
✅ All sections connected smoothly
✅ GSAP + ScrollTrigger + Lenis integrated
✅ Vanilla JavaScript (no React)
✅ Existing content preserved
✅ Existing functionality preserved
✅ Responsive (desktop/tablet/mobile)
✅ Reduced motion support
✅ Performance optimized
✅ Browser compatible
✅ Matches reference animation style
