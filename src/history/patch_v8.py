import json, re
P='/home/claude/build2/page.html'
p=open(P,encoding='utf-8').read()
def rep(old,new,count=1):
    global p
    assert old in p, old[:80]
    p=p.replace(old,new,count)

# ---- fonts ----
rep('family=Cairo:wght@400;600;700&','family=Baloo+Bhaijaan+2:wght@500;700;800&family=Cairo:wght@400;600;700&')
rep('var FONTS={tajawal:["\'Tajawal\',\'Segoe UI\',Tahoma,sans-serif","\'Cairo\',\'Segoe UI\',Tahoma,sans-serif"]',
    'var FONTS={tajawal:["\'Tajawal\',\'Segoe UI\',Tahoma,sans-serif","\'Baloo Bhaijaan 2\',\'Cairo\',\'Segoe UI\',Tahoma,sans-serif"]')

# ---- brand tokens ----
a=p.index(':root{\n  color-scheme:light;'); b=p.index('*{box-sizing:border-box}')
p=p[:a]+''':root{
  color-scheme:light;
  /* Dr. Baker identity: logo red #990000, cream #EFE6DC, deep maroon shadow */
  --bg:#FBF6F1; --surface:#FFFFFF; --ink:#2A1512; --muted:#7A6560; --line:#EEE2D8;
  --navy:#5C0A0A; --on-navy:#FFF8F2; --navy-muted:#E2C7BD;
  --accent:#5C0A0A; --on-accent:#FFFFFF; --accent-soft:#F6ECE3;
  --brand:#990000; --brand-soft:#FBE7E3; --cream:#EFE6DC;
  --good:#1E7F55; --good-soft:#E3F3EA; --warn:#94590A; --warn-soft:#FAF0DC; --bad:#A83226; --bad-soft:#F8E2DE;
  --font-head:'Baloo Bhaijaan 2','Cairo','Segoe UI',Tahoma,sans-serif; --font-body:'Tajawal','Segoe UI',Tahoma,sans-serif; --fs:16px;
}
:root[data-theme="dark"]{
  color-scheme:dark;
  --bg:#1A1110; --surface:#241817; --ink:#F3E9E2; --muted:#BFA9A1; --line:#3A2A27;
  --navy:#140A09; --on-navy:#FFF8F2; --navy-muted:#BFA9A1;
  --accent:#E8C9B8; --on-accent:#1A1110; --accent-soft:#33221F;
  --brand:#E0574A; --brand-soft:#3D1D1A; --cream:#3A2A27;
  --good:#4CC38A; --good-soft:#163A2B; --warn:#E5A23B; --warn-soft:#3B2D12; --bad:#F28174; --bad-soft:#41201C}
'''+p[b:]
rep('.logo{display:flex;align-items:center;justify-content:center;background:var(--brand);border-radius:12px;padding:12px 14px;min-height:60px}',
    '.logo{display:flex;align-items:center;justify-content:center;background:var(--brand);border-radius:16px;padding:10px 12px;min-height:60px}')
