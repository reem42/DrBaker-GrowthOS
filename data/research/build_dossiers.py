import json, re, collections
P = json.load(open('/home/claude/research3/products.json'))

U = dict(
 cfUAE='https://www.carrefouruae.com/mafuae/en/c/F21630300',
 talUAE='https://www.talabat.com/uae/grocery/697246/choithrams-sobha-hartland-dubai-nad-al-sheba-1/dairy-eggs/cream-butter?aid=1280',
 cfKSAc='https://www.carrefourksa.com/mafsau/en/search?keyword=whipping%20cream',
 cfKSAs='https://www.carrefourksa.com/mafsau/en/search?keyword=hazelnut%20spread',
 cfKSAm='https://www.carrefourksa.com/mafsau/en/search?keyword=cake%20mix',
 cfKEc='https://www.carrefour.ke/mafken/en/search?keyword=whipping%20cream',
 cfKEs='https://www.carrefour.ke/mafken/en/search?keyword=chocolate%20spread',
 cfKEm='https://www.carrefour.ke/mafken/en/search?keyword=cake%20mix',
 talKW='https://www.talabat.com/kuwait/talabat-mart/dairy-eggs/cream',
 talJO='https://www.talabat.com/jordan/grocery/796964/elite-mart-online-abdoun/dairy-eggs/cream?aid=6561',
 gsoColours='https://www.foodingredientsfirst.com/news/sensient-eyes-natural-colors-growth-in-gulf-region-on-additive-regulation-changes.html',
 gso2500='https://www.gso.org.sa/store/standards/GSO:693357/GSO%202500:2015?lang=en',
 sfdaAdd='https://sfda.gov.sa/sites/default/files/2019-06/AdditivesPermittedUseFoodStuffs.pdf',
 e171='https://regask.com/titanium-dioxide-ban-ksa-yemen-qatar/',
 chemSA='https://food.chemlinked.com/foodpedia/saudi-arabia-food-regulation',
 sfdaClear='https://betasfda.sfda.gov.sa/sites/default/files/2025-04/ConditionsRequirementsRoodClearance.pdf',
 foodex='https://www.foodexsaudiexpo.com/en/aboutfoodex/',
 gulfood27='https://portugalglobal.pt/noticias/2026/setembro/gulfood-2027-reune-industria-alimentar-global-no-dubai/',
 gfm='https://www.gulfoodmanufacturing.com/',
 cepa='https://en.amwalalghad.com/egypt-uae-push-forward-talks-on-cepa-deal/',
 cepa2='https://en.aletihad.ae/news/business/4633682/minister-of-foreign-trade-leads-high-level-delegation-to-egy',
 bano='https://www.puratos.com/news/Puratos-Group-signs-a-joint-venture-agreement-with-Bano-Group',
 iffco='https://iffco.com/?p=3297',
 dawn='https://www.foodnavigator.com/Article/2026/03/11/puratos-dawn-foods-deal-targets-the-20bn-donut-market/',
 jfdaCol='https://opendata.gov.jo/en/dataset/MIGRATED-964-2021',
 agadir='https://admin.jordanexportportal.gov.jo/files/khaled/New%20Factsheet/Factsheet_2-Aghadeer-_English.pdf',
 horecaJO='https://www.tradefairdates.com/HORECA-JORDAN-M12621/Amman.html',
 kePvoc='https://www.dhl.com/discover/en-ke/logistics-advice/import-export-advice/importing-into-kenya--when-kebs-certification-is-required',
 keLaw='https://new.kenyalaw.org/akn/ke/act/ln/1978/107/eng@2022-12-31',
 keAdd='https://www.foodbusinessmea.com/kenya-adopts-new-standards-to-govern-fast-growing-food-additives-market/',
 keSugar='https://theeastafrican.co.ke/tea/business-tech/kenya-dissolves-comesa-sugar-barriers-after-24-years-5312738',
 afsKE='https://www.showsbee.com/fairs/68301-Africa-Food-Show-Kenya-2027.html',
 maAdd='https://lematin.ma/societe/additifs-alimentaires-au-maroc-menace-ou-simple-surchauffe-mediatique/313481',
 maFairs='https://agriexchange.apeda.gov.in/ImportRegulations/04265202542314731581.pdf',
 maBlock='https://en.hespress.com/104504-104504.html',
 maSagaci='https://sagaciresearch.com/?p=25357',
 afsMA='https://www.foodexport.org/events/market-entry/product-showcases/r26aex1',
)

FX = {'SAR':3.75,'AED':3.6725,'JOD':0.709,'KWD':0.306,'KES':129.0}
def price(cat, brand, product, pack, val, cur, url, qty=None, unit='L', ch='retail', conf='high'):
    usd = round(val/FX[cur],2)
    per = round(usd/qty,2) if qty else None
    return dict(category_ar=cat, brand=brand, product=product, pack=pack, price_local=val, currency=cur,
                price_usd=usd, per_unit_usd=per, unit=unit, channel=ch, date='2026-10-13', url=url, confidence=conf)

# ---------- additive rule sets ----------
NAMES = {'E102':'Tartrazine','E110':'Sunset Yellow FCF','E129':'Allura Red AC','E133':'Brilliant Blue FCF','E150d':'Caramel IV','E150':'Caramel','E160b':'Annatto','E160a':'Beta-carotene','E104':'Quinoline Yellow','E122':'Carmoisine','E120':'Carmine (Cochineal)','E160':'Carotenes','E202':'Potassium sorbate','E211':'Sodium benzoate','E551':'Silicon dioxide','E500':'Sodium carbonates','GEL':'Gelatin'}
def gcc_rules(e171note):
    r = {}
    for c in ['E102','E110','E122','E129']:
        r[c] = dict(status='warning', note_ar='مسموح بحدود GSO 2500، مع عبارة تحذير إجبارية على العبوة: قد يؤثر سلباً على النشاط والانتباه لدى الأطفال.', url=U['gsoColours'])
    r['E104'] = dict(status='check', note_ar='لم نجد نصاً خليجياً صريحاً عنه. الاتحاد الأوروبي يطلب له نفس عبارة التحذير، فاعتبره مثل باقي الأصباغ الآزو لحد ما يتأكد من GSO 2500.', url=U['gso2500'])
    r['E120'] = dict(status='halal', note_ar='صبغة من حشرة القرمز. مقبولية حلال محل خلاف، ولازم تأكيد من جهة الحلال المعتمدة قبل الشحن أو استبدالها بصبغة نباتية.', url=U['chemSA'])
    r['GEL'] = dict(status='halal', note_ar='الجيلاتين يحتاج شهادة حلال لمصدره من جهة معتمدة من المركز السعودي للحلال/GCC.', url=U['chemSA'])
    for c in ['E133','E150','E150d','E160','E160a','E160b','E202','E211','E551','E500']:
        r[c] = dict(status='limits', note_ar='مسموح ضمن الحد الأقصى لفئة المنتج في GSO 2500. راجع الحد لكل فئة (حشوات، جلازات، مربى).', url=U['gso2500'])
    r['E171'] = dict(status='banned', note_ar=e171note, url=U['e171'])
    return r

SA_RULES = gcc_rules('ممنوع في السعودية منذ 21 أكتوبر 2022 (تعميم SFDA). منتجات Dr. Baker مفيهاش E171 حسب ملف البيانات.')
AE_RULES = gcc_rules('ممنوع في السعودية وقطر وعُمان. لم نتأكد من وضعه في الإمارات، ومنتجاتنا مفيهاش E171.')
AE_RULES['E171']['status']='check'
KW_RULES = gcc_rules('ممنوع في السعودية وقطر وعُمان. لم نتأكد من وضعه في الكويت، ومنتجاتنا مفيهاش E171.')
KW_RULES['E171']['status']='check'

JO_RULES = {}
for c in ['E102','E110','E122','E129','E104','E133']:
    JO_RULES[c]=dict(status='check', note_ar='الأردن عنده قائمة ألوان مسموحة (اللائحة الفنية 94/2017، بيانات JFDA). راجع وجود اللون وحده لفئة المنتج قبل الشحن.', url=U['jfdaCol'])
for c in ['E150','E150d','E160','E160a','E160b','E202','E211','E551','E500']:
    JO_RULES[c]=dict(status='limits', note_ar='مسموح عادة ضمن حدود Codex. راجع اللائحة الأردنية للفئة.', url=U['jfdaCol'])
