/* ---------- distributor tracker (db: distributors) ---------- */
var DIST=[],dSel=null,dShared=false,dErr="";
var DTYPES=["موزع","موزع حصري","وكيل","مستورد"];
var DLOG=[["visit","زيارة"],["call","مكالمة"],["order","طلبية"],["sample","عينات"],["training","تدريب/ديمو"],["support","دعم تسويقي"],["complaint","شكوى"],["payment","تحصيل"]];
var DFIELDS=[
 ["name","اسم الموزع","text"],["country","الدولة","text"],["city","المدينة / المنطقة","text"],["type","النوع","type"],["exclusive","حصري؟","bool"],
 ["owner","مسؤول المبيعات","text"],["since","بداية التعامل","date"],["terms","شروط الدفع","text"],
 ["target","المستهدف السنوي ($)","num"],["ytd","المشتريات من أول السنة ($)","num"],["lastOrder","تاريخ آخر طلبية","date"],["lastOrderValue","قيمة آخر طلبية ($)","num"],
 ["outstanding","مستحقات مفتوحة ($)","num"],["creditLimit","حد الائتمان ($)","num"],["stockWeeks","مخزون بالأسابيع","num"],
 ["supportBudget","ميزانية الدعم التسويقي ($)","num"],["supportSpent","المصروف من الدعم ($)","num"],
 ["products","الأصناف اللي بيوزعها","text"],["nextAction","الخطوة الجاية","text"],["nextDue","موعدها","date"],["notes","ملاحظات","area"]
];
function num(v){var n=parseFloat(v);return isNaN(n)?null:n;}
function dayOfYear(){var t=utc(todayISO()),y=new Date(t).getUTCFullYear();return (t-Date.UTC(y,0,1))/DAY+1;}
function health(d){
  var parts=[],sc=0,mx=0,flags=[];
  var tg=num(d.target),yt=num(d.ytd);
  if(tg&&yt!=null){var exp=tg*dayOfYear()/365,pace=exp?yt/exp:0;parts.push(["وتيرة الشراء مقابل المستهدف",Math.round(pace*100)+"%"]);mx+=40;sc+=pace>=1?40:pace>=.7?25:10;if(pace<.7)flags.push("المشتريات أقل من 70% من المستهدف حتى النهارده");d._pace=pace;}else d._pace=null;
  if(d.lastOrder){var ds=-daysTo(d.lastOrder);parts.push(["أيام من آخر طلبية",ds]);mx+=25;sc+=ds<=30?25:ds<=60?15:5;if(ds>60)flags.push("مفيش طلبية من "+ds+" يوم");d._days=ds;}else d._days=null;
  var os=num(d.outstanding),cl=num(d.creditLimit);
  if(os!=null&&cl){var r=os/cl;parts.push(["المستحقات من حد الائتمان",Math.round(r*100)+"%"]);mx+=20;sc+=r<=.8?20:r<=1?10:0;if(r>1)flags.push("متجاوز حد الائتمان");}
  var sw=num(d.stockWeeks);
  if(sw!=null){parts.push(["تغطية المخزون",sw+" أسبوع"]);mx+=15;sc+=sw>=4?15:sw>=2?8:3;if(sw<2)flags.push("المخزون أقل من أسبوعين: فرصة طلبية");}
  var sb=num(d.supportBudget),ss=num(d.supportSpent);if(sb!=null&&ss!=null&&ss>sb)flags.push("مصروف الدعم أكبر من الميزانية");
  if(d.nextDue&&d.nextDue<todayISO())flags.push("الخطوة الجاية متأخرة");
  if(!d.nextAction)flags.push("مفيش خطوة جاية محددة");
  var h=mx?Math.round(sc/mx*100):null;
  return {score:h,parts:parts,flags:flags,label:h==null?["بيانات ناقصة","p-check"]:h>=75?["سليم","p-limits"]:h>=50?["تحت المتابعة","p-warning"]:["خطر","p-banned"]};
}
function dLocalLoad(){DIST=load("bk_dist",[]);}
function dLocalSave(){save("bk_dist",DIST);}
async function dPersist(d){
  d.updatedAt=new Date().toISOString();
  var clean=JSON.parse(JSON.stringify(d,function(k,v){return k.charAt(0)==="_"?undefined:v;}));
  if(dbh&&dShared){
    try{await dbh.doc("distributors/"+d.id).set(clean);dErr="";}
    catch(e){dErr=(e&&e.code==="invalid_argument")?"مالكيش صلاحية تعديل بيانات الموزعين في الصفحة دي.":"الحفظ ما تمش، جرّبي تاني.";renderDist();}
  } else {var i=DIST.findIndex(function(x){return x.id===d.id;});if(i<0)DIST.push(d);else DIST[i]=d;dLocalSave();renderDist();}
}
async function dRemove(id){
  if(dbh&&dShared){try{await dbh.doc("distributors/"+id).delete();}catch(e){dErr="الحذف ما تمش.";}}
  else{DIST=DIST.filter(function(x){return x.id!==id;});dLocalSave();}
  dSel=null;renderDist();
}
function money(v){var n=num(v);return n==null?"—":"$"+fmt(n);}
function renderDist(){
  var flt=$("dFlt").value||"all",L=DIST.filter(function(d){return flt==="all"||d.country===flt;});
  L.forEach(function(d){d._h=health(d);});
  var countries={};DIST.forEach(function(d){if(d.country)countries[d.country]=1;});
  var cur=$("dFlt").value;$("dFlt").innerHTML='<option value="all">كل الدول</option>'+Object.keys(countries).map(function(c){return '<option'+(c===cur?' selected':'')+'>'+esc(c)+'</option>';}).join("");
  var tg=0,yt=0,risk=0,late=0;L.forEach(function(d){tg+=num(d.target)||0;yt+=num(d.ytd)||0;if(d._h.label[0]==="خطر")risk++;if(d.nextDue&&d.nextDue<todayISO())late++;});
  $("dKpis").innerHTML='<div class="cstat"><div><b>'+L.length+'</b><span>موزع ووكيل</span></div><div><b>'+(tg?Math.round(yt/tg*100)+'%':'—')+'</b><span>المشتريات من المستهدف السنوي ('+money(yt)+' من '+money(tg)+')</span></div><div><b>'+risk+'</b><span>موزع في خطر</span></div><div><b>'+late+'</b><span>متابعة متأخرة</span></div></div>';
  $("dMode").innerHTML=dShared?'<span class="tag t-good">محفوظ للفريق كله</span>':'<span class="tag t-warn">محفوظ على جهازك بس</span>';
  $("dErr").textContent=dErr;$("dErr").hidden=!dErr;
  var h='';
  if(!L.length)h='<div class="muted small" style="padding:20px 0">لسه مفيش موزعين. اضغطي "موزع جديد" وابدئي بالاسم والدولة والمستهدف السنوي.</div>';
  else h='<div class="tblwrap"><table><thead><tr><th>الموزع</th><th>الحالة</th><th>المشتريات مقابل المستهدف</th><th>آخر طلبية</th><th>المستحقات</th><th>الخطوة الجاية</th></tr></thead><tbody>'+L.sort(function(a,b){return (a._h.score==null?101:a._h.score)-(b._h.score==null?101:b._h.score);}).map(function(d){
    var p=d._pace,od=d.nextDue&&d.nextDue<todayISO();
    return '<tr class="drow'+(dSel===d.id?' sel':'')+'" data-d="'+esc(d.id)+'" tabindex="0"><td><b>'+esc(d.name||"بدون اسم")+'</b><div class="muted small">'+esc([d.country,d.city,d.type].filter(Boolean).join(" · "))+'</div></td>'
     +'<td><span class="pill '+d._h.label[1]+'">'+d._h.label[0]+(d._h.score!=null?' '+d._h.score:'')+'</span>'+(d._h.flags.length?'<div class="muted small">'+esc(d._h.flags[0])+(d._h.flags.length>1?' (+'+(d._h.flags.length-1)+')':'')+'</div>':'')+'</td>'
     +'<td style="min-width:150px">'+(p==null?'<span class="muted small">أدخلي المستهدف والمشتريات</span>':'<div class="row sp small"><span>'+money(d.ytd)+'</span><span>'+Math.round(p*100)+'% من الوتيرة</span></div><div class="bar '+(p>=1?'':'br')+'"><i style="width:'+Math.min(100,p*100)+'%"></i></div>')+'</td>'
     +'<td class="small">'+(d.lastOrder?dLabel(d.lastOrder,false)+'<div class="muted">من '+d._days+' يوم</div>':'—')+'</td>'
     +'<td class="small">'+money(d.outstanding)+(num(d.creditLimit)?'<div class="muted">من '+money(d.creditLimit)+'</div>':'')+'</td>'
     +'<td class="small">'+(d.nextAction?esc(d.nextAction)+'<div class="'+(od?'up':'muted')+'">'+(d.nextDue?dLabel(d.nextDue,false)+(od?' · متأخرة':''):'')+'</div>':'<span class="muted">—</span>')+'</td></tr>';}).join("")+'</tbody></table></div>';
  $("dList").innerHTML=h;
  $("dList").querySelectorAll("[data-d]").forEach(function(r){function go(){dSel=r.dataset.d;renderDist();var el=$("dDetail");if(el)el.scrollIntoView({behavior:"smooth",block:"start"});}r.addEventListener("click",go);r.addEventListener("keydown",function(e){if(e.key==="Enter")go();});});
  renderDDetail();
}
function renderDDetail(){
  var box=$("dDetail"),d=DIST.filter(function(x){return x.id===dSel;})[0];
  if(!d){box.hidden=true;return;}
  box.hidden=false;var hh=health(d);
  var h='<div class="row sp"><div><div class="eyebrow">DISTRIBUTOR FILE</div><h2>'+esc(d.name||"موزع جديد")+'</h2></div><div class="row"><span class="pill '+hh.label[1]+'">'+hh.label[0]+(hh.score!=null?' '+hh.score+'/100':'')+'</span><button class="btn sm" type="button" id="dClose">إغلاق</button></div></div>';
  h+='<div class="grid g2"><div class="stack"><h3>المؤشرات</h3>'+(hh.parts.length?'<div class="tline">'+hh.parts.map(function(p){return '<div><span class="when">'+esc(p[0])+'</span><b style="font-variant-numeric:tabular-nums">'+esc(String(p[1]))+'</b></div>';}).join("")+'</div>':'<div class="muted small">أدخلي المستهدف والمشتريات وتاريخ آخر طلبية والمستحقات والمخزون عشان يتحسب مؤشر الصحة.</div>')
   +(hh.flags.length?'<div class="warnbox"><b>تنبيهات:</b><ul class="clean">'+hh.flags.map(function(f){return '<li>'+esc(f)+'</li>';}).join("")+'</ul></div>':'')+'</div>'
   +'<div class="stack"><h3>مراجعة ربع سنوية</h3><div class="small muted">القاعدة: 100% من المستهدف أو أكثر = يتجدد الدعم. 70% لـ 99% = الدعم للنص. أقل من 70% = يقف الدعم وخطة تصحيح مكتوبة.</div><button class="btn" type="button" id="dReview">سجّلي مراجعة الربع ده</button>'
   +((d.reviews||[]).length?'<div class="tline">'+d.reviews.slice().reverse().map(function(r){return '<div><span class="when">'+esc(r.d)+'</span><span>'+esc(r.q)+': <b>'+r.pct+'%</b> · '+esc(r.decision)+'</span></div>';}).join("")+'</div>':'')+'</div></div>';
  h+='<form id="dForm" class="stack"><h3>البيانات</h3><div class="fgrid">'+DFIELDS.map(function(f){var k=f[0],v=d[k]==null?"":d[k],id="df_"+k;
    if(f[2]==="type")return '<label>'+f[1]+'<select id="'+id+'">'+DTYPES.map(function(t){return '<option'+(t===v?' selected':'')+'>'+t+'</option>';}).join("")+'</select></label>';
    if(f[2]==="bool")return '<label>'+f[1]+'<select id="'+id+'"><option value="">لا</option><option value="1"'+(v?' selected':'')+'>نعم</option></select></label>';
    if(f[2]==="area")return '<label class="wide">'+f[1]+'<textarea id="'+id+'" style="min-height:70px">'+esc(v)+'</textarea></label>';
    return '<label'+(k==="products"||k==="nextAction"?' class="wide"':'')+'>'+f[1]+'<input id="'+id+'" type="'+(f[2]==="num"?"number":f[2]==="date"?"date":"text")+'"'+(f[2]==="num"?' min="0" step="any"':'')+' value="'+esc(v)+'"></label>';}).join("")+'</div>'
   +'<div class="row"><button class="btn primary" type="submit">حفظ</button><span class="small muted" id="dSaved"></span><span style="flex:1"></span><button class="btn sm" type="button" id="dDel">حذف الموزع</button><span id="dDelConfirm" hidden><span class="small up">متأكدة؟</span> <button class="btn sm" type="button" id="dDelYes">أيوه احذف</button> <button class="btn sm" type="button" id="dDelNo">لا</button></span></div></form>';
  h+='<div class="stack"><h3>سجل التواصل</h3><div class="row"><select id="dlType" aria-label="نوع النشاط">'+DLOG.map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>';}).join("")+'</select><input id="dlNote" placeholder="اللي حصل باختصار" style="flex:1;min-width:200px"><input id="dlDate" type="date" value="'+todayISO()+'" aria-label="التاريخ"><button class="btn" type="button" id="dlAdd">أضف</button></div>'
   +((d.log||[]).length?'<div class="tline">'+d.log.slice().sort(function(a,b){return a.d<b.d?1:-1;}).map(function(x){var t=DLOG.filter(function(y){return y[0]===x.k;})[0];return '<div><span class="when">'+esc(x.d)+'</span><span><span class="tag t-mute">'+(t?t[1]:x.k)+'</span> '+esc(x.t)+'</span></div>';}).join("")+'</div>':'<div class="muted small">لسه مفيش نشاط مسجل.</div>')+'</div>';
  box.innerHTML=h;
  $("dClose").addEventListener("click",function(){dSel=null;renderDist();});
  $("dForm").addEventListener("submit",function(e){e.preventDefault();var n=JSON.parse(JSON.stringify(d));
    DFIELDS.forEach(function(f){var el=$("df_"+f[0]),v=el.value;if(f[2]==="num")n[f[0]]=num(v);else if(f[2]==="bool")n[f[0]]=!!v;else n[f[0]]=v.trim?v.trim():v;});
    dPersist(n).then(function(){var s=$("dSaved");if(s)s.textContent="اتحفظ";});});
  $("dDel").addEventListener("click",function(){$("dDelConfirm").hidden=false;});
  $("dDelNo").addEventListener("click",function(){$("dDelConfirm").hidden=true;});
  $("dDelYes").addEventListener("click",function(){dRemove(d.id);});
  $("dlAdd").addEventListener("click",function(){var t=$("dlNote").value.trim();if(!t)return;var n=JSON.parse(JSON.stringify(d));n.log=(n.log||[]).concat([{d:$("dlDate").value||todayISO(),k:$("dlType").value,t:t}]);
    if($("dlType").value==="order"&&(!n.lastOrder||$("dlDate").value>n.lastOrder))n.lastOrder=$("dlDate").value;dPersist(n);});
  $("dReview").addEventListener("click",function(){var hh2=health(d),p=d._pace;if(p==null){$("dSaved").textContent="أدخلي المستهدف والمشتريات الأول";return;}
    var pct=Math.round(p*100),dec=pct>=100?"يتجدد الدعم":pct>=70?"الدعم للنص":"يقف الدعم + خطة تصحيح مكتوبة",dt=new Date(utc(todayISO())),q="Q"+(Math.floor(dt.getUTCMonth()/3)+1)+" "+dt.getUTCFullYear();
    var n=JSON.parse(JSON.stringify(d));n.reviews=(n.reviews||[]).filter(function(r){return r.q!==q;}).concat([{d:todayISO(),q:q,pct:pct,decision:dec}]);dPersist(n);});
}
function dNew(){var d={id:"d"+Date.now().toString(36),name:"",country:"",type:"موزع",log:[],reviews:[],createdAt:todayISO()};dSel=d.id;
  if(dbh&&dShared){DIST.push(d);renderDist();}else{DIST.push(d);dLocalSave();renderDist();}
  setTimeout(function(){var el=$("df_name");if(el)el.focus();},50);}
