"use strict";
NEXUS_SAM.Modules.CostMaster.Controller = (() => {
 function filters(){return {program:document.getElementById("scholarshipProgram").value,implementationType:document.getElementById("implementationType").value,search:document.getElementById("costSearch").value};}
 function refresh(){const rows=NEXUS_SAM.Modules.CostMaster.Service.list(filters());NEXUS_SAM.Modules.CostMaster.View.renderTable(rows);NEXUS_SAM.Modules.CostMaster.View.populateQualificationSelect(rows);}
 function onQualificationChange(){NEXUS_SAM.Modules.CostMaster.View.showQualification(NEXUS_SAM.Modules.CostMaster.Service.get(document.getElementById("qualificationCostMasterId").value));}
 function initialize(){document.getElementById("costSearch").addEventListener("input",refresh);document.getElementById("scholarshipProgram").addEventListener("change",()=>{refresh();onQualificationChange();});document.getElementById("implementationType").addEventListener("change",()=>{refresh();onQualificationChange();});document.getElementById("qualificationCostMasterId").addEventListener("change",onQualificationChange);refresh();onQualificationChange();}
 return Object.freeze({initialize,refresh,onQualificationChange});
})();
