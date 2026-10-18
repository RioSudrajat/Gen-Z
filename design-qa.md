# Capital Bridge implementation QA

Date: 2026-10-16. Scope: section `#why`, its raster assets and one-shot reveal. Existing landing structure and entry pages remain outside the change.

## Visual target and evidence

- Source: `docs/design/references/purpose-2026-10-15/concept-1-capital-bridge.png`, 1505 × 1045 pixels.
- User-selected option: first displayed image, Capital Bridge. User revision: label Global investors becomes Global capital.
- Implementation: `http://127.0.0.1:5174/#why`.
- Initial comparison: `landing/qa/capital-bridge/comparison-1505.png`.
- Final comparison: `landing/qa/capital-bridge/comparison-1505-v2.png`, browser-reported viewport 1505 × 1045 CSS pixels. The capture tool returns1490 ×1035 pixels; source is1505 ×1045. Normalization crops only15px of right margin and10px of bottom margin from the source into `reference-normalized.png`, preserving content at1:1 pixel scale with no stretch or downsample. No claim of exact capture density beyond this pixel normalization is made.
- State: final reveal, section top aligned at viewport top, navbar contracted. Source and implementation images were opened together in the same comparison input, both before and after correction.
- Additional captures: desktop-1440.png, laptop-1280.png, tablet-768.png, mobile-390-top.png, mobile-390-bottom.png, mobile-360.png in the same QA folder.
- Full-view captures retain readable headlines, labels, body copy and artwork details; separate crops were not needed for those details. The screenshot's floating AI extension button is not product UI.

## Findings and comparison history

1. [P2, resolved] Initial desktop composition was too contained and understated against the selected visual. The illustration and title occupied less width, with a larger left inset. Fixed the desktop layout above 900px viewport height: wider section container, 76px title cap, larger body copy, higher illustration overlap on its empty white region, and captions aligned to both sides. Text is layered above the image's white background. Re-captured at the source viewport and compared again; the final hierarchy, visual scale and spacing follow the selected direction.
2. [P2, resolved during implementation] Short desktop screens needed tighter vertical spacing to keep the note and both audience descriptions visible. Added a scoped compact layout for desktop viewports up to 900px tall. At 1440 × 900 the section is 900px tall and the note ends near y848. At 1280 × 800 the note ends near y784; the section can grow to about828px including bottom padding.

No actionable P0/P1/P2 findings remain in this scope.

## Required fidelity surfaces

- Fonts/typography: existing self-hosted GenZ Display and GenZ UI retained. Browser computed styles confirm the font families, desktop title76px, labels30px and body18/22px. Text remains HTML with semantic H2/H3 hierarchy. Mobile wraps intentionally with no clipping.
- Spacing/layout: large-screen composition compared against source; compact desktop retains a full reading position. Tablet retains horizontal art; mobile uses a separately composed portrait asset. No horizontal overflow at tested sizes.
- Color/tokens: existing #111827 ink, #0F766E teal, #4B5563 muted and white retained. Contrast against white is calculated in the Delivery Gate. No new theme or accent family.
- Image fidelity: source-inspired industrial solar miniature, charcoal Gen-Z gateway and pearl globe are generated raster artwork, not CSS/SVG approximations. Desktop and mobile are separately composed. Optimized WebP sizes: about100KB for1600px wide,165KB full wide and173KB mobile. Caption copy remains outside the bitmap. The scene is explicitly illustrative in accessible text and contains no investment amounts or live activity claims.
- Copy/content: approved copy preserved; only requested visible label changes to Global capital. No new financial, audit or partnership claims.

## Interaction and technical verification

- Final `npm run build` exit0; log at `landing/qa/capital-bridge/build.log`. Existing use-client bundling warnings and the existing612KB turbine chunk remain; this change adds no dependency or WebGL renderer.
- Runtime browser console errors: none observed in final desktop check and auth navigation check.
- About → Our purpose opens the section, closes the menu and leaves its title below the navbar.
- Mobile navigation opens with Enter and closes with Escape. Launch app opens `/auth/` and renders the existing email preview page.
- No controls or required hover interactions were added to the section. The artwork has no tab stops. Labels and all explanations remain readable independently of motion and image loading.
- Reveal reaches `clip-path: inset(0%)`; no pinning or scroll interception is introduced. It runs once after image load, only under prefers-reduced-motion:no-preference. CSS also forces the full unmasked scene under reduce.
- Reduced-motion limitation: the connected browser exposes no media-emulation capability. The matchMedia guard and static CSS fallback were reviewed in source; OS reduced-motion was not toggled or claimed as a runtime test.
- Viewports checked:1505×1045,1440×900,1280×800,768×1024,390×844,360×800. Screenshot and DOM evidence stored under the QA folder.

## Follow-up polish

- P3: artwork is a rendered illustration with a short reveal, not a live3D scene or simulated financial flow. This intentionally avoids adding rendering cost to the existing turbine3D section.
- Runtime reduced-motion emulation remains a coverage limitation; there is no known failing behavior.

## Implementation checklist

- [x] Selected scene and requested label implemented.
- [x] Responsive artwork, readable HTML copy, source-sized visual comparison and iteration completed.
- [x] Build, navigation, keyboard, overflow, asset loading, contrast and console verified within this scope.
- [x] Pre-flight and antislop Delivery Gate recorded in `landing/qa/capital-bridge/DELIVERY-GATE.md`.

final result: passed
