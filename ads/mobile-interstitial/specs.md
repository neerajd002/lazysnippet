# Mobile Interstitial Ad Specifications

This document outlines a production-ready specification for Mobile Interstitial (Gamified Catching Game) ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

The Mobile Interstitial ad starts as a `1 × 1` px out-of-page creative in Google Ad Manager and expands to take over the entire mobile screen viewport upon initialization.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Gamified Interstitial** | `1 × 1` px (GAM Unit) | `100% × 100vh` (Overlay)<br>Aspect Ratio: `9:16` | Mobile Devices Viewport Interstitial |

- **Layout Behavior**: On initialization, the ad expands to fill the full viewport screen (`100% × 100%`). The core content maintains a clean vertical `9:16` aspect ratio box (`width: min(100%, calc(100vh * 9 / 16))`) centered on the screen with a semi-transparent black backdrop.
- **Dismissal**: Includes a persistent close button (✕) in the top-right corner to allow the user to immediately exit the ad overlay.

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
- **Video Playback**: `N/A` (Mobile Interstitial default template uses static images and CSS/GSAP keyframe transitions for gameplay).

### B. Image Specifications
- **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
- **Supported Formats**: `PNG` (for transparent items/catcher basket), `JPEG` (high quality backgrounds), and `WebP` (next-gen optimization).
- **Maximum File Size**: 
  - Background Images (Intro & Game): `< 150 KB` per background.
  - Game Item Assets (Sandal, Top, Shirt, Shoe, Mobile, Laptop, Camera, Hanger): `< 15 KB` per item.
  - Overall Ad Initial Load Assets: `< 1.5 MB`.
- **Recommended Dimensions**: 
  - Game Area Box: `360 × 640` px or `450 × 800` px (fitting the 9:16 layout aspect).

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
- **`duration`**: Gameplay timer length in seconds (default: `20`).
- **`speed`**: Velocity speed factor of falling items (default: `0.5`).
- **`newSpawnTime`**: Spawn frequency in milliseconds for catchable items (default: `800`).
- **`objectTypes`**: Predefined array defining catchable products, their sprite sheet sources, score weights, sizes, and falling physics.

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
- **`clickUrl`**: GAM click tracker macro URL.
- **`timerDuration`**: Custom integer value representing gameplay seconds.
- **`fallingSpeed`**: Coefficient modifier for game item speed difficulty.
- **`impressionUrl`**: Third-party impression tracking pixel.

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
- **Impression Tracking**:
  - **Rendered/Impression**: Logged when the out-of-page script executes.
  - **Viewable Interstitial**: Logged when the introductory screen overlay mounts.
- **Gameplay/Interaction Tracking**:
  - **Ad Close**: Tracked when the close button is clicked, immediately removing the ad frame.
  - **Game Start**: Tracked when the user transitions from the Intro Screen to the Catching Game.
  - **Item Catch**: Tracked during gameplay when an item collides with the catcher basket.
  - **Game Over**: Tracked when the timer runs out and the success screen pops up.
- **Click-Through Tracking**:
  - Tracked when the user clicks the "BUY NOW" button on the Game Over screen, opening the advertiser landing page.

### B. Supported Ad Server Macros (GAM)
To properly log impressions and clicks inside GAM, the ad integration uses the following standard macros:

* **Click-Through Macro (`%%CLICK_URL_UNESC%%` / `%%CLICK_URL_ESC%%`)**:
  * Prepend this macro to the landing page destination URL to track click counts inside GAM.
* **Impression Macro (`%%VIEW_URL_UNESC%%` / `%%VIEW_URL_ESC%%`)**:
  * Injected as a 1x1 tracking pixel to register viewable impressions under GAM Active View.
* **Cachebuster Macro (`%%CACHEBUSTER%%`)**:
  * Appended to third-party tracking pixels to prevent browser caching of tracking requests.
  * *Example Usage*: `https://tracker.com/pixel.gif?ord=%%CACHEBUSTER%%`
