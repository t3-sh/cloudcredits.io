## Contribution Guide

Welcome! There are many ways to contribute—from writing code to adding program listings or simply spreading the word. Let's build **CloudCredits.io** together.

---

### Hacktoberfest Participation

CloudCredits.io opts in to Hacktoberfest each year. To help contributions count:

- Maintainers keep issues labeled with `hacktoberfest`, `good first issue`, and `help wanted` when they are ready for community pickup.
- Reviewers merge qualifying work, leave an overall approving review, or apply the `hacktoberfest-accepted` label so your PR is accepted during the 7-day review window.
- Please register at [hacktoberfest.com](https://hacktoberfest.com) before submitting October PRs, and avoid spammy or low-effort submissions—they will be marked `invalid` or `spam` per the event rules.

---

### 1. Code Contributions

- **Tech Stack**  
  - **Framework:** [Astro](https://astro.build/) (static, no SSR), React components, Tailwind CSS  
  - **Animations:** Framer Motion  
  - **Search:** Pagefind

- **Features & Priorities**  
  - We prioritize features from the roadmap and those most upvoted in Discussions. Feel free to fix bugs anytime!

- **Feature Workflow**  
  1. **Propose** a feature in Discussions.  
  2. If it gets enough community support (upvotes), the team converts it into a GitHub issue.  
  3. **Ready to Implement**: You can pick it up if it's unassigned.  
  4. **Not Converted Yet?** Check in with the core team first. Sometimes there are blockers or other plans.

- **Pull Requests**  
  - Fork the repo, make changes, and open a PR. Please reference the issue you're resolving or feature request if applicable.

- **Good First Issues**  
  - Look for the "Good First Issue" label if you're new to the codebase or want a simpler task.

---

### 2. Program/Listing Contributions

- **Criteria**  
  - Must be legit and beneficial programs (e.g., cloud/SaaS credits) from recognized companies.  
  - Should bring **real** or **significant** value to founders, open source projects, or builders.  
  - No shady offers or questionable "gotchas."

- **Format & Quality**  
  - Follow the existing listing structure for consistency.  
  - Provide official links and accurate details.  
  - We reserve the right to reject listings that require invasive requirements or have questionable practices.

- **What's Not Allowed**  
  - Invasive or predatory offers.  
  - Listings that function solely as lead generation without real user value.  
  - Tools that compromise user privacy or cause more harm than good.

#### How to Add a New Deal Listing

1. Create or update the provider entry:
   - If the provider is new, add `src/content/providers/<provider>.yaml` and include the metadata (name, url, etc).
   - Add the provider's logo SVG to `public/images/providers/<provider>.svg`.

2. Create the program listing:
   - Ensure `src/content/programs/<provider>/` exists.
   - Add `src/content/programs/<provider>/<program-name>.yaml` using an existing listing as a template.

3. Select tags:
   - Reference the `ALLOWED_TAGS` list in `src/tags.ts` and choose the most relevant tags.

4. Assign benefit and effort levels:
   Benefit (1–4):
   1 — Starter: basic credits or a short free trial (under $1K) to explore the platform
   2 — Growing: substantial credits or discounts (~$1K–$5K) to support production use
   3 — Growth Plus: significant credits (10K+) plus bonus perks (events, dedicated support)
   4 — Enterprise: high-value, customized package (> $100K) with dedicated services

   Effort (1–4):
   1 — Minimal: complete a simple form
   2 — Moderate: provide basic documentation (financials, pitch deck)
   3 — Extensive: participate in interviews and additional verifications
   4 — Intensive: undergo rigorous due diligence and complex approvals

Be sure to follow existing formatting conventions and test your changes locally before opening a PR.

---

### 3. Other Ways to Help

- **Content & Translations**  
  - Improve existing listings or translate them into new languages.
- **Bug Reports & Feedback**  
  - File an issue if you spot errors or have ideas for improvement.
- **Advocacy**  
  - Share the project with your community or network.
  - Help answer questions or review others' PRs.

---

### 4. Sponsorship & Advocacy

- We welcome support for our hosting and operational costs, but **no** sponsorship that requires special treatment or ad placements.  
- CloudCredits.io remains **neutral** and community-driven—no "pay-to-play" listings.

---

**Thank you** for being part of the CloudCredits.io community! We appreciate every contribution, big or small. If you have questions, open an issue or start a Discussion. Let's collaborate and empower more builders together.
