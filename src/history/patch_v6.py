import re, json
P='/home/claude/build2/page.html'
p=open(P,encoding='utf-8').read()

# CSS
css=r'''
/* v6 market + distributors */
.mkt3{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}
.mcard{border:1px solid var(--line);border-radius:14px;padding:16px;background:var(--surface);display:flex;flex-direction:column;gap:10px;min-width:0}
.mh{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.mh b{font-family:var(--font-head);font-size:1.05em}
table.mt{min-width:0}
table.mt td,table.mt th{padding:6px 4px}
.num{font-variant-numeric:tabular-nums;white-space:nowrap}
.fgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.fgrid .wide{grid-column:1/-1}
.fgrid input,.fgrid select,.fgrid textarea{width:100%}
tr.drow{cursor:pointer}
tr.drow:hover td{background:var(--accent-soft)}
tr.drow.sel td{background:var(--brand-soft)}
'''
p=p.replace('@media (prefers-reduced-motion:no-preference)',css+'\n@media (prefers-reduced-motion:no-preference)',1)

# paper: replace old snapshot panel with market box
a=p.index('  <div class="panel stack"><div class="row sp"><h2>نبض السوق</h2>')
b=p.index('\n',a)
p=p[:a]+'  <div class="panel stack" id="mktBox"></div><div class="small muted" id="dlNote0"></div>'+p[b:]
# remove stale note + KPI order: keep
# renderPaper: snapshot rendering -> renderMarket
a=p.index('  $("snap").innerHTML=NEWS.snapshot.map(function(x){')
b=p.index('}).join("");',a)+len('}).join("");')
p=p[:a]+'  renderMarket();'+p[b:]
old='var sg=NEWS.snapshot.filter(function(x){return x.item_en.indexOf("raw sugar")>=0;})[0],eg=NEWS.snapshot.filter(function(x){return x.item_en==="USD/EGP";})[0];'
assert old in p
p=p.replace(old,'var sgc=M.comm.filter(function(c){return c.k==="sugar";})[0],usd=M.fx.rows.filter(function(r){return r.c==="USD";})[0],sg={value:sgc?sgc.v+" "+sgc.u:"",change:sgc?(sgc.pct>0?"+":"")+sgc.pct+"% اليوم":""},eg={value:usd?n2(usd.sell):""};')
p=p.replace("'<tr><td>السكر الخام '+esc(sg?sg.value:\"\")+' ('+esc(sg?sg.change:\"\")+')، أعلى مستوى منذ فبراير 2025</td>","'<tr><td>السكر الخام '+esc(sg.value)+' ('+esc(sg.change)+')، فوق 20 سنت وأعلى مستوى منذ فبراير 2025</td>")
p=p.replace("'<tr><td>الدولار '+esc(eg?eg.value:\"\")+' جنيه، وفائدة CBE 19%</td>","'<tr><td>الدولار '+esc(eg.value)+' جنيه بيع في البنك المركزي، وفائدة CBE 19%</td>")
# stale banner uses NEWS age; market has its own
p=p.replace('if(age>=1)$("paperStale").textContent="الأخبار والأسعار هنا من "','if(age>=1)$("paperStale").textContent="أخبار الأقسام التحت من "')
p=p.replace('(قبل "+age+" يوم). اطلبي مني تحديث الجريدة قبل ما تعتمدي على أي رقم."','(قبل "+age+" يوم). السوق والأخبار اللي فوق محدثة بتاريخ "+M.asOf+"."')
# remove old dlPaper handler
a=p.index('$("dlPaper").addEventListener("click",function(){')
b=p.index('$("dlScreen").addEventListener',a)
p=p[:a]+p[b:]
p=p.replace('["dlPaper","dlPlan","dlLeads","dlScreen","dlReport"]','["dlPlan","dlLeads","dlScreen","dlReport","dDl"]')

# market + dist modules (market before newspaper; dist after distributor calc init)
p=p.replace('/* ---------- newspaper ---------- */',open('/home/claude/build2/market_v6.js',encoding='utf-8').read()+'\n/* ---------- newspaper ---------- */',1)

