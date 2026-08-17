"use strict";
NEXUS_SAM.Storage.Local = (() => {
  function set(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  function get(key){ const raw=localStorage.getItem(key); if(raw===null)return null; try{return JSON.parse(raw);}catch(e){console.error("SAM storage parse failed",e);return null;} }
  function remove(key){ localStorage.removeItem(key); }
  function clearByPrefix(prefix){ const keys=[]; for(let i=0;i<localStorage.length;i+=1){const k=localStorage.key(i);if(k&&k.startsWith(prefix))keys.push(k);} keys.forEach(k=>localStorage.removeItem(k)); }
  return Object.freeze({set,get,remove,clearByPrefix});
})();
