# Country dossier brief (shared)
Client: Dr. Baker (Egyptian manufacturer since 1959 of bakery & confectionery ingredients; factories in Damietta Egypt and Madinah Saudi Arabia).
Products: UHT/liquid whipping cream, powder cream mixes, fruit fillings/jams/fruit spread, mirror glazes, sweet drops sauces, chunky hazelnut/chocolate spreads, sugar paste, bakery & sponge cake mixes, drinks powder mix, stabilizers/improvers, ghee, pasteurized egg. HS codes: 040130, 0402, 1517, 1806, 1901, 2106, 2007/2008, 210500, 1704.
Today: 2026-10-13. Use WebSearch and WebFetch heavily (many searches). Prefer official sources (food authority, standards body, customs, FAS GAIN, Trade Map/ITC, organisers, retailer/supplier price pages). NEVER invent facts or prices. Every item needs a real url you opened or saw in results; if unverified, put it in "unverified" (Arabic). If a site is blocked, move on. Brand/company names stay in English; fields ending _ar are concise directive Arabic.

Write ONE valid JSON file (Write tool, no comments) with this shape:
{
 "country_ar":"","country_en":"","asOf":"2026-10-13",
 "competitors":[{"name":"","origin":"","type":"multinational|regional|local|importer","products":"","positioning_ar":"","threat":"high|medium|low","url":""}],   // 8-12 real competitors in cream/filling/glaze/spread/mix categories sold there
 "prices":[{"category_ar":"","product":"","brand":"","pack":"","price_local":0,"currency":"","price_usd":null,"per_kg_usd":null,"channel":"retail|wholesale|distributor|online","date":"","url":"","confidence":"high|medium|low"}],   // 10-25 real shelf/wholesale prices of comparable competitor products; per_kg_usd only when pack size known
 "priceSummary_ar":"",   // 3-4 sentences: price levels per category and where Dr. Baker can position
 "shipping":[{"item_ar":"","detail_ar":"","url":""}],   // import procedure, port, customs docs, import permit/registration, lab testing, label language, min remaining shelf life, CoO, Arabic label, halal, cold chain, duty and VAT
 "certificates":[{"name":"","required":"yes|likely|no|unclear","detail_ar":"","url":""}],
 "additives":[{"code":"E102","name":"Tartrazine","status":"banned|restricted|permitted|unclear","limit_ar":"","rule_ar":"","regulation":"","url":""}],  // one entry for EACH: E102 Tartrazine, E110 Sunset Yellow, E129 Allura Red, E133 Brilliant Blue, E150d Caramel IV, E150 Caramel, E160b Annatto, E160a Beta-carotene, E104 Quinoline Yellow, E122 Carmoisine, E120 Carmine, E160 Carotenes, E202 Potassium sorbate, E211 Sodium benzoate, E551 Silicon dioxide, E500; plus code "other" entries for other commonly banned/restricted items (alcohol/ethanol flavours, pork/gelatin, E171, azodicarbonamide, potassium bromate). Give max level for fillings/glazes/jams/cream/spreads when available and cite the regulation.
 "labeling_ar":"",
 "tariffs":[{"hs":"","desc_ar":"","duty":"","vat":"","note_ar":"","url":""}],   // applied duty for Egyptian-origin goods
 "agreements":[{"name":"","status":"","relevance_ar":"","tariff_note_ar":"","url":""}],   // Egypt-country agreements relevant to food (GAFTA, Agadir, COMESA, bilateral, AfCFTA...)
 "fairs":[{"name":"","dates":"","city":"","url":"","relevance_ar":""}],   // verified fairs in the next 12 months
 "seasons":[{"name_ar":"","period":"","impact_ar":"","url":""}],   // Ramadan 2027 (~8 Feb), Eid, national days, summer, wedding season, school
 "sources":[""],
 "unverified":[""]
}
Final reply: 5 lines max (found / missing).
