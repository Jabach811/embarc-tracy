# Embarc Tracy Redesign: Design Spec

Date: 2026-09-10
Status: approved in conversation, awaiting written review

## What this is

A portfolio concept that redesigns the Embarc Tracy dispensary website (goembarc.com/tracy) using Embarc's real brand and real menu. It is not constrained by their current vendor (Budflow). It is not a rebrand. It is the same store, made easier to shop.

Goal, in priority order:

1. Beginner-friendly. Someone who has never bought cannabis can find the right product by feel or occasion without knowing brands or strain jargon.
2. Deals first. The weekly schedule and member savings are the front door, because that is what regulars come for.
3. Nobody gets surprised at the counter. Every price says whether it applies online, in store, or both.

## Build approach

Plain HTML, CSS, and JavaScript. No framework, no build step, no install. Each screen is its own HTML file. One shared set of scripts loads the product data and powers the menu, product page, search, and cart. Open a file in a browser and it works. Hosting later is drag-and-drop to any static host.

Data comes from the harvested menu in `research/menu/products.json` (1,122 products), `brands.json` (116 brands with logos), and the per-category facet files. A one-time cleanup script produces the app's data file (see Data section).

Cart, checkout, and Passport Club sign-up are simulated. Nothing is sent anywhere.

## Pages

Five pages, one confirmation page, one drawer, one gate.

### Age gate

One screen, one button: "I'm 21 or older." Shown once per browser, then remembered. No cookie banner. The concept tracks nothing.

### Landing (`index.html`)

First screen answers three questions: are you open right now, what is today's deal, where do I start.

Top to bottom:

1. Header (shared, see Navigation).
2. Open-now line: "Open now until 9pm" or "Opens at 9am." Computed from the current time.
3. Today's deal block: day name, category, "30% off," one button that opens the menu filtered to it.
4. Three ways in:
   - Shop by feel: Relaxing, Uplifting, Sleep, Focus, Relief, Creative. Each links to the menu with that feel selected.
   - Shop by category: the eight category tabs (see Menu).
   - Today's 30% off: a row of six cards from today's deal category, sorted by best deal.
5. Store info card: address, phone, hours, parking, payment (cash and debit, $5 fee on debit, ATM inside), ID rules.
6. Short brand line: "A neighborhood shop. Every product hand-picked. 1% of sales goes back to Tracy." Nothing longer.
7. Footer (shared): Passport Club, Deals, Visit, license number, Prop 65 line.

Removed from the current page: welcome essay, "Experience the Best of Cannabis in Tracy," "Explore Tracy, CA" history, press logos, Google review badge, FAQ accordion, translate widget, sign-in bar, full product grid.

### Menu (`menu.html`)

The whole catalog on one page, but it never opens on everything. It always opens on a category or a feel. With no filter in the URL, it opens on today's deal category.

Top to bottom:

1. Header.
2. Today's deal strip: "Wednesday: 30% off all 3.5g flower" with a button that applies that filter. Flips by day automatically.
3. Category tabs (eight): Flower, Vapes, Prerolls, Edibles, Concentrates, Drinks, Wellness, Gear.
   - Wellness = tinctures + topicals + pills (about 40 items).
   - Gear = merch + batteries + papers + pipes + accessories + plants.
4. Feel chips (six): Relaxing, Uplifting, Sleep, Focus, Relief, Creative. Tapping one from each row combines them ("Edibles that help you sleep").
5. Active-filter chips: every active filter shows as a removable chip above the grid.
6. Sort control. Default "Best deal" (largest member savings first). Others: Price low to high, Price high to low, THC, A to Z.
7. Filter rail (desktop, left side) or filter sheet (mobile, slides up from a "Filters" button): strain type (Hybrid, Indica, Sativa, CBD), brand (searchable list), price range, "On sale only."
8. Product grid: 3 across on desktop, 2 across on mobile. Loads more as you scroll, no button.

Card contents: photo, brand, clean name, size, strain type, THC, price. Plus one deal line when it applies (see Deal marks). No badges, no starbursts, no strikethroughs.

Filter state lives in the URL query string so any view is shareable.

Search (in the header on every page) matches product name, brand, category, strain type, and effects. "sleep" returns sleep gummies, indica prerolls, and CBN tinctures.

### Product (`product.html?id=…`)

Top to bottom:

