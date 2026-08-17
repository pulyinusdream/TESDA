"use strict";
NEXUS_SAM.Modules.Tracking.Controller=(()=>{
 let selected="";
 function refresh(){const rows=NEXUS_SAM.Modules.Tracking.Service.all();if(!selected&&rows.length)selected=rows[0].transactionNo;NEXUS_SAM.Modules.Tracking.View.list(rows,selected);NEXUS_SAM.Modules.Tracking.View.detail(selected?NEXUS_SAM.Modules.Handoff.Repository.get(selected):null);}
 function open(no){selected=no;refresh();}
 function initialize(){document.getElementById("schoolTrackingList")?.addEventListener("click",e=>{const b=e.target.closest("[data-track-open]");if(b)open(b.dataset.trackOpen);});refresh();}
 return Object.freeze({initialize,refresh,open});
})();