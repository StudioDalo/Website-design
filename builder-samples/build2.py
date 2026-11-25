import html, os
E = html.escape

ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>'
PHONE = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>'
TICK = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7"/></svg>'
STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2.8 2.8 6 6.5.6-4.9 4.4 1.4 6.4L12 17l-5.8 3.2 1.4-6.4L2.7 9.4l6.5-.6z"/></svg>'

# ---------- architect-style line illustrations (Johal has no photos yet) ----------
def ill(kind, c):
    ink, acc, soft, paper = c['deep'], c['accent'], c['soft'], c['paper']
    grid = f'<defs><pattern id="g{kind}" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="{ink}" stroke-opacity=".07"/></pattern></defs><rect width="800" height="600" fill="{paper}"/><rect width="800" height="600" fill="url(#g{kind})"/>'
    ground = f'<path d="M40 470H760" stroke="{ink}" stroke-width="3"/><path d="M40 482H760" stroke="{ink}" stroke-opacity=".25" stroke-dasharray="6 8"/>'
    s = f'stroke="{ink}" stroke-width="3" stroke-linejoin="round" fill="none"'
    if kind == 'extension':
        body = f'''<path d="M110 470V250l150-110 150 110v220" fill="#fff" {s}/>
<path d="M150 300h60v70h-60zM310 300h60v70h-60z" fill="{soft}" {s}/>
<path d="M410 470V320h290v150" fill="#fff" {s}/><path d="M400 320h310" {s}/>
<path d="M520 320v-26h90v26" fill="{soft}" {s}/>
<path d="M440 348h230v122H440z" fill="{soft}" {s}/><path d="M497 348v122M555 348v122M612 348v122" {s}/>
<path d="M410 300v-40M700 300v-40M410 280h290" stroke="{acc}" stroke-width="2"/><path d="M404 274l12 12M694 274l12 12" stroke="{acc}" stroke-width="2"/>
<text x="555" y="270" text-anchor="middle" font-size="18" fill="{acc}" font-family="DM Sans,sans-serif">Rear extension</text>'''
    elif kind == 'office':
        body = f'''<path d="M90 470c30-90 120-110 170-60" fill="none" stroke="{ink}" stroke-opacity=".35" stroke-width="3"/>
<circle cx="170" cy="330" r="90" fill="{soft}" stroke="{ink}" stroke-width="3"/><path d="M170 420v50" {s}/>
<path d="M330 470V250h380v220" fill="#fff" {s}/><path d="M318 250h404" stroke="{ink}" stroke-width="6"/>
{''.join(f'<path d="M{x} 262v208" stroke="{ink}" stroke-opacity=".18" stroke-width="2"/>' for x in range(345,700,16))}
<path d="M380 290h220v180H380z" fill="{soft}" {s}/><path d="M490 290v180" {s}/>
<path d="M410 400h160v10H410z" fill="{acc}"/><path d="M600 470h120" {s}/>
<text x="520" y="230" text-anchor="middle" font-size="18" fill="{acc}" font-family="DM Sans,sans-serif">Garden office</text>'''
    else:  # garage conversion
        body = f'''<path d="M90 470V250l150-110 150 110v220" fill="#fff" {s}/>
<path d="M130 300h60v70h-60zM290 300h60v70h-60z" fill="{soft}" {s}/><path d="M215 470v-90h50v90" fill="{soft}" {s}/>
<path d="M390 470V300h320v170" fill="#fff" {s}/><path d="M380 300h340" {s}/>
<path d="M430 340h240v130" fill="none" stroke="{ink}" stroke-opacity=".3" stroke-dasharray="8 8" stroke-width="2"/>
<path d="M440 350h220v90H440z" fill="{soft}" {s}/><path d="M513 350v90M587 350v90" {s}/>
<path d="M430 450h240" {s}/>
<text x="550" y="285" text-anchor="middle" font-size="18" fill="{acc}" font-family="DM Sans,sans-serif">Garage conversion</text>'''
    return f'<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration: {E(kind)}">{grid}{body}{ground}</svg>'