# DIST section HTML
a=p.index('<section id="p-dist" class="stack" hidden>')
b=p.index('<div class="panel stack">',a)
p=p[:a]+'''<section id="p-dist" class="stack" hidden>
  <div class="panel stack">
    <div class="row sp"><div class="row"><h2>متابعة الموزعين والوكلاء</h2><span id="dMode"></span></div>
      <div class="row"><label>الدولة<select id="dFlt"><option value="all">كل الدول</option></select></label><button class="btn primary" id="dAdd" type="button" style="align-self:flex-end">موزع جديد</button><button class="btn" id="dDl" type="button" style="align-self:flex-end">تنزيل (Excel)</button></div></div>
    <div id="dKpis"></div>
    <div class="warnbox" id="dErr" hidden></div>
    <div id="dList"></div>
    <div class="small muted" id="dNote">مؤشر الصحة من 100: وتيرة المشتريات مقابل المستهدف (40)، أيام من آخر طلبية (25)، المستحقات من حد الائتمان (20)، تغطية المخزون (15). الأرقام بتدخلوها انتو، ولما نربط Odoo هتيجي أوتوماتيك.</div>
  </div>
  <div class="panel stack" id="dDetail" hidden></div>
  <details class="panel"><summary style="cursor:pointer;font-family:var(--font-head);font-weight:700">حاسبة الدعم التسويقي وقواعده</summary><div class="stack" style="margin-top:14px">
  '''+p[b:]
# close details before </section> of dist
a=p.index('<section id="p-dist"')
e=p.index('</section>',a)
p=p[:e]+'</div></details>\n'+p[e:]
# dist js after calc init line
anchor='function refreshAll(){'
p=p.replace(anchor,open('/home/claude/build2/dist_v6.js',encoding='utf-8').read()+'\n'+anchor,1)
# render dist on init
p=p.replace('renderWeights();renderMarkets();renderReport();sStatus();calc();refreshAll();','renderWeights();renderMarkets();renderReport();sStatus();calc();refreshAll();renderDist();')
# nav label
p=p.replace('<span class="ic">07</span>الموزعين</button>','<span class="ic">07</span>متابعة الموزعين</button>')
p=p.replace('dist:["DISTRIBUTOR PLAYBOOK","كيف نتعامل مع الموزع؟","متى ندعم، وبكام، وبأي شروط."]','dist:["DISTRIBUTOR MANAGEMENT","متابعة الموزعين","مين ماشي كويس، مين محتاج تدخل، وإيه الخطوة الجاية مع كل موزع."]')
p=p.replace('paper:["DAILY BRIEF · نبض السوق"','paper:["DAILY BRIEF · '+'"+todayISO()')

# new idea first
idea='''var IDEAS=[
 {news:"صادرات الشوكولاتة المصرية تقفز 98% إلى 301 مليون دولار في 8 أشهر",sec:"gulf_africa",goal:"aw",
  angle:"الشوكولاتة المصرية بقت رقم صعب",
  on:{ch:"LinkedIn (صفحة الشركة + حساب المدير)",fmt:"بوست نصي + صورة منتج شوكولاتة أو Mirror Glaze",aud:"المستوردون والموزعون في الخليج وأفريقيا",lang:"ltr",
   copy:"Egyptian chocolate exports nearly doubled this year: $301 million in eight months, up 98%.\\n\\nBuyers across the Gulf and Africa are choosing Egyptian quality at a competitive price. Dr. Baker's chocolate spreads, fillings and glazes are part of that shift, made in Damietta and Madinah.\\n\\nMeet us at Gulfood Manufacturing, Dubai, 3–5 Nov.\\n\\n#MadeInEgypt #Chocolate #GulfoodManufacturing",
   note:"الرقم من تقرير المجلس التصديري للصناعات الغذائية (Banker News، 9 أكتوبر). الرابط في أول كومنت."},
  off:{team:"المبيعات",title:"اتصل بموزعي الخليج بعرض خط الشوكولاتة",detail:"استخدم الرقم في المكالمة: الطلب على الشوكولاتة المصرية بيكبر. اعرض عينة Chunky Spread وMirror Glaze شوكولاتة قبل المعرض."}},
'''
p=p.replace('var IDEAS=[\n',idea,1)
p=p.replace('function ideaIndex(){return ((Math.round((utc(todayISO())-utc("2026-10-13"))/DAY)','function ideaIndex(){return ((Math.round((utc(todayISO())-utc("2026-10-13"))/DAY)')
open(P,'w',encoding='utf-8').write(p)
print('ok')
