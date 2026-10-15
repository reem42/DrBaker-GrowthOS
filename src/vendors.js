/* ---------- vendors & agencies (db: vendors, files: assets) ---------- */
var VEN=[],vSel=null,vShared=false,vErr="",asx=null;
var VCAT=["تجهيز وتصميم بوثات","دعاية وإعلان","طباعة","هدايا دعائية","تصوير وفيديو","شحن ولوجستيات","أخرى"];
var VST=[["new","جديد","t-mute"],["rfq","طلبنا عرض سعر","t-info"],["quoted","وصل عرض","t-warn"],["nego","تحت التفاوض","t-warn"],["approved","معتمد","t-good"],["rejected","مستبعد","t-bad"]];
var VLOG=[["call","مكالمة"],["wa","واتساب"],["email","إيميل"],["meet","اجتماع"],["file","استلام ملفات"],["pay","دفعة"],["note","ملاحظة"]];
var VF=[["name","اسم الشركة","text"],["cat","التخصص","cat"],["country","الدولة","text"],["city","المدينة","text"],["contactName","اسم المسؤول","text"],["phone","التليفون / واتساب","text"],["email","الإيميل","text"],["website","الموقع أو صفحة السوشيال","text"],["services","الخدمات اللي بيقدمها","wide"],["drive","لينك Drive للملفات الكبيرة (AI, PSD, Excel)","wide"],["nextAction","الخطوة الجاية","wide"],["nextDue","موعدها","date"],["notes","ملاحظات","area"]];
function vst(s){return VST.filter(function(x){return x[0]===(s||"new");})[0];}
function vLocal(){VEN=load("bk_ven",[]);}
async function vPersist(v){
  v.updatedAt=new Date().toISOString();
  var clean=JSON.parse(JSON.stringify(v,function(k,x){return k.charAt(0)==="_"?undefined:x;}));
  if(dbh&&vShared){try{await dbh.doc("vendors/"+v.id).set(clean);vErr="";}catch(e){vErr="الحفظ ما تمش. جرّبي تاني.";renderVen();}}
  else{var i=VEN.findIndex(function(x){return x.id===v.id;});if(i<0)VEN.push(v);else VEN[i]=v;save("bk_ven",VEN);renderVen();}
}
async function vRemove(id){if(dbh&&vShared){try{await dbh.doc("vendors/"+id).delete();}catch(e){}}else{VEN=VEN.filter(function(x){return x.id!==id;});save("bk_ven",VEN);}vSel=null;renderVen();}
function lastQuote(v){var q=(v.quotes||[]).slice().sort(function(a,b){return a.d<b.d?1:-1;})[0];return q;}
function renderVen(){
  var fc=$("vCat").value||"all",ff=$("vFair").value||"all",fs=$("vSt").value||"all";
  var L=VEN.filter(function(v){return (fc==="all"||v.cat===fc)&&(ff==="all"||(v.fairs||[]).indexOf(ff)>=0)&&(fs==="all"||(v.status||"new")===fs);});
  var today=todayISO(),late=VEN.filter(function(v){return v.nextDue&&v.nextDue<today&&v.status!=="rejected";}).length,qn=VEN.reduce(function(s,v){return s+(v.quotes||[]).length;},0),ap=VEN.filter(function(v){return v.status==="approved";}).length;
  $("vKpis").innerHTML='<div class="cstat"><div><b>'+VEN.length+'</b><span>مورد ووكالة</span></div><div><b>'+qn+'</b><span>عرض سعر متسجل</span></div><div><b>'+ap+'</b><span>معتمد</span></div><div><b>'+late+'</b><span>متابعة متأخرة</span></div></div>';
  $("vMode").innerHTML=vShared?'<span class="tag t-good">محفوظ للفريق كله</span>':'<span class="tag t-warn">محفوظ على جهازك بس</span>';
  $("vErr").textContent=vErr;$("vErr").hidden=!vErr;
  $("vList").innerHTML=!L.length?'<div class="muted small" style="padding:18px 0">لسه مفيش موردين'+(VEN.length?' بالفلتر ده':'')+'. اضغطي "مورد جديد" وسجّلي الاسم والتخصص ورقم التواصل.</div>'
   :'<div class="tblwrap"><table><thead><tr><th>الشركة</th><th>الحالة</th><th>آخر عرض سعر</th><th>الملفات</th><th>الخطوة الجاية</th></tr></thead><tbody>'+L.sort(function(a,b){return (a.nextDue||"9")<(b.nextDue||"9")?-1:1;}).map(function(v){var s=vst(v.status),q=lastQuote(v),od=v.nextDue&&v.nextDue<today;
     return '<tr class="drow'+(vSel===v.id?' sel':'')+'" data-v="'+esc(v.id)+'" tabindex="0"><td><b dir="auto">'+esc(v.name||"بدون اسم")+'</b><div class="muted small">'+esc([v.cat,v.city||v.country].filter(Boolean).join(" · "))+'</div></td><td><span class="tag '+s[2]+'">'+s[1]+'</span>'+(v.rating?' <span class="small" aria-label="التقييم">'+"★".repeat(v.rating)+'</span>':'')+'</td><td class="small">'+(q?esc(q.item)+'<div><b>'+fmt(q.amount)+' '+esc(q.cur)+'</b> · '+esc(q.d)+'</div>':'<span class="muted">—</span>')+'</td><td class="small">'+((v.files||[]).length||0)+(v.drive?' + Drive':'')+'</td><td class="small">'+(v.nextAction?esc(v.nextAction)+'<div class="'+(od?'up':'muted')+'">'+(v.nextDue?dLabel(v.nextDue,false)+(od?' · متأخرة':''):'')+'</div>':'<span class="muted">—</span>')+'</td></tr>';}).join("")+'</tbody></table></div>';
  $("vList").querySelectorAll("[data-v]").forEach(function(r){function go(){vSel=r.dataset.v;renderVen();var el=$("vDetail");if(el)el.scrollIntoView({behavior:"smooth",block:"start"});}r.addEventListener("click",go);r.addEventListener("keydown",function(e){if(e.key==="Enter")go();});});
  renderCompare();renderVDetail();
}
function renderCompare(){
  var items={};VEN.forEach(function(v){(v.quotes||[]).forEach(function(q){var k=(q.item||"").trim();if(!k)return;(items[k]=items[k]||[]).push({v:v.name,amount:q.amount,cur:q.cur,d:q.d,valid:q.valid});});});
  var ks=Object.keys(items).filter(function(k){return items[k].length>1;});
  $("vCompare").innerHTML=ks.length?'<h3>مقارنة عروض الأسعار</h3><div class="small muted">البنود اللي جالها أكتر من عرض، من الأرخص للأغلى (قارني بنفس العملة).</div>'+ks.map(function(k){var L=items[k].sort(function(a,b){return a.amount-b.amount;});return '<div class="pcat">'+esc(k)+'</div>'+L.map(function(x,i){return '<div class="prow" style="grid-template-columns:1.4fr 1fr 1fr"><span>'+(i===0?'<span class="tag t-good">الأرخص</span> ':'')+esc(x.v)+'</span><span class="num">'+fmt(x.amount)+' '+esc(x.cur)+'</span><span class="small muted">'+esc(x.d)+(x.valid?' · صالح لحد '+esc(x.valid):'')+'</span></div>';}).join("");}).join(""):'<div class="small muted">لما يجي أكتر من عرض لنفس البند (مثلاً "بوث 18 متر Gulfood") هيظهر هنا جنب بعض للمقارنة. اكتبي اسم البند بنفس الطريقة في كل عرض.</div>';
}
function rfqText(v,lang){
  var n=v.name||"",s=sender||{};
  if(lang==="en")return "Dear "+(v.contactName||n+" team")+",\n\nDr. Baker (Egyptian bakery & confectionery ingredients manufacturer) is preparing for Gulfood Manufacturing (Dubai, 3–5 Nov 2026) and Africa Food Show (Casablanca, 18–20 Nov 2026).\n\nCould you send us a quotation for:\n- [item, size, quantity]\n- Delivery date and location\n- Payment terms and quote validity\n- Samples of previous similar work\n\nWe need the offer by [date].\n\nBest regards,\n"+(s.name||"")+"\nDr. Baker";
  return "أهلاً "+(v.contactName||"فريق "+n)+"،\n\nمعاكم "+(s.name||"")+" من Dr. Baker. بنجهز لمعرض Gulfood Manufacturing في دبي (3 إلى 5 نوفمبر) وAfrica Food Show في الدار البيضاء (18 إلى 20 نوفمبر).\n\nمحتاجين عرض سعر لـ:\n- [البند، المقاس، الكمية]\n- ميعاد ومكان التسليم\n- شروط الدفع ومدة صلاحية العرض\n- نماذج من شغل مشابه\n\nياريت العرض يوصل قبل [التاريخ].\n\nشكراً،\n"+(s.name||"")+"\nDr. Baker";
}
function renderVDetail(){
  var box=$("vDetail"),v=VEN.filter(function(x){return x.id===vSel;})[0];
  if(!v){box.hidden=true;return;}box.hidden=false;
  var s=vst(v.status),today=todayISO();
  var h='<div class="row sp"><div><div class="eyebrow">VENDOR FILE</div><h2 dir="auto">'+esc(v.name||"مورد جديد")+'</h2></div><div class="row"><span class="tag '+s[2]+'">'+s[1]+'</span><button class="btn sm" type="button" id="vClose">إغلاق</button></div></div>';
  h+='<form id="vForm" class="stack"><div class="fgrid">'+VF.map(function(f){var k=f[0],val=v[k]==null?"":v[k],id="vf_"+k;
    if(f[2]==="cat")return '<label>'+f[1]+'<select id="'+id+'">'+VCAT.map(function(c){return '<option'+(c===val?' selected':'')+'>'+c+'</option>';}).join("")+'</select></label>';
    if(f[2]==="area")return '<label class="wide">'+f[1]+'<textarea id="'+id+'" style="min-height:70px">'+esc(val)+'</textarea></label>';
    return '<label'+(f[2]==="wide"?' class="wide"':'')+'>'+f[1]+'<input id="'+id+'" type="'+(f[2]==="date"?"date":"text")+'" value="'+esc(val)+'"'+(k==="phone"||k==="email"||k==="website"||k==="drive"?' dir="ltr"':'')+'></label>';}).join("")
   +'<label>الحالة<select id="vf_status">'+VST.map(function(x){return '<option value="'+x[0]+'"'+(x[0]===(v.status||"new")?' selected':'')+'>'+x[1]+'</option>';}).join("")+'</select></label>'
   +'<label>التقييم<select id="vf_rating"><option value="0">بدون</option>'+[1,2,3,4,5].map(function(n){return '<option value="'+n+'"'+(n===v.rating?' selected':'')+'>'+"★".repeat(n)+'</option>';}).join("")+'</select></label>'
   +'<div class="wide row">'+Object.keys(FAIRS).map(function(k){return '<label class="check" style="border:0"><input type="checkbox" data-vfair="'+k+'"'+((v.fairs||[]).indexOf(k)>=0?' checked':'')+'><span>'+esc(FAIRS[k].name)+'</span></label>';}).join("")+'</div></div>'
   +'<div class="row"><button class="btn primary" type="submit">حفظ</button><span class="small muted" id="vSaved"></span>'+(v.phone?'<span class="small">واتساب: <b dir="ltr">'+esc(v.phone)+'</b></span>':'')+(v.drive?'<a class="btn sm" href="'+esc(v.drive)+'" target="_blank" rel="noopener">فتح Drive</a>':'')+'<span style="flex:1"></span><button class="btn sm" type="button" id="vDel">حذف</button><span id="vDelC" hidden><span class="small up">متأكدة؟</span> <button class="btn sm" type="button" id="vDelY">أيوه احذف</button> <button class="btn sm" type="button" id="vDelN">لا</button></span></div></form>';
  /* files */
  h+='<div class="stack"><h3>الملفات اللي بعتوها</h3>'+(asx?'<div class="row"><input type="file" id="vFile" multiple accept="image/*,application/pdf,video/*,text/plain,text/csv"><span class="small muted" id="vUpMsg">صور، PDF، فيديو، أو نص. حتى 20 ميجا للملف. ملفات Excel وWord وAI ارفعيها على Drive وحطي اللينك فوق.</span></div>':'<div class="small muted">رفع الملفات متاح لصاحبة البورتال واللي معاهم صلاحية تعديل. استخدمي لينك Drive فوق.</div>')
   +((v.files||[]).length?'<div class="vfiles">'+v.files.map(function(f,i){var img=/^image\//.test(f.type||"");return '<div class="vfile">'+(img?'<img src="/_blob/'+esc(f.id)+'" alt="'+esc(f.name)+'" loading="lazy">':'<div class="vfic">'+esc((f.name.split(".").pop()||"FILE").toUpperCase())+'</div>')+'<div class="small" dir="auto" style="overflow-wrap:anywhere">'+esc(f.name)+'</div><div class="small muted">'+esc(f.d)+' · '+Math.max(1,Math.round((f.size||0)/1024))+' KB</div><div class="row"><a class="btn sm" href="/_blob/'+esc(f.id)+'" target="_blank" rel="noopener">فتح</a>'+(asx?'<button class="btn sm" type="button" data-fdel="'+i+'">حذف</button>':'')+'</div></div>';}).join("")+'</div>':'<div class="small muted">لسه مفيش ملفات.</div>')+'</div>';
  /* quotes */
  h+='<div class="stack"><h3>عروض الأسعار</h3><div class="row"><input id="vqItem" placeholder="البند (مثلاً: بوث 18 متر Gulfood)" style="flex:2;min-width:180px"><input id="vqAmt" type="number" min="0" step="any" placeholder="المبلغ" style="width:120px"><select id="vqCur"><option>USD</option><option>AED</option><option>EGP</option><option>SAR</option><option>MAD</option><option>EUR</option></select><label class="small">صالح لحد<input id="vqValid" type="date"></label><button class="btn" type="button" id="vqAdd">أضف العرض</button></div>'
   +((v.quotes||[]).length?'<div class="tblwrap"><table><thead><tr><th>التاريخ</th><th>البند</th><th>المبلغ</th><th>صالح لحد</th><th></th></tr></thead><tbody>'+v.quotes.map(function(q,i){var ex=q.valid&&q.valid<today;return '<tr><td class="small">'+esc(q.d)+'</td><td>'+esc(q.item)+'</td><td class="num"><b>'+fmt(q.amount)+'</b> '+esc(q.cur)+'</td><td class="small'+(ex?' up':'')+'">'+esc(q.valid||"—")+(ex?' · انتهى':'')+'</td><td><button class="btn sm" type="button" data-qdel="'+i+'">حذف</button></td></tr>';}).join("")+'</tbody></table></div>':'')+'</div>';
  /* rfq + log */
  h+='<details class="stack"><summary style="cursor:pointer;color:var(--accent)">رسالة طلب عرض سعر جاهزة</summary><div class="row" style="margin-top:8px"><select id="vRfqLang"><option value="ar">عربي</option><option value="en">English</option></select><button class="btn sm" type="button" id="vRfqCopy">نسخ</button></div><div class="copybox small" id="vRfq">'+esc(rfqText(v,"ar"))+'</div></details>';
  h+='<div class="stack"><h3>سجل التواصل</h3><div class="row"><select id="vlType">'+VLOG.map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>';}).join("")+'</select><input id="vlNote" placeholder="اللي حصل باختصار" style="flex:1;min-width:200px"><button class="btn" type="button" id="vlAdd">أضف</button></div>'
   +((v.log||[]).length?'<div class="tline">'+v.log.slice().reverse().map(function(x){var t=VLOG.filter(function(y){return y[0]===x.k;})[0];return '<div><span class="when">'+esc(x.d)+'</span><span><span class="tag t-mute">'+(t?t[1]:x.k)+'</span> '+esc(x.t)+'</span></div>';}).join("")+'</div>':'<div class="small muted">لسه مفيش تواصل مسجل.</div>')+'</div>';
  box.innerHTML=h;
  function cp(){return JSON.parse(JSON.stringify(v));}
  $("vClose").addEventListener("click",function(){vSel=null;renderVen();});
  $("vForm").addEventListener("submit",function(e){e.preventDefault();var n=cp();VF.forEach(function(f){n[f[0]]=$("vf_"+f[0]).value.trim();});n.status=$("vf_status").value;n.rating=+$("vf_rating").value||0;n.fairs=[];box.querySelectorAll("[data-vfair]").forEach(function(c){if(c.checked)n.fairs.push(c.dataset.vfair);});vPersist(n).then(function(){var s2=$("vSaved");if(s2)s2.textContent="اتحفظ";});});
  $("vDel").addEventListener("click",function(){$("vDelC").hidden=false;});$("vDelN").addEventListener("click",function(){$("vDelC").hidden=true;});$("vDelY").addEventListener("click",function(){vRemove(v.id);});
  $("vqAdd").addEventListener("click",function(){var it=$("vqItem").value.trim(),am=parseFloat($("vqAmt").value);if(!it||isNaN(am))return;var n=cp();n.quotes=(n.quotes||[]).concat([{d:today,item:it,amount:am,cur:$("vqCur").value,valid:$("vqValid").value||""}]);if((n.status||"new")==="new"||n.status==="rfq")n.status="quoted";n.log=(n.log||[]).concat([{d:today,k:"file",t:"عرض سعر: "+it+" "+am+" "+$("vqCur").value}]);vPersist(n);});
  box.querySelectorAll("[data-qdel]").forEach(function(b){b.addEventListener("click",function(){var n=cp();n.quotes.splice(+b.dataset.qdel,1);vPersist(n);});});
  $("vRfqLang").addEventListener("change",function(e){$("vRfq").textContent=rfqText(v,e.target.value);});
  $("vRfqCopy").addEventListener("click",function(){var t=$("vRfq").textContent,b=$("vRfqCopy");try{navigator.clipboard.writeText(t).then(function(){b.textContent="اتنسخ";var n=cp();if((n.status||"new")==="new"){n.status="rfq";n.log=(n.log||[]).concat([{d:today,k:"note",t:"اتبعت طلب عرض سعر"}]);vPersist(n);}},function(){});}catch(e){}});
  $("vlAdd").addEventListener("click",function(){var t=$("vlNote").value.trim();if(!t)return;var n=cp();n.log=(n.log||[]).concat([{d:today,k:$("vlType").value,t:t}]);vPersist(n);});
  if($("vFile"))$("vFile").addEventListener("change",async function(e){var fl=[].slice.call(e.target.files||[]),m=$("vUpMsg"),n=cp();n.files=n.files||[];
    for(var i=0;i<fl.length;i++){var f=fl[i];m.textContent="جاري رفع "+f.name+"...";try{var ext=(f.name.split(".").pop()||"").toLowerCase(),tp=f.type;if(!tp||/;/.test(tp)){tp={pdf:"application/pdf",txt:"text/plain",csv:"text/csv",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",mp4:"video/mp4"}[ext]||"";}
      var r=await asx.upload(f,tp?{type:tp}:undefined);n.files.push({id:r.id,name:f.name,type:r.contentType,size:r.sizeBytes,d:today});n.log=(n.log||[]).concat([{d:today,k:"file",t:"ملف: "+f.name}]);}
      catch(x){m.textContent="ما اترفعش "+f.name+": "+((x&&x.code)==="unsupported_type"?"النوع ده مش مدعوم، ارفعيه على Drive":(x&&x.code)==="too_large"?"أكبر من 20 ميجا":"حصل خطأ");}}
    await vPersist(n);});
  box.querySelectorAll("[data-fdel]").forEach(function(b){b.addEventListener("click",async function(){var n=cp(),f=n.files[+b.dataset.fdel];try{await asx.delete(f.id);}catch(x){}n.files.splice(+b.dataset.fdel,1);vPersist(n);});});
}
function vNew(){var v={id:"v"+Date.now().toString(36),name:"",cat:VCAT[0],status:"new",fairs:[],quotes:[],files:[],log:[],createdAt:todayISO()};VEN.push(v);vSel=v.id;if(!(dbh&&vShared))save("bk_ven",VEN);renderVen();setTimeout(function(){var el=$("vf_name");if(el)el.focus();},50);}
function vExport(){var wb=book();
  XLSX.utils.book_append_sheet(wb,sheet([["الشركة","التخصص","الدولة","المدينة","المسؤول","التليفون","الإيميل","الموقع","الخدمات","المعارض","الحالة","التقييم","الخطوة الجاية","موعدها","Drive","عدد الملفات"]].concat(VEN.map(function(v){return [v.name,v.cat,v.country,v.city,v.contactName,v.phone,v.email,v.website,v.services,(v.fairs||[]).map(function(k){return FAIRS[k]?FAIRS[k].name:k;}).join("، "),vst(v.status)[1],v.rating||"",v.nextAction,v.nextDue,v.drive,(v.files||[]).length];})),[26,20,12,12,18,16,24,24,40,30,14,8,40,12,40,10]),"الموردين");
  var q=[["الشركة","التاريخ","البند","المبلغ","العملة","صالح لحد"]];VEN.forEach(function(v){(v.quotes||[]).forEach(function(x){q.push([v.name,x.d,x.item,x.amount,x.cur,x.valid]);});});
  XLSX.utils.book_append_sheet(wb,sheet(q,[26,12,40,12,8,12]),"عروض الأسعار");
  var lg=[["الشركة","التاريخ","النوع","التفاصيل"]];VEN.forEach(function(v){(v.log||[]).forEach(function(x){var t=VLOG.filter(function(y){return y[0]===x.k;})[0];lg.push([v.name,x.d,t?t[1]:x.k,x.t]);});});
  XLSX.utils.book_append_sheet(wb,sheet(lg,[26,12,14,80]),"سجل التواصل");
  saveBook(wb,"DrBaker_Vendors_"+todayISO()+".xlsx","vNote");}
vLocal();
