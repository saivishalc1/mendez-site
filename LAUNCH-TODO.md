# Mendez-Vasquez LLC — launch checklist

Draft site with three design directions (A Hi-Vis, B Clean Slate, C Truck Side) at `/a/`, `/b/`, `/c/`.
After the client picks one, delete the other two folders, the chooser page and the A/B/C switch.

## Confirm with the client
Everything below is either a guess or comes only from their Facebook page.

- [ ] **Name and spelling:** "Mendez-Vasquez LLC" (as on the trucks). Do they want "Méndez" with an accent?
- [ ] **Phone (201) 723-2298:** does it take texts? Do they use **WhatsApp** on it? (The quote form offers text, WhatsApp and email.)
- [ ] **Email** mendezvasquez.llc@gmail.com: is it still checked?
- [ ] **Address** 1511 Summit Ave #3, Union City: OK to show publicly, or show "Union City, NJ" only?
- [ ] **Hours:** Facebook says "Always open". The site says "Open 7 days". Is that right?
- [ ] **Licensed & insured:** it's on the dumpster sign. Get the license or registration number for the footer if they have one.
- [ ] **Towns served:** the site lists Union City, West New York, North Bergen, Weehawken, Guttenberg, Hoboken, Jersey City, Secaucus, Bayonne.
- [ ] **What they won't take:** the site lists paint and chemicals, propane tanks, asbestos and medical waste. Do they handle any of these, or anything else, like tires or refrigerant?
- [ ] **Demolition scope:** the site only says interior gut-outs (kitchens, baths, drywall, flooring). Do they also do sheds, decks, garages or whole structures?
- [ ] **FAQ answers:** "Do I need to be there?" ("not always") and "carry stuff down stairs" ("yes").
- [ ] **Pricing:** none is shown. Do they want a starting price or a price per truck load? That could power an estimator.
- [ ] **Payment methods:** not mentioned anywhere yet.

## Assets we need from them
- [ ] **Original photos** straight from their phones. Only 2 Facebook photos are high-res; the other 8 are 315px thumbnails, so the site shows them small.
- [ ] Before and after photos of real jobs. This is the strongest proof for a cleanout business.
- [ ] Logo file, if they have one other than the truck lettering.
- [ ] Reviews: Facebook shows 1 review and no rating. If they have Google reviews, add them (real reviews only).

## Technical
- [ ] Connect the quote form to a backend (`FORM_ENDPOINT` in `site/src/shared/business.ts`, e.g. Formspree) so photos upload directly. Until then, the form hands the request to text, WhatsApp or email.
- [ ] Native Spanish speaker reviews `site/src/shared/content/es.ts`.
- [ ] Remove `noindex` from `*/index.html` and set up `robots.txt` at launch.
- [ ] Use an absolute `og:image` URL once the domain is known.
- [ ] Create or claim the Google Business Profile, and keep the business name, address and phone identical everywhere.
- [ ] Stock video credit: Pexels (free license, no attribution required; it's credited in the footer anyway).