JO_RULES['E120']=dict(status='halal', note_ar='مصدر حشري. أكّد مقبوليته مع جهة الحلال (JS 1475) أو استبدله.', url=U['jfdaCol'])
JO_RULES['GEL']=dict(status='halal', note_ar='شهادة حلال لمصدر الجيلاتين (JS 1475 للمنتجات الحيوانية).', url=U['jfdaCol'])

KE_RULES = {}
for c in ['E102','E110','E122','E129','E104','E133','E150','E150d','E160','E160a','E160b','E202','E211','E551','E500','E120']:
    KE_RULES[c]=dict(status='limits', note_ar='كينيا تتبع Codex ومواصفات EAC. مسموح ضمن الحدود، مع ذكر الإضافة باسمها أو رقمها على الملصق بالإنجليزي.', url=U['keLaw'])
KE_RULES['GEL']=dict(status='limits', note_ar='لا يوجد شرط حلال إلزامي، لكن شهادة حلال تفيد مع عملاء الساحل والمسلمين.', url=U['keLaw'])

MA_RULES = {}
for c in ['E102','E104','E110','E122','E129']:
    MA_RULES[c]=dict(status='warning', note_ar='المغرب متوافق مع لائحة الاتحاد الأوروبي 1333/2008 (حسب ONSSA). الاتحاد يطلب عبارة: peut avoir des effets indésirables sur l\'activité et l\'attention chez les enfants. أكّدها مع ONSSA.', url=U['maAdd'])
for c in ['E133','E150','E150d','E160','E160a','E160b','E202','E211','E551','E500']:
    MA_RULES[c]=dict(status='limits', note_ar='مسموح ضمن حدود القرار المشترك 1795-14 المعدل بالقرار 2750-22.', url=U['maAdd'])
MA_RULES['E120']=dict(status='halal', note_ar='مصدر حشري. حلال NM 08.0.800 مطلوب لبعض الفئات؛ أكّد أو استبدل.', url=U['maAdd'])
MA_RULES['GEL']=dict(status='halal', note_ar='شهادة حلال لمصدر الجيلاتين.', url=U['maAdd'])
MA_RULES['E171']=dict(status='check', note_ar='ممنوع في الاتحاد الأوروبي منذ 2022، ووضعه في المغرب غير محسوم في المصدر. منتجاتنا مفيهاش E171.', url=U['maAdd'])

# ---------- SKU compliance ----------
def skus_with(code):
    if code=='GEL':
        return [p for p in P if 'gelatin' in p['ing'].lower()]
    k = code[1:]
    pat = re.compile(r'\bE\s?-?'+k+r'(?![0-9a-z])', re.I)
    return [p for p in P if pat.search(p['ing'])]
SKU = {c: skus_with(c) for c in NAMES}

def compliance(rules):
    rows=[]; flagged=set()
    for c,nm in NAMES.items():
        s=SKU[c]
        if not s: continue
        r=rules.get(c, dict(status='check', note_ar='غير مؤكد', url=''))
        rows.append(dict(code=c if c!='GEL' else 'Gelatin', name=nm, status=r['status'], note_ar=r['note_ar'], url=r['url'], skus=len(s),
             cats=[k for k,_ in collections.Counter(p['cat'] for p in s).most_common(4)],
             list=[[p['code'] or '', p['name'], p['cat']] for p in s]))
        if r['status'] in ('warning','halal','banned','check'):
            flagged.update(p['name'] for p in s)
    order={'banned':0,'halal':1,'warning':2,'check':3,'limits':4}
    rows.sort(key=lambda x:(order[x['status']],-x['skus']))
    return dict(rows=rows, flagged=len(flagged), total=len(P))

