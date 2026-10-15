/* ---------- v11 fairs directory (db: fairplan) ---------- */
/* [id, name, country, city/venue, start, end, confirmed, fieldKey, fit(1-3), why, src] ; start "" = date not announced, end holds the text */
var FCAL_RAW=[
 ["hace26","HACE Hotel Expo","مصر","القاهرة · EIEC","2026-10-19","2026-10-21",1,"hor",3,"مخابز وحلواني وفنادق مصر تحت سقف واحد. فاضل عليه أيام، فالأنسب زيارة ومقابلة عملاء.","https://www.tradefairdates.com/Hace-Hotel-Expo-M5364/Cairo.html"],
 ["foodafrica26","Food Africa","مصر","القاهرة · EIEC","2026-12-07","2026-12-10",1,"food",3,"أكبر معرض أغذية في مصر، وبيجيله مستوردين عرب وأفارقة. تكلفة المشاركة أقل بكتير من دبي.","https://www.foodtechbiz.com/events-list/food-africa-7-to-10-december-2026-at-egypt-international-exhibition-center-cairo"],
 ["interpackmea26","interpack MEA","مصر","القاهرة · EIEC (مع Food Africa)","2026-12-07","2026-12-10",1,"pack",1,"تغليف وماكينات. مفيد لمكينة ولمقابلة موردي العبوات، مش لبيع المكونات.","https://www.foodtechbiz.com/events-list/interpack-mea-7-to-10-december-2026-at-egypt-international-exhibition-center-cairo"],
 ["fiafrica27","Fi Africa + ProPak MENA","مصر","القاهرة · EIEC","2027-06-01","2027-06-03",1,"ing",3,"معرض المكونات المتخصص: الزوار مصانع حلويات ومخابز وأغذية، ودول جمهورنا بالظبط.","https://www.figlobal.com/africa/en/useful-info/faqs.html"],
 ["egysweet","Egy Sweet","مصر","القاهرة · مركز المؤتمرات CICC","","يونيو غالباً (موعد الدورة الجاية مش معلن)",0,"sweet",3,"متخصص في الحلويات والمخابز ومكوناتها. آخر دورة يونيو 2025. اسألي المنظم Trust International Group (info@trustexpo.com).","https://www.tradefairdates.com/Egy-Sweet-amp-M2705/Cairo.html"],
 ["gm","Gulfood Manufacturing","الإمارات","دبي · DWTC","2026-11-03","2026-11-05",1,"ing",3,"معرضنا الرئيسي. قاعات المكونات 5 إلى 9.","https://www.gulfoodmanufacturing.com/"],
 ["ismme26","ISM Middle East","الإمارات","دبي · DWTC (جوه Gulfood Manufacturing)","2026-11-03","2026-11-05",1,"sweet",3,"معرض الحلويات والسناكس من Koelnmesse. مستوردين الشوكولاتة والحلويات في نفس رحلتنا.","https://www.tradefairdates.com/ISM-Middle-East-amp-M14023/Dubai.html"],
 ["gulfood27","Gulfood 2027","الإمارات","دبي · DWTC وExpo City","2027-03-15","2027-03-19",1,"food",2,"أكبر معرض أغذية في المنطقة. مناسب لمتابعة موزعي Gulfood Manufacturing.","https://portugalglobal.pt/noticias/2026/setembro/gulfood-2027-reune-industria-alimentar-global-no-dubai/"],
 ["foodexruh26","Foodex Saudi (الرياض)","السعودية","الرياض","2026-11-16","2026-11-18",1,"food",2,"أغذية عامة في الرياض. بين Gulfood Manufacturing وAfrica Food Show.","https://www.showsbee.com/fairs/78189-Foodex-Saudi-2027.html"],
 ["foodexjed26","Foodex Saudi (جدة)","السعودية","جدة · JIECC","2026-11-23","2026-11-25",1,"food",3,"17% من العارضين في قسم Sweets, Snacks & Bakery. قريب من مصنع المدينة.","https://www.foodexsaudiexpo.com/en/aboutfoodex/"],
 ["saudihoreca26","Saudi Horeca","السعودية","الرياض · RFECC","2026-12-07","2026-12-09",1,"hor",3,"ضيافة وحلويات ومخابز، ومعاه صالون الشوكولاتة والحلويات. نفس أسبوع Food Africa.","https://www.tradefairdates.com/Saudi-Horeca-amp-M11837/Riyadh.html"],
 ["saudifood27","The Saudi Food Show","السعودية","الرياض · RFECC","","سبتمبر 2027 تقريباً (دورة 2026 كانت 27–29 سبتمبر)",0,"food",2,"معرض أغذية سنوي كبير في الرياض. استني إعلان موعد 2027.","https://www.tradefairdates.com/The-Saudi-Food-Show-amp-M2837/Riyadh.html"],
 ["afs","Africa Food Show","المغرب","الدار البيضاء","2026-11-18","2026-11-20",1,"food",3,"معرضنا التاني. بوابة غرب وشمال أفريقيا.","https://www.foodexport.org/events/market-entry/product-showcases/r26aex1"],
 ["siam27","SIAM","المغرب","مكناس","2027-04-19","2027-04-27",1,"agri",1,"معرض زراعي بالأساس. زيارة بس لو فيه اجتماعات.","https://www.ntradeshows.com/agriculture/meknes-0/"],
 ["djazagro27","Djazagro","الجزائر","الجزائر العاصمة · SAFEX","2027-04-12","2027-04-15",1,"food",3,"أكبر معرض أغذية ومكونات ومخابز في الجزائر، وفيه قطاع مخابز وحلويات واضح.","https://www.german-pavilion.com/en/djazagro-2027"],
 ["libyafood27","Libya Food Expo","ليبيا","طرابلس · معرض طرابلس الدولي","","مارس 2027 (غير مؤكد)",0,"food",2,"سوق جار يوصله الشحن البري من مصر. أكّدي الموعد مع المنظم (info@iec.ly).","https://www.eventseye.com/messen/f-libya-food-expo-31274-2.html"],
 ["agropackiraq26","Agro Pack & Food Iraq","العراق","أربيل · أرض المعارض الدولية","2026-11-23","2026-11-26",1,"food",2,"أغذية ومكونات وتغليف. نفس أسبوع Foodex جدة.","https://www.iraq-agrofood.com/"],
 ["horecajo27","HORECA Jordan","الأردن","عمّان · JIEC","","أكتوبر 2027 تقريباً (دورة 2026 كانت 11–13 أكتوبر)",0,"hor",2,"ضيافة وحلويات في الأردن. خططي لنسخة 2027 بدري.","https://www.tradefairdates.com/HORECA-JORDAN-M12621/Amman.html"],
 ["horecakw27","HORECA Kuwait","الكويت","الكويت · أرض المعارض الدولية","2027-04-12","2027-04-14",1,"hor",2,"ضيافة وأغذية للمحترفين بس.","https://www.tradefairdates.com/Catering-Hospitality-Trade-Fairs-Kuwait-FSL74-L121-S1.html"],
 ["horecalb26","HORECA Lebanon","لبنان","بيروت · Seaside Arena","2026-11-10","2026-11-13",1,"hor",1,"قوي في الحلويات والشيفات. السوق صغير ومخاطره عالية.","https://www.tradefairdates.com/HORECA-LEBANON-M6131/Beirut.html"],
 ["horecaom27","HORECA Oman","عُمان","مسقط · OCEC","","سبتمبر 2027 تقريباً (دورة 2026 كانت 14–16 سبتمبر)",0,"hor",1,"سوق صغير. زيارة لو فيه موزع مهتم.","https://www.showsbee.com/fairs/65182-HORECA-Oman-2026.html"],
 ["foodqatar27","Food Qatar","قطر","الدوحة · DECC","","أكتوبر 2027 تقريباً (دورة 2026 كانت 12–14 أكتوبر)",0,"food",1,"معرض محلي مع Hospitality Qatar.","https://www.qatarliving.com/en/article/qatar-food-exhibition-dates-exhibitors-visitor-info"],
 ["afskenya27","Africa Food Show Kenya","كينيا","نيروبي · Bomas","2027-10-27","2027-10-29",1,"food",2,"نفس منظم معرض الدار البيضاء (MIE Events). بوابة شرق أفريقيا.","https://www.showsbee.com/fairs/68301-Africa-Food-Show-Kenya-2027.html"],
 ["afssa27","Africa Food Show South Africa","جنوب أفريقيا","كيب تاون · CTICC","2027-06-22","2027-06-24",1,"food",1,"سوق بعيد ومنافسة محلية قوية. للاستكشاف بس.","https://www.tradefairdates.com/Africas-Big-7-M11819/Cape-Town.html"],
 ["worldfoodist26","WorldFood Istanbul","تركيا","إسطنبول · IFM","2026-12-15","2026-12-18",1,"food",2,"شركات أغذية مصرية شاركت فيه قبل كده. مفيد لدراسة المنافسين الأتراك.","https://www.showsbee.com/fairs/84080-WorldFood-Istanbul-2027.html"],
 ["sial26","SIAL Paris","فرنسا","باريس · Paris Nord Villepinte","2026-10-17","2026-10-21",1,"food",1,"أكبر معرض أغذية في العالم، وبيبدأ بعد يومين. متابعة الأخبار بس.","https://www.sialparis.com/en/pratical-info/dates-venue-opening-times"],
 ["ism27","ISM Cologne","ألمانيا","كولونيا","2027-01-31","2027-02-03",1,"sweet",2,"المعرض العالمي للحلويات والسناكس. زيارة لمعرفة التريندات والمنافسين.","https://www.liaa.gov.lv/en/event/crafting-sweet-partnerships-meet-us-latvia-national-pavilion-during-ism-cologne-2027"],
 ["anuga27","Anuga","ألمانيا","كولونيا","2027-10-09","2027-10-13",1,"food",2,"معرض أغذية عالمي كل سنتين. فيه جناح مصري عادة.","https://www.anuga.com/trade-fair/anuga/dates-opening-hours/"],
 ["iddba27","IDDBA","الولايات المتحدة","أتلانتا","2027-06-06","2027-06-08",1,"sweet",2,"ألبان وديلي ومخابز التجزئة الأمريكية. لما نقرر ندخل أمريكا.","https://www.iddba.org/iddba-show/iddba-2027"],
 ["fancyfood27","Summer Fancy Food Show","الولايات المتحدة","نيويورك · Javits","2027-07-25","2027-07-27",0,"food",1,"أغذية متخصصة ومستوردة. التاريخ من مصدر واحد، أكّديه.","https://www.expobeds.com/event/summer-fancy-food-show/2027"]
];
var FFIELD={ing:"مكونات",sweet:"حلويات ومخبوزات",hor:"ضيافة وHoReCa",food:"أغذية عامة",pack:"تغليف وماكينات",agri:"زراعي"};
var FPST=[["","لسه"],["watch","متابعة"],["study","بندرسه"],["visit","هنزور"],["exhibit","هنشارك كعارض"],["no","مش مناسب"]];
var FPCL={watch:"t-mute",study:"t-info",visit:"t-warn",exhibit:"t-good",no:"t-bad"};
var FCAL=FCAL_RAW.map(function(r){return {id:r[0],n:r[1],c:r[2],city:r[3],s:r[4],e:r[5],conf:!!r[6],f:r[7],fit:r[8],why:r[9],u:r[10]};});
var FPLAN=load("bk_fplan",{}),fpShared=false,fcC="all",fcFit="0",fcPast=false;
function fcal(id){return FCAL.filter(function(x){return x.id===id;})[0];}
function fairName(id){var f=fcal(id);return f?f.n+(FAIRS[id]?"":" · "+f.c):(FAIRS[id]?FAIRS[id].name:id);}
function fcWhen(f){if(!f.s)return esc(f.e);var a=new Date(utc(f.s)),b=new Date(utc(f.e));return (a.getUTCMonth()===b.getUTCMonth()?a.getUTCDate()+"–"+b.getUTCDate()+" "+MN[a.getUTCMonth()]:a.getUTCDate()+" "+MN[a.getUTCMonth()]+" – "+b.getUTCDate()+" "+MN[b.getUTCMonth()])+" "+b.getUTCFullYear();}
function fcLeft(f){if(!f.s)return '<span class="tag t-mute">موعد غير معلن</span>';var d=daysTo(f.s),dd=daysTo(f.e);return d>0?'<span class="tag '+(d<=30?"t-warn":"t-mute")+'">بعد '+d+' يوم</span>':dd>=0?'<span class="tag t-good">شغال الآن</span>':'<span class="tag t-mute">انتهى</span>';}
function fcUp(f){return !f.s||daysTo(f.e)>=0;}
function fcSorted(){return FCAL.slice().sort(function(a,b){return (a.s||"9"+a.e)<(b.s||"9"+b.e)?-1:1;});}
function fpSave(id,st){FPLAN[id]=Object.assign({},FPLAN[id],{st:st,d:todayISO()});if(dbh&&fpShared){try{dbh.doc("fairplan/"+id).set(JSON.parse(JSON.stringify(FPLAN[id])));}catch(e){}}else save("bk_fplan",FPLAN);renderFcal();}
function renderFcal(){
  var box=$("fcalBox");if(!box)return;
  var cs=[];FCAL.forEach(function(f){if(cs.indexOf(f.c)<0)cs.push(f.c);});
  var L=fcSorted().filter(function(f){return (fcC==="all"||(fcC==="eg"?f.c==="مصر":f.c===fcC))&&f.fit>=+fcFit&&(fcPast||fcUp(f));});
  var next=fcSorted().filter(function(f){return f.s&&daysTo(f.e)>=0&&f.fit===3;}).slice(0,4);
  var plan=FCAL.filter(function(f){var s=(FPLAN[f.id]||{}).st;return s==="visit"||s==="exhibit";});
  var H='<div class="row sp"><div class="stack" style="gap:2px"><div class="eyebrow">FAIRS DIRECTORY</div><h2>دليل المعارض</h2><div class="small muted">معارض مصر ومعارض الدول اللي موجودين فيها أو عاوزين ندخلها. حددي قرارك لكل معرض، والمعارض دي بتظهر كاختيار في صفحة الموردين.</div></div>'
   +'<div class="row"><label>الدولة<select id="fcC"><option value="all">كل الدول</option><option value="eg">مصر بس</option>'+cs.map(function(c){return '<option'+(c===fcC?' selected':'')+'>'+esc(c)+'</option>';}).join("")+'</select></label>'
   +'<label>المناسبة لنا<select id="fcFit"><option value="0">الكل</option><option value="2">متوسط وعالي</option><option value="3">عالي بس</option></select></label>'
   +'<label class="check" style="align-self:flex-end;flex-direction:row;align-items:center;gap:6px"><input type="checkbox" id="fcPast"'+(fcPast?' checked':'')+' style="width:auto;margin:0">المنتهية</label>'
   +'<button class="btn" type="button" id="fcDl" style="align-self:flex-end">تنزيل (Excel)</button></div></div>';
  H+='<div class="cstat">'+next.map(function(f){return '<div><b>'+(daysTo(f.s)>0?daysTo(f.s)+' يوم':'الآن')+'</b><span>'+esc(f.n)+' · '+esc(f.c)+'</span></div>';}).join("")+'<div><b>'+plan.length+'</b><span>معرض قررنا نروحه</span></div></div>';
  H+='<div class="tblwrap"><table><thead><tr><th>المعرض</th><th>الدولة</th><th>الموعد</th><th>المجال</th><th>مناسب لنا</th><th>قرارنا</th></tr></thead><tbody>'+(L.length?L.map(function(f){var p=FPLAN[f.id]||{},st=p.st||"";
     return '<tr'+(st==="no"?' style="opacity:.55"':'')+'><td><b dir="auto">'+esc(f.n)+'</b>'+(FAIRS[f.id]?' <span class="tag t-brand">خطتنا</span>':'')+'<div class="small muted">'+esc(f.why)+' <a href="'+esc(f.u)+'" target="_blank" rel="noopener">المصدر</a></div></td><td class="small">'+esc(f.c)+'<div class="muted">'+esc(f.city)+'</div></td><td class="small" style="white-space:nowrap">'+fcWhen(f)+(f.s&&!f.conf?' <span class="tag t-warn">أكّدي</span>':'')+'<div>'+fcLeft(f)+'</div></td><td class="small">'+esc(FFIELD[f.f]||"")+'</td><td aria-label="'+f.fit+' من 3" style="white-space:nowrap;color:var(--accent)">'+"★".repeat(f.fit)+'<span style="opacity:.25">'+"★".repeat(3-f.fit)+'</span></td><td><select data-fp="'+f.id+'">'+FPST.map(function(x){return '<option value="'+x[0]+'"'+(x[0]===st?' selected':'')+'>'+x[1]+'</option>';}).join("")+'</select>'+(st?'<div><span class="tag '+(FPCL[st]||"")+'">'+FPST.filter(function(x){return x[0]===st;})[0][1]+'</span></div>':'')+'</td></tr>';}).join(""):'<tr><td colspan="6" class="muted small">مفيش معارض بالفلتر ده.</td></tr>')+'</tbody></table></div>'
   +'<div class="small muted">'+(fpShared?'القرارات محفوظة للفريق كله.':'القرارات محفوظة على جهازك بس.')+' التواريخ من مواقع المنظمين وقوائم المعارض، ومعلّم عليها لو محتاجة تأكيد قبل الحجز.</div><div class="small muted" id="fcNote"></div>';
  box.innerHTML=H;
  $("fcFit").value=fcFit;
  $("fcC").addEventListener("change",function(e){fcC=e.target.value;renderFcal();});
  $("fcFit").addEventListener("change",function(e){fcFit=e.target.value;renderFcal();});
  $("fcPast").addEventListener("change",function(e){fcPast=e.target.checked;renderFcal();});
  $("fcDl").addEventListener("click",fcExport);
  box.querySelectorAll("[data-fp]").forEach(function(s){s.addEventListener("change",function(){fpSave(s.dataset.fp,s.value);});});
  var vf=$("vFair");if(vf&&!vf.dataset.done)fillVenFair();
}
function fcExport(){var wb=book();
  XLSX.utils.book_append_sheet(wb,sheet([["المعرض","الدولة","المدينة والمكان","من","إلى / الموعد","مؤكد","المجال","مناسب لنا (من 3)","قرارنا","ليه","المصدر"]].concat(fcSorted().map(function(f){var st=(FPLAN[f.id]||{}).st||"";return [f.n,f.c,f.city,f.s,f.s?f.e:f.e,f.conf?"نعم":"لا",FFIELD[f.f]||"",f.fit,(FPST.filter(function(x){return x[0]===st;})[0]||["",""])[1],f.why,f.u];})),[28,14,30,12,30,8,16,10,14,60,50]),"دليل المعارض");
  saveBook(wb,"DrBaker_Fairs_"+todayISO()+".xlsx","fcNote");}
/* vendor fair picker: grouped by country, our plan first */
function fairOpts(skip){var g={},order=[];fcSorted().filter(function(f){return fcUp(f)||FAIRS[f.id];}).forEach(function(f){if((skip||[]).indexOf(f.id)>=0)return;var k=FAIRS[f.id]?"خطتنا":f.c;if(!g[k]){g[k]=[];order.push(k);}g[k].push(f);});
  order.sort(function(a,b){return a==="خطتنا"?-1:b==="خطتنا"?1:a==="مصر"?-1:b==="مصر"?1:0;});
  return order.map(function(k){return '<optgroup label="'+esc(k)+'">'+g[k].map(function(f){return '<option value="'+f.id+'">'+esc(f.n)+' · '+(f.s?fcWhen(f):"موعد غير معلن")+'</option>';}).join("")+'</optgroup>';}).join("");}
function fillVenFair(){var vf=$("vFair");if(!vf)return;var cur=vf.value;vf.innerHTML='<option value="all">كل المعارض</option>'+fairOpts();vf.value=cur||"all";if(vf.value!==cur)vf.value="all";vf.dataset.done="1";}
