# Expandable Ad Specifications

This document outlines a production-ready specification for expandable ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

An expandable ad starts in a **Collapsed State** and transitions to an **Expanded State** on user interaction.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Mobile Banner to Interstitial** | `320 × 50` px | `320 × 480` px | Mobile phones (bottom/top anchor) |
| **Medium Rectangle to Half-Page** | `300 × 250` px | `300 × 600` px | Sidebar / In-feed |
| **Standard Leaderboard to Large** | `728 × 90` px | `728 × 360` px (or `970 × 250` px) | Tablet / Desktop Header |
| **Billboard / Super Leaderboard** | `970 × 90` px | `970 × 250` px (or `970 × 500` px) | Desktop Header / Premium |
| **Custom Vertical Column (Demo)** | `316 × 728` px | `949 × 728` px | Yahoo Custom Multi-Column |

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
* **Autoplay & Audio (IAB Compliant)**:
  * Video autoplay **must start muted** by default (e.g., `muted autoplay playsinline`).
  * Sound is strictly **user-initiated**. The ad must display a visible mute/unmute control icon, allowing the user to toggle the sound on or off.
* **Supported Formats**: `MP4` (H.264 video codec, AAC audio codec) for universal HTML5 browser compatibility.
* **Maximum File Size**: 
  * *Host-initiated (Initial load)*: `< 2.0 MB` recommended.
  * *User-initiated (Polite load)*: Up to `10.0 MB`.
* **Duration**: Max `15 to 30 seconds` (looping permitted).
* **Frame Rate**: Up to `30 fps`.

### B. Image Specifications
* **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
* **Supported Formats**: `PNG` (for transparent layers/close buttons), `JPEG` (high quality backgrounds), and `WebP` (next-gen optimization).
* **Maximum File Size**: 
  * Main Backgrounds: `< 150 KB`.
  * Close Buttons / UI Overlays: `< 15 KB`.

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
* **Creative Dimensions**:
  * `Collapsed Width` & `Collapsed Height`
  * `Expanded Width` & `Expanded Height`
* **Asset Sources**:
  * `Base Image URL` (Banner state background image asset)
  * `Expanded Background Image URL` (Expanded state background image asset)
  * `Video Source URL` (Direct path to the ad video)
  * `Close Button Image URL` (Relative or CDN URL for custom close asset)
* **Close Behavior Settings**:
  * `useCustomClose` (Boolean determining whether the ad registers its own UI close buttons)

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
* **`autoplay`** (Boolean: `true` / `false` to toggle auto-play behavior)
* **`videoloop`** (Boolean: `true` / `false` to set loop playback if the ad contains a video component)
* **`impression url`** (Primary custom impression tracking pixel URL)
* **`click url`** (Destination landing page URL for tracking)
* **`[Optional] custom click urls 1-3`** (Additional tracking destination URLs for specific interactive buttons inside the ad)
* **`[Optional] custom tracking pixels 1-5`** (Additional third-party tracker impression pixels for vendor verification)

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
* **Impression Tracking**:
  * **Rendered/Impression**: Logged when the ad iframe/container successfully loads.
  * **Viewable Impression**: Logged when the ad is confirmed as viewable on-screen (via standard Active View).
* **Expansion/Interaction Tracking**:
  * **Ad Expand**: Tracked when the user interacts with the ad to open the expanded panel.
  * **Ad Collapse**: Tracked when the user closes the expanded panel back to the default banner state.
* **Click-Through Tracking**:
  * Tracked when the user clicks the ad to go to the advertiser landing page.

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