D = {}
# ================= SAUDI =================
D['السعودية'] = dict(
 code='SA', asOf='2026-10-13',
 headline_ar='أكبر سوق خليجي لنا، والمصنع في المدينة المنورة يعطينا ميزة التوريد المحلي. الأولوية: كريمة الخفق والسبريد ومخاليط الكيك للمخابز والموزعين.',
 competitors=[
  dict(name='Almarai', origin='السعودية', type='local', products='كريمة خفق وطبخ، بودرة كريمة', positioning_ar='الأوسع انتشاراً في التجزئة، سعر متوسط.', threat='high', url=U['cfKSAc']),
  dict(name='Nadec', origin='السعودية', type='local', products='كريمة خفق وطبخ، مخاليط كيك', positioning_ar='أرخص كريمة خفق لتر على الرف (25.25 ريال).', threat='high', url=U['cfKSAc']),
  dict(name='Juhayna', origin='مصر', type='regional', products='كريمة خفق UHT', positioning_ar='منافس مصري مباشر على نفس الرف (29.99 ريال/لتر).', threat='high', url=U['cfKSAc']),
  dict(name='Puck (Arla)', origin='الدنمارك', type='multinational', products='كريمة خفق وطبخ', positioning_ar='علامة ثقة عند ربات البيوت، تسعير متوسط.', threat='medium', url=U['cfKSAc']),
  dict(name='Avonmore Professional', origin='أيرلندا', type='multinational', products='كريمة خفق احترافية', positioning_ar='يستهدف المحترفين في التجزئة (34.50 ريال/لتر).', threat='medium', url=U['cfKSAc']),
  dict(name='President / Elle & Vire', origin='فرنسا', type='multinational', products='كريمة خفق فرنسية', positioning_ar='الشريحة الفاخرة 41.50 إلى 51.25 ريال/لتر.', threat='low', url=U['cfKSAc']),
  dict(name='Al Alali', origin='السعودية', type='local', products='بودرة كريمة، مخاليط كيك', positioning_ar='قوي في بودرة الكريمة ومخاليط الكيك المنزلية.', threat='high', url=U['cfKSAm']),
  dict(name='Nutella (Ferrero)', origin='إيطاليا', type='multinational', products='سبريد بندق', positioning_ar='المرجع السعري للسبريد (47.50 ريال/كجم).', threat='medium', url=U['cfKSAs']),
  dict(name='Luna / Yamama', origin='السعودية', type='local', products='سبريد بندق وكاكاو', positioning_ar='سبريد اقتصادي 15.99 إلى 17.25 ريال للعبوة.', threat='medium', url=U['cfKSAs']),
  dict(name='Bano-Puratos', origin='بلجيكا/الخليج', type='multinational', products='حشوات، جلازات، شوكولاتة، محسنات', positioning_ar='المنافس الأقوى في B2B للمخابز. شراكة منذ 2018 مع Bano الموجودة في السعودية والإمارات والكويت.', threat='high', url=U['bano']),
  dict(name='IFFCO (Pristine)', origin='الإمارات', type='regional', products='كريمة خفق نباتية، حشوات ثابتة حرارياً، جلازات، دهون', positioning_ar='نفس محفظة Dr. Baker تقريباً للمحترفين، مع مراكز دعم فني في الخليج.', threat='high', url=U['iffco']),
 ],
 prices=[
  price('كريمة خفق','Nadec','Whipping Cream','1L',25.25,'SAR',U['cfKSAc'],1),
  price('كريمة خفق','Juhayna','Whipping Cream','1L',29.99,'SAR',U['cfKSAc'],1),
  price('كريمة خفق','Avonmore','Professional Whipping Cream','1L',34.50,'SAR',U['cfKSAc'],1),
  price('كريمة خفق','President','Whipping Cream','1L',41.50,'SAR',U['cfKSAc'],1),
  price('كريمة خفق','Elle & Vire','Excellence Whipping Cream','1L',51.25,'SAR',U['cfKSAc'],1),
  price('كريمة خفق','Almarai','Whipping Cream','500ml',20.50,'SAR',U['cfKSAc'],0.5),
  price('بودرة كريمة','Al Alali','Cream Delight Instant Dairy Whip','144g',17.99,'SAR',U['cfKSAc'],0.144,'kg'),
  price('بودرة كريمة','Almarai','Whipped Cream Topping Mix','35g x4',16.75,'SAR',U['cfKSAc'],0.14,'kg'),
  price('سبريد بندق','Nutella','Hazelnut Spread','1kg',47.50,'SAR',U['cfKSAs'],1,'kg'),
  price('سبريد بندق','Luna','Chocolate Hazelnut Spread','340g',15.99,'SAR',U['cfKSAs'],0.34,'kg'),
  price('سبريد بندق','Yamama','Cocoa & Hazelnut Spread','360g',17.25,'SAR',U['cfKSAs'],0.36,'kg'),
  price('سبريد بندق','Bonne Maman','Hazelnut Chocolate Spread','360g',34.50,'SAR',U['cfKSAs'],0.36,'kg'),
  price('مخلوط كيك','Nadec','Pound Choco Cake Mix','400g',13.50,'SAR',U['cfKSAm'],0.4,'kg'),
  price('مخلوط كيك','Al Alali','Ultra Moist Chocolate Cake Mix','500g',16.99,'SAR',U['cfKSAm'],0.5,'kg'),
  price('مخلوط كيك','Foster Clark\'s','Chocolate Swirl Cake Mix','500g',15.74,'SAR',U['cfKSAm'],0.5,'kg'),
  price('مخلوط كيك','Betty Crocker','Super Moist Dark Chocolate','430g',15.74,'SAR',U['cfKSAm'],0.43,'kg'),
  price('مخلوط كيك','Zidnee','Chocolate Cake Mix','500g',8.20,'SAR',U['cfKSAm'],0.5,'kg'),
 ],
 priceSummary_ar='كريمة الخفق على الرف من 6.7 دولار/لتر (Nadec) لـ 13.7 دولار/لتر (Elle & Vire)، والمنافس المصري Juhayna عند 8 دولار/لتر. مكان Dr. Baker الطبيعي بين Juhayna وAvonmore (8 إلى 9 دولار/لتر للتجزئة) مع رسالة "مصنوع في المدينة المنورة". السبريد بين 12.5 دولار/كجم (Luna وNutella) و25 دولار/كجم (Bonne Maman)، فالسبريد الاقتصادي محتاج سعر أقل من Nutella بوضوح. مخاليط الكيك 4.4 إلى 9.5 دولار/كجم. أسعار B2B (عبوات المخابز) مش منشورة، واطلبها من موزعينا Baker\'s Way وPlatraw.',
 shipping=[
  dict(item_ar='تسجيل المستورد والمنتج', detail_ar='المستورد يسجل على منصة Ghad التابعة لـ SFDA، وكل منتج يتسجل قبل الاستيراد (حوالي 5 أيام عمل للأغذية العامة).', url=U['chemSA']),
  dict(item_ar='التخليص', detail_ar='طلب التخليص على منصة Fasah. يشترط مستودع مرخص إلا لو الشحنات قليلة (5 شحنات سنوياً و2,000 كجم أو أقل).', url=U['sfdaClear']),
  dict(item_ar='المستندات', detail_ar='بيان جمركي، شهادة منشأ، فاتورة تجارية، قائمة تعبئة، بوليصة شحن، شهادة مطابقة، وشهادات الحلال والصحة عند الحاجة.', url=U['chemSA']),
  dict(item_ar='الملصق', detail_ar='العربية إلزامية، وأي لغة تانية لازم تطابقها. الإضافات تُكتب بوظيفتها واسمها أو رقم INS، والمواد المسببة للحساسية تُذكر (ومنها الكبريتيت فوق 10 ppm). منتجات التصنيع غير الموجهة للمستهلك ممكن تُعفى بتعهد من المستورد.', url=U['chemSA']),
  dict(item_ar='تاريخ الصلاحية', detail_ar='حسب GSO 150-1 (تواريخ الصلاحية الإلزامية). اشحن بأطول صلاحية متبقية ممكنة.', url=U['chemSA']),
  dict(item_ar='منتجات الألبان والبيض', detail_ar='منتجات الألبان والبيض لازم تيجي من منشآت معتمدة من SFDA، ومنتجات البيض تحتاج تصريح استيراد لكل شحنة (مهم للبيض المبستر وبودرة البيض).', url=U['chemSA']),
  dict(item_ar='العينات', detail_ar='ممكن سحب عينات للتحليل على حساب المستورد.', url=U['sfdaClear']),
  dict(item_ar='ميزة المصنع المحلي', detail_ar='منتجات مصنع المدينة المنورة تتجنب الاستيراد كلياً. حوّل الأصناف المطلوبة للسعودية والكويت للإنتاج هناك متى أمكن.', url=''),
 ],
 certificates=[
  dict(name='SFDA Ghad (منشأة ومنتج)', required='yes', detail_ar='تسجيل المستورد وكل صنف.', url=U['chemSA']),
  dict(name='Halal Certificate', required='yes', detail_ar='إلزامية للمنتجات اللي فيها مكون حيواني (جيلاتين، دهون حيوانية، إنزيمات) أو عليها شعار حلال، ومن جهة معتمدة من المركز السعودي للحلال. الألبان والحلويات والشوكولاتة تحت مراقبة خاصة.', url=U['chemSA']),
  dict(name='Health Certificate', required='yes', detail_ar='لشحنات المنتجات الحيوانية المنشأ (كريمة، بيض، سمن).', url=U['chemSA']),
  dict(name='Certificate of Origin', required='yes', detail_ar='ضروري للإعفاء الجمركي بموجب GAFTA.', url=U['chemSA']),
  dict(name='Certificate of Conformity', required='yes', detail_ar='ضمن مستندات التخليص.', url=U['chemSA']),
  dict(name='FSSC 22000 / BRCGS / ISO', required='no', detail_ar='مش شرط قانوني لكن المخابز الكبرى والسلاسل بتطلبها. Dr. Baker عندها الشهادات دي، فاستخدمها في البيع.', url=''),
 ],
 tariffs=[dict(hs='كل خطوطنا', desc_ar='منشأ مصري', duty='0% بموجب GAFTA مع شهادة منشأ عربية', vat='15% ضريبة قيمة مضافة', note_ar='المعدل العام لمنشأ خارج الاتفاقيات حوالي 5% (التعريفة الخليجية الموحدة). معلومة عامة، أكّدها مع المخلّص.', url='')],
 agreements=[
  dict(name='GAFTA', status='سارية', relevance_ar='إعفاء جمركي للسلع المصرية المنشأ بشرط قواعد المنشأ العربية.', tariff_note_ar='0%', url=''),
  dict(name='مصنع المدينة المنورة', status='قائم', relevance_ar='إنتاج داخل السعودية بدون استيراد، وبوابة برية للكويت.', tariff_note_ar='لا ينطبق', url=''),
 ],
 fairs=[
  dict(name='Foodex Saudi 2026', dates='23–25 نوفمبر 2026', city='جدة (JIECC)', url=U['foodex'], relevance_ar='17% من العارضين في قسم Sweets, Snacks & Bakery. قريب من مصنع المدينة.'),
  dict(name='Gulfood Manufacturing 2026', dates='3–5 نوفمبر 2026', city='دبي', url=U['gfm'], relevance_ar='المشترون السعوديون حاضرون بكثافة. ابدأ المواعيد منه.'),
 ],
 seasons=[
  dict(name_ar='رمضان 2027', period='حوالي 8 فبراير إلى 9 مارس 2027 (تقريبي)', impact_ar='أعلى موسم للحلويات والكريمة. الموزعون يطلبون قبله بحوالي شهرين: ديسمبر ويناير.', url=''),
  dict(name_ar='عيد الفطر', period='حوالي 10 مارس 2027 (تقريبي)', impact_ar='كيك وحلويات العيد، طلب المخابز في ذروته.', url=''),
  dict(name_ar='يوم التأسيس', period='22 فبراير', impact_ar='حملات أخضر وكيك مناسبات. يتداخل مع رمضان 2027.', url=''),
  dict(name_ar='اليوم الوطني', period='23 سبتمبر', impact_ar='كيك وحلويات باللون الأخضر، فرصة محتوى وعروض للمخابز.', url=''),
  dict(name_ar='موسم الأعراس والصيف', period='يونيو إلى أغسطس', impact_ar='طلب على تورتات المناسبات والكريمة. الحرارة تتطلب كريمة ثابتة.', url=''),
 ],
 unverified=['أسعار الجملة لعبوات المخابز (كريمة 1 لتر في كرتونة، حشوات 5 كجم) غير منشورة','نص GSO 2500 الحالي ومستويات كل لون حسب الفئة: لازم نسخة رسمية من المواصفة','وضع E104 في الخليج','حصص السوق للمنافسين في قطاع B2B'],
 rules=SA_RULES)