rep('.logo.hasimg{background:#fff}','.logo.hasimg{background:#FFF8F2;box-shadow:0 2px 0 rgba(0,0,0,.25)}')
rep('.logo img{height:40px;width:auto;max-width:170px;object-fit:contain}','.logo img{height:auto;width:100%;max-width:190px;object-fit:contain}')
rep('nav.tabs button[aria-selected="true"]{background:var(--brand);color:#fff}','nav.tabs button[aria-selected="true"]{background:var(--cream);color:var(--brand)}')
rep('nav.tabs button[aria-selected="true"] .ic{background:rgba(255,255,255,.22)}','nav.tabs button[aria-selected="true"] .ic{background:var(--brand);color:#fff}')
rep('.mast{background:var(--navy);','.mast{background:linear-gradient(135deg,var(--brand),var(--navy));')
css=r'''
/* v8 */
.matfair{display:flex;flex-direction:column;gap:10px;border-top:1px solid var(--line);padding-top:14px}
.matgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
.matcard{border:1px solid var(--line);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:8px;background:var(--bg)}
.matcard input{width:100%}
.nowcard{border:2px solid var(--brand);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px;background:var(--surface)}
.nowt{font-family:var(--font-head);font-size:1.12em}
.how{background:var(--accent-soft);border-radius:10px;padding:10px 12px}
.script{display:flex;flex-direction:column;gap:10px;border:1px dashed var(--line);border-radius:12px;padding:12px}
.sstep{display:flex;flex-direction:column;gap:4px;font-size:.92em}
details.obj summary{cursor:pointer;color:var(--brand);font-size:.9em}
.outcome{display:flex;flex-direction:column;gap:8px;border-top:1px solid var(--line);padding-top:10px}
.outcome input{width:100%}
.tl2{display:flex;flex-direction:column}
.tli{display:grid;grid-template-columns:14px 120px 1fr auto;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line);font-size:.9em}
.tli .dot{width:10px;height:10px;border-radius:50%;background:var(--line)}
.tli.done .dot{background:var(--good)} .tli.cur .dot{background:var(--brand);box-shadow:0 0 0 4px var(--brand-soft)}
.tli.done b{text-decoration:line-through;opacity:.6} .tli.off{opacity:.55}
.tli .when{color:var(--muted);font-size:.85em}
@media (max-width:600px){.tli{grid-template-columns:14px 1fr auto}.tli .when{grid-column:2}}
#dMkt{border-top:2px solid var(--brand-soft);padding-top:14px;display:flex;flex-direction:column;gap:14px}
.wlinks{display:flex;gap:8px;flex-wrap:wrap}
'''
rep('/* v7 editions + compact mobile */',css+'\n/* v7 editions + compact mobile */')

# ---- fairs materials panel ----
rep('<div class="grid g2" id="fairFacts"></div>\n  </div>','<div class="grid g2" id="fairFacts"></div>\n  </div>\n  <div class="panel stack" id="matBox"></div>')
rep('  $("fairFacts").innerHTML=fh;','  $("fairFacts").innerHTML=fh;\n  renderMaterials();')

# ---- pipeline tweaks ----
rep('fair:COUNTRY_FAIR[country]||"gm",done:{}});','fair:(country in COUNTRY_FAIR?COUNTRY_FAIR[country]:null),addedAt:todayISO(),done:{}});')
rep('var n=l.fair?nextStep(l):null,nd=','var n=stepsFor(l).length?nextStep(l):null,nd=')
# direct-mode text in stepText
rep('var f=FAIRS[l.fair],n=cleanName(l),fit=l.fit||"",ar=lang==="ar",trade=isTrade(l),fe=ar?f.ar:f.en,k=s.k;',
    'var f=FAIRS[l.fair],direct=!f;if(direct)f={name:ar0(lang)?"المكالمة":"our call",ar:"مكالمة فيديو 20 دقيقة",en:"a 20-minute video call"};var n=cleanName(l),fit=l.fit||"",ar=lang==="ar",trade=isTrade(l),fe=ar?f.ar:f.en,k=s.k;')
p=p.replace('function stepText(l,s,lang){','function ar0(x){return x==="ar";}\nfunction stepText(l,s,lang){',1)
rep('We will be at "+fe+" and would be glad to meet. Will you be attending?"','"+(direct?"Would you be open to "+fe+" next week?":"We will be at "+fe+" and would be glad to meet. Will you be attending?")')
rep('سنكون في "+fe+" ويسعدنا لقاؤكم. هل ستحضرون؟"','"+(direct?"هل يناسبكم "+fe+" الأسبوع القادم؟":"سنكون في "+fe+" ويسعدنا لقاؤكم. هل ستحضرون؟")')
rep('Would a short meeting at "+fe+" suit you?"','"+(direct?"Would "+fe+" next week suit you?":"Would a short meeting at "+fe+" suit you?")')
rep('هل يناسبكم لقاء قصير في "+fe+"؟"','"+(direct?"هل تناسبكم "+fe+" الأسبوع القادم؟":"هل يناسبكم لقاء قصير في "+fe+"؟")')
rep('Confirming our meeting at "+fe+" on','Confirming "+(direct?fe:"our meeting at "+fe)+" on')

