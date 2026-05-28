# Center Stage Ad Specifications

This document outlines a production-ready specification for Center Stage (Overlay Interstitial) ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

The Center Stage ad starts as a `1 × 1` px out-of-page block in Google Ad Manager and automatically expands to overlay the center of the viewport immediately upon load.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Center Stage Interstitial** | `1 × 1` px (GAM Unit) | `100% × 100vh` (Overlay)<br>Panel: Max `600 × 500` px | Desktop & Mobile Viewport Interstitial |

- **Layout Behavior**: On initialization, the ad expands the serving iframe to `100vh` and overlays a dark semi-transparent backdrop (`rgba(0, 0, 0, 0.6)`) over the publisher site. The ad panel scales outward from the center of the screen.
- **Responsive Behavior**: On desktop, the interactive panel is centered with a max-width of `600` px and height defined by `expandedHeight`. On mobile devices (max-width `600` px), the panel dynamically stretches to fill the full viewport (`100% × 100%`).

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
- **Video Playback**: `N/A` (Center Stage default template uses static/animated image overlays, though video assets can be optionally embedded as HTML5 components inside the panel).

### B. Image Specifications
- **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
- **Supported Formats**: `PNG` (for transparent items/close buttons), `JPEG` (high quality backgrounds), and `WebP` (next-gen optimization).
- **Maximum File Size**: 
  - Main Panel Image: `< 200 KB`.
  - Close Icon Asset: `< 10 KB`.
- **Recommended Dimensions**: 
  - Desktop Panel Image: `600 × 500` px.
  - Mobile Fullscreen Image: `320 × 480` px or `360 × 640` px.

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
- **`expandedHeight`**: Height of the interactive panel on desktop viewports (default: `500` px or `460` px).
- **`dismissed`**: Boolean state tracking whether the ad has been closed by the user.

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
- **`heroImage`**: URL path to the main overlay hero image asset.
- **`expandedHeight`**: Value controlling the height of the overlay panel in pixels.
- **`clickUrl`**: GAM click tracker macro URL.
- **`impressionUrl`**: Third-party impression tracking pixel.

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
- **Impression Tracking**:
  - **Rendered/Impression**: Logged when the ad mounts and starts the scale entrance animation.
  - **Viewable Impression**: Logged when the overlay renders on-screen.
- **Interaction Tracking**:
  - **Ad Dismiss/Close**: Tracked when the user clicks the close (✕) button or clicks the background dim overlay, removing the ad frame.
- **Click-Through Tracking**:
  - Tracked when the user clicks the main hero image area to open the advertiser landing page.

### B. Supported Ad Server Macros (GAM)
To properly log impressions and clicks inside GAM, the ad integration uses the following standard macros:

* **Click-Through Macro (`%%CLICK_URL_UNESC%%` / `%%CLICK_URL_ESC%%`)**:
  * Prepend this macro to the landing page destination URL to track click counts inside GAM.
* **Impression Macro (`%%VIEW_URL_UNESC%%` / `%%VIEW_URL_ESC%%`)**:
  * Injected as a 1x1 tracking pixel to register viewable impressions under GAM Active View.
* **Cachebuster Macro (`%%CACHEBUSTER%%`)**:
  * Appended to third-party tracking pixels to prevent browser caching of tracking requests.
  * *Example Usage*: `https://tracker.com/pixel.gif?ord=%%CACHEBUSTER%%`