# ================= UAE =================
D['الإمارات'] = dict(
 code='AE', asOf='2026-10-13',
 headline_ar='سوق مزدحم بالعلامات الأوروبية والسعودية، لكنه بوابة إعادة تصدير ومقر Gulfood. ادخل بكريمة خفق اقتصادية للمحترفين ومنتجات الحشوات والجلازات.',
 competitors=[
  dict(name='Almarai', origin='السعودية', type='regional', products='كريمة خفق وطبخ', positioning_ar='سعر وسط (27.49 درهم/لتر).', threat='high', url=U['cfUAE']),
  dict(name='Puck (Arla)', origin='الدنمارك', type='multinational', products='كريمة خفق وطبخ', positioning_ar='26.99 درهم/لتر، حاضر في كل السلاسل.', threat='high', url=U['cfUAE']),
  dict(name='Macphie Mactop', origin='بريطانيا', type='multinational', products='بديل كريمة خفق', positioning_ar='أقرب منتج لكريمة Dr. Baker النباتية، 24.99 درهم/لتر.', threat='high', url=U['cfUAE']),
  dict(name='Nadec', origin='السعودية', type='regional', products='كريمة خفق وطبخ', positioning_ar='أرخص كريمة خفق نص لتر (14.49 درهم).', threat='medium', url=U['cfUAE']),
  dict(name='Paysan Breton', origin='فرنسا', type='multinational', products='كريمة خفق UHT', positioning_ar='شريحة فوق المتوسط (39.79 درهم/لتر).', threat='low', url=U['cfUAE']),
  dict(name='Elle & Vire / President', origin='فرنسا', type='multinational', products='كريمة احترافية', positioning_ar='الشريحة الفاخرة 43.95 إلى 47.29 درهم/لتر.', threat='low', url=U['cfUAE']),
  dict(name='IFFCO (Pristine)', origin='الإمارات', type='regional', products='كريمة نباتية، حشوات، جلازات، دهون، مخاليط', positioning_ar='لاعب محلي بنفس محفظتنا للمحترفين، ومراكز دعم في الشرق الأوسط.', threat='high', url=U['iffco']),
  dict(name='Bano-Puratos', origin='بلجيكا/الخليج', type='multinational', products='حشوات، جلازات، شوكولاتة', positioning_ar='الأقوى في المخابز الاحترافية والفنادق.', threat='high', url=U['bano']),
 ],
 prices=[
  price('كريمة خفق','Macphie','Mactop Whipped Cream Alternative','1L',24.99,'AED',U['cfUAE'],1),
  price('كريمة خفق','Puck','Whipping Cream','1L',26.99,'AED',U['cfUAE'],1),
  price('كريمة خفق','Almarai','Chef\'s Choice Whipping Cream','1L',27.49,'AED',U['cfUAE'],1),
  price('كريمة خفق','Nadec','Whipping Cream','500ml',14.49,'AED',U['cfUAE'],0.5),
  price('كريمة خفق','Paysan Breton','Whipping and Cooking Cream','1L',39.79,'AED',U['cfUAE'],1),
  price('كريمة خفق','Elle & Vire','UHT Whipping Cream 35%','1L',47.29,'AED',U['cfUAE'],1),
  price('كريمة خفق','Elle & Vire','UHT Whipping Cream','1L',43.95,'AED',U['talUAE'],1),
  price('كريمة خفق','Puck','Whipping Cream','1L',28.95,'AED',U['talUAE'],1),
  price('كريمة طبخ','Pride','Cooking Cream','1L',12.99,'AED',U['cfUAE'],1),
  price('كريمة طبخ','Almarai','Chef\'s Choice Cooking Cream','1L',25.99,'AED',U['cfUAE'],1),
 ],
 priceSummary_ar='كريمة الخفق في التجزئة من 6.8 دولار/لتر (Macphie Mactop النباتية) لـ 12.9 دولار/لتر (Elle & Vire). المنافس المباشر لكريمتنا النباتية هو Mactop عند 6.8 دولار، والكريمة اللبنية المتوسطة (Puck وAlmarai) عند 7.3 إلى 7.9 دولار. الدخول بسعر رف 6.5 إلى 7 دولار/لتر للكريمة النباتية يكون منافس. أسعار الحشوات والجلازات للمحترفين غير منشورة ولازم تيجي من الموزعين في المعرض.',
 shipping=[
  dict(item_ar='الترخيص والتسجيل', detail_ar='رخصة تجارية تشمل تجارة الأغذية، وتسجيل المستورد في ZAD ونظام الإمارة (Dubai Municipality FIRS أو ADAFSA ZADI).', url=''),
  dict(item_ar='تسجيل المنتج', detail_ar='كل منتج يتسجل إلكترونياً مع تقييم الملصق قبل الاستيراد. الملصق بالعربي والإنجليزي، ومسموح بملصق ترجمة.', url=''),
  dict(item_ar='الملصق', detail_ar='بيانات عربية إلزامية، تاريخ إنتاج وانتهاء ورقم تشغيلة.', url=''),
  dict(item_ar='الحلال', detail_ar='شهادة حلال فقط عند وجود مكون حيواني أو ادعاء حلال، من جهة معترف بها من MOIAT.', url=''),
  dict(item_ar='الشحن', detail_ar='مضيق هرمز مغلق فعلياً منذ أواخر فبراير 2026، والموانئ الخليجية متأثرة. فضّل الموانئ الشرقية (الفجيرة وخورفكان) أو الشحن البري من السعودية.', url=''),
 ],
 certificates=[
  dict(name='تسجيل المنتج والملصق (Montaji / FIRS)', required='yes', detail_ar='قبل أول شحنة.', url=''),
  dict(name='Halal Certificate', required='likely', detail_ar='للأصناف اللي فيها جيلاتين أو مكون حيواني أو شعار حلال.', url=''),
  dict(name='Health Certificate', required='yes', detail_ar='لمنتجات الألبان والبيض.', url=''),
  dict(name='Certificate of Origin', required='yes', detail_ar='للإعفاء بموجب GAFTA.', url=''),
 ],
 tariffs=[dict(hs='كل خطوطنا', desc_ar='منشأ مصري', duty='0% بموجب GAFTA مع شهادة منشأ', vat='5% ضريبة قيمة مضافة', note_ar='معلومة عامة، أكّدها مع المخلّص.', url='')],
 agreements=[
  dict(name='GAFTA', status='سارية', relevance_ar='إعفاء جمركي للمنشأ المصري.', tariff_note_ar='0%', url=''),
  dict(name='Egypt–UAE CEPA', status='قيد التفاوض (زيارة وفد إماراتي لمصر يوليو 2026)', relevance_ar='لو اتوقّعت ممكن تسهّل الاعتراف بالشهادات والاستثمار، لكن مفيش أثر جمركي إضافي على الأغذية لأن GAFTA بتعفيها بالفعل.', tariff_note_ar='لا تغيير حالياً', url=U['cepa2']),
 ],
 fairs=[
  dict(name='Gulfood Manufacturing 2026', dates='3–5 نوفمبر 2026', city='دبي (DWTC)', url=U['gfm'], relevance_ar='معرضنا الرئيسي. قاعات المكونات 5 إلى 9.'),
  dict(name='Gulfood 2027', dates='15–19 مارس 2027', city='دبي (DWTC وExpo City)', url=U['gulfood27'], relevance_ar='بعد رمضان مباشرة. مناسب للمتابعة مع موزعي Gulfood Manufacturing.'),
 ],
 seasons=[
  dict(name_ar='رمضان 2027', period='حوالي 8 فبراير إلى 9 مارس 2027 (تقريبي)', impact_ar='الطلب يبلغ ذروته، والتخزين في ديسمبر ويناير.', url=''),
  dict(name_ar='اليوم الوطني الإماراتي', period='2 ديسمبر', impact_ar='كيك بألوان العلم، عروض للمخابز.', url=''),
  dict(name_ar='موسم السياحة والفنادق', period='أكتوبر إلى أبريل', impact_ar='أعلى طلب من الفنادق والمطاعم (HORECA).', url=''),
 ],
 unverified=['وضع E171 في الإمارات','أسعار الحشوات والجلازات للمحترفين','مصدر رسمي لمتطلبات Dubai Municipality (البيانات من دراسة سابقة عبر ChemLinked)'],
 rules=AE_RULES)

