# Easter Egg Directory

This file documents all the hidden Easter Eggs on the portfolio site, their locations, triggers, and effects.

| # | Name | Component Location | Trigger Action | Effect Summary |
|---|---|---|---|---|
| 1 | **Biometric Bypass** | `components/ui/BiometricGate.tsx` | Double-tap the scanner 3 times | Bypasses biometric scan, shows warning/threat messages, then a Confetti Celebration screen before granting access. |
| 2 | **Hero Matrix Glitch** | `components/sections/Hero.tsx` | Rapidly click the profile picture 5 times | Profile picture glitches, spinning ring accelerates, Matrix code rains from the image, and a "NO FACE FOUND" message appears. |
| 3 | **Konami Dashboard** | Global (`components/ui/PageTransitionWrapper.tsx`) | Type Konami Code: `↑ ↑ ↓ ↓ ← → ← → B A` | Triggers a global "System Override" dev dashboard with falling Matrix code and a "God Mode Enabled" toast. |
| 4 | **Skill Overload** | `components/sections/About.tsx` | Hover over the cycling skills text for exactly 3 seconds | The text cycling speed accelerates exponentially until it blurs, landing on a secret "MASTER OF EASTER EGGS" skill. |
| 5 | **Footer Black Hole** | `components/sections/Footer.tsx` | Drag the FA Logo slightly out of its container and release | The logo spins out of control, shrinks to nothing, and flashes an "Anomaly Detected" warning. |
| 6 | **Gravity Anomaly** | `components/sections/Resume.tsx` | Click the 3rd timeline node's glowing dot 3 times | All timeline cards detach, gain Matter.js physics physics, and fall to the bottom of the screen where they can be dragged. |
| 7 | **Typewriter Scribe** | `components/ui/TypewriterText.tsx` | Highlight (select text) for the word "Faceless" | Cursor changes to a quill, typing sounds play, and text turns into unreadable Ancient Runic font briefly. |
| 8 | **Contact Matrix** | `components/sections/Contact.tsx` | Hold `Shift` key while hovering the "Say Hello" button | Button text scrambles into Matrix symbols and button shadow glows violently green. |
| 9 | **Password Bypass** | `components/ui/BiometricGate.tsx` | Type "easter", then "egg", then "found" while the scanner interface is active. | Secretly bypasses the biometric scan by identifying the sequence and celebrates with confetti. |