1. Header.
2. Brand logo, clean name, size, strain type, THC. Photo alongside on desktop, above on mobile.
3. "What you'll pay" box. Always two rows:
   - Order online for pickup: $X
   - Walk in and buy at the counter: $Y
   If X equals Y, one line replaces the two rows: "Same price online or in store." If they differ: "This is an online-only deal. Order here first and pick it up in store." Under the rows, always: "Prices include tax. Paying by debit adds a $5 fee. Cash has no fee."
4. Deal reason, one sentence, in the category color, when a deal applies. Example: "30% off Stiiizy vapes, every day, for Passport Club members (free to join)." "Members" links to the Passport Club page.
5. Options: flavor or size as visible pills (variants share a group in the data). Quantity stepper.
6. Buttons: primary "Add to pickup order." Secondary text link "I'll just come in," which scrolls to the store hours and address block at the bottom of the page.
7. Description, sentence case.
8. "Good for" line built from the effects data.
9. "More from [brand]": six cards.
10. Store hours and address block.

Legal limit: adding more than 1 oz of flower or 8 g of concentrate to the cart is blocked, and the button says why.

### Deals (`deals.html`)

1. Header.
2. Today block: "Wednesday. 30% off all 3.5g flower." Button to the filtered menu. After 8:45pm it reads "Back tomorrow with 30% off dabs."
3. Week strip: seven boxes, Monday to Sunday, today outlined, each in its category color. Tapping a day switches the block above to that day.
4. Everyday member deals: one line per brand deal, each linking to the menu filtered to that brand.
5. Online only: title "Online only. Order first, then pick up." Two-sentence explanation. Grid of the online-only items.
6. Getaway Bag: $60, worth up to $125, Fridays, members only, countdown to next Friday 9am, "notify me" field (accepts input, shows "We'll let you know," stores nothing).
7. Fine print, one paragraph: deals need free Passport Club membership, prices include tax, debit fee, legal limits.

The names Points Menu, Daily Deals, Value Menu, and Super Value Menu do not appear anywhere.

### Passport Club (`passport.html`)

Three blocks and a button.

- What you get: 1 point per $1 (about 5% back), access to every deal, birthday gift, Getaway Bag access.
- What it costs: nothing. Phone number and birthday, at the counter or here.
- What to know: points are redeemed in store. Deals show member pricing once you join.
- "Join free" button opens a two-field form (phone, birthday). Submitting shows "Thanks, you're in" and sets a joined flag in the browser. Once joined, "members only" nags across the site collapse to a small "Member pricing" label.

### Cart drawer (every page)

Slides in from the right. Page underneath does not move.

- One row per item: photo, brand and name, size or flavor, quantity stepper, line price, "Remove" text link.
- One savings line: "Passport Club saves you $21 on this order."
- Gift progress: one bar with marks at $35 (keychain), $50 (stash bag), $75 (hat), and one sentence: "Add $12 more for a free stash bag."
- Totals block, same treatment as the product page: subtotal, "prices include tax," debit fee line. If any item is an online-only deal, one line at the top of the totals says so.
- Button: "Reserve for pickup." Under it: "Ready in 15 minutes at Tracy. Bring your ID."
- Reserving lands on `reserved.html` and clears the cart.
- Empty state: "Nothing here yet." Two buttons: today's deal, the menu.
- Cart persists across pages and reloads (browser storage).

### Order reserved (`reserved.html`)

Confirmation only. Order number, what was reserved, pickup instructions, address, hours, a link back to the menu. Part of the cart flow, not a nav item.

## Navigation

Header on every page: logo (links home), four links (Menu, Deals, Passport Club, Visit), search field, cart button with item count. "Visit" jumps to the store info block on the landing page.

Removed: translate widget, sign-in, "Pickup at" store picker, Locations, Blog, Brands, Getaway Bag as a nav item, promo bar.

Mobile: header collapses to logo, search icon, cart. The four links move to a bar pinned to the bottom of the screen.

## Deal logic

Weekly schedule, 30% off the category for Passport Club members:

- Monday: Edibles
- Tuesday: Vapes
- Wednesday: 3.5g Flower
- Thursday: Concentrates
- Friday: Infused Prerolls
- Saturday: All products
- Sunday: Vapes