# ================= JORDAN =================
D['الأردن'] = dict(
 code='JO', asOf='2026-10-13',
 headline_ar='سوق صغير لكن مستقر للمنتجات المصرية، معفى جمركياً بموجب أجادير وGAFTA، والعقبة خارج أزمة هرمز. ادخل عبر موزع واحد قوي.',
 competitors=[
  dict(name='Puck (Arla)', origin='الدنمارك', type='multinational', products='كريمة خفق وطبخ', positioning_ar='المرجع في كريمة الخفق (5.75 دينار/لتر).', threat='high', url=U['talJO']),
  dict(name='Almarai', origin='السعودية', type='regional', products='كريمة طبخ', positioning_ar='4.65 دينار/لتر للطبخ.', threat='medium', url=U['talJO']),
  dict(name='Master Gourmet', origin='غير محدد', type='importer', products='كريمة طبخ', positioning_ar='الأرخص على الرف.', threat='low', url=U['talJO']),
  dict(name='Betty Crocker', origin='الولايات المتحدة', type='multinational', products='بودرة كريمة خفق', positioning_ar='3.95 دينار لعبوتين 140 جم.', threat='medium', url=U['talJO']),
 ],
 prices=[
  price('كريمة خفق','Puck','Whipping Cream','1L',5.75,'JOD',U['talJO'],1),
  price('كريمة خفق','Puck','Whipping Cream','200ml',1.60,'JOD',U['talJO'],0.2),
  price('كريمة طبخ','Almarai','Cooking Cream','1L',4.65,'JOD',U['talJO'],1),
  price('كريمة طبخ','Puck','Cooking Cream','1L',5.99,'JOD',U['talJO'],1),
  price('بودرة كريمة','Betty Crocker','Whipping Cream Mix','140g x2',3.95,'JOD',U['talJO'],0.28,'kg'),
 ],
 priceSummary_ar='كريمة الخفق Puck عند حوالي 8.1 دولار/لتر، وكريمة الطبخ Almarai عند 6.6 دولار/لتر. مكان Dr. Baker: 6.5 إلى 7.5 دولار/لتر للتجزئة. العينة صغيرة (متجر واحد على Talabat)، فاطلب قائمة أسعار من الموزع قبل التسعير.',
 shipping=[
  dict(item_ar='تسجيل JFDA', detail_ar='تسجيل منشأة لمصدّري الألبان (HACCP)، وترخيص للأغذية الخاصة والإضافات. المستورد غير المسجل يدفع غرامة 2.5% من قيمة CIF.', url=''),
  dict(item_ar='الملصق', detail_ar='عربي أو ملصق عربي دائم. "يفضّل استهلاكه قبل" يُعامل كتاريخ انتهاء، وأخطاء الملصق ممكن تؤدي لرفض الشحنة.', url=''),
  dict(item_ar='الألبان', detail_ar='بودرة الحليب لبعض الاستخدامات تحتاج رخصة استيراد، والزيوت المهدرجة جزئياً ممنوعة في منتجات الألبان المصنعة.', url=''),
  dict(item_ar='الطريق', detail_ar='ميناء العقبة على البحر الأحمر خارج هرمز، أو براً.', url=''),
 ],
 certificates=[
  dict(name='JFDA Registration', required='yes', detail_ar='للمنشأة (ألبان) والمستورد.', url=''),
  dict(name='Halal (JS 1475)', required='yes', detail_ar='للمنتجات ذات المكون الحيواني.', url=''),
  dict(name='Certificate of Origin (Agadir/GAFTA)', required='yes', detail_ar='شرط الإعفاء الجمركي. قواعد منشأ Pan-Euro-Med لأجادير.', url=U['agadir']),
 ],
 tariffs=[dict(hs='كل خطوطنا', desc_ar='منشأ مصري', duty='0% بموجب أجادير/GAFTA', vat='16% ضريبة مبيعات على CIF', note_ar='المنتجات الزراعية تُحرر حسب جدول GAFTA. أكّد التصنيف لكل HS.', url=U['agadir'])],
 agreements=[
  dict(name='اتفاقية أجادير', status='سارية (موقعة 2004)', relevance_ar='إعفاء السلع الصناعية من الجمارك. قواعد منشأ Pan-Euro-Med مع تراكم قطري مع الاتحاد الأوروبي.', tariff_note_ar='0% للصناعي، والزراعي حسب GAFTA', url=U['agadir']),
  dict(name='GAFTA', status='سارية', relevance_ar='إعفاء للمنشأ العربي.', tariff_note_ar='0%', url=''),
 ],
 fairs=[dict(name='HORECA Jordan', dates='11–13 أكتوبر 2026 (انتهى اليوم)', city='عمّان (JIEC)', url=U['horecaJO'], relevance_ar='فاتنا هذا العام. خطط لنسخة 2027 مبكراً.')],
 seasons=[
  dict(name_ar='رمضان 2027', period='حوالي 8 فبراير 2027 (تقريبي)', impact_ar='ذروة الحلويات الشرقية والكريمة.', url=''),
  dict(name_ar='عيد الاستقلال', period='25 مايو', impact_ar='مناسبات وكيك.', url=''),
  dict(name_ar='موسم الصيف والأعراس', period='يونيو إلى أغسطس', impact_ar='تورتات الأعراس، والمغتربين العائدين.', url=''),
 ],
 unverified=['قائمة الألوان المسموحة في الأردن (ملف JFDA بصيغة XLS لم نستطع فتحه)','منافسو B2B للحشوات والجلازات في الأردن','أسعار السبريد ومخاليط الكيك'],
 rules=JO_RULES)

