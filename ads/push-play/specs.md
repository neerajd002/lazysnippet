# Push-Play Ad Specifications

This document outlines a production-ready specification for Push-Play (Expanding Multi-Video) ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

The Push-Play ad starts as a collapsed leader-billboard and expands downward, pushing the publisher content down to reveal a large multi-video panel.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Push-Down Video Billboard** | `970 × 90` px | `970 × 600` px | Desktop Header / Billboard |

- **Layout Behavior**: 
  - **Collapsed**: Displays 3 video thumbnails with play icons.
  - **Auto-Expand**: Expands automatically to `970 × 600` px after a `2`-second delay, auto-playing the first video muted. It auto-closes back to `970 × 90` px after an `8`-second delay unless the user interacts.
  - **Manual Expand**: Triggered when a user clicks/taps any of the 3 thumbnails. This expands the banner and plays the selected video with sound unmuted.
  - **SafeFrame Push**: Uses SafeFrame or MRAID APIs (`push: true`) to shift publisher content down rather than overlaying it.

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
- **Autoplay & Audio (IAB Compliant)**:
  - Auto-expanded video **must start muted** by default (e.g. `muted autoplay`).
  - User-initiated expansion (clicking a thumbnail) plays the video **unmuted**.
- **Supported Formats**: `MP4` (H.264 video codec, AAC audio codec).
- **Maximum File Size**: 
  - Initial Load: `< 2.0 MB` recommended.
  - Polite Load: Up to `10.0 MB` per video.
- **Duration**: Max `15 to 30 seconds` (looping permitted).
- **Frame Rate**: Up to `30 fps`.

### B. Image Specifications
- **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
- **Supported Formats**: `PNG`, `JPEG`, and `WebP`.
- **Maximum File Size**: 
  - Poster Images: `< 100 KB` per thumbnail.
  - Close / Icon Elements: `< 10 KB`.
- **Recommended Dimensions**: 
  - Poster Images: Aspect ratio matching the video player (e.g. `16:9` or `180 × 100` px thumbnail size).

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
- **`autoExpand`**: Boolean determining if the ad expands automatically on load (default: `true`).
- **`autoExpandDelay`**: Delay in milliseconds before auto-expansion (default: `2000`).
- **`autoCloseDelay`**: Timeout in milliseconds before auto-collapsing (default: `8000`).
- **`videos`**: Array of 3 video items containing:
  - `videoUrl`: Source path to the web-ready video asset.
  - `posterUrl`: Source path to the video thumbnail image.

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
- **`videoUrl1`, `videoUrl2`, `videoUrl3`**: Custom video asset links.
- **`posterUrl1`, `posterUrl2`, `posterUrl3`**: Custom thumbnail asset links.
- **`autoExpand`**: Toggle boolean to disable auto-expand behavior.
- **`clickUrl`**: GAM click tracker macro URL.
- **`impressionUrl`**: Third-party impression tracking pixel.

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
- **Impression Tracking**:
  - **Rendered/Impression**: Logged when the collapsed banner mounts.
- **Interaction/State Tracking**:
  - **Ad Expand**: Tracked on auto-expansion or when a user clicks a thumbnail.
  - **Ad Collapse**: Tracked on auto-close timeout or when clicking the close (✕) button.
  - **Thumbnail Clicks**: Tracked individually to report which video index (1, 2, or 3) was selected.
- **Video Playback Milestones**:
  - Tracked at 25%, 50%, 75%, and 100% (Completed) play progress.
- **Click-Through Tracking**:
  - Tracked when a user clicks the active video area to open the advertiser landing page.

### B. Supported Ad Server Macros (GAM)
To properly log impressions and clicks inside GAM, the ad integration uses the following standard macros:

* **Click-Through Macro (`%%CLICK_URL_UNESC%%` / `%%CLICK_URL_ESC%%`)**:
  * Prepend this macro to the landing page destination URL to track click counts inside GAM.
* **Impression Macro (`%%VIEW_URL_UNESC%%` / `%%VIEW_URL_ESC%%`)**:
  * Injected as a 1x1 tracking pixel to register viewable impressions under GAM Active View.
* **Cachebuster Macro (`%%CACHEBUSTER%%`)**:
  * Appended to third-party tracking pixels to prevent browser caching of tracking requests.
  * *Example Usage*: `https://tracker.com/pixel.gif?ord=%%CACHEBUSTER%%`
