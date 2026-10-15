import json,re,base64
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/'
B=ROOT+'data/'
p=open(ROOT+'src/page.html',encoding='utf-8').read()
d=open(B+'data.js',encoding='utf-8').read()
j=lambda o:json.dumps(o,ensure_ascii=False).replace('</','<\\/')
doss=json.load(open(ROOT+'data/research/dossiers.json',encoding='utf-8'))
mk=json.load(open(B+'live/market_2026-10-15_db.json',encoding='utf-8'))
e14=json.load(open(B+'live/market_2026-10-14.json',encoding='utf-8'))
e13=json.load(open(B+'live/market_2026-10-13.json',encoding='utf-8'))
e10=json.load(open(B+'live/market_2026-10-10.json',encoding='utf-8'))
drive=json.load(open(B+'live/drive.json',encoding='utf-8'))
world=json.load(open(B+'live/world.json',encoding='utf-8'))
us=json.load(open(B+'live/leads_US.json',encoding='utf-8'))
logo='data:image/png;base64,'+base64.b64encode(open(B+'logo.png','rb').read()).decode()
add=('\nDATA.news='+j(json.load(open(B+'live/news_2026-10-15.json',encoding='utf-8')))+';\nDATA.doss='+j(doss)+';\nDATA.market='+j(mk)+';\nDATA.editions='+j([e10,e13,e14])+';\nDATA.drive='+j(drive)+';\nDATA.world='+j(world)
     +';\nDATA.leads["الولايات المتحدة"]='+j(us)+';\nDATA.logo='+j(logo)+';\n')
open(ROOT+'dist/growthos.html','w',encoding='utf-8').write(p.replace('/*__DATA__*/',d+add))
h=open(ROOT+'dist/growthos.html',encoding='utf-8').read()
s=re.findall(r'<script>(.*?)</script>',h,re.S);open(ROOT+'dist/_check.js','w').write(s[1]);print(len(h))