# ================= KENYA =================
D['كينيا'] = dict(
 code='KE', asOf='2026-10-13',
 headline_ar='سوق صغير لكنه بوابة شرق أفريقيا، ومصر أكبر مورد شوكولاتة له. ابدأ بالسبريد ومخاليط الكيك والكريمة النباتية، وانتبه لـ PVoC.',
 competitors=[
  dict(name='Brookside', origin='كينيا', type='local', products='كريمة خفق وطبخ', positioning_ar='العلامة المحلية الأقوى في الألبان.', threat='high', url=U['cfKEc']),
  dict(name='Pristine (IFFCO)', origin='الإمارات', type='regional', products='Whip Topping نباتي', positioning_ar='762 شلن/لتر، أرخص كريمة خفق وأقرب منتج لنا.', threat='high', url=U['cfKEc']),
  dict(name='Emborg', origin='الدنمارك', type='multinational', products='كريمة UHT', positioning_ar='الشريحة الفاخرة 2,400 شلن/لتر.', threat='low', url=U['cfKEc']),
  dict(name='Dairyland', origin='كينيا', type='local', products='سبريد شوكولاتة وبندق', positioning_ar='الأكثر تنوعاً على الرف، 850 شلن/650 جم.', threat='high', url=U['cfKEs']),
  dict(name='Lyons Maid (Chocotella)', origin='كينيا', type='local', products='سبريد', positioning_ar='750 شلن/500 جم.', threat='medium', url=U['cfKEs']),
  dict(name='Nutella', origin='إيطاليا', type='multinational', products='سبريد', positioning_ar='الأغلى، 856 شلن/350 جم بعد خصم.', threat='low', url=U['cfKEs']),
  dict(name='Caroline', origin='غير محدد', type='importer', products='مخاليط كيك', positioning_ar='تسيطر على رف مخاليط الكيك بتشكيلة واسعة.', threat='high', url=U['cfKEm']),
  dict(name='Betty Crocker', origin='الولايات المتحدة', type='multinational', products='مخاليط كيك', positioning_ar='480 إلى 670 شلن/500 جم.', threat='medium', url=U['cfKEm']),
 ],
 prices=[
  price('كريمة خفق','Pristine','Regular Whip Topping','1L',762,'KES',U['cfKEc'],1),
  price('كريمة خفق','Brookside','Whipping Cream Cup','400ml',564,'KES',U['cfKEc'],0.4),
  price('كريمة خفق','Emborg','UHT Whipping Cream','1L',2400,'KES',U['cfKEc'],1),
  price('كريمة طبخ','Pristine','Cooking Cream','1L',910,'KES',U['cfKEc'],1),
  price('سبريد','Dairyland','Hazelnut Choco Spread','650g',850,'KES',U['cfKEs'],0.65,'kg'),
  price('سبريد','Lyons Maid','Chocotella Hazelnut & Cocoa','500g',750,'KES',U['cfKEs'],0.5,'kg'),
  price('سبريد','Nuteez','Creamy Chocolate Nut Spread','400g',340,'KES',U['cfKEs'],0.4,'kg'),
  price('سبريد','Nutella','Hazelnut Spread','350g',856,'KES',U['cfKEs'],0.35,'kg'),
  price('مخلوط كيك','Caroline','Chocolate Fudge Cake Mix','510g',566,'KES',U['cfKEm'],0.51,'kg'),
  price('مخلوط كيك','Betty Crocker','Super Moist Chocolate Fudge','500g',670,'KES',U['cfKEm'],0.5,'kg'),
 ],
 priceSummary_ar='كريمة الخفق النباتية Pristine عند حوالي 5.9 دولار/لتر هي المرجع، والكريمة اللبنية Brookside حوالي 10.9 دولار/لتر. السبريد المحلي 6.6 إلى 11.6 دولار/كجم وNutella حوالي 19 دولار/كجم، فيه مساحة لسبريد مصري بحوالي 8 إلى 9 دولار/كجم. مخاليط الكيك 8.6 إلى 10.4 دولار/كجم. الأسعار بالدولار محسوبة على 129 شلن/دولار (تقريبي).',
 shipping=[
  dict(item_ar='PVoC وشهادة المطابقة (CoC)', detail_ar='الإطار الجديد لـ KEBS ساري من فبراير 2026 (2026 إلى 2029). المسار A فحص كامل، والمسار B تسجيل منتج لسنة، والمسار C ترخيص حتى 3 سنوات. الرسوم 0.50% إلى 0.60% من قيمة FOB. بدون CoC: فحص عند الوصول بـ 0.6% من القيمة الجمركية، والمنتج المخالف يُرفض.', url=U['kePvoc']),
  dict(item_ar='المستندات', detail_ar='فاتورة تجارية، قائمة تعبئة، بوليصة شحن، Import Declaration Form، شهادة المطابقة، كود HS صحيح.', url=U['kePvoc']),
  dict(item_ar='الملصق', detail_ar='الإنجليزية لغة الملصق المعتادة، والإضافات تُذكر حسب لائحة Food Labelling, Additives and Standards.', url=U['keLaw']),
  dict(item_ar='الميناء', detail_ar='Mombasa. الشحن من مصر عبر البحر الأحمر وباب المندب متأثر بمخاطر الحوثيين.', url=''),
 ],
 certificates=[
  dict(name='KEBS Certificate of Conformity (PVoC)', required='yes', detail_ar='قبل الشحن. اختر المسار B أو C لو هتشحن بانتظام.', url=U['kePvoc']),
  dict(name='Certificate of Origin (COMESA)', required='yes', detail_ar='شرط المعاملة التفضيلية.', url=''),
  dict(name='Halal', required='no', detail_ar='غير إلزامي، لكنه ميزة مع عملاء مومباسا والساحل.', url=''),
 ],
 tariffs=[dict(hs='كل خطوطنا', desc_ar='منشأ مصري', duty='تفضيلي بموجب COMESA FTA (غالباً 0%)، وإلا التعريفة الخارجية المشتركة لـ EAC', vat='16%', note_ar='كينيا أنهت حماية السكر في COMESA أواخر 2025. أكّد نسبة الإعفاء لكل HS مع المخلّص.', url=U['keSugar'])],
 agreements=[
  dict(name='COMESA FTA', status='سارية، ومصر بتستخدمها', relevance_ar='معاملة تفضيلية للمنشأ المصري. في 2022 هددت كينيا بفرض رسوم على مصر بسبب المعاملة بالمثل، فتابع أي تغيير.', tariff_note_ar='غالباً 0%', url=U['keSugar']),
  dict(name='AfCFTA', status='سارية للدولتين', relevance_ar='إطار احتياطي لو اتغيرت COMESA.', tariff_note_ar='حسب الجداول', url=''),
 ],
 fairs=[
  dict(name='Africa Food Show Kenya 2027', dates='27–29 أكتوبر 2027', city='نيروبي (Bomas)', url=U['afsKE'], relevance_ar='نفس منظّم Africa Food Show المغرب (MIE Events).'),
  dict(name='Africa Food Show Morocco 2026', dates='18–20 نوفمبر 2026', city='الدار البيضاء', url=U['afsMA'], relevance_ar='قابل مشترين شرق أفريقيا هناك.'),
 ],
 seasons=[
  dict(name_ar='الكريسماس ورأس السنة', period='ديسمبر', impact_ar='أعلى موسم للكيك والسبريد في كينيا.', url=''),
  dict(name_ar='عيد الفصح', period='مارس/أبريل', impact_ar='موسم كيك ثاني.', url=''),
  dict(name_ar='العودة للمدارس', period='يناير ومايو وسبتمبر', impact_ar='طلب على السبريد.', url=''),
  dict(name_ar='رمضان والعيد', period='فبراير ومارس 2027 (تقريبي)', impact_ar='مهم في مومباسا والساحل.', url=''),
 ],
 unverified=['نص المعايير الخمسة الجديدة للإضافات في كينيا','منافسو B2B للحشوات والجلازات في نيروبي','سعر صرف الشلن الحالي (التقدير 129)'],
 rules=KE_RULES)

# ================= KUWAIT =================
D['الكويت'] = dict(
 code='KW', asOf='2026-10-13',
 headline_ar='سوق صغير بقوة شرائية عالية، لكنه الأكثر تأثراً بأزمة هرمز. خدمه براً من مصنع المدينة عبر موزع سعودي أو مستورد كويتي مسجل في PAFN.',
 competitors=[
  dict(name='KDD', origin='الكويت', type='local', products='كريمة سائلة وطبخ', positioning_ar='المحلي الأقوى، 2.370 دينار/لتر للكريمة السائلة.', threat='high', url=U['talKW']),
  dict(name='Puck (Arla)', origin='الدنمارك', type='multinational', products='كريمة طبخ', positioning_ar='0.860 دينار/500 مل.', threat='high', url=U['talKW']),
  dict(name='Almarai', origin='السعودية', type='regional', products='كريمة طبخ وطازجة', positioning_ar='2.100 دينار لعبوتين 500 مل.', threat='medium', url=U['talKW']),
  dict(name='Bano-Puratos', origin='الكويت/بلجيكا', type='multinational', products='حشوات، جلازات، شوكولاتة', positioning_ar='Bano أصلاً مجموعة كويتية، فالمنافسة في B2B قوية هنا.', threat='high', url=U['bano']),
 ],
 prices=[
  price('كريمة سائلة','KDD','Liquid Cream','1L',2.370,'KWD',U['talKW'],1),
  price('كريمة طبخ','KDD','Liquid Cooking Cream','1L',1.960,'KWD',U['talKW'],1),
  price('كريمة طبخ','Puck','Cooking Cream','500ml',0.860,'KWD',U['talKW'],0.5),
  price('كريمة طبخ','Almarai','Cooking Cream','2x500ml',2.100,'KWD',U['talKW'],1),
 ],
 priceSummary_ar='الكريمة السائلة المحلية KDD حوالي 7.7 دولار/لتر، وكريمة الطبخ 5.6 إلى 6.9 دولار/لتر. لم نجد كريمة خفق نباتية على الرف في المصدر، وده ممكن يكون فرصة لكن لازم نتأكد من موزع.',
 shipping=[
  dict(item_ar='تسجيل PAFN', detail_ar='تسجيل المنتجات على منصة Raqeb. المستورد يحتاج رخصة تجارية ورخصة استيراد.', url=''),
  dict(item_ar='الألبان', detail_ar='منتجات الألبان قد تحتاج موافقة مسبقة (القرار الوزاري 6 لسنة 2023).', url=''),
  dict(item_ar='الملصق', detail_ar='عربي للتجزئة، تاريخ إنتاج وانتهاء. الملف يشمل التركيبة الكاملة وتصميم العبوة وشروط التخزين.', url=''),
  dict(item_ar='الطريق', detail_ar='براً من السعودية عبر منفذ النويصيب بدلاً من البحر، لأن ميناء الشويخ تأثر بأزمة هرمز.', url=''),
 ],
 certificates=[
  dict(name='PAFN Registration (Raqeb)', required='yes', detail_ar='لكل صنف.', url=''),
  dict(name='Halal Certificate', required='likely', detail_ar='للمكونات الحيوانية، من جهة معتمدة من GAC.', url=''),
  dict(name='Certificate of Origin', required='yes', detail_ar='للإعفاء بموجب GAFTA.', url=''),
 ],
 tariffs=[dict(hs='كل خطوطنا', desc_ar='منشأ مصري', duty='0% بموجب GAFTA', vat='لا توجد ضريبة قيمة مضافة في الكويت', note_ar='معلومة عامة، أكّدها مع المخلّص.', url='')],
 agreements=[dict(name='GAFTA', status='سارية', relevance_ar='إعفاء للمنشأ المصري. الإنتاج من المدينة المنورة منشأ سعودي، معفى أيضاً داخل الخليج.', tariff_note_ar='0%', url='')],
 fairs=[dict(name='HORECA Kuwait', dates='يناير 2027 (غير مؤكد)', city='الكويت', url='', relevance_ar='تأكد من الموعد قبل الحجز.')],
 seasons=[
  dict(name_ar='رمضان 2027', period='حوالي 8 فبراير 2027 (تقريبي)', impact_ar='ذروة الطلب.', url=''),
  dict(name_ar='العيد الوطني وعيد التحرير', period='25 و26 فبراير', impact_ar='مناسبات وطنية، تتداخل مع رمضان 2027.', url=''),
 ],
 unverified=['أسعار السبريد ومخاليط الكيك','وضع E171 في الكويت','موعد HORECA Kuwait 2027'],
 rules=KW_RULES)