FIRMS = {
 "london-builders": dict(
  title="London Builders · Hayes handyman & fitted wardrobes",
  brand="London Builders", tagline="Handyman services", company_line="London Builders (Handyman Services)",
  display="DM Serif Display", display_ital=True,
  ink="#1f1b17", bg="#ffffff", band="#f6f1eb", soft="#efe5da", accent="#b8461c", accent2="#b8461c", deep="#2a2420", paper="#fbf8f4", onacc="#ffffff",
  phone="07467 877477", tel="+447467877477", first="Ravi",
  topline="Hayes and West London. Open 7 days, 7am to 10pm.",
  eyebrow="London Builders · Hayes",
  h1a="Hayes handyman,", h1b="fast, tidy and fair.", hero_ratio="5/4",
  lede="Fitted wardrobes and kitchens, TV mounting, flat-pack assembly, shelving and repairs for homes across Hayes and West London.",
  checks=["Open 7 days", "Clear price before work starts", "Tidy, friendly team"],
  rating="4.8", reviews="93",
  maps="https://www.google.com/maps/search/?api=1&query=51.4961062%2C-0.4209301&query_place_id=ChIJkcWbbQBzdkgRMHVB9hTOqYY",
  extra=None,
  hero=("img/1.jpg", "Fitted bedroom wardrobes", "Recent work"),
  services_kicker="From small fixes to fitted furniture", services_h="What we do",
  services=[["Fitted wardrobes", "Floor-to-ceiling wardrobes and overhead storage, built to fit the room."],
            ["Kitchen fitting", "Units, worktops and tiling fitted, plus leaks and taps sorted."],
            ["TV wall mounting", "Screens hung level and secure, cables tidied away."],
            ["Flat-pack assembly", "Wardrobes, beds, storage and office furniture built for you."],
            ["Shelving and curtain poles", "Floating shelves, alcove units, poles, rails and blinds."],
            ["Room makeovers", "Freshen up a bedroom or nursery in a day or two."]],
  gallery=[("img/2.jpg", "Kitchen fitting", "Grey gloss units, tiling and worktops"), ("img/3.jpg", "Fitted bedroom storage", "Overhead cupboards and bedside drawers")],
  ba=None,
  themes=[["Quick to respond", "Customers often mention the team turning up at short notice and finishing quickly."],
          ["Polite and tidy", "Reviewers describe friendly workers who clean up before they leave."],
          ["Fair prices", "Good value for money comes up again and again."],
          ["Solid workmanship", "Jobs done properly, first time."]],
  about_h1="Run by Ravi,", about_h2="based in Hayes.",
  about="London Builders is a Hayes handyman service run by Ravi. The team fits wardrobes and kitchens and takes on the jobs that pile up at home: mounting, assembling, fixing and freshening up rooms, for homes and businesses around West London.",
  area="Hayes and West London", hours="Every day, 7am to 10pm",
  footer="London Builders (Handyman Services) · Cranford Drive, Hayes UB3.", photo_note="Photos are of London Builders' own work, from its Google listing.",
 ),
 "olshan-construction": dict(
  title="Olshan Construction · Builders in Acton & London",
  brand="Olshan", tagline="Construction Ltd", company_line="Olshan Construction Ltd",
  display="Newsreader", display_ital=True,
  ink="#14181d", bg="#ffffff", band="#f1f4f7", soft="#e3e9ef", accent="#1d3b5c", accent2="#2f6c95", deep="#14263a", paper="#f7f9fb", onacc="#ffffff",
  phone="07886 123637", tel="+447886123637", first="Volodymyr",
  topline="Acton and across London. Saturday and same-day bookings.",
  eyebrow="Olshan Construction Ltd",
  h1a="Builders in", h1b="Acton & London.",
  lede="Full refurbishments, bathrooms and kitchens, extensions, lofts and roofing, from urgent repairs to the finishing details. Over 20 years in the trade.",
  checks=["Free estimates", "Written quotes", "24-hour call-out"],
  rating="5.0", reviews="28",
  maps="https://www.google.com/maps/search/?api=1&query=51.514693%2C-0.25336&query_place_id=ChIJvzoL8tACfY8RhtY-4Dy68Ts",
  extra=("Checkatrade", "9.86", "/10", "Based on 86 Checkatrade reviews."),
  hero=("img/bath-after.jpg", "Bathroom renovation", "Recent work"),
  services_kicker="From structure to finish", services_h="What we do",
  services=[["Full refurbishments", "Whole houses and flats taken back and finished to a high standard."],
            ["Bathrooms and kitchens", "Strip-out, supply and fit, tiling and finishing."],
            ["Extensions and lofts", "More space, planned and built by one team."],
            ["Roofing and balconies", "Flat roofs, balconies and garage roofs replaced and waterproofed."],
            ["Floors, doors and decorating", "Wood flooring, internal doors, plastering and painting."],
            ["Commercial and insurance work", "Fit-outs and insurance repairs, with 24-hour call-out."]],
  gallery=[("img/bath-after-2.jpg", "Bathroom renovation", "Marble-effect walls and brushed copper fittings"),
           ("img/balcony.jpg", "Balcony waterproofing", "Period balcony resurfaced and sealed"),
           ("img/hallway.jpg", "Hallway refurbishment", "Decorated, new doors and finishes"),
           ("img/on-site.jpg", "On site", "Careful prep before decorating")],
  ba=("img/bath-before.jpg", "img/bath-after.jpg", "Same bathroom, before and after", "From bare brick and boards to a finished bathroom with walk-in shower and bath."),
  themes=[["Attention to detail", "Customers single out the quality of the finish on every job."],
          ["Clean, organised sites", "The team is described as professional and tidy throughout."],
          ["Punctual and reliable", "Reviewers say the work is delivered as promised."],
          ["Recommended locally", "Several customers found Olshan through neighbours and friends."]],
  about_h1="Run by Volodymyr,", about_h2="20 years in the trade.",
  about="Olshan Construction Ltd is run by Volodymyr, who has more than 20 years of experience in the building trade. Registered since 2019 and based in Acton, the team works on homes and commercial property across London.",
  area="Acton and across London", hours="Saturday appointments and same-day bookings when available",
  footer="Olshan Construction Ltd · Company no. 12073069 · Acton, London W3.", photo_note="Photos are of Olshan's own work, shared by its customers on Google.",
 ),
 "johal-builders": dict(
  title="Johal Builders · Extensions & conversions in Hayes",
  brand="Johal", tagline="Builders UK Ltd", company_line="Johal Builders UK Ltd",
  display="Instrument Serif", display_ital=True,
  ink="#221a15", bg="#ffffff", band="#f7f1ea", soft="#efe2d4", accent="#8f3522", accent2="#a8452d", deep="#2c1f18", paper="#fcf8f3", onacc="#ffffff",
  phone="07882 947898", tel="+447882947898", first="Surjit",
  topline="Builders based in Hayes, UB4.",
  eyebrow="Johal Builders UK Ltd",
  h1a="Extensions and", h1b="conversions in Hayes.",
  lede="Rear extensions, garage conversions and garden offices, handled end to end by Surjit and his team, from an honest quote to the final clean.",
  checks=["Honest quotes", "Finished on schedule", "Trading since 2017"],
  rating="4.8", reviews="26",
  maps="https://www.google.com/maps/search/?api=1&query=51.537006299999994%2C-0.4213898&query_place_id=ChIJy8sAoYpydkgRRHm1fxW0Phc",
  extra=None,
  hero=("img/extension.jpg", "Rear kitchen extension", "Illustration"), hero_ratio="4/3",
  services_kicker="More space, built properly", services_h="What we do",
  services=[["Rear and house extensions", "Single-storey and larger extensions, managed end to end."],
            ["Garage conversions", "Turn the garage into an office, playroom or bedroom."],
            ["Garden offices", "Insulated, wired and ready to work from."],
            ["Bathrooms", "New bathrooms fitted and finished."],
            ["Full renovations", "Whole-house projects over several weeks."],
            ["Fencing, plastering and painting", "The finishing jobs inside and out."]],
  work_h1="What we build,", work_h2="more space at home.", work_note='<p class="sub">Illustrations of the kind of work we do. Our own project photos will replace them.</p>',
  gallery=[("img/garden-office.jpg", "Garden offices", "Timber-clad, glazed and ready to work from", "Illustration"), ("img/kitchen.jpg", "Extension kitchens", "A brighter kitchen in your new space", "Illustration")],
  ba=None,
  themes=[["Finished on time", "Even big extensions are described as delivered on schedule."],
          ["Quality finish", "Customers praise the standard of the completed work."],
          ["Hard-working and trustworthy", "A team reviewers say they'd happily have back."],
          ["Honest advice", "Clear estimates, quick quotes and helpful suggestions."]],
  about_h1="Led by Surjit,", about_h2="building in Hayes since 2017.",
  about="Johal Builders UK Ltd is a Hayes building company led by Surjit, trading as a limited company since December 2017. The team specialises in extensions, conversions and garden buildings for homeowners in Hayes and the surrounding area.",
  area="Hayes and surrounding areas", hours="Call or send a message for a quote",
  footer="Johal Builders UK Ltd · Company no. 11091340 · Hayes UB4.", photo_note="Images on this sample are illustrations; Johal's own project photos will replace them.",
 ),
}