function dExport(){
  var wb=book(),rows=[["الموزع","الدولة","المدينة","النوع","حصري","المسؤول","المستهدف $","المشتريات $","الوتيرة %","آخر طلبية","أيام","المستحقات $","حد الائتمان $","المخزون (أسابيع)","ميزانية الدعم $","المصروف $","الحالة","المؤشر","تنبيهات","الخطوة الجاية","موعدها"]];
  DIST.forEach(function(d){var h=health(d);rows.push([d.name,d.country,d.city,d.type,d.exclusive?"نعم":"لا",d.owner,num(d.target),num(d.ytd),d._pace==null?"":Math.round(d._pace*100),d.lastOrder||"",d._days==null?"":d._days,num(d.outstanding),num(d.creditLimit),num(d.stockWeeks),num(d.supportBudget),num(d.supportSpent),h.label[0],h.score==null?"":h.score,h.flags.join(" | "),d.nextAction||"",d.nextDue||""]);});
  XLSX.utils.book_append_sheet(wb,sheet(rows,[24,12,14,12,6,16,12,12,10,12,6,12,12,10,12,10,12,8,50,40,12]),"الموزعين");
  var lg=[["الموزع","التاريخ","النوع","التفاصيل"]];DIST.forEach(function(d){(d.log||[]).forEach(function(x){var t=DLOG.filter(function(y){return y[0]===x.k;})[0];lg.push([d.name,x.d,t?t[1]:x.k,x.t]);});});
  XLSX.utils.book_append_sheet(wb,sheet(lg,[24,12,12,80]),"سجل التواصل");
  var rv=[["الموزع","الربع","التاريخ","% من المستهدف","القرار"]];DIST.forEach(function(d){(d.reviews||[]).forEach(function(r){rv.push([d.name,r.q,r.d,r.pct,r.decision]);});});
  XLSX.utils.book_append_sheet(wb,sheet(rv,[24,10,12,14,30]),"المراجعات");
  saveBook(wb,"DrBaker_Distributors_"+todayISO()+".xlsx","dNote");
}
$("dAdd").addEventListener("click",dNew);
$("dFlt").addEventListener("change",renderDist);
$("dDl").addEventListener("click",dExport);
/* connect db */
dLocalLoad();
try{claude.use("db").then(function(db){
  if(!db)return;dbh=db;
  try{db.collection("distributors").onSnapshot(function(snap){
    dShared=true;var pend=DIST.filter(function(x){return !x.updatedAt;});
    DIST=snap.docs.map(function(s){var o=JSON.parse(JSON.stringify(s.data()||{}));o.id=s.id;return o;}).concat(pend.filter(function(p){return !snap.docs.some(function(s){return s.id===p.id;});}));
    renderDist();
  },function(){dShared=false;dLocalLoad();renderDist();});}catch(e){}
  try{db.doc("market/today").onSnapshot(function(s){if(s.exists){var v=s.data();if(v&&v.asOf&&v.fx){M=JSON.parse(JSON.stringify(v));renderPaper();}}},function(){});}catch(e){}
},function(){});}catch(e){}
