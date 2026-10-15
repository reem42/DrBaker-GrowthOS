/* ================= v8 ================= */
/* ---- fair materials (Drive) ---- */
var DRIVE=DATA.drive||{};
var MAT_ST=[["todo","لم يبدأ","t-mute"],["design","تصميم","t-info"],["review","مراجعة","t-warn"],["approved","معتمد","t-good"],["printed","مطبوع/جاهز","t-brand"]];
var MAT={};/* fairId -> {key:{s,note}} */
function matLoad(){MAT=load("bk_mat",{});}
matLoad();
async function matSave(fid){
  if(dbh&&dShared){try{await dbh.doc("fairs/"+fid).set({items:MAT[fid]||{},updatedAt:new Date().toISOString()});}catch(e){}}
  save("bk_mat",MAT);
}
function renderMaterials(){
  var box=$("matBox");if(!box)return;
  var ids=Object.keys(FAIRS).filter(function(k){return fairSel==="all"||fairSel===k;});
  var h='<div class="row sp"><div class="stack" style="gap:2px"><div class="eyebrow">PRINT & BOOTH MATERIALS</div><h2>مطبوعات المعرض على Google Drive</h2></div>'+(DRIVE.root?'<a class="btn" href="'+esc(DRIVE.root)+'" target="_blank" rel="noopener">فتح مجلد المعارض كله</a>':'')+'</div>'
   +'<div class="small muted">ارفعي التصميمات في المجلد المناسب، وعلّمي حالة كل بند هنا عشان الفريق كله يشوف فين وصلنا.</div>';
  ids.forEach(function(fid){
    var d=DRIVE[fid];if(!d)return;var st=MAT[fid]||{};
    var doneN=d.sub.filter(function(s){var x=st[s[0]];return x&&(x.s==="approved"||x.s==="printed");}).length;
    h+='<div class="matfair"><div class="row sp"><h3>'+esc(FAIRS[fid].name)+'</h3><div class="row"><span class="small muted">'+doneN+' من '+d.sub.length+' جاهز</span><a class="btn sm primary" href="'+esc(d.root)+'" target="_blank" rel="noopener">فتح مجلد المعرض</a></div></div><div class="matgrid">'
     +d.sub.map(function(s){var x=st[s[0]]||{},cur=MAT_ST.filter(function(m){return m[0]===(x.s||"todo");})[0];
       return '<div class="matcard"><div class="row sp"><b dir="ltr">'+esc(s[1])+'</b><span class="tag '+cur[2]+'">'+cur[1]+'</span></div>'
        +'<div class="row"><a class="btn sm" href="'+esc(s[2])+'" target="_blank" rel="noopener">فتح / رفع ملفات</a><select data-mat="'+fid+'|'+s[0]+'" aria-label="الحالة">'+MAT_ST.map(function(m){return '<option value="'+m[0]+'"'+(m[0]===(x.s||"todo")?' selected':'')+'>'+m[1]+'</option>';}).join("")+'</select></div>'
        +'<input data-matn="'+fid+'|'+s[0]+'" placeholder="ملاحظة (المقاس، الكمية، مين مسؤول)" value="'+esc(x.note||"")+'"></div>';}).join("")+'</div></div>';
  });
  box.innerHTML=h;
  box.querySelectorAll("[data-mat]").forEach(function(sel){sel.addEventListener("change",function(){var p=sel.dataset.mat.split("|");MAT[p[0]]=MAT[p[0]]||{};MAT[p[0]][p[1]]=Object.assign({},MAT[p[0]][p[1]],{s:sel.value});matSave(p[0]);renderMaterials();});});
  box.querySelectorAll("[data-matn]").forEach(function(inp){inp.addEventListener("change",function(){var p=inp.dataset.matn.split("|");MAT[p[0]]=MAT[p[0]]||{};MAT[p[0]][p[1]]=Object.assign({},MAT[p[0]][p[1]],{note:inp.value.trim()});matSave(p[0]);});});
}