FIRMS2 = {
 "approved-building": dict(
  title="Approved Building Solutions · Builders in Twickenham",
  brand="Approved Building", tagline="Solutions · Twickenham", company_line="Approved Building Solutions",
  display="Newsreader", display_ital=True,
  ink="#17211b", bg="#ffffff", band="#eef3ef", soft="#dfe9e2", accent="#2f5d46", accent2="#3f7a5c", deep="#1c3328", paper="#f8fbf9", onacc="#ffffff",
  phone="07427 873675", tel="+447427873675", first="David",
  topline="Builders based in Twickenham, TW2.",
  eyebrow="Approved Building Solutions",
  h1a="Twickenham builders", h1b="you can rely on.",
  lede="Refurbishments, conservatories, brickwork and general building across Twickenham and South West London, from David and a trusted team of family and friends with over 20 years in the trade.",
  checks=["Free estimates", "Over 20 years' experience", "On Checkatrade since 2020"],
  rsrc="Checkatrade", rmax="10", rating="9.83", reviews="77",
  maps="https://www.checkatrade.com/trades/approvedbuildingsolutions",
  extra=None,
  hero=("https://d8j0ntlcm91z4.cloudfront.net/user_3ARLWAWh1GQj6QXPi2rMFrmBWUs/hf_20261125_182405_6ab341f7-113a-4c96-b304-de917e1b4ae9.png", "Conservatory roof and garden wall", "Illustration"), hero_ratio="4/3",
  services_kicker="Domestic and commercial", services_h="What we do",
  services=[["Refurbishments", "Rooms and whole homes brought back to a high finish."],
            ["Conservatory roofs", "Old roofs replaced, ceilings fitted and walls finished."],
            ["Brickwork and garden walls", "Walls rebuilt, repointed and repaired."],
            ["Utility rooms and kitchens", "Fitted, plumbed and finished."],
            ["Structural repairs", "Cracks, lintels and failing brickwork put right."],
            ["Painting and decorating", "The finishing touches inside and out."]],
  work_h1="The kind of work", work_h2="we do every week.", work_note='<p class="sub">Illustrations of the kind of work we do. Our own project photos will replace them.</p>',
  gallery=[("https://d8j0ntlcm91z4.cloudfront.net/user_3ARLWAWh1GQj6QXPi2rMFrmBWUs/hf_20261125_182408_eb6844ff-2f8a-4f04-b0da-d482a6abf70e.png", "Utility rooms", "Fitted, plumbed and ready to use", "Illustration"), ("https://d8j0ntlcm91z4.cloudfront.net/user_3ARLWAWh1GQj6QXPi2rMFrmBWUs/hf_20261125_182406_ea29f82d-c0b7-40be-87bd-aff5155c14d8.png", "Brickwork and front paths", "Walls rebuilt with fresh pointing", "Illustration")],
  ba=None,
  themes=[["Reliable and on time", "Customers mention David arriving early, every day of the job."],
          ["Fair prices", "Quotes described as reasonable for the work done."],
          ["A professional finish", "Reviewers praise the standard of the finished work."],
          ["Friendly and polite", "A team customers are happy to have in their home."]],
  about_h1="Led by David,", about_h2="with a team of family and friends.",
  about="Approved Building Solutions is run by David Gonzalez with a team of family and friends who bring over 20 years' experience in the building trade. They take on domestic and commercial work across Twickenham, Isleworth and Feltham, and have been vetted on Checkatrade since 2020.",
  area="Twickenham, Whitton, Isleworth, Feltham and nearby", hours="Free estimates. Call or message David",
  footer="Approved Building Solutions · Twickenham TW2.", photo_note="Images on this sample are illustrations; David's own project photos will replace them.",
 ),
 "ic-construct": dict(
  title="I C Construct · Builders in Hounslow since 2008",
  brand="I C Construct", tagline="Builders · Hounslow", company_line="I C Construct",
  display="DM Serif Display", display_ital=True,
  ink="#141d22", bg="#ffffff", band="#edf3f5", soft="#dce8ec", accent="#1d5a6e", accent2="#287489", deep="#12303b", paper="#f7fafb", onacc="#ffffff",
  phone="07446 363467", tel="+447446363467", first="Calin",
  topline="Builders based in Hounslow. Free quotes, no call-out charge.",
  eyebrow="I C Construct",
  h1a="Hounslow builders,", h1b="trusted since 2008.",
  lede="Refurbishments, structural repairs, basement conversions, patios and garden walls across Hounslow and West London, from Calin and his team.",
  checks=["Free quotes", "No call-out charge", "Established 2008"],
  rsrc="Checkatrade", rmax="10", rating="10", reviews="50+",
  maps="https://www.checkatrade.com/trades/icconstruct",
  extra=None,
  hero=("https://d8j0ntlcm91z4.cloudfront.net/user_3ARLWAWh1GQj6QXPi2rMFrmBWUs/hf_20261125_182406_3b41cdde-15de-4077-8e70-34a8178b2ef0.png", "Full house refurbishment", "Illustration"), hero_ratio="4/3",
  services_kicker="All aspects of building", services_h="What we do",
  services=[["Full house refurbishments", "Whole homes and flats stripped back and finished."],
            ["Structural repairs", "Lateral restraint bars, brickwork and walls made safe."],
            ["Basement conversions", "Unused space turned into rooms you'll live in."],
            ["Extensions and conservatories", "More room at the back of the house."],
            ["Patios and garden walls", "Paving, raised beds and new brick walls."],
            ["Painting and decorating", "A clean finish once the building work is done."]],
  work_h1="The kind of work", work_h2="we're trusted with.", work_note='<p class="sub">Illustrations of the kind of work we do. Our own project photos will replace them.</p>',
  gallery=[("https://d8j0ntlcm91z4.cloudfront.net/user_3ARLWAWh1GQj6QXPi2rMFrmBWUs/hf_20261125_182408_f5625d7a-8bce-4df7-9494-148d4f731552.png", "Patios and garden walls", "Porcelain paving and raised planters", "Illustration"), ("https://d8j0ntlcm91z4.cloudfront.net/user_3ARLWAWh1GQj6QXPi2rMFrmBWUs/hf_20261125_182406_800d27ac-db4a-40f3-9114-467b4f4230f3.png", "Basement conversions", "A bright room below ground", "Illustration")],
  ba=None,
  themes=[["Top marks for quality", "Recent customers score the quality of work 10 out of 10."],
          ["Reliable", "10 out of 10 for reliability from recent customers."],
          ["Clear communication", "10 out of 10 for keeping customers informed."],
          ["Jobs big and small", "From restraint bars and patios to full house refurbishments."]],
  themes_note="Taken from I C Construct's Checkatrade scores and review titles.",
  about_h1="Led by Calin,", about_h2="over 20 years in construction.",
  about="I C Construct is run by Calin, who has over 20 years' experience in the construction industry and has run the company since 2008. The team covers all aspects of building across Hounslow and West London, and has been vetted on Checkatrade since 2016.",
  area="Hounslow and West London", hours="Free quotes and no call-out charge",
  footer="I C Construct · Hounslow, Middlesex.", photo_note="Images on this sample are illustrations; Calin's own project photos will replace them.",
 ),
 "av-construction": dict(
  title="AV Construction · Extensions and lofts in Hayes",
  brand="AV Construction", tagline="Builders · Hayes", company_line="AV Construction Builder Ltd",
  display="Fraunces", display_ital=True,
  ink="#211a12", bg="#ffffff", band="#f6f0e6", soft="#ece0cc", accent="#7a4f12", accent2="#95621a", deep="#2a1f12", paper="#fcf9f3", onacc="#ffffff",
  phone="020 8798 2045", tel="+442087982045", first="us",
  topline="Builders based in Hayes, UB4.",
  eyebrow="AV Construction Builder Ltd",
  h1a="Extensions and lofts,", h1b="built in Hayes.",
  lede="Rear extensions, loft conversions, bathrooms and full refurbishments for homes across Hayes and West London.",
  checks=["Free quotes", "Rated 4.9 on Google", "Local to Hayes"],
  rating="4.9", reviews="21",
  maps="https://www.google.com/maps/search/?api=1&query=51.5219235%2C-0.3880343&query_place_id=ChIJz60QiENtdkgRIvQ-Xph_yp0",
  extra=("Trade directory", "9.8", "/10", "From 41 customer reviews."),
  hero=("https://d8j0ntlcm91z4.cloudfront.net/user_3ARLWAWh1GQj6QXPi2rMFrmBWUs/hf_20261125_182408_01d0f25f-2d02-4c6c-b9e2-88e348f48b3a.png", "Rear extension with bifold doors", "Illustration"), hero_ratio="4/3",
  services_kicker="More space at home", services_h="What we do",
  services=[["Rear extensions", "Single-storey extensions with bifolds and roof lanterns."],
            ["Loft conversions", "Dormer and Velux lofts for an extra bedroom."],
            ["Bathrooms", "Walk-in showers, tiling and full refits."],
            ["Kitchens", "Fitted as part of an extension or on their own."],
            ["Refurbishments", "Whole-house updates, room by room."],
            ["General building", "Brickwork, plastering and repairs."]],
  work_h1="What we build,", work_h2="more space at home.", work_note='<p class="sub">Illustrations of the kind of work we do. Our own project photos will replace them.</p>',
  gallery=[("https://d8j0ntlcm91z4.cloudfront.net/user_3ARLWAWh1GQj6QXPi2rMFrmBWUs/hf_20261125_182406_9e9839e3-d43c-47e3-9acb-51df4d954d25.png", "Loft conversions", "A dormer bedroom with skylights", "Illustration"), ("https://d8j0ntlcm91z4.cloudfront.net/user_3ARLWAWh1GQj6QXPi2rMFrmBWUs/hf_20261125_182405_b55da333-3644-4090-9d1f-b1c3bf634436.png", "Bathrooms", "Walk-in shower and floating vanity", "Illustration")],
  ba=None,
  rev_h1="Rated 4.9 on Google,", rev_h2="and 9.8 out of 10 elsewhere.",
  themes=[["A clear price", "A written quote before any work starts."],
          ["One team", "The same builders from first visit to final clean."],
          ["Tidy sites", "Your home kept clean and safe while we work."],
          ["Finished properly", "Snags sorted before we call the job done."]],
  themes_note="How AV works. Customers' own words will go here once AV picks its favourite reviews.",
  about_h1="A Hayes building firm,", about_h2="for your whole project.",
  about="AV Construction Builder Ltd is a building company based in Hayes, UB4, taking on extensions, loft conversions, bathrooms and refurbishments for homeowners across Hayes and the surrounding area.",
  area="Hayes, Hillingdon and West London", hours="Call or send a message for a free quote",
  footer="AV Construction Builder Ltd · Hayes UB4.", photo_note="Images on this sample are illustrations; AV's own project photos will replace them.",
 ),
}

