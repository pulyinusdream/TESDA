"use strict";
NEXUS_SPECTRA.Controllers.Budget=(()=>{
 let current="";
 function rows(){return NEXUS_SPECTRA.Repository.Transactions.all().filter(x=>x.status==="FOR_BUDGET_OBLIGATION"||x.physicalHolder==="BUDGET").sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""));}
 function refresh(){NEXUS_SPECTRA.Views.Budget.queue(rows());NEXUS_SPECTRA.Views.Budget.detail(current);}
 function open(no){current=no;refresh();document.getElementById("budgetPanel").scrollIntoView({behavior:"smooth",block:"start"});}
 function input(){return {processedBy:document.getElementById("budgetProcessedBy")?.value||"",fundSource:document.getElementById("budgetFundSource")?.value||"",obligationType:document.getElementById("budgetObligationType")?.value||"BURS",obligationNo:document.getElementById("budgetObligationNo")?.value||"",obligationDate:document.getElementById("budgetObligationDate")?.value||"",amount:document.getElementById("budgetAmount")?.value||0,certificationRemarks:document.getElementById("budgetRemarks")?.value||""};}
 function save(){NEXUS_SPECTRA.Services.Budget.save(current,input());NEXUS_SPECTRA.Views.App.notify("Budget / obligation details saved.","success");refresh();}
 function certify(){NEXUS_SPECTRA.Services.Budget.save(current,input());const r=NEXUS_SPECTRA.Services.Budget.certify(current);if(!r.ok){NEXUS_SPECTRA.Views.App.notify(r.errors[0],"error");refresh();return;}NEXUS_SPECTRA.Views.App.notify("Obligation certified and forwarded to Accounting for DV/JEV.","success");current="";NEXUS_SPECTRA.Controllers.App.refresh();refresh();}
 function click(e){const o=e.target.closest("[data-budget-open]");if(o)return open(o.dataset.budgetOpen);if(e.target.closest("[data-budget-save]"))return save();if(e.target.closest("[data-budget-certify]"))return certify();}
 function initialize(){document.getElementById("budgetQueueBody").addEventListener("click",click);document.getElementById("budgetDetail").addEventListener("click",click);refresh();}
 return Object.freeze({initialize,refresh});
})();