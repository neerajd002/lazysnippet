# Slide-Up Footer Ad Specifications

This document outlines a production-ready specification for Slide-Up Footer (Bottom Anchor Expandable) ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

The Slide-Up Footer ad is a bottom-anchored banner that slides up on user click/tap to reveal a larger rich media overlay.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Slide-Up Footer Banner** | `600 × 100` px (Anchor) | `600 × 500` px (Overlay) | Mobile & Desktop Bottom Anchor |

- **Layout Behavior**: 
  - **Collapsed State**: Positioned fixed at the bottom center of the viewport (`position: fixed; bottom: 0`). Clicks anywhere on the banner (except the close button) expand the ad.
  - **Expanded State**: Slides upward to cover a large portion of the screen. A custom Close button (✕) in the panel collapses the ad back to the banner state.
  - **Dismissal**: Clicking the close button on the collapsed banner fully dismisses the ad, removing the ad frame.

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
- **Video Playback**: `N/A` (Default template uses static images and CSS animations, though custom HTML5 implementations can embed video layers inside the expanded panel).

### B. Image Specifications
- **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
- **Supported Formats**: `PNG` (transparencies), `JPEG` (backgrounds), and `WebP` (optimizations).
- **Maximum File Size**: 
  - Collapsed Banner Image: `< 80 KB`.
  - Expanded Panel Image: `< 200 KB`.
  - Close / UI Controls: `< 10 KB`.
- **Recommended Dimensions**: 
  - Banner background: `600 × 100` px.
  - Expanded panel background: `600 × 500` px.

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
- **`height`**: Height in pixels of the collapsed bottom banner (default: `100` px).
- **`expandedHeight`**: Height in pixels of the expanded panel overlay (default: `500` px).
- **`expanded`**: Boolean state tracking the open/closed state of the expanded panel.

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
- **`collapsedHeight`**: Custom height for the initial banner.
- **`expandedHeight`**: Custom height for the expanded panel.
- **`bannerImage`**: URL path to the collapsed state banner image.
- **`expandedImage`**: URL path to the expanded state panel image.
- **`clickUrl`**: GAM click tracker macro URL.
- **`impressionUrl`**: Third-party impression tracking pixel.

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
- **Impression Tracking**:
  - **Rendered/Impression**: Logged when the footer banner initializes and renders.
  - **Viewable Impression**: Logged when the banner enters the screen view.
- **Interaction/State Tracking**:
  - **Ad Expand**: Tracked when the user clicks the banner to slide up the expanded panel.
  - **Ad Collapse**: Tracked when the user collapses the panel back to the banner state.
  - **Ad Dismiss**: Tracked when the user closes/dismisses the collapsed banner, removing the ad frame.
- **Click-Through Tracking**:
  - Tracked when the user clicks the banner or expanded panel to navigate to the landing page.

### B. Supported Ad Server Macros (GAM)
To properly log impressions and clicks inside GAM, the ad integration uses the following standard macros:

* **Click-Through Macro (`%%CLICK_URL_UNESC%%` / `%%CLICK_URL_ESC%%`)**:
  * Prepend this macro to the landing page destination URL to track click counts inside GAM.
* **Impression Macro (`%%VIEW_URL_UNESC%%` / `%%VIEW_URL_ESC%%`)**:
  * Injected as a 1x1 tracking pixel to register viewable impressions under GAM Active View.
* **Cachebuster Macro (`%%CACHEBUSTER%%`)**:
  * Appended to third-party tracking pixels to prevent browser caching of tracking requests.
  * *Example Usage*: `https://tracker.com/pixel.gif?ord=%%CACHEBUSTER%%`
