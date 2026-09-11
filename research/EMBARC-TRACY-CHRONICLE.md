# Embarc Tracy: Site and Menu Chronicle

Research snapshot taken 2026-09-10. Everything here was pulled from goembarc.com, its public menu data feed, and third-party listings.

## The store

- Name: Embarc Tracy (one of 20 Embarc shops in California, "Central Valley" region)
- Address: 2706 Pavilion Pkwy #110, Tracy, CA 95304 (just off I-205)
- Phone: (209) 278-0420. Email: tracy@goembarc.com. Instagram: @embarctracy
- Hours: 9am to 9pm daily. Last order 10 minutes before close (8:45pm per city rules).
- License: C10-0001397-LIC
- Google: 4.9 stars, 669 reviews. Weedmaps: 4.9 stars, 521 ratings. Yelp: 21 reviews.
- Parking: free customer parking next to the shop
- Payment: cash and debit. ATM inside. $5 flat fee on electronic transactions.
- Age: 21+ with valid government ID, or 18+ with medical card
- Legal limits: 1 oz flower, 8 g concentrate per purchase
- Returns: defective product only (faulty vapes replaced)

## Brand voice and positioning

- "A family of neighborhood shops celebrating cannabis for the curious, the expert, and everyone in between."
- "All frills, no thrills" friendly service. Staff are called "Guides" or "canna specialists."
- "If it's here, it's good." Every brand is met, every product reviewed, hand-picked.
- "Your dollar flies further." Brand partnerships pass savings on.
- 1% of sales goes back to the local community via a community advisory board.
- Proudly unionized, above-market pay. Brought legal cannabis sales to the CA State Fair in 2023. Runs consumption events at Outside Lands.
- Tagline used on deals: "Discover Your High."

## Loyalty and deals (the part customers actually care about)

Passport Club (free loyalty program):
- Earn 1 point per $1 spent, redeem for cannabis. "5% back" is how they advertise it.
- Birthday discounts, giveaways (concert tickets, farm tours), Passport Day sales event
- $5 in points for downloading the app and turning on push notifications
- Daily Deals and online deals REQUIRE membership. Menu prices shown are member prices.

