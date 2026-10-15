import re, json
p = open('/home/claude/build2/page.html', encoding='utf-8').read()

# ---------------- CSS additions ----------------
css_add = r'''
/* report v5 */
.rep-top{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);padding-block:10px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:10px}
.rep-ctrl{display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;justify-content:space-between}
.secnav{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}
.secnav a{font-size:.82em;white-space:nowrap;text-decoration:none;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:2px 12px;background:var(--surface)}
.secnav a:hover{color:var(--ink);border-color:var(--ink)}
.rhero{background:var(--navy);color:var(--on-navy);border-radius:16px;padding:26px;display:grid;gap:16px}
.rhero h2{font-size:1.9em;color:var(--on-navy)}
.rhero p{color:var(--navy-muted);max-width:70ch}
.rhero .eyebrow{color:var(--navy-muted)}
.rkpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:rgba(255,255,255,.12);border-radius:12px;overflow:hidden}
.rkpis>div{background:var(--navy);padding:12px 14px;display:flex;flex-direction:column;gap:2px}
.rkpis b{font-family:var(--font-head);font-size:1.35em;line-height:1.3;font-variant-numeric:tabular-nums}
.rkpis span{font-size:.8em;color:var(--navy-muted)}
.rsec{display:flex;flex-direction:column;gap:12px;scroll-margin-top:140px}
.rsec>header{display:flex;flex-direction:column;gap:2px}
.rsec>header h2{font-size:1.3em}
.rsec>header p{color:var(--muted);font-size:.9em;max-width:75ch}
.cite{font-size:.72em;vertical-align:super;text-decoration:none;color:var(--brand);font-weight:700;margin-inline-start:2px}
.pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:1px 10px;font-size:.78em;font-weight:700;white-space:nowrap}
.pill::before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor}
.p-banned{background:var(--bad-soft);color:var(--bad)} .p-halal{background:var(--warn-soft);color:var(--warn)}
.p-warning{background:var(--warn-soft);color:var(--warn)} .p-check{background:var(--accent-soft);color:var(--muted)}
.p-limits{background:var(--good-soft);color:var(--good)} .p-high{background:var(--bad-soft);color:var(--bad)}
.p-medium{background:var(--warn-soft);color:var(--warn)} .p-low{background:var(--good-soft);color:var(--good)}
.p-yes{background:var(--bad-soft);color:var(--bad)} .p-likely{background:var(--warn-soft);color:var(--warn)} .p-no{background:var(--good-soft);color:var(--good)} .p-unclear{background:var(--accent-soft);color:var(--muted)}
.cstat{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}
.cstat>div{border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--surface)}
.cstat b{display:block;font-family:var(--font-head);font-size:1.6em;font-variant-numeric:tabular-nums;line-height:1.3}
.cstat span{font-size:.82em;color:var(--muted)}
.prow{display:grid;grid-template-columns:minmax(140px,1.4fr) 2fr 70px;gap:10px;align-items:center;padding:6px 0;border-bottom:1px solid var(--line);font-size:.9em}
.prow .bar{height:12px}
.prow .num{font-variant-numeric:tabular-nums;text-align:end;direction:ltr}
.pcat{font-family:var(--font-head);font-weight:700;margin-top:10px;font-size:.92em}
.steps{counter-reset:s;display:flex;flex-direction:column;gap:0;margin:0;padding:0;list-style:none}
.steps li{counter-increment:s;display:grid;grid-template-columns:34px 1fr;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}
.steps li::before{content:counter(s);width:28px;height:28px;border-radius:50%;background:var(--accent-soft);color:var(--ink);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85em;font-variant-numeric:tabular-nums}
.tline{display:flex;flex-direction:column}
.tline>div{display:grid;grid-template-columns:150px 1fr;gap:14px;padding:10px 0;border-bottom:1px solid var(--line)}
.tline .when{font-size:.85em;color:var(--muted);font-variant-numeric:tabular-nums}
.srcs{margin:0;padding-inline-start:22px;font-size:.84em;display:flex;flex-direction:column;gap:4px}
.srcs a{direction:ltr;overflow-wrap:anywhere}
details.sku summary{cursor:pointer;color:var(--accent);font-size:.82em}
details.sku ul{margin:6px 0 0;padding-inline-start:18px;font-size:.82em;max-height:220px;overflow:auto;direction:ltr;text-align:left}
/* daily idea */
.idea{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
.idea .card2{border:1px solid var(--line);border-radius:14px;padding:18px;background:var(--surface);display:flex;flex-direction:column;gap:10px;min-width:0}
.idea .card2.on{border-top:4px solid var(--brand)} .idea .card2.off{border-top:4px solid var(--navy)}
.copybox{white-space:pre-wrap;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px;font-size:.9em;line-height:1.75}
.copybox[dir="ltr"]{text-align:left}
.newsref{font-size:.82em;color:var(--muted);border-inline-start:3px solid var(--line);padding-inline-start:10px}
.today3{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
.today3 button{all:unset;cursor:pointer;border:1px solid var(--line);border-radius:14px;padding:16px;background:var(--surface);display:flex;flex-direction:column;gap:6px}
.today3 button:hover{border-color:var(--ink)}
.today3 button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.today3 .k{font-size:.74em;font-weight:700;letter-spacing:.06em;color:var(--brand)}
.today3 .t{font-family:var(--font-head);font-weight:700;line-height:1.5}
.today3 .s{font-size:.85em;color:var(--muted)}
@media (max-width:600px){.tline>div{grid-template-columns:1fr;gap:2px}.prow{grid-template-columns:1fr 1fr 60px}}
'''
p = p.replace('@media (prefers-reduced-motion:no-preference)', css_add + '\n@media (prefers-reduced-motion:no-preference)', 1)