/* ---- pipeline: direct (no-fair) timeline, snooze, action-first detail ---- */
var DIRECT_LBL={cf:"تأكيد موعد مكالمة الفيديو",rm:"تذكير بالمكالمة",mt:"مكالمة الفيديو وتسجيل الاحتياج",ty:"Email شكر وملخص بعد المكالمة"};
function stepsFor(l){
  var f=FAIRS[l.fair],direct=!f;
  if(l.source==="موزع حالي")return [];
  var base=direct?addTo(l.addedAt||"2026-10-13",21):null,sz=l.snz||{};
  var arr=STEPS.map(function(s){var anchor=direct?base:(s.a==="s"?f.start:f.end);return {k:s.k,lbl:(direct&&DIRECT_LBL[s.k])||s.lbl,cond:s.cond,date:addTo(anchor,s.off+(sz[s.k]||0)),fb:EMAILSTEPS[s.k]&&!hasEmail(l)?fallbackCh(l):null};});
  if(l.action==="handoff_sales")arr.unshift({k:"hs",lbl:"تحويل لمسؤول المبيعات (حساب كبير)",date:addTo(direct?addTo(base,-21):f.start,(direct?0:-22)+(sz.hs||0))});
  return arr;
}
var STEP_TYPE={li:["LinkedIn","t-info"],em1:["Email","t-info"],em2:["Email","t-info"],wa:["WhatsApp","t-good"],cf:["Email","t-info"],rm:["Email","t-info"],mt:["اجتماع","t-brand"],ty:["Email","t-info"],sm:["عينات","t-warn"],hs:["تحويل للمبيعات","t-warn"],cl:["مكالمة","t-brand"],f2:["Email","t-info"],rv:["قرار","t-mute"]};
var HOW={
 li:["افتحي صفحة الشركة على LinkedIn واعملي Follow.","علّقي تعليق مفيد على آخر منشور ليهم (مش إعلان).","بعد 3 أيام ابعتي Email #1 على الإيميل العام."],
 em1:["ابعتي من إيميل الشركة الرسمي، مش Gmail شخصي.","أرفقي الكتالوج PDF أقل من 5 ميجا، أو لينك.","العنوان مختصر وصادق، وفي الآخر عنوان الشركة وسطر إلغاء الاشتراك.","لو مفيش إيميل عام: استخدمي نموذج الاتصال في موقعهم."],
 em2:["ابعتيها لو مفيش رد بعد 6 أيام بس.","ركّزي على خط واحد يناسبهم، مع صورة تطبيق.","لو ردوا: علّمي (العميل رد) وكمّلي على WhatsApp."],
 wa:["بس لو العميل رد أو وافق على واتساب.","رسالة قصيرة، وبعدين الكتالوج كملف.","سجّلي الموعد المتفق عليه."],
 cf:["دعوة تقويم فيها التاريخ والوقت (بتوقيت بلده) واللينك أو رقم الجناح.","حددي مين هيحضر من عندنا."],
 rm:["تذكير قبل الموعد بـ 3 أيام، سطرين بس."],
 mt:["افتحي الملف قبل اللقاء بـ 10 دقائق.","اسألي أسئلة الاكتشاف وسجّلي الإجابات في (سجّل نتيجة).","اختمي بخطوة جاية بتاريخ."],
 ty:["خلال 24 ساعة.","ملخص اللي اتفقنا عليه والخطوة الجاية بتاريخ."],
 sm:["العينات بتتشحن بعد طلب مكتوب وعنوان من الشركة بس.","كمّلي قائمة العينات تحت وسجلي رقم البوليصة.","تابعي بعد 3 أيام من الوصول بمكالمة."],
 hs:["حسابات كبيرة: مسؤول المبيعات يتواصل مباشرة.","ابعتيله ملخص العميل والمصدر والخط المناسب."],
 cl:["اتصلي على الرقم العام في أيام العمل الرسمية لبلد العميل.","اتبعي السيناريو، وسجّلي النتيجة فوراً."],
 f2:["زاوية جديدة: عرض أول طلبية أو موسم (رمضان).","لو مفيش رد بعد 3 محاولات: قفلي الملف."],
 rv:["قرري: تفاوض، أو نشرة شهرية، أو إغلاق."]
};
var OBJ=[["عندنا مورد بالفعل","طبيعي، أغلب عملائنا كان عندهم مورد. نقترح نجرب صنف واحد بس جنب المورد الحالي ونقارن الثبات والتكلفة لكل منتج نهائي."],
 ["السعر غالي","خلينا نحسبها بالتكلفة لكل كيكة أو قطعة، مش بالكيلو. ابعتلي استهلاكك الشهري وأعملك مقارنة مكتوبة."],
 ["ابعت كتالوج وخلاص","أكيد، هبعته النهارده على الإيميل الرسمي. إيه الخط اللي يهمكم أكتر عشان أبعت معاه البيانات الفنية؟"],
 ["مش وقته دلوقتي","تمام، إمتى بتخططوا لطلبيات الموسم الجاي؟ أتواصل معاكم قبلها بأسبوعين."],
 ["مش مهتمين","متشكرة لوقتك. هسجّل إنكم مش عايزين تواصل تاني."]];
