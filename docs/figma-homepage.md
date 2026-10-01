# Figma homepage

The React homepage at `/` recreates [Trackier UI/UX, node 10510:14168](https://www.figma.com/design/vyTDbt6o21URT6LVbJtnjd/Trackier-UI-UX?node-id=10510-14168).

Run `npm run dev` and open `http://localhost:3000/`.

## Components

- `src/components/trackier/TrackierPage.tsx`: navigation, layered hero, partner logos, opportunity cards, scroll reveal behavior.
- `ExpertiseSection.tsx`: expertise cards, founder callout, AI assistant banner.
- `PlatformSections.tsx`: keyboard-accessible feature tabs and integration filters.
- `ClientStories.tsx`: automatic testimonial carousel and accessible video player; `clientStories.data.ts` contains the editable story/video data.
- `ClosingSections.tsx`: Earth call to action, FAQ categories and disclosures, footer.
- `VimeoBackground.tsx`: muted, looping closing-section video with visibility and reduced-motion handling.

Each component has a scoped CSS module. The original design uses a 1512px frame and a 1080px content column. Grid and flex layouts adapt for tablets and phones; only layered artwork uses absolute positioning. Animations respect `prefers-reduced-motion`, and content remains visible when JavaScript is unavailable.

The hero adds scroll-linked parallax inspired by [Fora](https://fora.so/#hero): the distant hills move at 31% of the scroll distance and the dashboard/fox at 20%, while the foreground scrolls normally. `useHeroParallax.ts` updates a CSS variable through a passive scroll listener and `requestAnimationFrame`, clamps motion after the hero exits, and responds to reduced-motion preference changes. At the top of the page, the original Figma geometry is preserved.

The client logos use two seamless CSS carousels: the first row moves left and the second moves right. Both pause on hover or through the shared pause/resume button. Duplicate logos are hidden from assistive technology; reduced-motion users see all logos in static, wrapped rows.

The FAQ follows Fora's FAQ styling: a left-aligned heading, charcoal cards, pill category selection, and soft pointer-following border highlights. `useFaqGlow.ts` batches nearby-card updates in one animation frame and disables pointer motion for touch/reduced-motion users. Independent accessible accordions animate open and closed with CSS grid rows; collapsed answers are inert, and changing categories resets their open state. The footer retains its original design.

The platform showcase adapts the motion from Fora's `framer-f8ai71-container`: pointer-lit borders, full-panel crossfades, and changing captions. Its background and corner radii follow [Figma node 10611:633](https://www.figma.com/design/vyTDbt6o21URT6LVbJtnjd/Trackier-UI-UX?node-id=10611-633): the original black-to-green background asset, transparent panels, 20% white outlines, 10px outer corners, and 8px tab corners with a 10% white selected fill. The hover glow is masked to borders so it does not change those fills. It keeps Trackier's existing dashboard artwork and content. The tour advances every eight seconds while visible, pauses on hover/focus or manual selection, and has a pause/resume control. Reduced motion disables the tour and transitions. Keyboard tab navigation and horizontal tab scrolling work on smaller screens; overlapping panels reserve a stable height and inactive panels are inert. `usePointerGlow.ts` shares the pointer effect between the platform and FAQ.

The platform tabs frame also has a soft border highlight that travels around its outline every eight seconds. The masked CSS effect preserves the Figma fill and corners, does not intercept clicks, pauses outside the viewport or in a hidden browser tab, and is removed for reduced motion.

Opportunity cards have staggered entrances and a separate, smoothly eased hover lift, so hovering does not interrupt the scroll reveal. Their resting state follows [Figma node 10611:13829](https://www.figma.com/design/vyTDbt6o21URT6LVbJtnjd/Trackier-UI-UX?node-id=10611-13829): transparent fill, no painted stroke, 20px corners, and a glass treatment recreated with 4px backdrop blur and subtle inset lighting. Their green hover outlines and soft halos adapt the treatment from [Design Monks' solutions cards](https://www.designmonks.co/services/logo-branding). A soft radial glow follows the cursor inside the hovered card using the shared `usePointerGlow` hook; other cards retain their resting appearance, and the glow fades on exit. Arrow motion uses translation without shifting the link layout. Expertise cards add restrained entrance staggering, small hover movements in the original artwork, a gentle founder portrait zoom, and a one-time AI icon entrance. Hover motion is limited to precise pointers and disabled for reduced motion.

Client stories scroll continuously at 27px per second, with three cards on desktop, two on tablets, and one on phones. Scrolling pauses on hover, keyboard focus, user interaction, hidden tabs, offscreen content, and video playback. Previous/next and pause/resume controls remain available; reduced motion disables automatic scrolling. Duplicated cards are hidden from assistive technology and keyboard navigation. Each play button opens a native modal dialog, with Escape/backdrop/close dismissal, focus restoration, and playback cleanup. The supplied [YouTube video](https://www.youtube.com/watch?v=huzHyFb1uKo) is temporarily shared by all three cards. The iframe is created only after a play click.

The closing demo button follows the interactive component behind [Figma node 10557:16790](https://www.figma.com/design/vyTDbt6o21URT6LVbJtnjd/Trackier-UI-UX?node-id=10557-16790). Its authored mouse-enter and mouse-leave reactions use Smart Animate, ease-out, and 300ms: green becomes `#1B755B`, the label becomes white, and the arrow becomes `#27DB94`. Keyboard focus uses the same state. Dimensions and 10px corners stay fixed; the unavailable hover-only Gilroy font is replaced by the existing Manrope, without introducing a label shift.

The closing call to action uses the supplied [Vimeo video](https://vimeo.com/1232025498) as a muted, looping background. The [official Vimeo embed](https://help.vimeo.com/hc/en-us/articles/12426285089681-About-embedding-background-and-Chromeless-videos) preloads 600px before the section reaches the viewport, then starts automatically on entry and fades in once playback begins. Player readiness and media-loaded events both trigger playback when visible; brief loading failures retry without becoming a permanent user pause. The responsive player covers the section, pauses offscreen or in hidden tabs, and offers a pause/play button. An intentional pause is preserved on reentry. Reduced motion retains the original Earth still without loading the video. That still also remains as the loading/error fallback, so blocked media does not obscure the call to action. Vimeo messages are checked against both the player origin and iframe window.

Footer navigation links are white at rest. Hovering one link leaves it white, shifts its label 12px to the right, and dims links across the other footer columns to 50% opacity, following the [AppsFlyer footer](https://www.appsflyer.com/). Both transitions take 150ms; label motion leaves the link hit area stable. Keyboard focus receives the same treatment, touch does not retain hover dimming, and reduced motion removes the shift.

Original Figma image/vector assets and locally hosted Manrope/Inter fonts live in `public/react-assets/figma/`. UUID filenames retain the original export identities. The Earth fallback is a still export of the original media layer. No page or section screenshots are used as implementation assets.

Repeated opportunity cards, testimonials, and draft FAQ wording are intentionally preserved from the supplied design. Additional tab panels and FAQ answers provide working interactions. Demo/trial/contact links lead to the existing Trackier website.

The CMS demonstration routes at `/react-demo/` and `/react-demo/reuse/` retain their own header, footer, and content adapter through `src/app/[...slug]/layout.tsx`.

Validation: `npm run check`, `npm run build`, and `npm run test:smoke` (with the local server running).
