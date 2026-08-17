"use strict";
NEXUS_SAM.Services.Storage = (() => {
  const settings=NEXUS_SAM.Configuration.Settings; let provider=NEXUS_SAM.Storage.Local;
  const buildKey=(key)=>`${settings.STORAGE_PREFIX}:${key}`;
  function setProvider(next){ if(!next||typeof next.set!=="function"||typeof next.get!=="function") throw new TypeError("Valid storage provider required"); provider=next; }
  function save(key,value){provider.set(buildKey(key),value);} function load(key,fallback=null){const v=provider.get(buildKey(key));return v===null?fallback:v;} function remove(key){provider.remove(buildKey(key));}
  return Object.freeze({setProvider,save,load,remove});
})();
