# Flip Ad Specifications

This document outlines a production-ready specification for Flip (3D Card Flip) ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

The Flip ad utilizes in-place CSS 3D transforms to flip between a static front-face banner and an interactive back-face featuring rich media/video playback.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Medium Rectangle Flip** | `300 × 250` px | `N/A` (In-place transformation) | Sidebar / In-feed / Inline |

- **Layout Behavior**: The ad remains inside a static `300 × 250` px container. A user click/tap or auto-trigger activates a smooth 3D flip animation (`rotateY(180deg)`) revealing the back panel.
- **Autoplay/Hover Interrupt**: On user mouseenter/hover, automatic flip sequences are disabled (`autoplay = false`), giving the user direct manual control over the flip states.

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
- **Autoplay & Audio (IAB Compliant)**:
  - Back-face video **must start muted** by default (e.g. `autoplay muted playsinline`).
  - Audio toggle/user control must be provided if audio is enabled.
- **Supported Formats**: `MP4` (H.264 video codec, AAC audio codec).
- **Maximum File Size**: `< 2.0 MB`.
- **Duration**: Max `15 seconds`.
- **Frame Rate**: Up to `30 fps`.

### B. Image Specifications
- **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
- **Supported Formats**: `PNG` (transparencies), `JPEG` (backgrounds), and `WebP` (optimizations).
- **Maximum File Size**: 
  - Front Background Image: `< 100 KB`.
  - Close/UI Overlays: `< 10 KB`.
- **Recommended Dimensions**: 
  - Front Background: `300 × 250` px (or scaled proportionally to fit the 90% inner container box).

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
- **`autoplay`**: Boolean controlling whether the card flips automatically to the video back-face after loading (default: `true`).
- **`flipCard`**: State boolean driving the flipped state classes on the DOM.

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
- **`frontImage`**: URL path to the static front-face background image.
- **`videoSource`**: URL path to the video asset displayed on the back-face of the card.
- **`clickUrl`**: GAM click tracker macro URL.
- **`impressionUrl`**: Third-party impression tracking pixel.

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
- **Impression Tracking**:
  - **Rendered/Impression**: Logged when the front banner mounts and displays.
- **Interaction Tracking**:
  - **Card Flip**: Tracked when the card rotates to the back-face.
  - **Card Collapse**: Tracked when the card collapses/rotates back to the front-face.
  - **Video Progress**: Milestones (25%, 50%, 75%, 100% completion) tracked during back-face video playback.
- **Click-Through Tracking**:
  - Tracked when the user clicks the ad container to go to the advertiser landing page.

### B. Supported Ad Server Macros (GAM)
To properly log impressions and clicks inside GAM, the ad integration uses the following standard macros:

* **Click-Through Macro (`%%CLICK_URL_UNESC%%` / `%%CLICK_URL_ESC%%`)**:
  * Prepend this macro to the landing page destination URL to track click counts inside GAM.
* **Impression Macro (`%%VIEW_URL_UNESC%%` / `%%VIEW_URL_ESC%%`)**:
  * Injected as a 1x1 tracking pixel to register viewable impressions under GAM Active View.
* **Cachebuster Macro (`%%CACHEBUSTER%%`)**:
  * Appended to third-party tracking pixels to prevent browser caching of tracking requests.
  * *Example Usage*: `https://tracker.com/pixel.gif?ord=%%CACHEBUSTER%%`
