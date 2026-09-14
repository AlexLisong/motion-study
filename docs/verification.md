# Verification

Verified September 14, 2026.

## Static checks

- `npm run build` passes JavaScript syntax, entrypoint, all four study definitions, and 14 local asset references.
- Video byte-range request `bytes=0-1` returns HTTP 206 with exactly two bytes and a valid `Content-Range`.
- Images, fonts, and three videos are stored locally. No application network service or account is required.

## Live Chrome checks

- Gallery loads all four previews; case links and shared navigation open the expected views.
- Next Move video is seekable through its 9.04-second duration; scrolling to the product section advances playback near the end of the clip.
- Product dialog accepts a size selection and adds it to the demo bag. Bag content, price total, removal, empty state, and focus restoration were verified.
- Pause motion stops video playback.
- Orla collection tabs switch the visible description using the right arrow key.
- Undr Rules accordion expands and displays its content.
- All four studies were inspected at a 390px phone viewport; the gallery was also checked at 320px. No unintended horizontal scrolling was observed in the checked views.
- A mobile Orla copy overlap found during inspection was corrected and rechecked.
- Desktop and mobile screenshots are saved in [screenshots/](screenshots/).

## Review

Independent code review identified and verified fixes for local video byte ranges, pending seek updates, and changes to the reduced-motion preference. No medium or high findings remained in that review.

## Limits

- Browser verification was in Chrome, not a comprehensive cross-browser/device suite.
- Dynamic OS reduced-motion changes were code-reviewed; the user’s system settings were not changed to test them.
- Keel uses a static reference crop with parallax; the original Keel animation was unavailable.
- No checkout, real event workflow, external database, or persistent cart is implemented or implied.
- This delivery publishes source to GitHub; it does not configure a hosted production site.