Everyday member deals come from the discount labels in the data: Stiiizy vapes 30%, Stiiizy flower/prerolls/extract/batteries 15%, Dabwoods 30%, Chico's Best 30%, Jeeter 5pk baby infused and 2g XL 30%, Ellis Greens 30%, Cake 30%, Value Menu 30%, and the remaining labeled everyday discounts.

Online-only: items whose discount label starts with "SUPER VALUE MENU." Their online price is the harvested price. Their walk-in price is the full price.

### Deal marks on cards

Only two kinds of items get a mark, as one short line of text in the category color:

- In today's category deal: "30% off today"
- On an everyday member discount: "30% off every day"
- Online-only items get "Online only" instead of a percentage.

Everything else shows a plain price.

### Prices

The harvested price is the Passport Club online price. Full price is derived from the discount percentage in the label. Prices are shown rounded to the nearest dollar, with "Prices include tax" stated on the product page, cart, and deals page. The store closes at 9pm; last order 8:45pm.

## Data

A one-time script (`tools/build-data.js`) reads the research files and writes `data/products.json` for the site. For each product it produces:

- `id`, `brand`, `brandLogo`
- `name`: cleaned. Strip the brand if the raw name repeats it, strip the bracketed size and the trailing " - 1 G" style suffix, title-case the rest. "POD [1G] WHITE RASPBERRY - 1 G" becomes "White Raspberry Pod."
- `size`: from the bracket or the size field, normalized ("1g", "3.5g", "100mg", "10 pack").
- `category`: one of the eight tabs.
- `subtype`: from the facet files (Live Rosin, Gummy, 510 Thread, and so on).
- `strain`: Hybrid, Indica, Sativa, CBD, or none.
- `thc`, `cbd`
- `effects`: from the facet data where present, otherwise inferred from strain type (Indica: Relaxing, Sleep; Sativa: Uplifting, Focus, Creative; CBD: Relief). Inferred effects are marked so the UI can word them softly.
- `priceOnline`, `priceWalkIn`, `dealKind` (today, everyday, onlineOnly, none), `dealPct`, `dealText`
- `group`: the variant group, so product pages can show sibling flavors and sizes.
- `image`, `description` (sentence case), `slug`

Products with no image get a neutral placeholder tile with the category icon.

## Visual system

Their brand, tightened.

- Type: Chalet (London and New York cuts) for headlines. Their body sans for text. Magda Clean Mono only for prices, hours, and legal text. Three headline sizes.
- Color: off-white page (#FCFBF7), near-black text (#0B0B0B), orange (#F76101) for the one primary button per screen. Category colors only as small text labels and the deal-day strip, never as card backgrounds.
- Cards: white, one thin border (#E9E9E9), no shadow, no badge shapes.
- Spacing: one rhythm across every page. Generous on the landing, tighter on the grid.
- Motion: the drawer slides, the grid fades on filter change. Nothing else animates.
- Mobile first. Every screen designed at phone width, then widened. Bottom nav and filter sheet exist only on mobile.

Assets already saved under `research/assets/`: logos, the three font files, category icons, storefront photos.

## File layout

```
index.html  menu.html  product.html  deals.html  passport.html  reserved.html
css/site.css
js/data.js      loads data/products.json, exposes lookups and filter/sort helpers
js/deals.js     schedule, today's deal, price and deal-text rules
js/cart.js      cart storage, drawer rendering, gift progress, limits
js/ui.js        header, age gate, search, bottom nav, shared card rendering
js/menu.js  js/product.js  js/landing.js  js/deals-page.js  js/passport.js
data/products.json  data/brands.json
assets/ (copied from research/assets)
tools/build-data.js
```

## Testing

- Data script: run it, spot-check twenty products across categories for name, size, price, and deal fields. Confirm the eight-category mapping covers every raw category.
- Each page opened in the browser at phone width and desktop width. Screenshots compared against the current site's screenshots in `research/screenshots/`.
- Deal logic checked by overriding the clock: each day of the week, plus after 8:45pm.
- Online-only flow: add a Super Value item to the cart, confirm the product page, card, and cart all say online only.
- Legal limit: add over 1 oz of flower, confirm the block.
- Cart survives reload and carries across pages.
- Age gate shows once, then not again.

## Out of scope

Real checkout, real accounts, real store inventory, other Embarc locations, blog, translation, search engine optimization copy.