# ================= MOROCCO =================
D['المغرب'] = dict(
 code='MA', asOf='2026-10-13',
 headline_ar='سوق كبير تسيطر عليه فرنسا في الكريمة (حوالي 83% من واردات 040130). الدخول يحتاج كتالوج فرنسي وحلال NM 08.0.800 وتسجيل ONSSA. ابدأ بالحشوات والجلازات والدهون.',
 competitors=[
  dict(name='الموردون الفرنسيون (President, Elle & Vire وغيرهم)', origin='فرنسا', type='multinational', products='كريمة UHT', positioning_ar='فرنسا تورّد حوالي 83% من واردات الكريمة 040130 للمغرب (2024)، مدعومة باتفاقية الشراكة مع الاتحاد الأوروبي. الأسماء التجارية غير مؤكدة.', threat='high', url=''),
  dict(name='الموردون الأتراك', origin='تركيا', type='regional', products='آيس كريم ومنتجات حلويات', positioning_ar='تركيا حوالي 24% من واردات الآيس كريم 210500.', threat='medium', url=''),
  dict(name='Enmer', origin='المغرب', type='local', products='دقيق ومكونات مخابز', positioning_ar='أكثر علامة مكونات مخابز مسحاً في المغرب حسب Sagaci.', threat='medium', url=U['maSagaci']),
 ],
 prices=[],
 priceSummary_ar='لم نستطع الوصول لأسعار رف موثقة للمغرب (Marjane وCarrefour Maroc لم تُظهر نتائج). اجمع الأسعار في Africa Food Show من الموزعين مباشرة.',
 shipping=[
  dict(item_ar='ONSSA', detail_ar='تسجيل/ترخيص ONSSA قبل التخليص، وشهادة مطابقة من مكتب الجودة الإقليمي (DCQ) لكل شحنة. ONSSA تقبل شهادات حكومية فقط.', url=U['maFairs']),
  dict(item_ar='المستندات', detail_ar='فاتورة أصلية، قائمة تعبئة، شهادة منشأ، شهادة صحية لكل شحنة. الشهادات القديمة بأشهر تُرفض.', url=U['maFairs']),
  dict(item_ar='الملصق', detail_ar='الفرنسية إلزامية (الاسم، المكونات، القيم الغذائية). العربية معفاة لمكونات B2B (القرار 13-79-10)، وراجع منتجات التجزئة.', url=''),
  dict(item_ar='الحلال', detail_ar='حلال NM 08.0.800 لمنتجات الألبان والدهون.', url=''),
 ],
 certificates=[
  dict(name='ONSSA Registration / DCQ Conformity', required='yes', detail_ar='لكل شحنة.', url=U['maFairs']),
  dict(name='Halal NM 08.0.800', required='likely', detail_ar='للألبان والدهون.', url=''),
  dict(name='Certificate of Origin (Agadir)', required='yes', detail_ar='شرط الإعفاء. قواعد منشأ Pan-Euro-Med.', url=U['agadir']),
 ],
 tariffs=[dict(hs='كل خطوطنا', desc_ar='منشأ مصري', duty='0% للسلع الصناعية بموجب أجادير، والزراعية حسب GAFTA', vat='حسب الفئة', note_ar='في 2025 أوقف المغرب السلع المصرية بشكل غير رسمي بسبب خلاف على أجادير (منها المنتجات الغذائية). العلاقات تحسنت في 2026 حسب دراسة سابقة. أكّد مع المستورد إن الشحنات بتعدي عادي.', url=U['maBlock'])],
 agreements=[
  dict(name='اتفاقية أجادير', status='سارية مع خلافات تطبيق في 2025', relevance_ar='إعفاء جمركي، لكن حصل حظر غير رسمي على السلع المصرية في فبراير 2025.', tariff_note_ar='0% للصناعي', url=U['maBlock']),
  dict(name='GAFTA', status='سارية', relevance_ar='إطار احتياطي للإعفاء.', tariff_note_ar='0%', url=''),
 ],
 fairs=[dict(name='Africa Food Show Morocco 2026', dates='18–20 نوفمبر 2026 (مصدر آخر 17–19)', city='الدار البيضاء', url=U['afsMA'], relevance_ar='معرضنا الثاني. أكّد الموعد مع MIE Events.')],
 seasons=[
  dict(name_ar='رمضان 2027', period='حوالي 8 فبراير 2027 (تقريبي)', impact_ar='ذروة الحلويات (الشباكية) والطلب على الدهون والعسل والمكسرات.', url=''),
  dict(name_ar='عيد العرش', period='30 يوليو', impact_ar='مناسبة وطنية.', url=''),
  dict(name_ar='موسم الأعراس', period='الصيف', impact_ar='تورتات وحلويات المناسبات.', url=''),
 ],
 unverified=['أسعار رف الكريمة والسبريد في المغرب','أسماء المنافسين الفعليين في الحشوات والجلازات','وضع E171 والتحذير على الأصباغ في المغرب بنص رسمي','الوضع الحالي لتطبيق أجادير على السلع المصرية'],
 rules=MA_RULES)


U.update(dict(
 fdaColors='https://www.fda.gov/forindustry/coloradditives/coloradditiveinventories/ucm115641.htm',
 dyes='https://www.mcdermottlaw.com/insights/bye-bye-bright-dyes-strategies-for-responding-to-fdas-synthetic-food-dye-phase-out/',
 usTariff='https://enterpriseam.com/logistics/2026/07/28/the-us-raised-egypts-tariff-to-12-5-while-cairo-opened-its-market-wider-to-us-cars/',
 arabAm='https://www.arabamerica.com/connecting-to-our-culture-wholesale-distributors-of-middle-eastern-food-products/',
 bakemark='https://www.bakersjournal.com/clearlake-capital-group-acquires-bakemark/',
 pregel='https://pregelamerica.com/pastry-solutions/',
 dawn2='https://www.foodnavigator.com/Article/2026/03/11/puratos-dawn-foods-deal-targets-the-20bn-donut-market/',
 trFta='https://www.mic-cust.com/mic-blog/posts/detail/ad/could-turkey-egypt-fta-be-under-threat/',
 trWorldFood='https://en.amwalalghad.com/?p=217097',
))
US_RULES={}
for c in ['E102','E110','E129','E133']:
    US_RULES[c]=dict(status='warning',note_ar='مسموح حالياً كلون FD&C معتمد بالدفعة (Yellow 5 / Yellow 6 / Red 40 / Blue 1) ويتكتب باسمه على الملصق. FDA معلنة خطة للتخلص من الأصباغ البترولية بنهاية 2026، وتكساس هتطلب عبارة تحذير من 2027. جهّز بديل طبيعي للأصناف المصدّرة لأمريكا.',url=U['dyes'])
for c in ['E122','E104']:
    US_RULES[c]=dict(status='banned',note_ar='مش ضمن ألوان FDA المسموحة في الأغذية. الأصناف دي لازم تتعدل تركيبتها قبل أي شحن لأمريكا.',url=U['fdaColors'])
US_RULES['E120']=dict(status='warning',note_ar='مسموح (Carmine / Cochineal extract) ولازم يتذكر باسمه في المكونات لأنه مسبب حساسية محتمل.',url=U['fdaColors'])
for c in ['E150','E150d','E160','E160a','E160b','E202','E211','E551','E500']:
    US_RULES[c]=dict(status='limits',note_ar='مسموح في أمريكا (لون معفى من الاعتماد أو مادة حافظة/مضافة معترف بها) ضمن الاستخدام الجيد. تأكد من الاسم الأمريكي على الملصق.',url=U['fdaColors'])
US_RULES['GEL']=dict(status='limits',note_ar='مسموح. لو بتبيع لموزعين حلال (وده الأرجح) هتحتاج شهادة حلال لمصدر الجيلاتين.',url=U['fdaColors'])
TR_RULES={}
for c in ['E102','E104','E110','E122','E129']:
    TR_RULES[c]=dict(status='warning',note_ar='تركيا متوافقة غالباً مع لوائح الاتحاد الأوروبي، اللي بتطلب عبارة تحذير للأصباغ الآزو. غير متأكد من النص التركي، راجعه مع المستورد.',url='')
for c in ['E133','E150','E150d','E160','E160a','E160b','E202','E211','E551','E500','E120','GEL']:
    TR_RULES[c]=dict(status='check',note_ar='غالباً مسموح ضمن حدود، لكن ما راجعناش اللائحة التركية. حلال مطلوب عملياً للسوق.',url='')

