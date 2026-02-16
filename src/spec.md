# Specification

## Summary
**Goal:** Build the Velora MVP experience with a consistent design system, a 30-day daily program, premium-gated features (Text Softly, Journal, Audio Lessons), and per-user persistence via Internet Identity.

**Planned changes:**
- Apply the Velora global design system (palette, typography, rounded components, soft shadows/gradients, gentle fade-in animations) across all screens.
- Add Splash Screen with “Velora” typographic logo, tagline “Love deeply. Stay whole.”, and “Start Your Journey” CTA navigating to Welcome.
- Add Welcome Screen status selection (Single / In a relationship / Healing / Married) with validation, persistence, and navigation to Home.
- Implement Home / Daily Program screen for days 1–30 with lesson card, affirmation styling, and Next/Previous navigation.
- Implement premium gating: free users can access days 1–3 only; premium unlocks days 1–30 plus Text Softly, Journal, and Audio Lessons; locked UI shows padlock indicators and no ads.
- Add Premium Features screen with tabs (“Text Softly”, “Journal”, “Audio Lessons”) and “Unlock Full Program – ₦2,500/month” CTA that toggles/stores premium status in-app.
- Implement Text Softly Generator with category cards (Pull Away, Flirty, Apology, Missing You, Boundaries), random message display in speech-bubble UI, and per-user favorites (heart toggle), premium-gated.
- Implement Journal screen (“My Private Thoughts”) with lined-entry styling, Add Entry CTA, Save flow, and per-user private storage, premium-gated.
- Implement Profile / Settings with optional nickname, premium badge indicator, and soft-rose minimalist icons; persist nickname and show it where appropriate.
- Add app-wide Internet Identity sign-in/out and scope profile/status/premium/favorites/journal data to the signed-in principal; signed-out users can browse free content but must sign in to save personal data.
- Backend: create single Motoko canister APIs with stable storage for per-user profile, favorites, and journal entries (upgrade-safe patterns).
- Add Audio Lessons tab UI as a premium-gated list with locked states for non-premium; playback can be placeholder-only.

**User-visible outcome:** Users can sign in with Internet Identity, choose a relationship status, follow the 30-day program (days 1–3 free), and (after upgrading in-app) access all days plus Text Softly, Journal, and Audio Lessons with favorites and entries saved per user.
