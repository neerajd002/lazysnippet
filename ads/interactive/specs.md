# Interactive Ad Specifications

This document outlines a production-ready specification for Interactive (Hotspot & Social Commerce) ads, aligned with standard IAB (Interactive Advertising Bureau) HTML5 guidelines and Google Ad Manager (GAM) setups.

---

## 1. Standard Ad Dimensions & Sizes

The Interactive ad features clickable hotspots, product modals, customer reviews, and direct social commerce integrations inside a standard banner viewport.

| Format Type | Collapsed State (W × H) | Expanded State (W × H) | Common Placements |
| :--- | :--- | :--- | :--- |
| **Interactive Rectangle** | `300 × 250` px | `N/A` (In-place interaction) | Sidebar / In-feed / Inline |

- **Layout Behavior**: The ad displays within a static `300 × 250` px banner. Hotspots pulse dynamically to encourage user interaction. Clicking hotspots overlays content bubbles (technology, fragrance, or offers) or mounts modals (e.g. reviews modal) in-place without expanding the iframe.

---

## 2. Asset Specifications & IAB Guidelines

To ensure fast load times, compatibility with standard ad exchanges, and high rendering quality, assets must adhere to the following specifications:

### A. Video Specifications
- **Video Playback**: `N/A` (Interactive banner uses static assets).

### B. Image Specifications
- **DPI / Resolution**: Images must be saved at **72 dpi** (dots per inch), which is the digital web standard.
- **Supported Formats**: `PNG` (for overlays/transparencies), `JPEG` (backgrounds), and `WebP` (optimizations).
- **Maximum File Size**: 
  - Main Background Image: `< 150 KB`.
  - Hotspot Popups / Offer Panels: `< 50 KB` each.
  - Overall Ad Initial Load Assets: `< 1.2 MB`.
- **Recommended Dimensions**: 
  - Background Image: `300 × 250` px.
  - Technology/Fragrance Popups: `80 × 80` px (Circle style).
  - Offer Image: `186 × 226` px.

---

## 3. Configuration & Customization Properties

To make the creative flexible, configuration properties are split between the development/build phase and runtime settings configured inside Google Ad Manager.

### A. Ad-Level Properties (Customized during Ad Development)
These properties are defined statically or dynamically within the ad codebase during the development and design phase:
- **`reviews`**: Static array containing customer reviews with fields for name, title, description, and rating (1-5 stars).
- **`whatsappLink`**: Default click URL pattern for WhatsApp chat integration.
- **`productLink`**: Default target ecommerce landing page URL.
- **`hotSpotPopup`**: Reactive state string tracking the currently active overlay popup name (e.g. `technology`, `fragrance`, `offer`, `reviews`).

### B. GAM-Level Configurable Properties (Configured in Google Ad Manager)
These variables are exposed as input parameters in the Google Ad Manager HTML5 creative template or key-values, allowing traffickers to customize campaigns dynamically without modifying the underlying ad code:
- **`backgroundImage`**: URL path for the main banner background image.
- **`shopNowImage`**: URL path to the "Shop Now" call-to-action button image.
- **`checkOfferImage`**: URL path to the "Check Offer" button image.
- **`technologyImage`**: Background image URL for the technology bubble overlay.
- **`fragranceImage`**: Background image URL for the fragrance bubble overlay.
- **`offerImage`**: Custom coupon/discount image URL.
- **`clickUrl`**: GAM click tracker macro URL.
- **`whatsappNumber`**: WhatsApp phone number for lead generation (e.g., `+91XXXXXXXXXX`).

---

## 4. Tracking & Analytics (Ad Server Macros)

### A. Tracked Events
- **Impression Tracking**:
  - **Rendered/Impression**: Logged when the ad mounts and components are ready.
- **Interaction Tracking**:
  - **Hotspot Clicks**: Tracked when a user clicks the technology, fragrance, or offer hotspot.
  - **Social Interactions**: Tracked when the user clicks the WhatsApp icon, Wishlist button, or reviews trigger.
  - **Modal Open/Close**: Tracked when the customer reviews modal opens or is dismissed.
- **Click-Through Tracking**:
  - Tracked when a user clicks the main background, the "Shop Now" button, or product links, redirecting to the landing page.

### B. Supported Ad Server Macros (GAM)
To properly log impressions and clicks inside GAM, the ad integration uses the following standard macros:

* **Click-Through Macro (`%%CLICK_URL_UNESC%%` / `%%CLICK_URL_ESC%%`)**:
  * Prepend this macro to the landing page destination URL to track click counts inside GAM.
* **Impression Macro (`%%VIEW_URL_UNESC%%` / `%%VIEW_URL_ESC%%`)**:
  * Injected as a 1x1 tracking pixel to register viewable impressions under GAM Active View.
* **Cachebuster Macro (`%%CACHEBUSTER%%`)**:
  * Appended to third-party tracking pixels to prevent browser caching of tracking requests.
  * *Example Usage*: `https://tracker.com/pixel.gif?ord=%%CACHEBUSTER%%`