# ---------------- report section HTML ----------------
a = p.index('<!-- REPORT -->'); b = p.index('<!-- DIST -->')
p = p[:a] + '''<!-- REPORT -->
<section id="p-report" class="stack" hidden>
  <div class="rep-top">
    <div class="rep-ctrl">
      <label>الدولة<select id="repCountry"></select></label>
      <div class="row"><button class="btn primary" id="dlReport" type="button">تنزيل التقرير (Excel)</button><button class="btn" id="goLeads" type="button">عملاء الدولة</button></div>
    </div>
    <nav class="secnav" id="secnav" aria-label="أقسام التقرير"></nav>
    <span class="small muted" id="dlNote3"></span>
  </div>
  <div id="repBody" class="stack" style="gap:34px"></div>
</section>

''' + p[b:]

# ---------------- daily idea panel ----------------
p = p.replace('''  <div id="days" class="panel"></div>''', '''  <div class="panel stack" id="ideaBox"></div>
  <div id="days" class="panel"></div>''')
# today strip on paper
p = p.replace('''  <div id="paperStale" class="note" hidden></div>''', '''  <div class="today3" id="today3"></div>
  <div id="paperStale" class="note" hidden></div>''')

# ---------------- JS: replace report renderer ----------------
a = p.index('/* ---------- country report ---------- */'); b = p.index('/* ---------- distributor calc ---------- */')
js_report = open('/home/claude/build2/report_v5.js', encoding='utf-8').read()
p = p[:a] + js_report + '\n' + p[b:]

