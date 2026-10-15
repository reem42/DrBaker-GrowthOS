# Dr. Baker GrowthOS: كود البورتال

بورتال تسويق وتصدير لـ Dr. Baker. صفحة HTML واحدة (عربي، RTL)، شغالة حالياً كـ Claude Artifact على claude.ai، وقبل الربط مع Odoo.

- **النسخة الحية (مشتركة مع الفريق):** https://claude.ai/artifact/DL2phhrtmPunC2BNiK2nuD
- **نسخة العرض (ببيانات 15 أكتوبر 2026):** https://claude.ai/artifact/RFf8ECvbP7TgfffjNhmLWo
- النسخة دي عامة: لينكات Google Drive في `data/live/drive.json` أمثلة (`EXAMPLE_FOLDER_n`)، وبيانات التواصل الشخصية للموردين اتشالت. النسخة الحية على claude.ai فيها البيانات الحقيقية.
- مفيش أي API keys أو أسرار في الملفات. البورتال مش بيكلم أي API خارجي من غير claude.ai.

## الصفحات (التابات)

| # | التاب | الكود الأساسي |
|---|---|---|
| 01 | جريدة اليوم (أخبار + سعر الصرف + البورصة + الخامات، باختيار العدد باليوم) | `renderPaper` في `src/page.html`، `src/market_v6.js` |
| 02 | خطة المعارض + دليل المعارض (30 معرض) + مطبوعات Drive | `renderFairs`، `src/fcal.js`، `renderMaterials` في `src/v8.js` |
| 03 | **التسويق اليومي** (أونلاين وأوفلاين + اقتراح البوست اليومي من الأخبار) | `renderDaily` في `src/page.html`، `src/ideas_v5.js` |
| 04 | العملاء والـ Timeline (Pipeline + سيناريو المكالمة والرسائل والعينات) | `renderBoard` / `renderDetail` في `src/v8.js` |
| 05 | الأسواق (ترتيب الدول) | `renderMarkets` |
| 06 | تقرير دولة (تجارة، امتثال المكونات، منافسين، شحن، شهادات، معارض) + طلب دراسة | `src/report_v5.js`، كتلة `v9: study requests` في `src/page.html` |
| 07 | متابعة الموزعين + خطة تسويق الموزع | `src/dist_v6.js` |
| 08 | الموردين والوكالات (عروض أسعار، ملفات، RFQ) | `src/vendors.js` |

> الملفات اللي في `src/*.js` اتدمجت بالفعل جوه `src/page.html`. موجودة منفصلة للقراءة والمراجعة. التعديل الفعلي بيتعمل في `src/page.html`.

## هيكل الملفات

```
src/page.html            القالب الكامل (HTML + CSS + JS) وفيه مكان /*__DATA__*/ للبيانات
src/*.js                 نسخ منفصلة من الموديولات (مدموجة في page.html)
src/history/             سكريبتات الدمج القديمة (للتاريخ بس)
data/data.js             البيانات الأساسية: الدول، العملاء، الأخبار الأولى
data/live/               أعداد السوق اليومية market_YYYY-MM-DD.json، الأخبار news_*.json، الدول world.json، Drive، عملاء أمريكا
data/research/           تقارير الدول dossiers.json + منتجات Dr. Baker (607 صنف) + مراجعة الإضافات
data/db_snapshot/        نسخة من قاعدة بيانات البورتال يوم 15 أكتوبر 2026 (موردين، موزعين، دراسات، أعداد السوق)
tools/assemble.py        بيجمع src/page.html + data → dist/growthos.html
tools/make_standalone.py بيعمل نسخة HTML مستقلة فيها بيانات db_snapshot
dist/growthos.html       النسخة المنشورة على claude.ai
dist/DrBaker_GrowthOS_*.html  نسخ مستقلة (تتفتح من أي متصفح)
```

## التشغيل

```bash
python3 tools/assemble.py                       # يبني dist/growthos.html
python3 tools/make_standalone.py 2026-10-15     # نسخة مستقلة قابلة للتعديل (التعديلات تتحفظ في المتصفح)
python3 tools/make_standalone.py 2026-10-15 view   # نسخة عرض
```
محتاج Python 3 بس. المكتبة الخارجية الوحيدة اللي الصفحة بتحملها هي SheetJS (xlsx 0.18.5 من cdnjs) لتنزيل Excel، والخطوط من Google Fonts (Cairo, Tajawal).

## البيانات المشتركة (قاعدة بيانات الـ Artifact)

على claude.ai الصفحة بتستخدم `claude.use("db")`. الـ collections:

| Collection | المحتوى | مين بيكتب |
|---|---|---|
| `market/<YYYY-MM-DD>` و`market/today` | عدد اليوم: `asOf, fx, banks, stocks, comm, news, paper` (`paper` = أخبار الجريدة كاملة) | الأدمن بس (قاعدة `market write admin`) |
| `vendors/<id>` | الموردين: بيانات، `quotes[]`، `files[]` (asset ids)، `log[]` | الفريق |
| `distributors/<id>` | الموزعين | الفريق |
| `leads/<hash>` | العملاء والـ Timeline (عميل في كل doc، والـ `id` الأصلي جوه الـ doc) | الفريق |
| `progress/fairTasks`، `progress/readiness` | علامات مهام المعارض `{done}` وقائمة الجاهزية `{items}` | الفريق |
| `fairplan/<fairId>` | قرار الفريق لكل معرض `{st, d}` | الفريق |
| `fairs/<fairId>` | حالة مطبوعات المعرض | الفريق |
| `studyRequests`, `dossiers`, `studyCountries`, `studyLeads` | طلبات دراسة الدول ونتايجها | الفريق / الأتمتة |

Capabilities المستخدمة: `db`، `downloads` (Excel)، `assets` (رفع ملفات الموردين)، `user`، `mcp` (زرار بدء الدراسة).
برّه claude.ai، `make_standalone.py` بيحط shim صغير بيقلد `claude.use("db")` من `db_snapshot` ويحفظ في localStorage.

## التحديث اليومي

1. عدد جديد `data/live/market_<date>.json` (فيه `paper` للأخبار).
2. يتكتب في `market/<date>` و`market/today` بالـ db، والصفحة بتحدّث نفسها من غير إعادة نشر.

## الربط مع Odoo (بعدين)

الأماكن اللي هتتربط: `vendors` (res.partner + purchase)، `distributors` (res.partner + sale)، العملاء والـ pipeline (crm.lead)، وتنزيلات Excel تتحول API calls.
