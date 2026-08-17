"use strict";
TAESF.NTTC.Modal=(()=>{
  let active=null;
  function esc(s){return String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[c]));}
  function close(result){if(!active)return;const {overlay,resolve}=active;active=null;overlay.classList.add("closing");setTimeout(()=>overlay.remove(),150);resolve(result);}
  function open({title,eyebrow="NEXUS • NTTC",message="",content="",confirmText="Save",cancelText="Cancel",tone="default",wide=false,hideCancel=false}={}){
    if(active)close(null);
    return new Promise(resolve=>{
      const overlay=document.createElement("div");overlay.className="nexus-modal-overlay";overlay.innerHTML=`<section class="nexus-modal ${wide?"wide":""} tone-${esc(tone)}" role="dialog" aria-modal="true"><div class="nexus-modal-accent"></div><header><div><span class="eyebrow">${esc(eyebrow)}</span><h2>${esc(title||"NTTC")}</h2>${message?`<p>${esc(message)}</p>`:""}</div><button class="modal-close" type="button" aria-label="Close">×</button></header><div class="nexus-modal-body">${content}</div><footer>${hideCancel?"":`<button class="secondary modal-cancel" type="button">${esc(cancelText)}</button>`}<button class="primary modal-confirm" type="button">${esc(confirmText)}</button></footer></section>`;
      document.body.appendChild(overlay);requestAnimationFrame(()=>overlay.classList.add("open"));active={overlay,resolve};
      overlay.querySelector(".modal-close")?.addEventListener("click",()=>close(null));overlay.querySelector(".modal-cancel")?.addEventListener("click",()=>close(null));overlay.addEventListener("click",e=>{if(e.target===overlay)close(null);});
      overlay.querySelector(".modal-confirm")?.addEventListener("click",()=>close({confirmed:true,overlay}));
      document.addEventListener("keydown",function onKey(e){if(e.key==="Escape"&&active?.overlay===overlay){document.removeEventListener("keydown",onKey);close(null);}});
    });
  }
  async function alert(title,message,tone="info"){return open({title,message,confirmText:"Got it",hideCancel:true,tone});}
  async function form({title,message="",fields=[],confirmText="Save",tone="default",wide=false}={}){
    const content=`<form class="nexus-modal-form" onsubmit="return false">${fields.map(f=>{const id=`modal_${f.name}`;if(f.type==="textarea")return `<label class="${f.span===2?"span-2":""}"><span>${esc(f.label)}${f.required?" *":""}</span><textarea id="${id}" name="${esc(f.name)}" rows="${f.rows||4}" placeholder="${esc(f.placeholder||"")}">${esc(f.value||"")}</textarea>${f.help?`<small>${esc(f.help)}</small>`:""}</label>`;if(f.type==="date"||f.type==="time"||f.type==="number"||f.type==="text")return `<label class="${f.span===2?"span-2":""}"><span>${esc(f.label)}${f.required?" *":""}</span><input id="${id}" name="${esc(f.name)}" type="${f.type}" value="${esc(f.value||"")}" placeholder="${esc(f.placeholder||"")}" ${f.min?`min="${esc(f.min)}"`:""} ${f.step?`step="${esc(f.step)}"`:""}>${f.help?`<small>${esc(f.help)}</small>`:""}</label>`;return "";}).join("")}</form>`;
    if(active)close(null);
    return new Promise(resolve=>{
      const overlay=document.createElement("div");overlay.className="nexus-modal-overlay";overlay.innerHTML=`<section class="nexus-modal ${wide?"wide":""} tone-${esc(tone)}" role="dialog" aria-modal="true"><div class="nexus-modal-accent"></div><header><div><span class="eyebrow">NEXUS • NTTC</span><h2>${esc(title||"NTTC")}</h2>${message?`<p>${esc(message)}</p>`:""}</div><button class="modal-close" type="button" aria-label="Close">×</button></header><div class="nexus-modal-body">${content}<div class="modal-inline-error" hidden></div></div><footer><button class="secondary modal-cancel" type="button">Cancel</button><button class="primary modal-confirm" type="button">${esc(confirmText)}</button></footer></section>`;
      document.body.appendChild(overlay);requestAnimationFrame(()=>overlay.classList.add("open"));active={overlay,resolve};
      const cancel=()=>close(null);overlay.querySelector(".modal-close").addEventListener("click",cancel);overlay.querySelector(".modal-cancel").addEventListener("click",cancel);overlay.addEventListener("click",e=>{if(e.target===overlay)cancel();});
      overlay.querySelector(".modal-confirm").addEventListener("click",()=>{const form=overlay.querySelector("form"),fd=new FormData(form),data=Object.fromEntries(fd.entries());const missing=fields.filter(f=>f.required&&!String(data[f.name]||"").trim()).map(f=>f.label);if(missing.length){const err=overlay.querySelector(".modal-inline-error");err.hidden=false;err.textContent=`Please complete: ${missing.join(", ")}.`;return;}close(data);});
      setTimeout(()=>overlay.querySelector("input,textarea")?.focus(),100);
    });
  }
  return Object.freeze({open,form,alert,close});
})();
