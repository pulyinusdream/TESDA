"use strict";
TAESF.NTTC.QualificationRepository = (()=>{
  const KEY="nttc.block2.qualifications";
  const SEED=[
    {qualificationCode:"BPP-NCII",sector:"Tourism",qualificationTitle:"Bread and Pastry Production NC II",ncLevel:2,active:true},
    {qualificationCode:"COOK-NCII",sector:"Tourism",qualificationTitle:"Cookery NC II",ncLevel:2,active:true},
    {qualificationCode:"FBS-NCII",sector:"Tourism",qualificationTitle:"Food and Beverage Services NC II",ncLevel:2,active:true},
    {qualificationCode:"FBS-NCIII",sector:"Tourism",qualificationTitle:"Food and Beverage Services NC III",ncLevel:3,active:true},
    {qualificationCode:"CSS-NCII",sector:"ICT",qualificationTitle:"Computer Systems Servicing NC II",ncLevel:2,active:true}
  ];
  function all(){ const rows=TAESF.NTTC.LocalStorage.get(KEY); if(rows&&rows.length) return rows; TAESF.NTTC.LocalStorage.set(KEY,SEED); return SEED.slice(); }
  function active(){ return all().filter(x=>x.active!==false); }
  function find(code){ return all().find(x=>x.qualificationCode===code)||null; }
  function replace(rows){ TAESF.NTTC.LocalStorage.set(KEY,Array.isArray(rows)?rows:[]); return all(); }
  return Object.freeze({all,active,find,replace});
})();
