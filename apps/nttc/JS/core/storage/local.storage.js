"use strict";
TAESF.NTTC.LocalStorage = Object.freeze({
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),
  get:(k)=>{const v=localStorage.getItem(k); return v===null?null:JSON.parse(v);},
  remove:(k)=>localStorage.removeItem(k)
});