# ---- distributor detail: marketing plan ----
rep("  h+='<div class=\"stack\"><h3>سجل التواصل</h3>","  h+='<div id=\"dMkt\"></div>';\n  h+='<div class=\"stack\"><h3>سجل التواصل</h3>")
rep('  box.innerHTML=h;\n  $("dClose").addEventListener("click",function(){dSel=null;renderDist();});','  box.innerHTML=h;\n  renderMkt(d);\n  $("dClose").addEventListener("click",function(){dSel=null;renderDist();});')

# ---- db: fair materials ----
rep('  try{db.collection("market").onSnapshot(','  try{db.collection("fairs").onSnapshot(function(snap){snap.docs.forEach(function(s){var v=s.data();if(v&&v.items)MAT[s.id]=JSON.parse(JSON.stringify(v.items));});renderMaterials();},function(){});}catch(e){}\n  try{db.collection("market").onSnapshot(')

# ---- countries: world + report ----
rep('var c=byName($("repCountry").value),dz=DOSS[c.country],b=c.basics||{},sc=score(c),',
    'var c=byName($("repCountry").value)||worldC($("repCountry").value),dz=DOSS[c.country],b=c.basics||{},sc=c.scores?score(c):null,')
rep("'<div class=\"rkpis\"><div><b>'+sc.toFixed(1)+' / 10</b>","'<div class=\"rkpis\"><div><b>'+(sc==null?'—':sc.toFixed(1)+' / 10')+'</b>")
rep('  if(!dz)H+=','  if(!c.scores)H+=worldPanel(c);\n  else if(!dz)H+=')
rep('var wb=book(),b=c.basics||{},sc=score(c);','var wb=book(),b=c.basics||{},sc=c.scores?score(c):0;')
rep('$("dlReport").addEventListener("click",function(){var c=byName($("repCountry").value);','$("dlReport").addEventListener("click",function(){var c=byName($("repCountry").value)||worldC($("repCountry").value);')
# report book guard for CRIT scores
p=p.replace('CRIT.map(function(k){return [k[1],c.scores[k[0]]];})','CRIT.map(function(k){return [k[1],c.scores?c.scores[k[0]]:""];})')

init_old='''  var names=C.map(function(c){return c.country;});
  $("repCountry").innerHTML=names.map(function(n){return "<option>"+esc(n)+"</option>";}).join("");'''
init_new='''  var names=C.map(function(c){return c.country;});
  var extra=Object.keys(DOSS).concat(Object.keys(DATA.leads)).filter(function(n,i,a){return names.indexOf(n)<0&&a.indexOf(n)===i;});
  var known=names.concat(extra),fullN=Object.keys(DOSS);
  var enKnown=C.map(function(c){return c.country_en;}).concat(["United States","Türkiye","Turkey"]);
  $("repCountry").innerHTML='<optgroup label="تقرير كامل">'+fullN.map(function(n){return "<option>"+esc(n)+"</option>";}).join("")+'</optgroup>'
   +'<optgroup label="دراسة أولية">'+known.filter(function(n){return fullN.indexOf(n)<0;}).map(function(n){return "<option>"+esc(n)+"</option>";}).join("")+'</optgroup>'
   +'<optgroup label="كل دول العالم">'+WORLD.filter(function(w){return enKnown.indexOf(w[1])<0&&known.indexOf(w[0])<0;}).map(function(w){return '<option value="'+esc(w[0])+'">'+esc(w[0])+'</option>';}).join("")+'</optgroup>';
  names=known;'''
rep(init_old,init_new)