var SMP=[["req","طلب مكتوب من الشركة (إيميل أو رسالة)"],["addr","اسم المستلم وعنوان الشحن من الشركة"],["items","الأصناف والكميات وتواريخ الصلاحية"],["docs","شهادة تحليل أو شهادة صحية لو الدولة بتطلبها"],["cold","تبريد للأصناف المبردة (كريمة)"],["handed","اتسلمت لمسؤول المبيعات"]];
function callScript(l){
  var ct=l.contact||{},n=cleanName(l);
  return '<div class="script"><div class="sstep"><b>1. الافتتاح (20 ثانية)</b><div>"صباح الخير، أنا '+esc(sender.name)+' من Dr. Baker، مصنع مصري لمكونات المخابز والحلويات من 1959 وعندنا مصنع في المدينة المنورة. ممكن أكلم المسؤول عن المشتريات أو المنتجات الجديدة؟"</div></div>'
   +'<div class="sstep"><b>2. سبب المكالمة</b><div>"بعتنالكم إيميل عن '+esc(l.fit||"منتجاتنا")+'. حابة أعرف إيه اللي بتشتغلوا عليه حالياً عشان أقترح حاجة تناسبكم."</div></div>'
   +'<div class="sstep"><b>3. أسئلة الاكتشاف</b><ul class="clean small"><li>بتشتروا إيه حالياً في الكريمة والحشوات والجلازات والسبريد؟ من مين؟</li><li>الكميات الشهرية تقريباً؟</li><li>أكبر مشكلة مع المورد الحالي (ثبات، سعر، توريد)؟</li><li>مين صاحب القرار، وإمتى بتطلبوا للموسم الجاي؟</li></ul></div>'
   +'<div class="sstep"><b>4. الاعتراضات</b>'+OBJ.map(function(o){return '<details class="obj"><summary>'+esc(o[0])+'</summary><div class="small">"'+esc(o[1])+'"</div></details>';}).join("")+'</div>'
   +'<div class="sstep"><b>5. القفلة</b><div>"أقترح أبعتلكم عينة من '+esc((l.fit||"").split("،")[0]||"الصنف المناسب")+' مع البيانات الفنية. ممكن عنوان الشحن والإيميل الرسمي؟ وأتابع معاكم يوم [التاريخ]."</div></div>'
   +(ct.generalPhone?'<div class="small">الرقم العام: <b dir="ltr">'+esc(ct.generalPhone)+'</b></div>':'<div class="small muted">مفيش رقم عام موثق. استخدمي صفحة التواصل.</div>')+'</div>';
}
function renderDetail(){
  var box=$("detail"),l=leads.filter(function(x){return x.id===sel;})[0];
  if(!l){box.innerHTML='<div class="eyebrow">LEAD FILE</div><h3>اختاري عميل من الـ Pipeline</h3><div class="muted small">هيفتحلك الإجراء المطلوب دلوقتي (مكالمة، إيميل، واتساب، عينات) بالسيناريو والنص الجاهز، والـ Timeline كامل.</div>';return;}
  var ct=l.contact||{},st=stepsFor(l),dm=doneMap(l),f=FAIRS[l.fair],today=todayISO();
  var h='<div class="row sp"><div><div class="eyebrow">LEAD FILE · '+esc(l.country)+'</div><h2>'+esc(cleanName(l))+'</h2></div><div class="row">'+(l.priority?'<span class="tag t-brand">أولوية '+esc(l.priority)+'</span>':'')+(l.confidence?'<span class="tag '+(l.confidence==="high"?"t-good":l.confidence==="medium"?"t-warn":"t-bad")+'">ثقة '+({high:"عالية",medium:"متوسطة",low:"منخفضة"}[l.confidence]||l.confidence)+'</span>':'')+'</div></div>'
   +'<div class="small muted">'+esc([l.city,l.type].filter(Boolean).join(" · "))+(l.website?' · <a href="'+esc(l.website)+'" target="_blank" rel="noopener" dir="ltr">'+esc(host(l.website)||l.website)+'</a>':'')+'</div>'
   +(l.fit?'<div class="small"><b>الخط المناسب:</b> '+esc(l.fit)+'</div>':'')
   +(l.evidence?'<div class="small"><b>ليه العميل ده:</b> '+esc(l.evidence)+'</div>':'')
   +'<div class="small"><b>اتصال عام:</b> '+(ct.genericEmail?'<span dir="ltr">'+esc(ct.genericEmail)+'</span>':'إيميل غير موثق')+(ct.generalPhone?' · <span dir="ltr">'+esc(ct.generalPhone)+'</span>':'')+(ct.contactPageUrl?' · <a href="'+esc(ct.contactPageUrl)+'" target="_blank" rel="noopener">صفحة التواصل</a>':'')+' · المصادر: '+(l.sources||[]).map(function(s){return '<a href="'+esc(s)+'" target="_blank" rel="noopener">'+esc(host(s)||"رابط")+'</a>';}).join("، ")+'</div>'
   +'<div class="row"><label>المرحلة<select id="dStageSel">'+STAGES.map(function(s){return '<option value="'+s[0]+'"'+(s[0]===l.stage?" selected":"")+'>'+s[1]+'</option>';}).join("")+'</select></label><label class="check" style="border:0;padding:0"><input type="checkbox" id="repBox"'+(l.replied?" checked":"")+'><span>العميل رد على تواصلنا</span></label></div>';
  if(l.dnc){h+='<div class="warnbox">العميل ده طلب عدم التواصل. كل الخطوات وقفت.</div>';}
  else if(!st.length){h+='<div class="note">ده موزع قائم. تابعيه من صفحة "متابعة الموزعين".</div>';}
  else{
    var cur=nextStep(l);
    if(cur){
      var ty=STEP_TYPE[cur.k]||["",""],od=cur.date<today,o=stepOut(l,cur);
      h+='<div class="nowcard"><div class="row sp"><div class="row"><span class="tag '+ty[1]+'">'+ty[0]+'</span><b class="nowt">'+esc(cur.lbl)+'</b></div><span class="tag '+(od?'t-bad':cur.date===today?'t-brand':'t-mute')+'">'+(od?'متأخر · ':cur.date===today?'النهارده · ':'')+dLabel(cur.date)+'</span></div>'
       +(f?'<div class="small muted">مرتبط بـ '+esc(f.name)+'</div>':'<div class="small muted">تواصل مباشر (مفيش معرض): اللقاء مكالمة فيديو</div>')
       +'<div class="how"><b>إزاي تنفذيها</b><ul class="clean small">'+(HOW[cur.k]||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul></div>';
      if(cur.k==="cl"||cur.k==="mt")h+=callScript(l);
      if(cur.k==="sm"||cur.k==="hs"){var sp=l.sample||{};h+='<div class="stack"><b>قائمة العينات</b>'+SMP.map(function(s){return '<label class="check"><input type="checkbox" data-smp="'+s[0]+'"'+((sp.c||{})[s[0]]?" checked":"")+'><span>'+esc(s[1])+'</span></label>';}).join("")+'<div class="row"><label>شركة الشحن ورقم البوليصة<input id="smpAwb" value="'+esc(sp.awb||"")+'" dir="ltr"></label><label>الوصول المتوقع<input id="smpEta" type="date" value="'+esc(sp.eta||"")+'"></label></div></div>';}
      if(o.warn)h+='<div class="warnbox">'+esc(o.warn)+'</div>';
      if(EMAILSTEPS[cur.k]&&!sender.addr)h+='<div class="warnbox">ضيفي العنوان البريدي للشركة في بيانات المُرسل قبل الإرسال.</div>';
      if(o.text&&cur.k!=="cl"&&cur.k!=="mt"){
        if(EMAILSTEPS[cur.k])h+='<label>اللغة<select id="langSel"><option value="en"'+((l._lang||l.language)==="en"?" selected":"")+'>English</option><option value="ar"'+((l._lang||l.language)==="ar"?" selected":"")+'>عربي</option></select></label>';
        if(o.to)h+='<div class="small"><b>إلى:</b> <span dir="ltr">'+esc(o.to)+'</span></div>';
        if(o.subject)h+='<div class="small"><b>العنوان:</b> <span dir="auto">'+esc(o.subject)+'</span></div>';
        if(o.note)h+='<div class="small muted">'+esc(o.note)+'</div>';
        h+='<textarea id="draft" aria-label="النص">'+esc(o.text)+'</textarea><div class="row"><button class="btn" id="copyBtn" type="button">نسخ النص</button><span class="small muted" id="copyMsg"></span></div>';
      }
      h+='<div class="outcome"><input id="outNote" placeholder="سجّلي اللي حصل: رد، معاد، اعتراض، طلب عينة..."><div class="row"><button class="btn primary" type="button" id="stDone">تم ✓</button><button class="btn" type="button" id="stSnooze">أجّلي 3 أيام</button><button class="btn" type="button" id="stLog">سجّلي ملاحظة بس</button></div></div></div>';
    } else h+='<div class="note">كل خطوات الـ Timeline خلصت. قرري: تفاوض، نشرة شهرية، أو إغلاق.</div>';
    h+='<div class="stack" style="gap:0"><h3>الـ Timeline</h3><div class="tl2">'+st.map(function(s){var dn=dm[s.k],act=stepActive(l,s),isCur=cur&&cur.k===s.k,od=!dn&&act&&s.date<today,ty=STEP_TYPE[s.k]||[""];
      return '<div class="tli'+(dn?' done':'')+(isCur?' cur':'')+(act?'':' off')+'"><span class="dot"></span><span class="when">'+dLabel(s.date)+'</span><span><b>'+esc(s.lbl)+'</b> <span class="muted small">'+ty[0]+(act?'':' · بعد رد العميل')+(od?' · متأخر':'')+(dn?' · تم '+esc(dn):'')+'</span></span><input type="checkbox" data-step="'+s.k+'"'+(dn?" checked":"")+(act?"":" disabled")+' aria-label="'+esc(s.lbl)+'"></div>';}).join("")+'</div></div>';
  }
  h+='<details><summary class="small" style="cursor:pointer;color:var(--accent)">قائمة الالتزام وعدم التواصل</summary>'+COMPLY.map(function(k){return '<label class="check"><input type="checkbox" data-k="'+k[0]+'"'+(l.checks&&l.checks[k[0]]?" checked":"")+'><span>'+k[1]+'</span></label>';}).join("")
   +'<label class="check"><input type="checkbox" id="dncBox"'+(l.dnc?" checked":"")+'><span><b>طلب عدم التواصل / إلغاء الاشتراك</b> (يوقف كل الخطوات)</span></label></details>'
   +'<div><h3>السجل</h3>'+((l.log||[]).length?'<div class="tline">'+l.log.slice().reverse().map(function(x){return '<div><span class="when">'+x.d+'</span><span class="small">'+esc(x.t)+'</span></div>';}).join("")+'</div>':'<div class="small muted">لسه مفيش تواصل مسجل.</div>')+'</div>';
  box.innerHTML=h;
  function logIt(t){l.log=l.log||[];l.log.push({d:today,t:t});}
  $("dStageSel").addEventListener("change",function(e){l.stage=e.target.value;logIt("المرحلة: "+stageName(l.stage));persist();refreshAll();});
  $("repBox").addEventListener("change",function(e){l.replied=e.target.checked;if(l.replied)logIt("العميل رد");persist();refreshAll();});
  box.querySelectorAll("[data-k]").forEach(function(x){x.addEventListener("change",function(){l.checks=l.checks||{};l.checks[x.dataset.k]=x.checked;persist();});});
  $("dncBox").addEventListener("change",function(e){l.dnc=e.target.checked;if(l.dnc)logIt("عدم تواصل: توقفت كل الخطوات");persist();refreshAll();});
  box.querySelectorAll("[data-step]").forEach(function(c){c.addEventListener("change",function(){var k=c.dataset.step;if(c.checked){dm[k]=today;var s=st.filter(function(x){return x.k===k;})[0];logIt("تم: "+(s?s.lbl:k));if(l.stage==="new"&&(k==="li"||k==="em1"||k==="mt"))l.stage="contacted";if(k==="sm")l.stage="samples";}else delete dm[k];persist();refreshAll();});});
  box.querySelectorAll("[data-smp]").forEach(function(c){c.addEventListener("change",function(){l.sample=l.sample||{};l.sample.c=l.sample.c||{};l.sample.c[c.dataset.smp]=c.checked;persist();});});
  if($("smpAwb"))$("smpAwb").addEventListener("change",function(e){l.sample=l.sample||{};l.sample.awb=e.target.value.trim();if(l.sample.awb)logIt("عينات اتشحنت: "+l.sample.awb);persist();});
  if($("smpEta"))$("smpEta").addEventListener("change",function(e){l.sample=l.sample||{};l.sample.eta=e.target.value;persist();});
  if($("langSel"))$("langSel").addEventListener("change",function(e){l._lang=e.target.value;renderDetail();});
  if($("copyBtn"))$("copyBtn").addEventListener("click",function(){var t=$("draft").value,m=$("copyMsg");try{navigator.clipboard.writeText(t).then(function(){m.textContent="اتنسخ";},function(){$("draft").select();m.textContent="النص متحدد، انسخيه";});}catch(e){$("draft").select();}});
  var cur2=nextStep(l);
  if($("stDone"))$("stDone").addEventListener("click",function(){var n=$("outNote").value.trim();dm[cur2.k]=today;logIt("تم: "+cur2.lbl+(n?" · "+n:""));if(l.stage==="new"&&(cur2.k==="li"||cur2.k==="em1"||cur2.k==="mt"))l.stage="contacted";if(cur2.k==="sm")l.stage="samples";persist();refreshAll();});
  if($("stSnooze"))$("stSnooze").addEventListener("click",function(){l.snz=l.snz||{};l.snz[cur2.k]=(l.snz[cur2.k]||0)+3;logIt("تأجيل 3 أيام: "+cur2.lbl);persist();refreshAll();});
  if($("stLog"))$("stLog").addEventListener("click",function(){var n=$("outNote").value.trim();if(!n)return;logIt(n);persist();renderDetail();});
}

/* ---- distributor co-marketing plan ---- */
var LANGS={gulf:"عربي خليجي",eg:"عربي مصري",fr:"فرنسي",en:"English"};
function dLang(d){var c=d.country||"";if(/السعودية|الإمارات|الكويت|قطر|عُمان|البحرين/.test(c))return "gulf";if(/مصر/.test(c))return "eg";if(/المغرب|الجزائر|تونس/.test(c))return "fr";if(/الأردن|العراق|لبنان|ليبيا/.test(c))return "gulf";return "en";}
function capFor(lang,kind,d){
  var n=d.name||"[الموزع]",p=(d.products||"كريمة الخفق والحشوات والجلازات").split(/[،,]/)[0];
  var T={
   gulf:{hero:"جديدنا عند "+n+": "+p+" من Dr. Baker 🍰\nجودة ثابتة من مصنعنا في المدينة المنورة.\nاطلبها الحين من "+n+" (الرابط في أول تعليق).",
         recipe:"وصفة اليوم بـ "+p+" من Dr. Baker:\n[الخطوات باختصار]\nجرّبها في مخبزك واطلب من "+n+".",
         client:"شكراً لـ [اسم المخبز] على الثقة 👏\nكيكتهم اليوم معمولة بـ "+p+" من Dr. Baker، متوفر عند "+n+".",
         offer:"عرض الموسم للمخابز: [العرض] على "+p+" من Dr. Baker لين [التاريخ].\nللطلب: راسل "+n+" على الخاص."},
   eg:{hero:"وصل عند "+n+": "+p+" من Dr. Baker 🍰\nجودة ثابتة من 1959.\nاطلب دلوقتي من "+n+" (اللينك في أول كومنت).",
       recipe:"وصفة النهارده بـ "+p+" من Dr. Baker:\n[الخطوات باختصار]\nجربها في محلك واطلب من "+n+".",
       client:"شكراً لـ [اسم المحل] 👏 التورتة دي معمولة بـ "+p+" من Dr. Baker، متوفر عند "+n+".",
       offer:"عرض الموسم: [العرض] على "+p+" من Dr. Baker لحد [التاريخ]. للطلب ابعت رسالة لـ "+n+"."},
   fr:{hero:"Nouveau chez "+n+" : "+p+" Dr. Baker 🍰\nQualité constante, fabriqué en Égypte depuis 1959.\nCommandez auprès de "+n+" (lien en premier commentaire).",
       recipe:"Recette du jour avec "+p+" Dr. Baker :\n[étapes]\nDisponible chez "+n+".",
       client:"Merci à [pâtisserie] 👏 Leur gâteau du jour est réalisé avec "+p+" Dr. Baker, disponible chez "+n+".",
       offer:"Offre de saison pour les pâtisseries : [offre] sur "+p+" Dr. Baker jusqu'au [date]. Contactez "+n+" en message privé."},
   en:{hero:"Now at "+n+": Dr. Baker "+p+" 🍰\nConsistent quality, made in Egypt since 1959.\nOrder from "+n+" (link in the first comment).",
       recipe:"Recipe of the day with Dr. Baker "+p+":\n[steps]\nAvailable at "+n+".",
       client:"Thank you [bakery] 👏 Today's cake is made with Dr. Baker "+p+", available at "+n+".",
       offer:"Seasonal offer for bakeries: [offer] on Dr. Baker "+p+" until [date]. Message "+n+" to order."}};
  return T[lang][kind];
}
function mktPlan(d){
  var m=d.mkt||{},bud=num(m.budget)!=null?num(m.budget):(num(d.supportBudget)?Math.round(num(d.supportBudget)/12):500),lang=m.lang||dLang(d);
  var split=[["إعلانات ممولة (Meta/LinkedIn)",.45],["أنشطة أوفلاين: ديمو وعينات",.30],["إنتاج محتوى وتصوير",.15],["احتياطي",.10]];
  var media=bud*.45,reach=[[ "متحفظ",6],["واقعي",4],["متفائل",2.5]].map(function(x){return [x[0],Math.round(media/x[1]*1000)];});
  var posts=[["الأسبوع 1","Reel منتج (15 ثانية)","hero"],["الأسبوع 1","بوست وصفة/تطبيق","recipe"],["الأسبوع 2","صورة عميل مخبز (بموافقته)","client"],["الأسبوع 2","Story: سؤال للمخابز","recipe"],["الأسبوع 3","Reel ديمو من المخبز","hero"],["الأسبوع 3","بوست وصفة/تطبيق","recipe"],["الأسبوع 4","عرض الموسم أو آخر موعد طلب","offer"],["الأسبوع 4","شكر عميل/نتيجة الديمو","client"]];
  var off=[["كل شهر","يوم ديمو في أكبر 2 مخابز عند الموزع","الشيف بتاعنا أو شيف الموزع، والمنتج من الموزع"],["كل شهر","10 علب عينات لمخابز جديدة","بعد طلب المخبز، والمتابعة من مندوب الموزع"],["كل ربع","ورشة تدريب للشيفات (15 إلى 25 شيف)","مكان عند الموزع، شهادة حضور باسم Dr. Baker"],["كل ربع","مواد نقطة البيع: بوسترات وستاندات","تصميم من عندنا وطباعة عند الموزع"],["حسب الموسم","مشاركة في معرض محلي","بعد موافقة على الميزانية"]];
  var kpi=["عدد استفسارات المخابز (رسائل واتساب/فيسبوك) شهرياً","حضور الديمو وعدد اللي طلبوا بعده","تحويل العينات لطلبيات (هدف 20% أو أكثر)","نمو مشتريات الموزع من Dr. Baker مقارنة بالربع اللي فات"];
  return {bud:bud,lang:lang,split:split,reach:reach,posts:posts,off:off,kpi:kpi};
}
function renderMkt(d){
  var P=mktPlan(d),box=$("dMkt");if(!box)return;
  box.innerHTML='<div class="row sp"><div><div class="eyebrow">CO-MARKETING PLAN</div><h3>خطة التسويق مع '+esc(d.name||"الموزع")+'</h3></div><button class="btn sm" type="button" id="mkDl">تنزيل الخطة (Excel)</button></div>'
   +'<div class="row"><label>الميزانية الشهرية ($)<input id="mkBud" type="number" min="0" value="'+P.bud+'"></label><label>لغة المحتوى<select id="mkLang">'+Object.keys(LANGS).map(function(k){return '<option value="'+k+'"'+(k===P.lang?' selected':'')+'>'+LANGS[k]+'</option>';}).join("")+'</select></label></div>'
   +'<div class="grid g2"><div class="stack"><b>توزيع الميزانية</b>'+P.split.map(function(s){return '<div class="prow" style="grid-template-columns:1.6fr 1.4fr 70px"><span>'+s[0]+'</span><div class="bar br"><i style="width:'+s[1]*100+'%"></i></div><span class="num">$'+fmt(P.bud*s[1])+'</span></div>';}).join("")
   +'<div class="small muted">الوصول المتوقع من الإعلانات (تقدير، مبني على تكلفة ألف ظهور 2.5 إلى 6 دولار):</div><div class="row">'+P.reach.map(function(r){return '<span class="tag t-mute">'+r[0]+': '+fmt(r[1])+' ظهور</span>';}).join("")+'</div><div class="small muted">الحد الأدنى العملي للإعلان: حوالي 5 دولار في اليوم لكل حملة، يعني 150 دولار في الشهر على الأقل.</div></div>'
   +'<div class="stack"><b>مؤشرات النجاح</b><ul class="clean small">'+P.kpi.map(function(k){return '<li>'+esc(k)+'</li>';}).join("")+'</ul></div></div>'
   +'<div class="stack"><b>أونلاين: 8 بوستات في الشهر على صفحات الموزع</b><div class="tblwrap"><table><thead><tr><th>التوقيت</th><th>النوع</th><th>النص الجاهز</th><th></th></tr></thead><tbody>'+P.posts.map(function(p,i){return '<tr><td class="small">'+p[0]+'</td><td class="small">'+p[1]+'</td><td><div class="copybox small" dir="'+(P.lang==="en"||P.lang==="fr"?"ltr":"rtl")+'" id="cap'+i+'">'+esc(capFor(P.lang,p[2],d))+'</div></td><td><button class="btn sm" type="button" data-cap="'+i+'">نسخ</button></td></tr>';}).join("")+'</tbody></table></div><div class="small muted">النشر من صفحة الموزع باسمه، وإحنا بنسلّم التصميمات والنصوص. الرابط في أول كومنت، ومفيش أرقام تليفون في الكومنتات.</div></div>'
   +'<div class="stack"><b>أوفلاين</b><div class="tblwrap"><table><thead><tr><th>التكرار</th><th>النشاط</th><th>التنفيذ</th></tr></thead><tbody>'+P.off.map(function(o){return '<tr><td class="small">'+o[0]+'</td><td>'+esc(o[1])+'</td><td class="small">'+esc(o[2])+'</td></tr>';}).join("")+'</tbody></table></div></div>';
  function saveMk(){var n=JSON.parse(JSON.stringify(d));n.mkt={budget:num($("mkBud").value),lang:$("mkLang").value};dPersist(n);}
  $("mkBud").addEventListener("change",saveMk);$("mkLang").addEventListener("change",saveMk);
  box.querySelectorAll("[data-cap]").forEach(function(b){b.addEventListener("click",function(){var t=$("cap"+b.dataset.cap).textContent;try{navigator.clipboard.writeText(t).then(function(){b.textContent="اتنسخ";},function(){});}catch(e){}});});
  $("mkDl").addEventListener("click",function(){var wb=book();
    XLSX.utils.book_append_sheet(wb,sheet([["البند","النسبة","المبلغ $"]].concat(P.split.map(function(s){return [s[0],s[1],Math.round(P.bud*s[1])];})).concat([[],["السيناريو","الظهور المتوقع"]]).concat(P.reach),[40,10,12]),"الميزانية");
    XLSX.utils.book_append_sheet(wb,sheet([["التوقيت","النوع","النص"]].concat(P.posts.map(function(p){return [p[0],p[1],capFor(P.lang,p[2],d)];})),[12,30,90]),"بوستات الشهر");
    XLSX.utils.book_append_sheet(wb,sheet([["التكرار","النشاط","التنفيذ"]].concat(P.off),[14,50,60]),"أوفلاين");
    XLSX.utils.book_append_sheet(wb,sheet([["مؤشرات النجاح"]].concat(P.kpi.map(function(k){return [k];})),[80]),"المؤشرات");
    saveBook(wb,"DrBaker_CoMarketing_"+(d.name||"distributor").replace(/[^A-Za-z0-9]+/g,"_")+".xlsx","dNote");});
}