Weekly deal schedule (30% off the day's category):
- Monday: Edibles
- Tuesday: Vapes
- Wednesday: 3.5g Flower
- Thursday: Dabs (concentrates)
- Friday: Infused Prerolls
- Saturday: All Products
- Sunday: Vapes

Standing offers:
- 30% off select brands every day for members (Stiiizy vapes, Dabwoods, Chico's Best, Jeeter 5pk babies, and others)
- 15% off Stiiizy flower, prerolls, extract, batteries every day
- "Value Menu" 30% off and "Super Value Menu" 50% off tiers
- 30% off first Weedmaps order ($40 min), 20% off online orders (Weedmaps listing)
- 30% off for industry employees on Mondays (Weedmaps listing)
- Cart thresholds: spend $35 free keychain, $50 free stash bag, $75 free hat
- Getaway Bag: $60 bundle worth up to $125 in a limited-edition bag, drops every Friday, members only, sells out. Site shows a countdown and a drop history (drop 081 on 9/4, 082 on 9/11, and so on).
- Deals are color-coded in-store: Flower green, Carts yellow, Pre-rolls teal, Edibles pink, Extracts red, Wellness blue

## The menu (1,122 of 1,151 live products captured)

Files: `menu/products.csv` and `menu/products.json` (name, brand, category, size, strain type, THC, price, sale flag, discount label, image URL, description). `menu/brands.json` has all 116 brands with logos and counts. `menu/stores.json` has all 20 locations. `menu/facets-*.json` has the sub-type breakdown per category.

By category (count, price range, typical price):
- Vapes: 358 items, $15 to $90, typically $35. Sub-types: Ready to Use 201, 510 Thread cartridge 118, Pod 54.
- Prerolls: 200 items, $5 to $50, typically $28. Infused 128, plain flower 71, infused blunt 6.
- Flower: 180 items, $15 to $175, typically $45. Pre-pack 127, smalls 34, pre-ground 10, infused 9.
- Accessories and merch: 116 items, $1 to $220. T-shirts 32, batteries 24, papers 16, pipes 8, plus Embarc-branded stickers, totes, hoodies ("High From Tracy," "Painfully Local," "Wish You Were High").
- Edibles: 112 items, $7 to $26, typically $20. Gummies 91, chews 7, chocolate 6, mints 3, cookies 3.
- Concentrates: 58 items, $15 to $80, typically $38. Live rosin 34 dominates.
- Drinks: 47 items, $4 to $20, typically $8. Juice 11, tea 10, soda 9, shots 9, water 4, tonic 4.
- Pills: 20 items. Tablets 19, capsule 1.
- Tinctures: 15 items, $30 to $110. Droppers 12, syrups 3.
- Plants (clones): 11 items, $55 to $85.
- Topicals: 5 items, balms and one cream.

Strain type: Hybrid 438, Indica 246, Sativa 207, CBD 12, unlabeled 219 (mostly merch).
On sale right now: 297 of 1,122 items.
Sizes: 1g is by far the most common (458), then 100mg edibles (142), 3.5g (83), 2.5g (57), 14g (40), 7g (39).

Top brands by item count: Stiiizy 73, Heavy Hitters 57, Embarc house merch 50, Dabwoods 39, Claybourne 32, Almora Farm 30, Jeeter 26, Sluggers 25, Gelato 23, Chico's Best 22, Puff 22, Halara 21, Turn 21, 710 Labs 20, LoLo 20, Uncle Arnie's 18, Kanha 17, St Ides 15, PAX 15, Wyld 15.

Product data quality notes:
- Names are ALL CAPS with size in brackets, e.g. "POD [1G] WHITE RASPBERRY". Needs title-casing and splitting.
- 980 of 1,122 have descriptions. 1,003 have images (webp on CloudFront).
- Variants (same product, different flavors or sizes) are grouped by a "group_name" field like "FLOWER [14G]".
- Prices end in .04 or .05 (tax-inclusive rounding). Sale prices are member prices.
- Discount labels are internal strings like "EVERYDAY DISCOUNT - DABWOODS - 30%" and "THURSDAY Q4 DAILY DEALS TURN CARTRIDGES". They explain WHY something is on sale, which the current site never surfaces.

## How the current site is built

- Platform: Budflow (a cannabis e-commerce vendor). Remix-based app. Public JSON endpoints under /api (stores, brands-dropdown, facets, instant-search, product).
- Fonts: Chalet London 1960 and Chalet New York 1960 (headline sans), Magda Clean Mono (mono for labels and legal text). Saved in `assets/`.
- Brand orange: #F76101. Near-black: #0B0B0B. Off-white: #FCFBF7. Light grey borders: #E9E9E9 / #E5E5E5.
- Category colors: Vape #f3ae4b, Flower #99a038, Prerolls #689a9b, Edibles #ec8097, Concentrates #ec6a4e, Drinks #ffcbd6, Topicals #9999f5, Pills #ffc2cf, Accessories #e0e0e0, Deals #ffff97.
- Region colors: Bay Area #beb470, Central Valley #94b9b8, SoCal #e3b25d, Tahoe #8bb47d.
- Category icons: simple line SVGs, saved in `assets/icons/`.
- Category one-liners already written by them: Flower "The most iconic form of the plant. Fresh, quality, fairly priced." Vapes "Disposable pens, cartridges, and pods. Convenient, discreet, and potent." Edibles "THC gummies, chocolates, and chews. Precise dosing, delicious flavors." Concentrates "Live resin, rosin, sauce, and diamonds. Maximum potency, pure flavor." Drinks "Infused sodas, seltzers, and beverages. Refreshing and fast-acting." Topicals "Creams, balms, and patches. Targeted relief without the high." Tinctures "CBD oils and THC tinctures. Sublingual absorption for quick effects." Prerolls "Pre-rolled joints, blunts, and infused prerolls. Ready to enjoy, no rolling required."

## What the Tracy page looks like today (top to bottom)

1. Green promo bar: "Passport Club Prices Shown. Daily + Online Deals require free Passport Club membership."
2. Header: logo, "Pickup at: Alameda" dropdown (defaults to the WRONG store even on the Tracy page), cart, Sign In, translate widget
3. Mega nav: Shop (10 categories), Points Menu, Deals, Brands, Getaway Bag, Locations, Blog
4. Search bar
5. Hero: "4.9 / 669 Google Reviews" badge, H1 "Embarc Tracy Cannabis Dispensary", one-line tagline, polaroid photo of storefront
6. "Welcome to Embarc Tracy": three paragraphs of SEO copy
7. Info card: hours, address, phone, email, IG
8. Press logos: LA Times, Adweek, ABC, CBS, AdAge, Forbes, SF Chronicle
9. "Shop all at Embarc": full product grid, left filter rail (Deals, Category, Brands, Type, Effects, Price slider), sort dropdown, 24 products then "Load More" (1,127 more)
10. "Experience the Best of Cannabis in Tracy" SEO copy (Read more)
11. "Explore Tracy, CA" local history SEO copy (Read more)
12. FAQ accordion, 9 questions
13. Footer: 3 link columns, social, Prop 65 warning, 20 license numbers, "Powered by Budflow"
14. Modals on load: age gate ("I'm 21") AND a cookie consent banner, stacked on top of each other
15. Cart drawer: "YOUR CART IS EMPTY :(" with spend-threshold gifts

## Where it falls down (first-pass critique)

- Two modals on arrival. Age gate plus cookie banner cover the page before you see anything.
- The header says "Pickup at: Alameda" on the Tracy page. The store context is wrong until the user fixes it.
- One page does everything. Store info, 1,151-product menu, SEO essays, and FAQ are all stacked on a single URL. It is a landing page and a store at the same time and is good at neither.
- The menu is a wall. 24 tiny cards, a "Load More" button, and a filter rail with 116 brands. No way in for someone who doesn't already know what they want.
- Product names are raw inventory strings in ALL CAPS: "GUMMY BAR 10PK [100MG] TROPICAL BLUE RAZZ - 100 MG - 10 PACK". The card truncates them, so you see "gummy bar 10pk [100mg] tropical b…"
- Deals are the store's best asset and they are buried. The weekly schedule lives in a paragraph on the /deals page. The "why it's on sale" is never shown next to the price.
- Every product is "on sale" with a strikethrough, so the sale badge means nothing.
- Getaway Bag, Points Menu, Passport Club, Daily Deals, Value Menu, Super Value Menu: six overlapping savings programs with no single explanation.
- Nav has three different category lists (mega menu, mobile menu, chip row) that don't match each other.
- Heavy SEO padding ("Explore Tracy, CA" railroad history) pushes real content down.
- Prices end in .04 and .05 which looks like a rounding bug.
- Effects filters (Relaxing, Uplifted, etc.) exist in the data but are hidden in the filter rail. That's the most beginner-friendly way in and it's invisible.

## Assets saved

`assets/`
- logo-embarc.webp, logo-embarc-header.webp, bottom-logo.webp
- Chalet-LondonNineteenSixty.woff2, Chalet-NewYorkNineteenSixty.woff2, MagdaCleanMonoWebW03-Rg.woff2
- tracy-storefront.webp, tracy-polaroid.webp, hero-banner.webp
- favicon-96.png, android-icon-192.png
- icons/ (9 category SVGs)

`pages/` raw HTML and plain-text dumps of: home, Tracy location page, deals, loyalty, about, FAQ, contact, brands, locations, daily-deals blog post, Getaway Bag.

`root.css` and `dispensary-content.css`: their full stylesheet with all design tokens.

Not captured: a clean screenshot of the page past the age gate. I did not click through the "I'm 21" gate, which also accepts their terms of use. Say the word and I will.
