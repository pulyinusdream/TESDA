"use strict";
NEXUS_SAM.Modules.Reports.Service = (()=>{
 const esc=s=>(s??"").toString().replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
 const peso=n=>new Intl.NumberFormat("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n||0));
 function splitName(raw){
   const txt=(raw||"").trim(); const [lastPart,restPart=""] = txt.split(/,(.+)/).filter(x=>x!==undefined);
   const last=(lastPart||"").trim(); let rest=(restPart||"").trim().replace(/\s+/g," "), ext="";
   const em=rest.match(/\s+(JR\.?|SR\.?|II|III|IV|V)$/i); if(em){ext=em[1].toUpperCase();rest=rest.slice(0,em.index).trim();}
   const words=rest.split(" ").filter(Boolean); let first="",middle="";
   if(words.length<=1)first=rest; else {first=words.slice(0,-1).join(" ");middle=words.at(-1);}
   return {last,first,middle,extension:ext};
 }
 function reportDates(reports){return [...reports].filter(r=>r.attendanceDate).sort((a,b)=>NEXUS_SAM.Modules.Attendance.Service.parseBsrsDate(a.attendanceDate)-NEXUS_SAM.Modules.Attendance.Service.parseBsrsDate(b.attendanceDate));}
 function parseDuration(v){const m=(v||"").match(/(\d{1,2})\s*:\s*(\d{1,2})/);if(!m)return null;return Number(m[1])+Number(m[2])/60;}
 function build(batchId){
   const allowance=NEXUS_SAM.Modules.Allowance.Service.build(batchId), batch=allowance.batch;
   if(!batch)return {ok:false,errors:["Select a scholarship batch."],allowance};
   const reports=reportDates(allowance.reports||[]), profile=NEXUS_SAM.Modules.Reports.Repository.get(batchId)||{};
   const scholars=allowance.rows.map((r,idx)=>{
      const n=splitName(r.name), uli=profile.ulis?.[r.key]||"";
      const dayCells=reports.map(report=>{
        const d=r.days.find(x=>x.reportId===report.attendanceImportId);
        if(!d)return {date:report.attendanceDate,hours:0,status:"MISSING"};
        if(d.status==="ABSENT")return {date:report.attendanceDate,hours:0,status:"ABSENT"};
        if(d.status!=="PRESENT")return {date:report.attendanceDate,hours:0,status:d.status};
        const src=report.scholars.find(s=>s.no===d.scholarNo); const parsed=parseDuration(src?.bsrsDuration);
        return {date:report.attendanceDate,hours:parsed??8,status:"PRESENT"};
      });
      const totalHours=dayCells.reduce((a,d)=>a+d.hours,0), percentage=Number(batch.approvedTrainingHours)?Math.round(totalHours/Number(batch.approvedTrainingHours)*100):0;
      const initial=Math.min(Number(batch.maximumTsf||0)/2,r.earned), remaining=Math.max(0,r.earned-initial);
      return {...r,no:idx+1,...n,uli,dayCells,totalHours,percentage,initial,remaining,total:r.earned,remarks:r.isReady?"Completed":"For Review"};
   });
   const errors=[];
   if(!allowance.summary.ready)errors.push("Attendance is not yet fully payroll-ready. Resolve all attendance and report-level issues first.");
   if(reports.length!==Number(batch.approvedTrainingDays||0))errors.push(`Expected ${batch.approvedTrainingDays} unique dated attendance reports; found ${reports.length}.`);
   return {ok:errors.length===0,errors,batch,reports,scholars,profile,allowance};
 }
 function defaultProfile(batchId){
   const current=NEXUS_SAM.Modules.Reports.Repository.get(batchId)||{};
   return {preparedBy:current.preparedBy||"",preparedTitle:current.preparedTitle||"Registrar",approvedBy:current.approvedBy||"",approvedTitle:current.approvedTitle||"Center Administrator",entityAddress:current.entityAddress||"",copies:3,updatedAt:current.updatedAt||"",ulis:current.ulis||{},poCertifiedBy:current.poCertifiedBy||"",poApprovedBy:current.poApprovedBy||"",poAccountingBy:current.poAccountingBy||"",poDisbursingBy:current.poDisbursingBy||""};
 }
 function saveProfile(batchId,p){return NEXUS_SAM.Modules.Reports.Repository.save(batchId,{...p,copies:3});}
 function pageCss(orientation="portrait"){
   return `@page{size:A4 ${orientation};margin:10mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#000;margin:0;font-size:10px}.copy{page-break-after:always}.copy:last-child{page-break-after:auto}.center{text-align:center}.right{text-align:right}.bold{font-weight:700}.small{font-size:8px}.tiny{font-size:7px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #000;padding:3px;vertical-align:middle}.no-border td{border:0}.header{margin-bottom:8px}.header h1{font-size:15px;margin:6px 0}.header h2{font-size:12px;margin:3px 0}.signature{margin-top:18px;display:flex;justify-content:space-between;gap:30px}.signature>div{width:42%;text-align:center}.sigline{border-top:1px solid #000;margin-top:28px;padding-top:3px}.copy-label{font-size:7px;text-align:right;color:#444;margin-bottom:2px}.muted{color:#444}`;
 }
 function headerHtml(data,title){const b=data.batch,p=data.profile;return `<div class="header center"><div class="small">Republic of the Philippines</div><div class="bold">TECHNICAL EDUCATION AND SKILLS DEVELOPMENT AUTHORITY</div><div class="bold">${esc(b.tvi||"TVET Provider")}</div><div class="small">${esc(p.entityAddress||"")}</div><h1>${esc(title)}</h1><h2>${esc(b.qualificationTitle)}</h2><div><b>${esc(formatDate(b.trainingStartDate))} to ${esc(formatDate(b.trainingEndDate))}</b></div><div class="small">Training Duration</div><div><b>${esc(b.rqmNo)}</b></div><div class="small">RQM Number</div></div>`;}
 function formatDate(v){if(!v)return "";const d=new Date(`${v}T12:00:00`);return d.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});}
 function copyWrap(inner,copies=3){return Array.from({length:copies},(_,i)=>`<section class="copy"><div class="copy-label">Copy ${i+1} of ${copies}</div>${inner}</section>`).join("");}
 function summaryHtml(data){
   const dates=data.reports.map((r,i)=>`<th><div>${i+1}</div><div class="tiny">${esc(shortDate(r.attendanceDate))}</div></th>`).join("");
   const rows=data.scholars.map(s=>`<tr><td class="center">${s.no}</td><td>${esc(s.name)}</td>${s.dayCells.map(d=>`<td class="center">${d.status==="PRESENT"?trimNum(d.hours):d.status==="ABSENT"?"A":"-"}</td>`).join("")}<td class="center">${trimNum(s.totalHours)}</td><td class="center">${s.percentage}</td><td class="center">${esc(s.remarks)}</td></tr>`).join("");
   const h=`${headerHtml(data,"SUMMARY OF ATTENDANCE")}<div class="small"><b>Total Number of hours: ${esc(data.batch.approvedTrainingHours)}</b></div><table><thead><tr><th style="width:25px">NO.</th><th style="min-width:140px">NAME OF SCHOLAR</th>${dates}<th>Sub-Total</th><th>Percentage</th><th>REMARKS</th></tr></thead><tbody>${rows}</tbody></table>${signatureHtml(data)}`;
   return documentHtml("Summary of Attendance",pageCss("landscape")+`body{font-size:8px}.header{margin-bottom:4px}.header h1{font-size:13px;margin:3px 0}.header h2{font-size:10px;margin:2px 0}th,td{font-size:5.8px;padding:1.2px}.signature{margin-top:7px}.sigline{margin-top:12px}`,copyWrap(h,3));
 }
 function billingHtml(data){
   const rows=data.scholars.map(s=>`<tr><td class="center">${s.no}</td><td>${esc(s.uli||"")}</td><td>${esc(s.last)}</td><td>${esc(s.first)}</td><td>${esc(s.middle)}</td><td>${esc(s.extension)}</td><td class="right">${peso(s.initial)}</td><td class="right">${peso(s.remaining)}</td><td class="right bold">${peso(s.total)}</td></tr>`).join("");
   const total=data.scholars.reduce((a,s)=>a+s.total,0),initial=data.scholars.reduce((a,s)=>a+s.initial,0),remaining=data.scholars.reduce((a,s)=>a+s.remaining,0);
   const h=`${headerHtml(data,"BILLING STATEMENT")}<table><thead><tr><th rowspan="2">NO.</th><th rowspan="2">ULI</th><th colspan="4">NAME OF SCHOLAR</th><th rowspan="2">Training Support Fund<br><span class="tiny">(initial 50%)</span></th><th rowspan="2">Training Support Fund<br><span class="tiny">(remaining 50%)</span></th><th rowspan="2">Total Training Support Fund<br><span class="tiny">(full)</span></th></tr><tr><th>Last Name</th><th>First Name</th><th>Middle Name</th><th>Extension</th></tr></thead><tbody>${rows}<tr class="bold"><td colspan="6" class="center">TOTAL</td><td class="right">${peso(initial)}</td><td class="right">${peso(remaining)}</td><td class="right">${peso(total)}</td></tr></tbody></table>${signatureHtml(data)}`;
   return documentHtml("Billing Statement",pageCss("portrait")+`th,td{font-size:7.7px;padding:2.2px}`,copyWrap(h,3));
 }
 function payrollHtml(data){
   const rows=data.scholars.map(s=>`<tr><td>${s.no}</td><td>${esc(s.last)}</td><td>${esc(s.first)}</td><td>${esc(s.middle)}</td><td>${esc(s.extension)}</td><td></td><td class="right">${peso(s.initial)}</td><td class="right">0.00</td><td class="right">0.00</td><td class="right">0.00</td><td class="right">0.00</td><td class="right bold">${peso(s.total)}</td><td></td><td></td></tr>`).join("");
   const total=data.scholars.reduce((a,s)=>a+s.total,0),initial=data.scholars.reduce((a,s)=>a+s.initial,0);
   const words=`${peso(total)} PESOS`;const b=data.batch,p=data.profile;
   const h=`<div class="po-payroll"><div class="appendix">Appendix 33</div><div class="payroll-title">PAYROLL FOR THE TRAINING FOR WORK SCHOLARSHIP PROGRAM (TWSP)</div><div class="po-meta"><span><b>School :</b> ${esc(b.tvi)}</span><span><b>Payroll No. :</b> _______________________</span><span><b>Fund Cluster :</b> ${new Date(b.trainingStartDate+"T12:00:00").getFullYear()} ${esc(b.scholarshipProgram)}</span><span>Sheet _________ of __________ Sheets</span></div><div class="ack">We acknowledge receipt of sum shown opposite our name as representing payment for the Training Support Fund in <b>${esc(b.qualificationTitle)}</b> under ${esc(b.scholarshipProgram)} from ${esc(formatDate(b.trainingStartDate))} to ${esc(formatDate(b.trainingEndDate))}.</div><table class="po-table"><thead><tr><th rowspan="2">Serial No.</th><th colspan="4">NAME</th><th colspan="7">Amount</th><th rowspan="2">ID PRESENTED</th><th rowspan="2">Signature of Recipient</th></tr><tr><th>Last Name</th><th>First Name</th><th>Middle Name</th><th>Ext.</th><th></th><th>TSF<br>(initial 50%)</th><th>H/PPE</th><th>IA</th><th>T-Shirt</th><th>IM</th><th>TOTAL</th></tr></thead><tbody>${rows}<tr class="bold total"><td colspan="6"></td><td class="right">${peso(initial)}</td><td class="right">0.00</td><td class="right">0.00</td><td class="right">0.00</td><td class="right">0.00</td><td class="right">${peso(total)}</td><td></td><td></td></tr></tbody></table><div class="cert-grid"><div class="cert-code">A</div><div class="cert-text"><b>CERTIFIED:</b>&nbsp;&nbsp; Attendance as stated.<div class="sign-name">${esc(p.poCertifiedBy||"____________________________")}</div><div>Signature over Printed Name of Authorized Official</div></div><div class="cert-code">C</div><div class="cert-text"><b>APPROVED FOR PAYMENT:</b>&nbsp;&nbsp; ${esc(words)}<div class="sign-name">${esc(p.poApprovedBy||"____________________________")}</div><div>(Signature over Printed Name)<br>Head of Agency/Authorized Representative</div></div><div class="cert-code">B</div><div class="cert-text"><b>CERTIFIED:</b>&nbsp;&nbsp; Supporting documents complete and proper; and cash available in the amount of P ${peso(total)}<div class="sign-name">${esc(p.poAccountingBy||"____________________________")}</div><div>(Signature over Printed Name)<br>Head of Accounting Division/Unit</div></div><div class="cert-code">D</div><div class="cert-text"><b>CERTIFIED:</b>&nbsp;&nbsp; I HEREBY CERTIFY ON MY OFFICIAL OATH THAT I HAVE PAID THIS __________ day of __________ to each person whose name appears on the above roll the amount opposite his/her name; established his/her identity & affixed his/her signature.<div class="sign-name">${esc(p.poDisbursingBy||"____________________________")}</div><div>(Signature over Printed Name)<br>Disbursing Officer</div><div class="po-refs">ORS/BURS No.: ____________________ &nbsp;&nbsp; JEV No.: ____________________ &nbsp;&nbsp; Date: _____________</div></div></div></div>`;
   const css=pageCss("landscape")+`body{font-size:7px}.copy{padding:0}.appendix{text-align:right;font-size:7px}.payroll-title{text-align:center;font-weight:700;font-size:12px;margin:8px 0 16px}.po-meta{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px}.po-meta span:nth-child(even){text-align:right}.ack{margin:8px 0;font-size:7.3px}.po-table th,.po-table td{font-size:6.2px;padding:2px;text-align:center}.po-table td:nth-child(2),.po-table td:nth-child(3),.po-table td:nth-child(4),.po-table td:nth-child(5){text-align:left}.po-table .right{text-align:right}.cert-grid{display:grid;grid-template-columns:18px 1fr 18px 1.7fr;border:1px solid #000;border-top:0}.cert-grid>div{border-right:1px solid #000;border-top:1px solid #000;padding:4px;min-height:54px}.cert-code{text-align:center;font-weight:700}.cert-text{font-size:6.3px}.sign-name{text-align:center;font-weight:700;margin-top:14px}.po-refs{text-align:right;margin-top:6px}`;
   return documentHtml("Provincial Office Payroll",css,copyWrap(h,3));
 }
 function signatureHtml(data){return `<div class="signature"><div><div>Prepared by:</div><div class="sigline bold">${esc(data.profile.preparedBy||"")}</div><div>${esc(data.profile.preparedTitle||"Registrar")}</div></div><div><div>Approved by:</div><div class="sigline bold">${esc(data.profile.approvedBy||"")}</div><div>${esc(data.profile.approvedTitle||"Center Administrator")}</div></div></div>`;}
 function shortDate(v){const d=NEXUS_SAM.Modules.Attendance.Service.parseBsrsDate(v);return d?d.toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"2-digit"}):v;}
 function trimNum(n){return Number.isInteger(Number(n))?String(Number(n)):Number(n).toFixed(1);}
 function documentHtml(title,css,body){return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${css}</style></head><body>${body}<script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`;}
 function openPrint(html){const w=window.open("","_blank");if(!w)throw new Error("Pop-up was blocked. Allow pop-ups for NEXUS-SAM report generation.");w.document.open();w.document.write(html);w.document.close();}
 return Object.freeze({build,defaultProfile,saveProfile,summaryHtml,billingHtml,payrollHtml,openPrint,splitName});
})();