D['الولايات المتحدة']=dict(code='US',asOf='2026-10-13',
 headline_ar='سوق ضخم لكن الدخول الواقعي ليه عبر موزعي الأغذية الشرق أوسطية والحلال، مش عبر المخابز الأمريكية مباشرة. ابدأ بالسبريد ومخاليط الكيك والجيلي وحشوات الفاكهة بتركيبة من غير أصباغ بترولية.',
 competitors=[
  dict(name='Dawn Foods',origin='الولايات المتحدة',type='multinational',products='مخاليط دونات، جلازات، حشوات، تغطيات',positioning_ar='المسيطر على حشوات وجلازات المخابز. Puratos بتستحوذ عليه (الإغلاق متوقع آخر 2026).',threat='high',url=U['dawn2']),
  dict(name='BakeMark (Westco, BakeSense)',origin='الولايات المتحدة',type='local',products='مخاليط، حشوات، تغطيات',positioning_ar='مصنع وموزع: 29 مركز توزيع و19 ألف عميل. ممكن يكون عميل (موّرد له) مش بس منافس.',threat='high',url=U['bakemark']),
  dict(name='Pregel America',origin='إيطاليا/الولايات المتحدة',type='multinational',products='حلول باستري، حشوات، جلازات',positioning_ar='الشريحة الاحترافية للباتيسري.',threat='medium',url=U['pregel']),
  dict(name='موزعو الأغذية الشرق أوسطية (Sadaf, Ziyad, UBC)',origin='الولايات المتحدة',type='importer',products='علامات خاصة + استيراد من 20+ دولة',positioning_ar='دول قناتنا مش منافسين: بيبيعوا علامتهم الخاصة جنب علامات مستوردة.',threat='low',url=U['arabAm']),
 ],
 prices=[],
 priceSummary_ar='لم نجمع أسعار رف موثقة لأمريكا بعد. الأسعار في القناة الشرق أوسطية بتتحدد مع الموزع على أساس سعر FOB زائد الجمارك (12.5% حالياً) والشحن وهامش الموزع والتاجر. اطلب من أول موزع قائمة أسعار رف لمنتجات مشابهة.',
 shipping=[
  dict(item_ar='تسجيل منشأة FDA',detail_ar='مصنع دمياط لازم يكون مسجّل في FDA Food Facility Registration ويجدد التسجيل كل سنتين (أكتوبر إلى ديسمبر في السنوات الزوجية).',url=''),
  dict(item_ar='Prior Notice',detail_ar='إخطار مسبق لـ FDA قبل وصول كل شحنة.',url=''),
  dict(item_ar='FSVP',detail_ar='المستورد الأمريكي مسؤول عن برنامج التحقق من المورد الأجنبي (FSVP)، وهيطلب منك HACCP وخطة سلامة غذاء وشهاداتك.',url=''),
  dict(item_ar='الملصق',detail_ar='إنجليزي، Nutrition Facts بالشكل الأمريكي، المكونات بالأسماء الأمريكية للألوان (FD&C Yellow No. 5)، وإعلان مسببات الحساسية التسعة ومنها السمسم.',url=U['fdaColors']),
  dict(item_ar='الجمارك',detail_ar='من 24 يوليو 2026 السلع المصرية عليها 12.5% (Section 301)، مع استثناءات لبعض الأغذية غير محددة. أكّد التصنيف مع مخلّص أمريكي.',url=U['usTariff']),
 ],
 certificates=[
  dict(name='FDA Food Facility Registration',required='yes',detail_ar='إلزامي للمصنع المصدّر.',url=''),
  dict(name='HACCP / Preventive Controls',required='yes',detail_ar='يطلبها المستورد ضمن FSVP. شهادات FSSC 22000 وBRCGS بتسهّل جداً.',url=''),
  dict(name='Halal',required='likely',detail_ar='مش إلزامي قانونياً، لكن قناة الموزعين الشرق أوسطية بتطلبه.',url=''),
  dict(name='Kosher',required='likely',detail_ar='مفيد جداً لموزعي المخابز (Bakers Authority مثلاً بيصنف منتجات Kosher).',url=''),
 ],
 tariffs=[dict(hs='كل خطوطنا',desc_ar='منشأ مصري',duty='12.5% (Section 301) فوق التعريفة العادية',vat='لا توجد ضريبة قيمة مضافة فيدرالية',note_ar='بعض الأغذية مستثناة لكن القائمة غير منشورة في المصدر.',url=U['usTariff'])],
 agreements=[dict(name='لا توجد اتفاقية تجارة حرة',status='—',relevance_ar='اتفاقية QIZ مع مصر تخص المنسوجات أساساً ومش بتفيد الأغذية.',tariff_note_ar='12.5%',url=U['usTariff'])],
 fairs=[dict(name='Summer Fancy Food Show',dates='يونيو كل سنة (أكّد تاريخ 2027)',city='نيويورك',url='',relevance_ar='أكبر معرض للأغذية المتخصصة والمستوردة.'),dict(name='IDDBA',dates='يونيو كل سنة (أكّد تاريخ 2027)',city='الولايات المتحدة',url='',relevance_ar='معرض الألبان والمخبوزات والديلي.')],
 seasons=[dict(name_ar='رمضان والعيد',period='فبراير ومارس 2027 (تقريبي)',impact_ar='ذروة قناة الأغذية العربية.',url=''),dict(name_ar='Thanksgiving والكريسماس',period='نوفمبر وديسمبر',impact_ar='موسم الخبز المنزلي ومخاليط الكيك.',url='')],
 unverified=['أسعار الرف في أمريكا','قائمة الأغذية المستثناة من تعريفة 12.5%','تواريخ معارض 2027'],
 rules=US_RULES)
D['تركيا']=dict(code='TR',asOf='2026-10-13',
 headline_ar='تركيا منتج ومصدّر قوي لنفس فئاتنا (البندق، الشوكولاتة، الحلويات)، فالسوق صعب كوجهة بيع. قيمتها لنا كمصدر خامات (البندق) ومعرض WorldFood Istanbul لمقابلة مشترين من آسيا الوسطى والبلقان.',
 competitors=[dict(name='المنتجون الأتراك للحلويات والبندق',origin='تركيا',type='local',products='شوكولاتة، سبريد بندق، حلويات',positioning_ar='منافسون أقوياء محلياً وفي الخليج وأفريقيا.',threat='high',url='')],
 prices=[],priceSummary_ar='لم نجمع أسعاراً لتركيا. السوق مش أولوية بيع.',
 shipping=[dict(item_ar='الاستيراد',detail_ar='لم نراجع إجراءات الاستيراد التركية في هذه الدراسة.',url='')],
 certificates=[dict(name='Halal',required='likely',detail_ar='مطلوب عملياً.',url='')],
 tariffs=[dict(hs='كل خطوطنا',desc_ar='منشأ مصري',duty='تفضيلي بموجب اتفاقية التجارة الحرة مصر–تركيا (سارية من مارس 2007)',vat='حسب الفئة',note_ar='في 2021 انتقد نواب مصريون الاتفاقية، لكن ما فيش إلغاء رسمي في المصدر.',url=U['trFta'])],
 agreements=[dict(name='اتفاقية التجارة الحرة مصر–تركيا',status='سارية (موقعة 2005، نافذة 2007)',relevance_ar='إعفاء جمركي متبادل للسلع الصناعية.',tariff_note_ar='تفضيلي',url=U['trFta'])],
 fairs=[dict(name='WorldFood Istanbul',dates='سبتمبر كل سنة (أكّد 2027)',city='إسطنبول',url=U['trWorldFood'],relevance_ar='شاركت فيه شركات غذاء مصرية في 2025.')],
 seasons=[dict(name_ar='رمضان',period='فبراير 2027 (تقريبي)',impact_ar='موسم الحلويات.',url='')],
 unverified=['لوائح الإضافات التركية','إجراءات الاستيراد وشهادات المطابقة','أسعار المنافسين'],
 rules=TR_RULES)

out = {}
for k, v in D.items():
    rules = v.pop('rules')
    v['compliance'] = compliance(rules)
    v['e171'] = rules.get('E171')
    out[k] = v
json.dump(out, open('/home/claude/research3/dossiers.json','w'), ensure_ascii=False)
for k,v in out.items(): print(k, len(v['competitors']), len(v['prices']), v['compliance']['flagged'], [ (r['code'],r['status'],r['skus']) for r in v['compliance']['rows']][:6])
