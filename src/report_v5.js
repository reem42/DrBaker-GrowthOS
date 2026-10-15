/* ---------- country report (v5: dossier) ---------- */
var DOSS=DATA.doss||{};
var THREAT={high:"عالي",medium:"متوسط",low:"منخفض"};
var STAT={banned:["ممنوع","p-banned"],halal:["مراجعة حلال","p-halal"],warning:["مسموح بعبارة تحذير","p-warning"],check:["يحتاج تأكيد","p-check"],limits:["مسموح ضمن حدود","p-limits"]};
var REQ={yes:"إلزامية",likely:"غالباً",no:"غير إلزامية",unclear:"غير واضح"};
var TYPE={multinational:"عالمي",regional:"إقليمي",local:"محلي",importer:"مستورد"};
var SRC=[],SRCI={};
function cite(u){if(!u)return "";if(SRCI[u]==null){SRC.push(u);SRCI[u]=SRC.length;}return '<a class="cite" href="'+esc(u)+'" target="_blank" rel="noopener" title="'+esc(host(u))+'">['+SRCI[u]+']</a>';}
function bars(rows,max){return rows.map(function(r){return '<div><div class="row sp"><span>'+r[0]+'</span><span class="small" style="font-variant-numeric:tabular-nums">'+r[1]+'</span></div><div class="bar"><i style="width:'+Math.min(100,r[2]/max*100)+'%"></i></div></div>';}).join("");}
function sec(id,eye,title,sub,body){return '<section class="rsec" id="r-'+id+'"><header><div class="eyebrow">'+eye+'</div><h2>'+title+'</h2>'+(sub?'<p>'+sub+'</p>':'')+'</header>'+body+'</section>';}
function nextFairOf(c,dz){
  var best=null;
  var list=(dz?dz.fairs.map(function(f){return {n:f.name,d:f.dates}; }):[]).concat((c.fairs||[]).map(function(f){return {n:f.name,d:f.date};}));
  list.forEach(function(f){var m=/(\d{4}-\d{2}-\d{2})/.exec(f.d||"");var iso=m?m[1]:null;
    if(!iso){var mm=/(\d{1,2})\s*[–-]\s*\d{1,2}\s+(\S+)\s+(\d{4})/.exec(f.d||"");if(mm){var mi=MN.indexOf(mm[2]);if(mi>=0)iso=mm[3]+"-"+String(mi+1).padStart(2,"0")+"-"+String(mm[1]).padStart(2,"0");}}
    if(iso){var dd=daysTo(iso);if(dd>=0&&(!best||dd<best.dd))best={n:f.n,dd:dd};}});
  return best;
}
function renderReport(){
  SRC=[];SRCI={};
  var c=byName($("repCountry").value),dz=DOSS[c.country],b=c.basics||{},sc=score(c),rk=ranked().map(function(x){return x.c.country;}).indexOf(c.country)+1,v=VERD[c.verdict]||["",""];
  var e=c.egyptExportsUsdM||{},nf=nextFairOf(c,dz),H="",nav=[];
  function add(id,label,html){nav.push([id,label]);H+=html;}
  /* hero */
  var comp=dz?dz.compliance:null;
  H+='<div class="rhero"><div class="stack" style="gap:6px"><div class="eyebrow">COUNTRY REPORT · '+esc(c.country_en)+(dz?' · '+esc(dz.asOf):'')+'</div><div class="row" style="gap:12px"><h2>'+esc(c.country)+'</h2><span class="tag '+v[1]+'">قرار الدراسة: '+v[0]+'</span></div><p>'+esc(dz?dz.headline_ar:(c.scoreBasis||""))+'</p></div>'
   +'<div class="rkpis"><div><b>'+sc.toFixed(1)+' / 10</b><span>نقاط الجاذبية (الترتيب '+rk+' من '+C.length+')</span></div>'
   +'<div><b>'+(e.total!=null?'$'+fmt(e.total)+'M':'غير متاح')+'</b><span>صادرات مصر للدولة '+(e.year||"")+'</span></div>'
   +'<div><b>'+esc(b.population||"غير متاح")+'</b><span>السكان</span></div>'
   +(comp?'<div><b>'+comp.flagged+' / '+comp.total+'</b><span>صنف يحتاج إجراء قبل الشحن</span></div>':'')
   +'<div><b>'+(nf?nf.dd+' يوم':'لا يوجد')+'</b><span>'+(nf?esc(nf.n):'معرض قريب مؤكد')+'</span></div></div></div>';
  if(!dz)H+='<div class="note">التقرير الكامل (منافسين، أسعار، امتثال المكونات، شحن، شهادات) متاح حالياً لـ 6 دول: '+Object.keys(DOSS).join("، ")+'. الدولة دي فيها بيانات التجارة واللوائح الأساسية بس. اطلبي مني أكمّلها.</div>';
  /* trade */
  var ch=e.byChapter||{},rows=[],mx=1;
  Object.keys(ch).forEach(function(k){if(ch[k]!=null&&ch[k]>mx)mx=ch[k];});
  Object.keys(ch).forEach(function(k){rows.push([(CH[k]||k)+' <span class="muted small">(HS'+k+')</span>',ch[k]==null?"غير ظاهر":ch[k],ch[k]||0]);});
  rows.sort(function(a,b){return b[2]-a[2];});
  var wi=c.worldImports||[];
  var srcT=(c.sources||[]).filter(function(s){return /^https?:/.test(s);}).slice(0,3).map(cite).join("");
  add("trade","التجارة",sec("trade","TRADE FLOWS","التجارة: صادرات مصر وواردات الدولة","بنفس منطق Trade Map: صادرات مصر للدولة حسب الفصل، وواردات الدولة من خطوط Dr. Baker مع أكبر الموردين."+srcT,
    '<div class="grid g2"><div class="panel stack"><h3>صادرات مصر حسب الفصل ('+(e.year||"")+'، مليون $)</h3>'+(rows.length?bars(rows,mx):'<div class="muted small">غير متاح</div>')+'<div class="muted small">"غير ظاهر" يعني خارج أعلى الفصول في المصدر.</div></div>'
    +'<div class="panel stack"><h3>المخاطر</h3><div class="small">'+esc(c.risk||"غير متاح")+'</div></div></div>'
    +'<div class="panel"><div class="tblwrap"><table><thead><tr><th>الخط</th><th>HS</th><th>الواردات (M$)</th><th>السنة</th><th>أكبر الموردين</th></tr></thead><tbody>'
    +(wi.length?wi.map(function(w){return '<tr><td>'+esc(hsLabel(w.hs))+'</td><td dir="ltr" style="text-align:start">'+esc(w.hs)+'</td><td style="font-variant-numeric:tabular-nums">'+(w.usdM==null?'غير متاح':w.usdM)+'</td><td>'+(w.year||"")+'</td><td class="small" dir="ltr" style="text-align:start">'+esc(w.topSuppliers||"")+'</td></tr>';}).join(""):'<tr><td colspan="5" class="muted">مفيش بيانات واردات مجمّعة.</td></tr>')
    +'</tbody></table></div></div>'));
  if(dz){
    /* competitors */
    add("comp","المنافسون",sec("comp","COMPETITION","مين بيبيع في السوق ده","منافسون رصدناهم على الرفوف أو في مصادر الشركات. درجة التهديد تقديرنا لقربهم من منتجات Dr. Baker.",
      '<div class="panel"><div class="tblwrap"><table><thead><tr><th>المنافس</th><th>المنشأ</th><th>النوع</th><th>المنتجات</th><th>التموضع</th><th>التهديد</th></tr></thead><tbody>'
      +dz.competitors.map(function(x){return '<tr><td><b>'+esc(x.name)+'</b>'+cite(x.url)+'</td><td>'+esc(x.origin)+'</td><td>'+(TYPE[x.type]||x.type)+'</td><td class="small">'+esc(x.products)+'</td><td class="small">'+esc(x.positioning_ar)+'</td><td><span class="pill p-'+x.threat+'">'+THREAT[x.threat]+'</span></td></tr>';}).join("")
      +'</tbody></table></div></div>'));
    /* prices */
    var ph;
    if(dz.prices.length){
      var cats={};dz.prices.forEach(function(x){(cats[x.category_ar]=cats[x.category_ar]||[]).push(x);});
      ph='<div class="grid g2"><div class="panel stack"><h3>السعر لكل لتر أو كيلو (دولار)</h3>';
      Object.keys(cats).forEach(function(k){var L=cats[k].filter(function(x){return x.per_unit_usd;}).sort(function(a,b){return a.per_unit_usd-b.per_unit_usd;});if(!L.length)return;var mxp=L[L.length-1].per_unit_usd;
        ph+='<div class="pcat">'+esc(k)+' <span class="muted small">($/'+(L[0].unit==="kg"?"كجم":"لتر")+')</span></div>'+L.map(function(x){return '<div class="prow"><span>'+esc(x.brand)+' <span class="muted small">'+esc(x.pack)+'</span></span><div class="bar br"><i style="width:'+Math.max(4,x.per_unit_usd/mxp*100)+'%"></i></div><span class="num">'+x.per_unit_usd.toFixed(2)+'</span></div>';}).join("");});
      ph+='</div><div class="panel stack"><h3>قراءة الأسعار وتموضع Dr. Baker</h3><p class="small" style="line-height:1.9">'+esc(dz.priceSummary_ar)+'</p><div class="muted small">أسعار تجزئة رصدناها يوم '+esc(dz.prices[0].date)+'. التحويل للدولار بأسعار صرف تقريبية.</div></div></div>'
       +'<details class="panel"><summary class="small" style="cursor:pointer;color:var(--accent)">كل الأسعار المرصودة ('+dz.prices.length+')</summary><div class="tblwrap" style="margin-top:10px"><table><thead><tr><th>الفئة</th><th>العلامة</th><th>المنتج</th><th>العبوة</th><th>السعر</th><th>$</th><th>المصدر</th></tr></thead><tbody>'
       +dz.prices.map(function(x){return '<tr><td>'+esc(x.category_ar)+'</td><td>'+esc(x.brand)+'</td><td dir="ltr" style="text-align:start">'+esc(x.product)+'</td><td>'+esc(x.pack)+'</td><td style="font-variant-numeric:tabular-nums">'+x.price_local+' '+x.currency+'</td><td style="font-variant-numeric:tabular-nums">'+x.price_usd.toFixed(2)+'</td><td>'+cite(x.url)+'</td></tr>';}).join("")+'</tbody></table></div></details>';
    } else ph='<div class="panel"><p class="small">'+esc(dz.priceSummary_ar)+'</p></div>';
    add("price","الأسعار",sec("price","COMPETITOR PRICING","أسعار المنافسين","",ph));
    /* compliance */
    var cnt={banned:0,halal:0,warning:0,check:0,limits:0};comp.rows.forEach(function(r){cnt[r.status]+=r.skus;});
    var ch2='<div class="cstat"><div><b>'+comp.flagged+'</b><span>صنف من '+comp.total+' يحتاج إجراء</span></div><div><b>'+(cnt.halal)+'</b><span>مراجعة حلال (قرمز E120 وجيلاتين)</span></div><div><b>'+(cnt.warning)+'</b><span>مرة استخدام لصبغة تتطلب عبارة تحذير</span></div><div><b>'+(dz.e171&&dz.e171.status==="banned"?"E171 ممنوع":"E171")+'</b><span>غير موجود في منتجاتنا</span></div></div>'
      +'<div class="panel"><div class="tblwrap"><table><thead><tr><th>الإضافة</th><th>الحالة في '+esc(c.country)+'</th><th>أصنافنا</th><th>الفئات</th><th>المطلوب</th></tr></thead><tbody>'
      +comp.rows.map(function(r){var st=STAT[r.status];return '<tr><td><b dir="ltr">'+esc(r.code)+'</b><div class="muted small" dir="ltr" style="text-align:start">'+esc(r.name)+'</div></td><td><span class="pill '+st[1]+'">'+st[0]+'</span></td><td style="font-variant-numeric:tabular-nums"><b>'+r.skus+'</b></td><td class="small">'+r.cats.map(esc).join("، ")+'</td><td class="small">'+esc(r.note_ar)+cite(r.url)+'<details class="sku"><summary>الأصناف ('+r.skus+')</summary><ul>'+r.list.map(function(s){return '<li>'+esc(s[1])+(s[0]?' <span class="muted">'+esc(s[0])+'</span>':'')+'</li>';}).join("")+'</ul></details></td></tr>';}).join("")
      +'</tbody></table></div></div>';
    add("comply","المكونات والألوان",sec("comply","INGREDIENT COMPLIANCE","المكونات والألوان مقابل لوائح "+esc(c.country),"فحصنا مكونات 607 صنف من ملف بيانات المنتجات مقابل لوائح الإضافات في الدولة. الألوان المسموحة بعبارة تحذير تحتاج تعديل الملصق أو استبدال الصبغة بلون طبيعي.",ch2));
    /* shipping */
    add("ship","الشحن",sec("ship","IMPORT & CLEARANCE","الشحن والتخليص","",'<div class="panel"><ol class="steps">'+dz.shipping.map(function(x){return '<li><div><b>'+esc(x.item_ar)+'</b>'+cite(x.url)+'<div class="small">'+esc(x.detail_ar)+'</div></div></li>';}).join("")+'</ol></div>'));
    /* certificates */
    add("cert","الشهادات",sec("cert","CERTIFICATES","الشهادات المطلوبة","",'<div class="panel"><div class="tblwrap"><table><thead><tr><th>الشهادة</th><th>مطلوبة؟</th><th>التفاصيل</th></tr></thead><tbody>'+dz.certificates.map(function(x){return '<tr><td><b dir="auto">'+esc(x.name)+'</b>'+cite(x.url)+'</td><td><span class="pill p-'+x.required+'">'+REQ[x.required]+'</span></td><td class="small">'+esc(x.detail_ar)+'</td></tr>';}).join("")+'</tbody></table></div></div>'));
    /* tariffs & agreements */
    add("trade2","الاتفاقيات",sec("trade2","TARIFFS & AGREEMENTS","الجمارك والاتفاقيات مع مصر","",
      '<div class="grid g2">'+dz.tariffs.map(function(t){return '<div class="panel stack"><div class="eyebrow">TARIFF</div><div class="big" style="font-size:1.5em">'+esc(t.duty)+'</div><div class="small"><b>الضريبة:</b> '+esc(t.vat)+'</div><div class="small muted">'+esc(t.note_ar)+cite(t.url)+'</div></div>';}).join("")
      +'<div class="panel stack">'+dz.agreements.map(function(a){return '<div><b dir="auto">'+esc(a.name)+'</b> <span class="tag t-mute">'+esc(a.status)+'</span>'+cite(a.url)+'<div class="small">'+esc(a.relevance_ar)+'</div></div>';}).join('<hr style="border:0;border-top:1px solid var(--line);margin:4px 0">')+'</div></div>'));
    /* fairs & seasons */
    add("cal","المعارض والمواسم",sec("cal","FAIRS & SEASONS","المعارض والمواسم","المواسم الإسلامية تواريخها تقريبية.",
      '<div class="grid g2"><div class="panel stack"><h3>المعارض</h3><div class="tline">'+dz.fairs.map(function(f){return '<div><span class="when">'+esc(f.dates)+'</span><span><b dir="auto">'+esc(f.name)+'</b>'+cite(f.url)+' <span class="muted small">'+esc(f.city)+'</span><div class="small">'+esc(f.relevance_ar)+'</div></span></div>';}).join("")+'</div></div>'
      +'<div class="panel stack"><h3>مواسم الطلب</h3><div class="tline">'+dz.seasons.map(function(s){return '<div><span class="when">'+esc(s.period)+'</span><span><b>'+esc(s.name_ar)+'</b><div class="small">'+esc(s.impact_ar)+'</div></span></div>';}).join("")+'</div></div></div>'));
    add("gaps","لم نتأكد منه",sec("gaps","OPEN QUESTIONS","لم نتأكد منه","اسأل عنه الموزع أو المنظّم قبل أي قرار.",'<div class="panel"><ul class="clean small">'+dz.unverified.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul></div>'));
  } else {
    var st=load("bk_reg_"+c.country_en,{}),h="";
    (c.regulatory||[]).forEach(function(r,i){h+='<label class="check"><input type="checkbox" data-i="'+i+'"'+(st[i]?" checked":"")+'><span>'+esc(r)+'</span></label>';});
    add("reg","اللوائح",sec("reg","REGULATION","اللوائح والجمارك",esc(c.tariffNote||""),'<div class="panel">'+(h||'<div class="muted small">غير متاح</div>')+'</div>'));
    add("cal","المعارض",sec("cal","FAIRS","المعارض","",'<div class="panel"><div class="tline">'+((c.fairs||[]).map(function(f){return '<div><span class="when">'+esc(f.date||"")+'</span><span><b dir="auto">'+esc(f.name)+'</b> <span class="muted small">'+esc(f.city||"")+'</span></span></div>';}).join("")||'<div class="muted small">لا يوجد</div>')+'</div></div>'));
  }
  (c.sources||[]).forEach(function(s){if(/^https?:/.test(s))cite(s);});
  add("src","المصادر",sec("src","SOURCES","المصادر","كل رقم في التقرير له رقم مرجع يفتح المصدر.",'<div class="panel"><ol class="srcs">'+SRC.map(function(u){return '<li><a href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(host(u))+'</a> <span class="muted" dir="ltr">'+esc(u.length>90?u.slice(0,90)+"…":u)+'</span></li>';}).join("")+'</ol></div>'));
  $("repBody").innerHTML=H;
  $("secnav").innerHTML=nav.map(function(n){return '<a href="#r-'+n[0]+'" data-sec="'+n[0]+'">'+n[1]+'</a>';}).join("");
  $("secnav").querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(ev){ev.preventDefault();var t=$("r-"+a.dataset.sec);if(t)t.scrollIntoView({behavior:"smooth",block:"start"});});});
  $("repBody").querySelectorAll("[data-i]").forEach(function(x){x.addEventListener("change",function(){var st=load("bk_reg_"+c.country_en,{});st[x.dataset.i]=x.checked;save("bk_reg_"+c.country_en,st);});});
  $("goLeads").hidden=!leadCount(c.country);
}
$("repCountry").addEventListener("change",renderReport);
$("goLeads").addEventListener("click",function(){var n=$("repCountry").value;$("genCountry").value=n;$("fltCountry").value=n;renderBoard();show("crm");});
