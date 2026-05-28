# Carousel Ad Specifications

This document outlines a production-ready specification for Carousel (3D Cylinder) ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

The Carousel ad features a rotating 3D Cylinder composed of interactive panels (slides) that respond to user drags, scrolls, and clicks.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Billboard Carousel** | `970 × 250` px | `N/A` | Desktop Header / Billboard |

- **Layout Behavior**: The cylinder automatically rotates (`autoRotateSpeed`). Users can drag/swipe to spin the cylinder left and right. Clicks on the container navigate to the default click URL, while clicks on individual panels navigate to slide-specific URLs.

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
- **Video Playback**: `N/A` (Carousel does not contain a video component).

### B. Image Specifications
- **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
- **Supported Formats**: `PNG` (for transparent items), `JPEG` (high quality photos), and `WebP` (next-gen optimization).
- **Maximum File Size**: 
  - Individual Slide Panel Images: `< 50 KB` per slide.
  - Overall Ad Initial Load Assets: `< 1.5 MB`.
- **Slide Panel Count**: Recommended 6 to 12 slides.
- **Recommended Dimensions**: 
  - Panel Images: `300 × 200` px.

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
- **`autoRotateSpeed`**: Speed of automatic 3D cylinder rotation (default: `0.1`).
- **`panelWidth`**: Width in pixels of each individual slide face panel on the cylinder (default: `300`).
- **`slides`**: Static array configuration of slide objects including `id`, `title`, `image`, and `url`.

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
- **`defaultUrl`**: Default click-through destination landing page.
- **`clickUrl`**: GAM click tracker macro URL.
- **`trackingUrl`**: Third-party click tracking pixel endpoint.
- **`slideImages`**: List of custom URLs for slide panels (configured via GAM list fields or key-value fields).
- **`slideUrls`**: List of custom click URLs mapped to each slide panel.

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
- **Impression Tracking**:
  - **Rendered/Impression**: Logged when the ad mounts and the GSAP intro animation plays.
- **Interaction Tracking**:
  - **Slide Drag/Spin**: Logged when a user drags/swipes to spin the cylinder.
- **Click-Through Tracking**:
  - **General Click**: Tracked when the user clicks the billboard background.
  - **Slide Click**: Mapped to slide-specific tracking pixels (e.g. `trackingUrl?click=[Slide URL]`).

### B. Supported Ad Server Macros (GAM)
To properly log impressions and clicks inside GAM, the ad integration uses the following standard macros:

* **Click-Through Macro (`%%CLICK_URL_UNESC%%` / `%%CLICK_URL_ESC%%`)**:
  * Prepend this macro to the landing page destination URL to track click counts inside GAM.
* **Impression Macro (`%%VIEW_URL_UNESC%%` / `%%VIEW_URL_ESC%%`)**:
  * Injected as a 1x1 tracking pixel to register viewable impressions under GAM Active View.
* **Cachebuster Macro (`%%CACHEBUSTER%%`)**:
  * Appended to third-party tracking pixels to prevent browser caching of tracking requests.
  * *Example Usage*: `https://tracker.com/pixel.gif?ord=%%CACHEBUSTER%%`
