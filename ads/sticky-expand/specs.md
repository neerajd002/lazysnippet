# Sticky-Expand Ad Specifications

This document outlines a production-ready specification for Sticky-Expand (Right Sidebar Sticky Expandable) ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

The Sticky-Expand ad is a vertical sidebar anchored to the right edge of the viewport that slides out on user click/tap to reveal a large interactive overlay.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Sticky Sidebar Expandable** | `40 × 160` px (Anchor) | `600 × 500` px (Overlay) | Desktop & Mobile Right Sidebar Anchor |

- **Layout Behavior**:
  - **Collapsed State**: Positioned fixed on the middle-right of the screen viewport (`position: fixed; right: 0; top: 50%; transform: translateY(-50%)` or `top: 0; right: 0; height: 100vh`). The content displays vertical text indicating an expansion action.
  - **Expanded State**: Renders a dark backdrop covering the page. The ad panel flies in smoothly from the right side (`x: 500` transition). A Close button (✕) collapses the ad back to the sidebar state.

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
- **Video Playback**: `N/A` (Default template uses static images and CSS transitions, though custom HTML5 implementations can embed video player frames inside the expanded panel).

### B. Image Specifications
- **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
- **Supported Formats**: `PNG` (transparencies), `JPEG` (backgrounds), and `WebP` (optimizations).
- **Maximum File Size**: 
  - Sidebar Banner Background: `< 50 KB`.
  - Expanded Panel Image: `< 200 KB`.
  - Close / UI Controls: `< 10 KB`.
- **Recommended Dimensions**: 
  - Sidebar Anchor: `40 × 160` px.
  - Expanded panel background: `600 × 500` px.

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
- **`width`**: Width in pixels of the collapsed vertical sidebar (default: `40` px).
- **`height`**: Height in pixels of the collapsed vertical sidebar (default: `160` px).
- **`expandedHeight`**: Height in pixels of the expanded panel overlay (default: `500` px).
- **`expanded`**: Boolean state tracking the open/closed state of the expanded panel.

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
- **`collapsedWidth`**: Custom width for the collapsed sidebar.
- **`collapsedHeight`**: Custom height for the collapsed sidebar.
- **`expandedHeight`**: Custom height for the expanded panel overlay.
- **`expandedImage`**: URL path to the expanded state panel image.
- **`clickUrl`**: GAM click tracker macro URL.
- **`impressionUrl`**: Third-party impression tracking pixel.

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
- **Impression Tracking**:
  - **Rendered/Impression**: Logged when the vertical sticky sidebar mounts and initializes.
  - **Viewable Impression**: Logged when the sidebar renders on the viewport edge.
- **Interaction/State Tracking**:
  - **Ad Expand**: Tracked when the user clicks the vertical sidebar to fly in the expanded panel.
  - **Ad Collapse**: Tracked when the user collapses the panel back to the sidebar state.
  - **Ad Dismiss**: Tracked if the user closes/dismisses the collapsed sidebar, removing the ad frame.
- **Click-Through Tracking**:
  - Tracked when the user clicks the expanded panel content to navigate to the landing page.

### B. Supported Ad Server Macros (GAM)
To properly log impressions and clicks inside GAM, the ad integration uses the following standard macros:

* **Click-Through Macro (`%%CLICK_URL_UNESC%%` / `%%CLICK_URL_ESC%%`)**:
  * Prepend this macro to the landing page destination URL to track click counts inside GAM.
* **Impression Macro (`%%VIEW_URL_UNESC%%` / `%%VIEW_URL_ESC%%`)**:
  * Injected as a 1x1 tracking pixel to register viewable impressions under GAM Active View.
* **Cachebuster Macro (`%%CACHEBUSTER%%`)**:
  * Appended to third-party tracking pixels to prevent browser caching of tracking requests.
  * *Example Usage*: `https://tracker.com/pixel.gif?ord=%%CACHEBUSTER%%`
