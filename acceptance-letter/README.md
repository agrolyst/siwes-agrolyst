# Acceptance Letter Page

The acceptance letter is part of the Agrolyst SIWES portal's existing single-page application.

- Route: `/acceptance-letter/`
- Main implementation: `index.html` (the `letter()` function and route handler).
- This portal uses Supabase session authentication and loads the applicant's SIWES application.
- A letter is displayed only when the authorised status is `acceptance_letter_issued`, with both an acceptance letter number and issued timestamp.
- Applicants can print or save the issued letter as PDF from the page.

The source file is here: [index.html](../index.html).
