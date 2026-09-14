# Reference and asset credits

Source: [Viktor Oddy’s post, September 14, 2026](https://x.com/viktoroddy/status/2099488750283923775).

The 11-minute walkthrough demonstrates using visual references and motion assets to build expressive websites. This repository implements four principal examples as independent studies, rather than reproducing every tool, inspiration thumbnail, or intermediate screen visible in the recording.

| Example               | Approximate timestamp | Retained characteristics                                                           | Adaptation                                                                                                                      |
| --------------------- | --------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Keel                  | 00:25                 | Blue environment, chrome/ring imagery, light serif typography                      | The original animation URL was not recoverable. A clean image crop from the reference supplies the scene, with scroll parallax. |
| Futuristic streetwear | 05:45                 | Giant character, low-angle footwear, teal backdrop, condensed headings             | Named **Next Move** here. Added native size dialogs and a clearly labelled local demo bag.                                      |
| Orla                  | 08:00                 | Oversized wordmark, pale editorial backdrop, fashion film                          | Uses a scroll-controlled film so the initial pose stays composed. Adds three keyboard-accessible look descriptions.             |
| Undr                  | 09:55                 | Red oversized type, drift footage, dark background, Rules/Nights/Pull up structure | Adds native accordions and explicitly fictional event details.                                                                  |

## Source media

These public asset URLs were visible in the recording or in the public Undr example it displayed. Local copies are resized/transcoded for browser playback and accompanied by poster frames. The application does not call these hosts at runtime.

- **Next Move video:** https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260914_054423_331b83c7-be70-47ee-94fd-517ea989f0e8.mp4
- **Orla video:** https://d8j0ntlcm91z4.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/hf_20260912_155845_0dc2a196-b8a2-414c-94bb-80854ed49125.mp4
- **Undr video:** https://d2ol7oe51mr4n9.cloudfront.net/user_3GJaYKPxdnQG0Q9O26lu6DPmcHu/3abfc4bb-a49d-4a22-93e6-3ebb0f7fa9ac.mp4
- **Undr public visual reference:** https://t2-pearl-nine.vercel.app/
- **Keel poster:** Crop of the chrome rings and sky from the source recording at approximately 00:25. It is a still-image approximation, not a recovered original animation.

Original media ownership remains with the respective creators and rights holders. Reference access is not a general asset license, and no broader license was established from the source. The repository’s code license excludes these media and the artwork represented in screenshots. Replace the reference media with your own licensed artwork for a commercial adaptation.

## Typography

Self-hosted Google Fonts are used as available visual approximations:

- DM Sans, variable weight 400–700: shared interface, Orla, and Undr.
- DM Serif Display, regular and italic: Keel and editorial accents.
- Barlow Condensed, bold: Next Move.

The font files retain their [SIL Open Font Licenses](licenses/). The implementation does not claim pixel-perfect reproduction or ownership of the original concepts.