def media(src, f, alt):
    if src.startswith('ill:'):
        return ill(src[4:], f)
    return f'<img src="{src}" alt="{E(alt)}" loading="lazy">'

def page(f):
    fq = f['display'].replace(' ', '+') + (':ital@0;1' if f['display_ital'] else '')
    checks = ''.join(f'<li>{TICK}<span>{E(c)}</span></li>' for c in f['checks'])
    extra = ''
    if f['extra']:
        n, v, of, note = f['extra']
        extra = f'<div class="rc"><span class="rc-src">{E(n)}</span><span class="rc-n">{v}<small>{of}</small></span><span class="rc-note">{E(note)}</span></div>'
    services = ''.join(f'<li><span class="num">{i:02d}</span><h3>{E(t)}</h3><p>{E(d)}</p></li>' for i, (t, d) in enumerate(f['services'], 1))
    gal = ''.join(f'<figure class="card{" ill" if g[0].startswith("ill:") else ""}">{media(g[0], f, g[1])}<figcaption><span class="tag">{E(g[3] if len(g) > 3 else ("Illustration" if g[0].startswith("ill:") else "Recent work"))}</span><b>{E(g[1])}</b><span>{E(g[2])}</span></figcaption></figure>' for g in f['gallery'])
    ba = ''
    if f['ba']:
        b, a, h, d = f['ba']
        ba = f'''<section class="band"><div class="wrap ba-grid">
<div><p class="eyebrow">Before and after</p><h2>{E(h.split(",")[0])},<br><em>before and after.</em></h2><p class="sub">{E(d)}</p><p class="hint">Drag the handle to compare.</p></div>
<div class="ba" id="ba" style="--p:50%">
<img src="{a}" alt="Bathroom after the renovation">
<div class="ba-before"><img src="{b}" alt="Bathroom before the renovation, stripped back to brick"></div>
<span class="ba-l">Before</span><span class="ba-r">After</span>
<span class="ba-line" aria-hidden="true"><i></i></span>
<input type="range" min="0" max="100" value="50" aria-label="Compare before and after">
</div></div></section>'''
    themes = ''.join(f'<li><div class="stars" aria-hidden="true">{STAR*5}</div><h3>{E(t)}</h3><p>{E(d)}</p></li>' for t, d in f['themes'])
    hs, hc, ht = f['hero']
    return f'''<!DOCTYPE html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(f['title'])}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family={fq}&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
<style>
/* VOICE calm, established local builder: generous space, quiet confidence
   IDEA a well-set brochure: serif headlines, labelled sections, big photo cards
   PICTURE the firm's own work, large and rounded; drawings where no photos exist
   COLOUR AND TYPE white and one tinted band, one brand colour; {f['display']} over DM Sans
   LAYOUT top strip, header, hero with rating card, numbered services, work, reviews, about, quote */
:root{{color-scheme:light;--ink:{f['ink']};--bg:{f['bg']};--band:{f['band']};--soft:{f['soft']};--acc:{f['accent']};--acc2:{f['accent2']};--deep:{f['deep']};--on:{f['onacc']};--paper:{f['paper']};--line:color-mix(in srgb,var(--ink) 12%,transparent);--serif:"{f['display']}",Georgia,serif}}
*{{box-sizing:border-box;min-width:0}}
html{{scroll-behavior:smooth;scroll-padding-top:90px}}
body{{margin:0;background:var(--bg);color:var(--ink);font:17px/1.65 "DM Sans",system-ui,sans-serif;overflow-x:clip}}
a{{color:inherit}} img{{display:block;max-width:100%}}
.wrap{{max-width:1200px;margin:0 auto;padding-inline:clamp(20px,5vw,48px)}}
.top{{background:var(--deep);color:#fff;font-size:13px}} .top .wrap{{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-block:9px}}
.top a{{text-decoration:none;font-weight:600;white-space:nowrap}}
.sample{{background:var(--soft);color:var(--deep);font-size:13px;text-align:center;padding:6px 12px}}
header{{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--bg) 94%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}}
.bar{{display:flex;align-items:center;gap:28px;padding-block:16px}}
.logo{{text-decoration:none;line-height:1.05}} .logo b{{display:block;font:400 28px/1 var(--serif);color:var(--acc)}} .logo span{{font-size:13px;opacity:.7}}
nav{{display:flex;gap:26px;margin-left:auto;font-size:15px;font-weight:500}} nav a{{text-decoration:none;padding-block:10px}} nav a:hover{{color:var(--acc2)}}
.btn{{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 24px;border-radius:8px;font:600 16px/1 "DM Sans",sans-serif;text-decoration:none;border:1.5px solid var(--acc);cursor:pointer;transition:transform .15s,background .15s}}
.btn svg{{width:18px;height:18px}} .btn.p{{background:var(--acc);color:var(--on)}} .btn.p:hover{{background:var(--deep);border-color:var(--deep)}}
.btn.o{{background:#fff;color:var(--acc)}} .btn.o:hover{{background:var(--band)}}
:focus-visible{{outline:3px solid var(--acc2);outline-offset:3px}}
.eyebrow{{display:flex;align-items:center;gap:14px;margin:0 0 22px;font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--acc)}}
.eyebrow::before{{content:"";width:36px;height:1.5px;background:currentColor}}
h1,h2{{font-family:var(--serif);font-weight:400;letter-spacing:-.01em;text-wrap:balance;margin:0}}
h1{{font-size:clamp(46px,6.2vw,80px);line-height:1}} h2{{font-size:clamp(36px,4.4vw,56px);line-height:1.04}}
h1 em,h2 em{{font-style:italic;color:var(--acc2)}}
h3{{font-size:19px;line-height:1.3;margin:0 0 6px;font-weight:600}}
.sub{{max-width:36em;opacity:.8;margin:18px 0 0}}
section{{padding-block:clamp(64px,9vw,120px)}} .band{{background:var(--band)}}
.hero{{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:clamp(36px,6vw,80px);align-items:center;padding-block:clamp(48px,7vw,96px)}}
.lede{{font-size:19px;max-width:31em;margin:26px 0 32px;opacity:.85}}
.cta{{display:flex;gap:12px;flex-wrap:wrap}}
.checks{{list-style:none;padding:22px 0 0;margin:32px 0 0;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:10px 26px;font-size:14px}}
.checks li{{display:flex;align-items:center;gap:8px}} .checks svg{{width:16px;height:16px;color:var(--acc2)}}
.rcs{{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}}
.rc{{display:grid;grid-template-columns:auto auto;align-items:center;gap:2px 14px;padding:16px 20px;border:1px solid var(--line);border-radius:12px;background:var(--paper,#fff)}}
.rc-src{{font-weight:700;font-size:15px}} .rc-n{{font:400 34px/1 var(--serif)}} .rc-n small{{font:14px "DM Sans";opacity:.6}}
.rc-note{{grid-column:1/-1;font-size:13px;opacity:.7}} .rc .stars{{grid-column:1/-1}}
.stars{{display:flex;gap:2px;color:#c58a00}} .stars svg{{width:17px;height:17px}}
.photo{{position:relative;border-radius:18px;overflow:hidden;background:var(--soft);aspect-ratio:4/5}}
.photo img,.photo svg{{width:100%;height:100%;object-fit:cover}}
.photo.ill{{aspect-ratio:4/3!important;border:1px solid var(--line);background:var(--paper)}} .photo.ill .cap{{background:none;color:var(--ink)}}
.photo .chip,.card .tag{{position:absolute;top:16px;left:16px;background:#fff;color:var(--ink);font-size:12px;font-weight:600;padding:6px 10px;border-radius:6px}}
.photo .cap{{position:absolute;left:0;right:0;bottom:0;padding:60px 24px 22px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.6));font:400 26px/1.15 var(--serif)}}
.svc-head{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px 60px;align-items:end;margin-bottom:48px}}
.svcs{{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--line)}}
.svcs li{{padding:30px 28px 34px 0;border-bottom:1px solid var(--line)}} .svcs li:not(:nth-child(3n+1)){{padding-left:28px;border-left:1px solid var(--line)}}
.num{{display:block;font:400 15px/1 var(--serif);color:var(--acc2);margin-bottom:18px}} .svcs p{{margin:0;font-size:15.5px;opacity:.75}}
.cards{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin-top:48px}}
.card{{position:relative;margin:0;border-radius:18px;overflow:hidden;aspect-ratio:4/3;background:var(--soft)}}
.card img,.card svg{{width:100%;height:100%;object-fit:cover;transition:transform .6s}} .card:hover img{{transform:scale(1.03)}}
.card figcaption{{position:absolute;inset:auto 0 0 0;padding:70px 24px 22px;background:linear-gradient(transparent,rgba(0,0,0,.62));color:#fff;display:grid;gap:2px}}
.card figcaption b{{font:400 28px/1.1 var(--serif)}} .card figcaption span:last-child{{font-size:14px;opacity:.85}}
.card.ill figcaption{{background:none;color:var(--ink);position:static;padding:0}} .card.ill{{aspect-ratio:auto;display:grid;grid-template-rows:auto auto;background:var(--paper,#fff);border:1px solid var(--line)}}
.card.ill svg{{aspect-ratio:4/3;height:auto}} .card.ill figcaption{{padding:18px 22px 22px}}
.ba-grid{{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:clamp(32px,6vw,80px);align-items:center}}
.hint{{font-size:14px;opacity:.65;margin-top:22px}}
.ba{{position:relative;border-radius:18px;overflow:hidden;aspect-ratio:1100/1300;max-height:720px;user-select:none;background:var(--soft)}}
.ba img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.ba-before{{position:absolute;inset:0;clip-path:inset(0 calc(100% - var(--p)) 0 0)}}
.ba-l,.ba-r{{position:absolute;top:16px;background:#fff;font-size:12px;font-weight:700;padding:6px 10px;border-radius:6px}} .ba-l{{left:16px}} .ba-r{{right:16px}}
.ba-line{{position:absolute;top:0;bottom:0;left:var(--p);width:3px;margin-left:-1.5px;background:#fff;pointer-events:none}}
.ba-line i{{position:absolute;top:50%;left:50%;width:48px;height:48px;margin:-24px 0 0 -24px;border-radius:50%;background:#fff;box-shadow:0 4px 18px rgba(0,0,0,.25)}}
.ba-line i::before{{content:"";position:absolute;inset:0;margin:auto;width:22px;height:10px;background:linear-gradient(90deg,var(--acc) 0 2px,transparent 2px 20px,var(--acc) 20px);clip-path:polygon(0 50%,30% 0,30% 100%,0 50%,100% 50%,70% 0,70% 100%,100% 50%)}}
.ba input{{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize}}
.ba:has(input:focus-visible) .ba-line i{{outline:3px solid var(--acc2);outline-offset:3px}}
.rev-head{{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:28px;align-items:end;margin-bottom:44px}}
.big-rate{{display:grid;gap:4px;padding:24px 28px;border-radius:14px;background:#fff;border:1px solid var(--line);min-width:250px}}
.big-rate .rc-n{{font-size:52px}} .big-rate a{{font-size:14px;font-weight:600;color:var(--acc)}}
.quotes{{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}}
.quotes li{{background:#fff;border:1px solid var(--line);border-radius:14px;padding:26px}}
.quotes h3{{font:400 25px/1.15 var(--serif);margin:14px 0 10px}} .quotes p{{margin:0;font-size:15px;opacity:.75}}
.small{{font-size:13px;opacity:.6;margin-top:18px}}
.about{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(32px,6vw,80px);align-items:start}}
.about p{{margin:0 0 16px;font-size:18px}}
.quote-sec{{background:var(--deep);color:#fff}} .quote-sec .eyebrow{{color:#fff;opacity:.8}} .quote-sec h2 em{{color:#fff;opacity:.85}}
.qgrid{{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(32px,6vw,80px)}}
.bigphone{{display:inline-flex;align-items:center;gap:12px;margin-top:30px;font:400 clamp(32px,3.6vw,44px)/1 var(--serif);text-decoration:none;white-space:nowrap}} .bigphone svg{{width:28px;height:28px}}
dl{{margin:32px 0 0;display:grid;gap:16px}} dt{{font-size:13px;opacity:.65;text-transform:uppercase;letter-spacing:.08em}} dd{{margin:2px 0 0;font-weight:500}}
form{{display:grid;gap:16px;background:#fff;color:var(--ink);padding:clamp(22px,3vw,36px);border-radius:16px}}
label{{display:grid;gap:7px;font-weight:600;font-size:14px}}
input:not([type=range]),textarea{{font:inherit;font-size:16px;padding:13px 14px;border:1px solid color-mix(in srgb,var(--ink) 22%,transparent);border-radius:8px;background:#fff;color:var(--ink)}}
textarea{{min-height:120px;resize:vertical}} .two{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}}
.ok{{display:none;margin:0;background:var(--band);padding:14px;border-radius:8px;font-weight:600;font-size:15px}} .ok.on{{display:block}}
footer{{padding-block:28px 110px;font-size:14px;opacity:.7}} footer .wrap{{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}}
.dock{{display:none}}
@media(max-width:960px){{.hero,.about,.qgrid,.ba-grid,.svc-head,.rev-head{{grid-template-columns:minmax(0,1fr)}}.photo{{aspect-ratio:4/3}}.svcs{{grid-template-columns:repeat(2,minmax(0,1fr))}}.svcs li,.svcs li:not(:nth-child(3n+1)){{padding:26px 20px 28px 0;border-left:0}}.svcs li:nth-child(2n){{padding-left:20px;border-left:1px solid var(--line)}}.quotes{{grid-template-columns:repeat(2,minmax(0,1fr))}}nav{{display:none}}.bar .btn{{margin-left:auto}}}}
@media(max-width:620px){{.svcs,.quotes,.cards,.two{{grid-template-columns:minmax(0,1fr)}}.svcs li:nth-child(2n){{padding-left:0;border-left:0}}.bar .btn{{display:none}}.top .wrap{{justify-content:center;text-align:center}}
.dock{{display:grid;grid-template-columns:1fr 1fr;gap:10px;position:fixed;left:0;right:0;bottom:0;z-index:20;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid var(--line)}}.dock .btn{{min-height:50px}}.bigphone{{white-space:normal}}}}
@media(prefers-reduced-motion:reduce){{html{{scroll-behavior:auto}}*{{transition:none!important}}}}
</style></head><body>
<div class="sample">Sample website prepared for {E(f['company_line'])}. Not live yet.</div>
<div class="top"><div class="wrap"><span>{E(f['topline'])}</span><a href="tel:{f['tel']}">Call {E(f['phone'])}</a></div></div>
<header><div class="wrap bar">
<a class="logo" href="#top"><b>{E(f['brand'])}</b><span>{E(f['tagline'])}</span></a>
<nav aria-label="Main"><a href="#services">Services</a><a href="#work">Our work</a><a href="#reviews">Reviews</a><a href="#about">About</a></nav>
<a class="btn p" href="#quote">Get a quote {ARROW}</a>
</div></header>
<main id="top">
<div class="wrap hero">
<div>
<p class="eyebrow">{E(f['eyebrow'])}</p>
<h1>{E(f['h1a'])}<br><em>{E(f['h1b'])}</em></h1>
<p class="lede">{E(f['lede'])}</p>
<div class="cta"><a class="btn p" href="#quote">Get a free quote {ARROW}</a><a class="btn o" href="tel:{f['tel']}">{PHONE} Call {E(f['first'])}</a></div>
<div class="rcs"><a class="rc" href="{E(f['maps'])}" style="text-decoration:none"><span class="rc-src">{E(f.get('rsrc','Google'))}</span><span class="rc-n">{f['rating']}<small>/{f.get('rmax','5')}</small></span><span class="stars" aria-hidden="true">{STAR*5}</span><span class="rc-note">Based on {f['reviews']} {E(f.get('rsrc','Google'))} reviews.</span></a>{extra}</div>
<ul class="checks">{checks}</ul>
</div>
<div class="photo{" ill" if hs.startswith("ill:") else ""}" style="aspect-ratio:{f.get("hero_ratio","4/5")}">{media(hs, f, hc)}<span class="chip">{E(ht)}</span><span class="cap">{E(hc)}</span></div>
</div>

<section id="services" class="band"><div class="wrap">
<div class="svc-head"><div><p class="eyebrow">{E(f['services_kicker'])}</p><h2>{E(f['services_h'])}</h2></div>
<p class="sub" style="margin:0">Tell us about the job and you'll get a clear price before any work starts.</p></div>
<ul class="svcs">{services}</ul>
</div></section>

<section id="work"><div class="wrap">
<p class="eyebrow">Our work</p><h2>{E(f.get("work_h1","Recent projects,"))}<br><em>{E(f.get("work_h2","finished properly."))}</em></h2>{f.get("work_note","")}
<div class="cards">{gal}</div>
</div></section>
{ba}
<section id="reviews"{' class="band"' if not f['ba'] else ' class="band" style="background:var(--paper)"'}><div class="wrap">
<div class="rev-head"><div><p class="eyebrow">Feedback from customers</p><h2>{E(f.get('rev_h1','What customers say'))}<br><em>{E(f.get('rev_h2','about ' + f['brand'] + '.'))}</em></h2></div>
<div class="big-rate"><span class="rc-src">{E(f.get('rsrc','Google'))}</span><span class="rc-n">{f['rating']}<small>/{f.get('rmax','5')}</small></span><span class="stars" aria-hidden="true">{STAR*5}</span><span class="rc-note">Based on {f['reviews']} {E(f.get('rsrc','Google'))} reviews.</span><a href="{E(f['maps'])}">See the full listing on {E(f.get('rsrc','Google'))}</a></div></div>
<ul class="quotes">{themes}</ul>
<p class="small">{E(f.get('themes_note', "What comes up most in " + f['brand'] + "'s " + f.get('rsrc','Google') + " reviews, summarised."))}</p>
</div></section>

<section id="about"><div class="wrap about">
<div><p class="eyebrow">About us</p><h2>{E(f['about_h1'])}<br><em>{E(f['about_h2'])}</em></h2></div>
<div><p>{E(f['about'])}</p><p>Call or message {E(f['first'])} directly. You'll speak to the person doing the work.</p></div>
</div></section>

<section id="quote" class="quote-sec"><div class="wrap qgrid">
<div><p class="eyebrow">Free quote</p><h2>Tell us about<br><em>your project.</em></h2>
<a class="bigphone" href="tel:{f['tel']}">{PHONE}{E(f['phone'])}</a>
<dl><div><dt>Area</dt><dd>{E(f['area'])}</dd></div><div><dt>Hours</dt><dd>{E(f['hours'])}</dd></div></dl></div>
<form id="q" novalidate>
<div class="two"><label for="n">Your name<input id="n" autocomplete="name"></label><label for="t">Phone<input id="t" type="tel" autocomplete="tel"></label></div>
<label for="pc">Postcode<input id="pc" autocomplete="postal-code"></label>
<label for="j">What do you need doing?<textarea id="j"></textarea></label>
<button class="btn p" type="submit">Send my enquiry {ARROW}</button>
<p class="ok" id="ok" role="status">Thanks. This is a sample site, so nothing was sent. Once it's live, enquiries go straight to {E(f['first'])}.</p>
</form></div></section>
</main>
<footer><div class="wrap"><span>{E(f['footer'])}</span><span>{E(f['photo_note'])}</span></div></footer>
<div class="dock"><a class="btn o" href="tel:{f['tel']}">{PHONE} Call {E(f['first'])}</a><a class="btn p" href="#quote">Get a quote</a></div>
<script>{{const f=document.getElementById('q'),ok=document.getElementById('ok');f.addEventListener('submit',e=>{{e.preventDefault();ok.classList.add('on');}});
const ba=document.getElementById('ba');if(ba){{const r=ba.querySelector('input');r.addEventListener('input',()=>ba.style.setProperty('--p',r.value+'%'));}}}}</script>
</body></html>'''

import sys
TARGET = FIRMS2 if 'new' in sys.argv else FIRMS
for slug, f in TARGET.items():
    f.setdefault('paper', '#fff')
    os.makedirs(os.path.join('/home/claude/sites', slug), exist_ok=True)
    out = os.path.join('/home/claude/sites', slug, 'index.html')
    with open(out, 'w') as fh:
        fh.write(page(f))
    print(slug, os.path.getsize(out))
