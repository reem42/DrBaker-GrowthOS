import json,glob,os,sys
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/'
DB=ROOT+'data/db_snapshot'
snap={}
for f in glob.glob(DB+'/*/*.json'):
    c=os.path.basename(os.path.dirname(f));i=os.path.basename(f)[:-5]
    snap[c+'/'+i]=json.load(open(f,encoding='utf-8'))
date=sys.argv[1]
view=len(sys.argv)>2 and sys.argv[2]=='view'
shim='''<script>
/* Standalone mode: data snapshot from the portal on SNAPDATE. Changes are kept in this browser only. */
(function(){var ORIG=window.claude;if(ORIG&&!window.__FORCE_SNAP)return;
var SNAP=__SNAP__,KEY="bk_standalone_db",store;
try{store=JSON.parse(localStorage.getItem(KEY)||"null");}catch(e){}
if(!store||store.__v!=="SNAPDATE"){store=JSON.parse(JSON.stringify(SNAP));store.__v="SNAPDATE";}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}
var subs={};
function docs(c){return Object.keys(store).filter(function(k){return k.indexOf(c+"/")===0&&k.split("/").length===2;}).map(function(k){var v=store[k];return {id:k.split("/")[1],exists:true,data:function(){return JSON.parse(JSON.stringify(v));}};});}
function fire(c){(subs[c]||[]).forEach(function(f){f();});}
function docRef(path){var c=path.split("/")[0];return {id:path.split("/")[1],path:path,
  get:function(){var v=store[path];return Promise.resolve({id:path.split("/")[1],exists:!!v,data:function(){return v?JSON.parse(JSON.stringify(v)):undefined;}});},
  set:function(d){store[path]=JSON.parse(JSON.stringify(d));persist();setTimeout(function(){fire(c);},0);return Promise.resolve();},
  update:function(d){store[path]=Object.assign({},store[path]||{},JSON.parse(JSON.stringify(d)));persist();setTimeout(function(){fire(c);},0);return Promise.resolve();},
  delete:function(){delete store[path];persist();setTimeout(function(){fire(c);},0);return Promise.resolve();}};}
var db={doc:docRef,collection:function(c){return {doc:function(id){return docRef(c+"/"+id);},
  onSnapshot:function(next){var f=function(){var d=docs(c);next({docs:d,size:d.length,empty:!d.length,docChanges:function(){return [];}});};(subs[c]=subs[c]||[]).push(f);setTimeout(f,0);return function(){};}};}};
var downloads={save:function(o){var b=new Blob([o.data],{type:"application/octet-stream"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=o.filename||"file";document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);return Promise.resolve({saved:true});}};
window.claude={use:function(n){if(n==="db")return Promise.resolve(db);if(n==="downloads"){if(ORIG)return ORIG.use("downloads").then(function(d){return d||downloads;},function(){return downloads;});return Promise.resolve(downloads);}return Promise.resolve(null);}};
})();
</script>'''.replace('__SNAP__',json.dumps(snap,ensure_ascii=False).replace('</','<\\/')).replace('SNAPDATE',date)
s=open(ROOT+'dist/growthos.html',encoding='utf-8').read()
i=s.index('<script')
banner=('<div style="background:#9b0f14;color:#fff;font:600 13px Tajawal,Cairo,sans-serif;padding:6px 14px;text-align:center" dir="rtl">نسخة عرض من بورتال Dr. Baker GrowthOS، بيانات لحد '+date+'. أي تعديل هنا مش بيتحفظ عند الفريق.</div>') if view else ('<div style="background:#0f2240;color:#fff;font:600 13px Tajawal,Cairo,sans-serif;padding:6px 14px;text-align:center" dir="rtl">نسخة HTML مستقلة: بيانات البورتال لحد '+date+'. التعديلات هنا بتتحفظ على الجهاز ده بس. النسخة الحية المشتركة على claude.ai.</div>')
out=s[:i]+('<script>window.__FORCE_SNAP=1;</script>' if view else '')+shim+'\n'+s[i:]
out=out.replace('<body>','<body>'+banner,1) if '<body>' in out else out
open(ROOT+'dist/DrBaker_GrowthOS_'+('view_' if view else '')+date+'.html','w',encoding='utf-8').write(out)
print(len(snap),'docs', len(out))
