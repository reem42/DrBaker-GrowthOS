/* ---------- live market (db: market/today) ---------- */
var M=DATA.market;
var dbh=null;
function pctTag(p){if(p==null||isNaN(p))return '<span class="muted">—</span>';var c=p>0?"up":p<0?"dn":"fl";return '<span class="'+c+'" dir="ltr" style="font-variant-numeric:tabular-nums">'+(p>0?"▲ +":p<0?"▼ ":"● ")+p.toFixed(2)+'%</span>';}
function pctTagS(p){/* stocks: up is good for the company, show neutral colors */if(p==null||isNaN(p))return '—';return '<span class="'+(p>0?"dn":p<0?"up":"fl")+'" dir="ltr" style="font-variant-numeric:tabular-nums">'+(p>0?"+":"")+p.toFixed(2)+'%</span>';}
function n2(v){return (v==null||v==="")?"—":Number(v).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});}
function renderMarket(){
  var m=M,age=-daysTo(m.asOf),h='';
  h+='<div class="row sp"><div class="stack" style="gap:2px"><div class="eyebrow">MARKET TODAY · السوق اليوم</div><h2>سعر الصرف والبورصة والخامات</h2></div><div class="row"><span class="tag '+(age<1?"t-good":"t-warn")+'">آخر تحديث: '+esc(m.updatedAt||m.asOf)+'</span><button class="btn sm" id="dlPaper" type="button">تنزيل (Excel)</button></div></div>';
  if(age>=1)h+='<div class="note">البيانات دي من '+dLabel(m.asOf,false)+'. اكتبيلي "حدّث السوق" وهتتحدث هنا من غير ما تفتحي صفحة جديدة.</div>';
  h+='<div class="mkt3">';
  /* FX */
  h+='<div class="mcard"><div class="mh"><b>سعر صرف الجنيه</b><span class="small muted">'+esc(m.fx.bank)+'</span></div><table class="mt"><thead><tr><th>العملة</th><th>شراء</th><th>بيع</th></tr></thead><tbody>'
   +m.fx.rows.map(function(r){return '<tr><td><b dir="ltr">'+esc(r.c)+'</b> <span class="muted small">'+esc(r.n)+'</span></td><td class="num">'+n2(r.buy)+'</td><td class="num"><b>'+n2(r.sell)+'</b></td></tr>';}).join("")+'</tbody></table>'
   +(m.banks&&m.banks.length?'<div class="small"><b>الدولار في البنوك ('+esc(m.banksTime||"")+'):</b> '+m.banks.map(function(b){return esc(b.n)+' '+n2(b.buy)+' / '+n2(b.sell);}).join(" · ")+'</div>':'')
   +'<div class="srcline">'+m.fx.src.map(function(s){return '<a href="'+esc(s.u)+'" target="_blank" rel="noopener">'+esc(s.n)+'</a>';}).join(" · ")+'</div></div>';
  /* stocks */
  h+='<div class="mcard"><div class="mh"><b>المنافسون في البورصة</b><span class="small muted">EGX + Tadawul</span></div><table class="mt"><thead><tr><th>الشركة</th><th>السعر</th><th>اليوم</th></tr></thead><tbody>'
   +m.stocks.map(function(s){return '<tr title="'+esc(s.rel)+'"><td><b dir="ltr">'+esc(s.n)+'</b> <span class="muted small" dir="ltr">'+esc(s.x+":"+s.t)+'</span><div class="muted small">'+esc(s.rel)+'</div></td><td class="num">'+n2(s.p)+' <span class="muted small">'+esc(s.cur)+'</span><div class="muted small">'+esc(s.d)+'</div></td><td class="num">'+pctTagS(s.pct)+' <a class="cite" href="'+esc(s.u)+'" target="_blank" rel="noopener">↗</a></td></tr>';}).join("")+'</tbody></table><div class="small muted">الأسعار متأخرة 15 دقيقة على الأقل من المصدر.</div></div>';
  /* commodities */
  h+='<div class="mcard"><div class="mh"><b>خامات Dr. Baker</b><span class="small muted">بورصات السلع</span></div><table class="mt"><thead><tr><th>الخامة</th><th>السعر</th><th>اليوم</th></tr></thead><tbody>'
   +m.comm.map(function(c){return '<tr><td><b>'+esc(c.n)+'</b><div class="muted small">'+esc(c.why)+'</div></td><td class="num">'+esc(c.v)+' <div class="muted small">'+esc(c.u)+'</div></td><td class="num">'+pctTag(c.pct)+'</td></tr>';}).join("")+'</tbody></table>'
   +'<div class="srcline"><a href="'+esc(m.commSrc.u)+'" target="_blank" rel="noopener">'+esc(m.commSrc.n)+'</a> · '+esc(m.asOf)+'</div></div>';
  h+='</div>';
  /* today's headlines */
  if(m.news&&m.news.length){
    h+='<div class="stack" style="gap:0"><div class="sect-h"><h3>أخبار اليوم</h3></div>'+m.news.map(function(x){return '<article class="story"><h3>'+esc(x.t)+'</h3><p class="small">'+esc(x.s)+'</p><div class="do"><b>الخطوة:</b> '+esc(x.a)+'</div><div class="srcline"><a href="'+esc(x.u)+'" target="_blank" rel="noopener">'+esc(x.src)+'</a><span>'+esc(x.d)+'</span></div></article>';}).join("")+'</div>';
  }
  $("mktBox").innerHTML=h;
  $("dlPaper").addEventListener("click",dlPaperFn);
}
function dlPaperFn(){
  var wb=book(),m=M;
  XLSX.utils.book_append_sheet(wb,sheet([["العملة","الاسم","شراء","بيع","المصدر"]].concat(m.fx.rows.map(function(r){return [r.c,r.n,r.buy,r.sell,m.fx.bank];})).concat((m.banks||[]).map(function(b){return ["USD",b.n,b.buy,b.sell,m.banksTime||""];})),[10,24,10,10,30]),"سعر الصرف");
  XLSX.utils.book_append_sheet(wb,sheet([["الشركة","الرمز","البورصة","السعر","العملة","التغير %","التاريخ","العلاقة بـ Dr. Baker","المصدر"]].concat(m.stocks.map(function(s){return [s.n,s.t,s.x,s.p,s.cur,s.pct,s.d,s.rel,s.u];})),[18,8,8,10,8,10,12,50,50]),"البورصة");
  XLSX.utils.book_append_sheet(wb,sheet([["الخامة","السعر","الوحدة","التغير %","الأثر","التاريخ"]].concat(m.comm.map(function(c){return [c.n,c.v,c.u,c.pct,c.why,m.asOf];})),[18,12,14,10,40,12]),"الخامات");
  XLSX.utils.book_append_sheet(wb,sheet([["الخبر","الملخص","الخطوة","المصدر","الرابط","التاريخ"]].concat((m.news||[]).map(function(x){return [x.t,x.s,x.a,x.src,x.u,x.d];})),[50,70,50,20,50,12]),"أخبار اليوم");
  var rows=[["القسم","العنوان","الملخص","الأثر","الخطوة","المصدر","الرابط","التاريخ"]];
  SEC.forEach(function(s){(NEWS.sections[s[0]]||[]).forEach(function(x){rows.push([s[1],x.headline_ar,x.summary_ar,x.impact_ar||"",x.action_ar||"",x.source||"",x.url||"",x.date||""]);});});
  XLSX.utils.book_append_sheet(wb,sheet(rows,[18,50,70,50,50,26,50,12]),"أخبار الأسبوع");
  saveBook(wb,"DrBaker_Market_"+m.asOf+".xlsx","dlNote0");
}
