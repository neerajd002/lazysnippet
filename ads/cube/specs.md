# Cube Ad Specifications

This document outlines a production-ready specification for Cube (3D Rotating Cube) ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

The Cube ad features a 3D rotating cube layout, displaying 4 interactive panel faces that transition via swipe or automatic rotation.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Half-Page Cube** | `300 × 600` px | `N/A` | Sidebar / In-feed |
| **Billboard Cube** | `970 × 250` px | `N/A` | Desktop Header / Billboard |
| **Leaderboard Cube** | `728 × 90` px | `N/A` | Header / Footer Banner |

- **Layout Behavior**: The ad rotates automatically or responds to user swipe/drag gestures to transition between 4 slide panels.
- **Rotation Direction**: 
  - `horizontal` (default, e.g. for `300 × 600` px and `728 × 90` px).
  - `vertical` (configurable, e.g. for `970 × 250` px).

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
- **Video Playback**: `N/A` (Cube default template uses static/animated image overlays, though custom HTML5 slides can support embedded video players).

### B. Image Specifications
- **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
- **Supported Formats**: `PNG` (for overlays/borders), `JPEG` (high quality backgrounds), `WebP` (next-gen optimization), and `GIF` (for animated slides).
- **Maximum File Size**: 
  - Individual Slide Image: `< 150 KB` per slide.
  - Overall Ad Initial Load Assets: `< 1.2 MB`.
- **Slide Count**: Exactly `4` slides (mapping to the four faces of the rotating cube).
- **Recommended Dimensions**: Must match the selected format state exactly:
  - Half-Page: `300 × 600` px.
  - Billboard: `970 × 250` px.
  - Leaderboard: `728 × 90` px.

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
- **`direction`**: Animation transition swipe direction (`horizontal` or `vertical`).
- **`slides`**: Array containing exactly 4 slide objects. Each object contains:
  - `id`: Slide identifier (e.g. `slide1`).
  - `image`: URL path of the slide image.
  - `color`: CSS text color value.
  - `url`: Specific landing page URL.

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
- **`clickUrl`**: GAM click tracker macro URL.
- **`trackingUrl`**: Third-party click tracking pixel endpoint.
- **`slideImages 1-4`**: Configurable background images for each of the 4 faces.
- **`slideUrls 1-4`**: Slide-specific landing page destinations.

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
- **Impression Tracking**:
  - **Rendered/Impression**: Logged when the ad mounts and the Swiper/Cube container initializes.
- **Interaction Tracking**:
  - **Cube Rotate/Swipe**: Logged when a user swipes or drags to rotate the cube sides.
- **Click-Through Tracking**:
  - Tracked when a user clicks the active cube face, resolving to the specific `slideUrl` mapped to the visible slide.

### B. Supported Ad Server Macros (GAM)
To properly log impressions and clicks inside GAM, the ad integration uses the following standard macros:

* **Click-Through Macro (`%%CLICK_URL_UNESC%%` / `%%CLICK_URL_ESC%%`)**:
  * Prepend this macro to the landing page destination URL to track click counts inside GAM.
* **Impression Macro (`%%VIEW_URL_UNESC%%` / `%%VIEW_URL_ESC%%`)**:
  * Injected as a 1x1 tracking pixel to register viewable impressions under GAM Active View.
* **Cachebuster Macro (`%%CACHEBUSTER%%`)**:
  * Appended to third-party tracking pixels to prevent browser caching of tracking requests.
  * *Example Usage*: `https://tracker.com/pixel.gif?ord=%%CACHEBUSTER%%`