# world helpers + v8 module before refreshAll
world_js=r'''
var WORLD=DATA.world||[];
function worldC(nm){var w=WORLD.filter(function(x){return x[0]===nm;})[0]||[nm,nm,"",""];var dz=DOSS[nm];
  return {country:nm,country_en:w[1]||nm,iso3:w[3],scores:null,verdict:null,basics:{},egyptExportsUsdM:{},worldImports:[],fairs:[],sources:[],regulatory:[],tariffNote:"",risk:"غير مدروس بعد",notes:"",scoreBasis:dz?dz.headline_ar:"دولة جديدة لسه ما اتدرستش."};}
function worldPanel(c){
  var en=c.country_en||"",slug=en.toLowerCase().replace(/[^a-z]+/g,"-").replace(/^-|-$/g,""),te="https://tradingeconomics.com/egypt/exports/"+slug,
   wits=c.iso3?"https://wits.worldbank.org/CountryProfile/en/Country/"+c.iso3+"/Year/LTST/Summary":"https://wits.worldbank.org",
   tr="https://trendeconomy.com/data/import_h2/"+en.replace(/[^A-Za-z]/g,"")+"/1806";
  var prompt="اعملي دراسة كاملة لدولة "+c.country+" ("+en+") لـ Dr. Baker زي تقرير السعودية: حجم السوق وصادرات مصر، المنافسين وأسعارهم، الألوان والمكونات الممنوعة من منتجاتنا، الشحن والشهادات، الجمارك والاتفاقيات مع مصر، المعارض والمواسم، و10 عملاء محتملين حقيقيين.";
  var leadsN=leadCount(c.country);
  return '<div class="panel stack"><div class="eyebrow">NEW MARKET</div><h3>ابدئي دراسة '+esc(c.country)+'</h3>'
   +(DOSS[c.country]?'':'<div class="small">الدولة دي لسه ما اتدرستش. الروابط دي بتفتح أرقام التجارة الأساسية فوراً:</div>')
   +'<div class="wlinks"><a class="btn sm" href="'+esc(te)+'" target="_blank" rel="noopener">صادرات مصر للدولة (Trading Economics)</a><a class="btn sm" href="'+esc(wits)+'" target="_blank" rel="noopener">ملف الدولة (WITS)</a><a class="btn sm" href="'+esc(tr)+'" target="_blank" rel="noopener">واردات الشوكولاتة HS1806</a><a class="btn sm" href="https://www.trademap.org" target="_blank" rel="noopener">Trade Map</a><a class="btn sm" href="https://gain.fas.usda.gov" target="_blank" rel="noopener">تقارير USDA GAIN</a></div>'
   +'<ol class="clean small"><li>حجم واردات الدولة من خطوطنا (1806، 1901، 2106، 0401، 2007) وأكبر الموردين.</li><li>هل فيه اتفاقية مع مصر تعفي من الجمارك؟</li><li>الألوان والمكونات الممنوعة، ولغة الملصق، وشرط الحلال.</li><li>المنافسين على الرف وأسعارهم.</li><li>المعارض والمواسم، وأول 10 موزعين.</li></ol>'
   +(leadsN?'<div class="small"><b>'+leadsN+' عميل محتمل جاهزين</b> للدولة دي في تاب العملاء.</div>':'')
   +'<div class="row"><button class="btn primary" type="button" id="cpPrompt">انسخي طلب الدراسة</button><span class="small muted" id="cpMsg">ابعتيه لي في الشات وأنا أعمل التقرير الكامل.</span></div></div>';
}
document.addEventListener("click",function(e){if(e.target&&e.target.id==="cpPrompt"){var nm=$("repCountry").value,c=byName(nm)||worldC(nm);var t="اعملي دراسة كاملة لدولة "+c.country+" ("+c.country_en+") لـ Dr. Baker زي تقرير السعودية: حجم السوق وصادرات مصر، المنافسين وأسعارهم، الألوان والمكونات الممنوعة من منتجاتنا، الشحن والشهادات، الجمارك والاتفاقيات مع مصر، المعارض والمواسم، و10 عملاء محتملين حقيقيين.";try{navigator.clipboard.writeText(t).then(function(){$("cpMsg").textContent="اتنسخ. ابعتيه لي في الشات.";},function(){$("cpMsg").textContent=t;});}catch(x){$("cpMsg").textContent=t;}}});
'''
rep('function refreshAll(){',world_js+open('/home/claude/build2/v8.js',encoding='utf-8').read()+'\nfunction refreshAll(){')
# generate(): US leads auto-added once (new country in DATA.leads)
rep('if(!leads){leads=seedPartners();["السعودية","الإمارات","الأردن","كينيا"].forEach(generate);persist();}',
    'if(!leads){leads=seedPartners();["السعودية","الإمارات","الأردن","كينيا"].forEach(generate);persist();}\nif(!load("bk_us_added",false)){generate("الولايات المتحدة");save("bk_us_added",true);}')
open(P,'w',encoding='utf-8').write(p)
print("ok")
