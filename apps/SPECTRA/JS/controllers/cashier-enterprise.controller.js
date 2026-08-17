"use strict";
NEXUS_SPECTRA.Controllers.CashierEnterprise=(()=>{
 let screen="overview",reportBack="reports";
 const root=()=>document.getElementById("cashierEnterpriseShell");
 function title(name){const map={overview:["Cashier Overview","Today’s priorities, queue and alerts."],"client-queue":["Client Payment Queue","Call and collect against authorized Orders of Payment."],"order-payment":["Order of Payment","Prepare the payment instruction before the client proceeds to Cashier."],collections:["Daily Collections","Record each payment and Official Receipt before serving the next client."],deposits:["Deposits","Group undeposited collections by fund and record bank deposit references."],disbursements:["Payments & Disbursements","Process scholarship and other approved disbursements."],records:["Payment Records","Search historical checks, cash advances and LANDBANK batches."],compliance:["Cash Advance Compliance","Liquidation and Accounting compliance clocks."],forms:["Accountable Forms","Control check and Official Receipt custody before transactions."],reports:["Reports Center","Choose one report to review, preview and finalize."],coa:["COA Submission","Monitor scanning, submission, due dates and filing."],archive:["Report Archive","Search saved reports, signed scans and COA references."],raaf:["RAAF","Appendix 67 — accountable forms report."],rci:["RCI","Report of Checks Issued."],disbursement:["Cash Disbursement","Monthly report of cash disbursements."],receipts:["Cash Receipts Record","Appendix 29 monthly cash receipts."],"collections-report":["Collections & Deposits","Appendix 26 monthly collection/deposit report."],liquidationjev:["Liquidation JEV","Accounting entry after cash advance liquidation."]};return map[name]||["Cashier Workspace",""];}
 function show(name){
   screen=name;const r=root();if(!r)return;
   r.querySelectorAll("[data-ent-nav]").forEach(b=>b.classList.toggle("active",b.dataset.entNav===name));
   r.querySelectorAll("[data-ent-screen-panel]").forEach(p=>p.hidden=p.dataset.entScreenPanel!==name);
   const [h,p]=title(name);document.getElementById("cashEntPageTitle").textContent=h;document.getElementById("cashEntPageSubtitle").textContent=p;
   document.getElementById("cashEntBreadcrumb").innerHTML=name==="overview"?"Cashier / Overview":`Cashier / <button data-ent-screen="overview">Home</button> / ${h}`;
   if(name==="overview")NEXUS_SPECTRA.Views.CashierEnterprise.dashboard();
   if(name==="client-queue")NEXUS_SPECTRA.Views.CashierWorkspace.queue();
   if(name==="compliance")NEXUS_SPECTRA.Views.Compliance.cashier();
   if(name==="records")NEXUS_SPECTRA.Views.CashierEnterprise.records(document.querySelector("[data-ent-record-mode].active")?.dataset.entRecordMode||"INDIVIDUAL_CHECK");
   if(name==="archive")NEXUS_SPECTRA.Views.CashierEnterprise.archive();
   if(["order-payment","collections","deposits","forms","raaf","rci","disbursement","receipts","collections-report","liquidationjev","coa"].includes(name))mountLegacy(name);
   if(name==="disbursements")mountDisbursements();
   window.scrollTo({top:0,behavior:"smooth"});
 }
 function moveNode(node,host){if(node&&host&&node.parentElement!==host)host.appendChild(node);}
 function legacyReportPanel(key){return document.querySelector(`#cashierReportsPanel [data-report-panel="${key}"]`);}
 function mountLegacy(name){
   const host=document.querySelector(`[data-ent-screen-panel="${name}"] .cash-ent-mount`);if(!host)return;host.innerHTML="";
   const map={"order-payment":"order",collections:"daily",deposits:"deposits",forms:"forms",raaf:"raaf",rci:"rci",disbursement:"disbursement",receipts:"receipts","collections-report":"collections",liquidationjev:"liquidationjev",coa:"coa"},panel=legacyReportPanel(map[name]);
   if(panel){panel.hidden=false;moveNode(panel,host);panel.classList.add("cash-ent-embedded");}
   if(name==="deposits")NEXUS_SPECTRA.Controllers.CashierReports.renderUndeposited?.();
   if(name==="rci")NEXUS_SPECTRA.Views.RCI.liquidation?.();
   if(name==="coa")NEXUS_SPECTRA.Views.CashierReports.renderArchive?.();
 }
 function mountDisbursements(){const host=document.querySelector('[data-ent-screen-panel="disbursements"] .cash-ent-mount');if(!host)return;host.innerHTML="";const q=document.getElementById("cashierQueuePanel"),d=document.getElementById("cashierPanel");if(q){q.hidden=false;moveNode(q,host);q.classList.add("cash-ent-embedded");}if(d){d.hidden=false;moveNode(d,host);d.classList.add("cash-ent-embedded");}}
 function openReport(name){reportBack="reports";show(name);}
 function callClient(id){const cashier=prompt("Cashier / teller name:")||"";NEXUS_SPECTRA.Services.PaymentQueue.call(id,cashier);NEXUS_SPECTRA.Views.CashierWorkspace.queue();NEXUS_SPECTRA.Views.CashierEnterprise.dashboard();}
 function startClient(id){NEXUS_SPECTRA.Services.PaymentQueue.start(id,"");NEXUS_SPECTRA.Views.CashierWorkspace.queue();}
 function skipClient(id){NEXUS_SPECTRA.Services.PaymentQueue.skip(id);NEXUS_SPECTRA.Views.CashierWorkspace.queue();NEXUS_SPECTRA.Views.CashierEnterprise.dashboard();}
 function completeClient(id){const q=NEXUS_SPECTRA.Services.PaymentQueue.today().find(x=>x.queueId===id);if(!q)return;const orNo=prompt(`Official Receipt number for ${q.queueNo}:`);if(orNo===null)return;const op=NEXUS_SPECTRA.Repository.Cashier.orders().find(x=>x.orderPaymentNo===q.orderPaymentNo),result=NEXUS_SPECTRA.Services.Cashier.saveCollection({orderPaymentNo:q.orderPaymentNo,date:new Date().toISOString().slice(0,10),time:new Date().toTimeString().slice(0,5),referenceNo:orNo,payor:q.payor,fund:(op?.fund||"SSP"),fundCluster:op?.fundCluster||"",nature:op?.purpose||op?.serviceType||"",collection:q.amount,deposit:0});if(!result.ok){NEXUS_SPECTRA.Views.App.notify(result.errors[0],"error");return;}NEXUS_SPECTRA.Services.PaymentQueue.complete(q.queueId,orNo);NEXUS_SPECTRA.Views.App.notify(`${q.queueNo} payment recorded. OR ${orNo}.`,"success");NEXUS_SPECTRA.Views.CashierWorkspace.queue();NEXUS_SPECTRA.Views.CashierEnterprise.dashboard();}
 function click(e){
   const nav=e.target.closest("[data-ent-nav]");if(nav)return show(nav.dataset.entNav);
   const scr=e.target.closest("[data-ent-screen]");if(scr)return show(scr.dataset.entScreen);
   const rep=e.target.closest("[data-ent-report]");if(rep)return openReport(rep.dataset.entReport);
   const mode=e.target.closest("[data-ent-record-mode]");if(mode){root().querySelectorAll("[data-ent-record-mode]").forEach(b=>b.classList.toggle("active",b===mode));return NEXUS_SPECTRA.Views.CashierEnterprise.records(mode.dataset.entRecordMode);}
   const call=e.target.closest("[data-client-call]");if(call)return callClient(call.dataset.clientCall);
   const st=e.target.closest("[data-client-start]");if(st)return startClient(st.dataset.clientStart);
   const sk=e.target.closest("[data-client-skip]");if(sk)return skipClient(sk.dataset.clientSkip);
   const cp=e.target.closest("[data-client-complete]");if(cp)return completeClient(cp.dataset.clientComplete);
   const ap=e.target.closest("[data-ent-archive-preview]");if(ap){show("coa");setTimeout(()=>NEXUS_SPECTRA.Views.CashierReports.preview(ap.dataset.entArchivePreview),30);return;}
   const as=e.target.closest("[data-ent-archive-scan]");if(as)return NEXUS_SPECTRA.Services.CashierReportArchive.openScan(as.dataset.entArchiveScan);
 }
 function input(e){if(e.target.matches("#cashArchiveSearch,#cashArchiveYear,#cashArchiveFund,#cashArchiveStatus"))NEXUS_SPECTRA.Views.CashierEnterprise.archive();}
 function initialize(){const r=root();if(!r)return;r.addEventListener("click",click);r.addEventListener("input",input);show("overview");}
 return Object.freeze({initialize,show});
})();