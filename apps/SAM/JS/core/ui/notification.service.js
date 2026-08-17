"use strict";
NEXUS_SAM.UI = NEXUS_SAM.UI || {};
NEXUS_SAM.UI.Notification = (()=>{
 let timer=null;
 function show(message,type="success",detail=""){
   const el=document.getElementById("toast"); if(!el)return;
   clearTimeout(timer); el.className=`toast show toast-${type}`;
   el.innerHTML=`<strong>${type==="success"?"✓":type==="error"?"!":"ℹ"} ${message}</strong>${detail?`<span>${detail}</span>`:""}`;
   timer=setTimeout(()=>{el.classList.remove("show");},4200);
 }
 return Object.freeze({show,success:(m,d)=>show(m,"success",d),error:(m,d)=>show(m,"error",d),info:(m,d)=>show(m,"info",d),warning:(m,d)=>show(m,"warning",d)});
})();