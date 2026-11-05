# Project Section Redesign Specification

## Objective

Redesign only the Project section of the existing portfolio.

The visual direction combines the current portfolio identity with an overlapping/fan project-card concept:

- editorial scrapbook
- cream paper
- deep navy
- muted gold
- ocean-inspired details
- physical paper/card depth
- premium and mature visual style

## Reference Concept

The supplied reference uses a three-card fan composition with:

- left card rotated slightly counter-clockwise
- center card straight and dominant
- right card rotated slightly clockwise
- staggered entrance animation
- subtle movement and depth

This concept should be adapted to the existing Spring Boot + Thymeleaf portfolio rather than copied as a React/shadcn component.

## Scope

Only the Project section may be visually changed.

Do not modify:

- Home
- Navbar
- Profile Hero
- About
- Skills
- Contact
- Footer
- Dashboard
- Backend
- Controller
- Service
- Repository
- Entity/Model
- Database
- Authentication
- Routes
- CRUD behavior
- Existing project data
- Existing project images
- Existing project links
- Thymeleaf bindings

## Project Card Direction

Project cards should feel like physical portfolio prints placed on a desk.

Visual elements:

- warm cream paper
- subtle paper texture
- thin muted-gold border
- layered paper underlay
- soft editorial shadow
- restrained rotation
- slight card overlap
- ocean/wave decorative line
- subtle botanical or paper details

Avoid:

- neon
- excessive gradients
- glassmorphism
- gaming UI
- generic SaaS cards
- excessive rounded corners
- excessive decoration

## Desktop

Use a fan/overlapping composition.

Suggested rotation:

- left: `rotate(-4deg)`
- center: `rotate(0deg)`
- right: `rotate(4deg)`

The center card should be visually dominant.

If there are more than three projects, keep every project and continue the visual system in additional rows/groups. Never hard-code the design to only three projects.

## Hover

Cards should feel tactile:

- slight lift
- subtle rotation toward zero
- stronger but soft shadow
- image scale around `1.015`–`1.03`
- higher z-index

Use:

`cubic-bezier(0.22, 1, 0.36, 1)`

Avoid bounce and elastic overshoot.

## Entrance Animation

Reveal the section progressively:

1. paper background
2. eyebrow
3. heading
4. paper layers
5. project cards
6. image/text settling
7. decorative details

Use opacity, transform, subtle rotation and clip-path where useful.

## Scroll Reveal

Use the existing `portfolio.js` animation system if available.

Extend existing IntersectionObserver logic instead of replacing it.

Elements must remain visible if JavaScript is unavailable.

## Responsive

### Desktop
Full fan/overlap composition.

### Tablet
Reduce overlap, rotation and decorative complexity.

### Mobile
Use a clean vertical stack.

Do not allow horizontal overflow.

## Reduced Motion

Respect:

`prefers-reduced-motion: reduce`

Disable:

- entrance movement
- parallax
- unnecessary rotation
- long animation delays

Keep content immediately visible.

## Data Safety

Preserve all existing:

- project names
- descriptions
- images
- links
- Thymeleaf expressions
- `th:each`
- `th:text`
- `th:src`
- `th:href`
- other bindings

Never invent project information.

## Final Result

The Project section should feel like a premium editorial scrapbook archive: layered, tactile, ocean-inspired and animated, while remaining visually consistent with the existing portfolio.