# ---------------- reportBook: extend ----------------
p = p.replace('''  var L=leads.filter(function(l){return l.country===c.country;});
  if(L.length){''', '''  var dz=DOSS[c.country];
  if(dz){
    XLSX.utils.book_append_sheet(wb,sheet([["المنافس","المنشأ","النوع","المنتجات","التموضع","درجة التهديد","المصدر"]].concat(dz.competitors.map(function(x){return [x.name,x.origin,x.type,x.products,x.positioning_ar,THREAT[x.threat]||x.threat,x.url];})),[28,14,14,30,60,10,50]),"المنافسون");
    XLSX.utils.book_append_sheet(wb,sheet([["الفئة","العلامة","المنتج","العبوة","السعر المحلي","العملة","السعر $","$ لكل لتر/كجم","القناة","تاريخ الرصد","المصدر"]].concat(dz.prices.map(function(x){return [x.category_ar,x.brand,x.product,x.pack,x.price_local,x.currency,x.price_usd,x.per_unit_usd,x.channel,x.date,x.url];})).concat([[],["قراءة الأسعار",dz.priceSummary_ar]]),[14,18,34,10,12,8,10,14,10,12,50]),"أسعار المنافسين");
    var cr=[["الإضافة","الاسم","الحالة","كود الصنف","اسم الصنف","الفئة","الإجراء","المصدر"]];
    dz.compliance.rows.forEach(function(r){r.list.forEach(function(s){cr.push([r.code,r.name,STAT[r.status][0],s[0],s[1],s[2],r.note_ar,r.url]);});});
    XLSX.utils.book_append_sheet(wb,sheet(cr,[10,20,16,14,40,20,80,50]),"امتثال المكونات");
    XLSX.utils.book_append_sheet(wb,sheet([["البند","التفاصيل","المصدر"]].concat(dz.shipping.map(function(x){return [x.item_ar,x.detail_ar,x.url];})),[24,100,50]),"الشحن والتخليص");
    XLSX.utils.book_append_sheet(wb,sheet([["الشهادة","مطلوبة؟","التفاصيل","المصدر"]].concat(dz.certificates.map(function(x){return [x.name,REQ[x.required]||x.required,x.detail_ar,x.url];})),[34,12,80,50]),"الشهادات");
    XLSX.utils.book_append_sheet(wb,sheet([["البند","الحالة","الأثر","الجمارك","المصدر"]].concat(dz.agreements.map(function(x){return [x.name,x.status,x.relevance_ar,x.tariff_note_ar,x.url];})).concat(dz.tariffs.map(function(x){return ["تعريفة: "+x.hs,x.duty,x.note_ar,x.vat,x.url];})),[26,30,80,24,50]),"الجمارك والاتفاقيات");
    XLSX.utils.book_append_sheet(wb,sheet([["النوع","الاسم","التوقيت","المكان/الأثر","المصدر"]].concat(dz.fairs.map(function(x){return ["معرض",x.name,x.dates,x.city+" · "+x.relevance_ar,x.url];})).concat(dz.seasons.map(function(x){return ["موسم",x.name_ar,x.period,x.impact_ar,x.url];})),[10,30,30,80,50]),"المعارض والمواسم");
    XLSX.utils.book_append_sheet(wb,sheet([["لم نتأكد منه"]].concat(dz.unverified.map(function(x){return [x];})),[100]),"فجوات");
  }
  var L=leads.filter(function(l){return l.country===c.country;});
  if(L.length){''')

# ---------------- daily ideas JS ----------------
js_idea = open('/home/claude/build2/ideas_v5.js', encoding='utf-8').read()
p = p.replace('/* ---------- newspaper ---------- */', js_idea + '\n/* ---------- newspaper ---------- */')
p = p.replace('function refreshAll(){renderPaper();renderFairs();renderDaily();renderBoard();renderDetail();}',
              'function refreshAll(){renderPaper();renderToday();renderIdea();renderFairs();renderDaily();renderBoard();renderDetail();}')
# markets: full dossier badge
p = p.replace('''h+='<tr><td><b>'+esc(c.country)+'</b></td>''', '''h+='<tr><td><b>'+esc(c.country)+'</b>'+(DOSS[c.country]?' <span class="tag t-brand">تقرير كامل</span>':'')+'</td>''')
open('/home/claude/build2/page.html', 'w', encoding='utf-8').write(p)
print('ok', len(p))
