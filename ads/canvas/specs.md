# Canvas Ad Specifications

This document outlines a production-ready specification for Canvas (Skin or Site Takeover) ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

The Canvas ad starts as a `1 × 1` px out-of-page serving block in Google Ad Manager and dynamically breaks out to render left and right background gutters/panels wrapping around the publisher's main website content container.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Desktop Takeover (Skin)** | `1 × 1` px (GAM Unit) | `Dynamic` px (Left/Right Gutters) | Desktop Gutter Skins (Left & Right side) |

- **Layout Behavior**: Left and Right panels anchor to the browser window (`position: fixed`). The width of each panel is dynamically calculated at runtime based on the publisher content wrapper container.
- **Responsive Fallback**: Automatically yields (hides) if the available gutter space is smaller than the minimum width of `160` px.

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
- **Video Playback**: `N/A` (Canvas skin does not contain a video component).

### B. Image Specifications
- **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
- **Supported Formats**: `PNG` (for transparency layers), `JPEG` (high quality backgrounds), and `WebP` (next-gen optimization).
- **Maximum File Size**: 
  - Left & Right Gutter Backgrounds: `< 300 KB` per image.
- **Recommended Dimensions**: 
  - Left/Right Panels: `400 × 1200` px or `450 × 1600` px to support large monitors and scrolling viewports.

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
- **`minWidth`**: Minimum width in pixels required for each side gutter to render the ad panels (default: `160`).
- **`topPadding`**: Dynamic offset computed at runtime to prevent overlapping with publisher sticky headers.

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
- **`leftImage`**: URL path to the left gutter background image asset.
- **`rightImage`**: URL path to the right gutter background image asset.
- **`contentSelector`**: CSS selector string targeting the publisher's main page container (e.g. `#main-content`, `.container`, `.wrapper`) to calculate remaining gutter space.
- **`click url`**: Destination landing page URL for tracking.
- **`[Optional] custom tracking pixels`**: Additional third-party tracker impression pixels for vendor verification.

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
- **Impression Tracking**:
  - **Rendered/Impression**: Logged when the ad breaks out and successfully calculates/injects gutter panels.
- **Click-Through Tracking**:
  - Tracked when the user clicks either the left or right background panels to open the advertiser landing page.

### B. Supported Ad Server Macros (GAM)
To properly log impressions and clicks inside GAM, the ad integration uses the following standard macros:

* **Click-Through Macro (`%%CLICK_URL_UNESC%%` / `%%CLICK_URL_ESC%%`)**:
  * Prepend this macro to the landing page destination URL to track click counts inside GAM.
  * *Example Usage*: `%%CLICK_URL_UNESC%%https://www.advertiser.com`
* **Impression Macro (`%%VIEW_URL_UNESC%%` / `%%VIEW_URL_ESC%%`)**:
  * Injected as a 1x1 tracking pixel to register viewable impressions under GAM Active View.
* **Cachebuster Macro (`%%CACHEBUSTER%%`)**:
  * Appended to third-party tracking pixels to prevent browser caching of tracking requests.
  * *Example Usage*: `https://tracker.com/pixel.gif?ord=%%CACHEBUSTER%%`
