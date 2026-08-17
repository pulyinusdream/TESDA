"use strict";
NEXUS_SPECTRA.Repository.SPMOR=(()=>{
 const KEYS={imports:"NEXUS:SPECTRA:spmorImports",scholars:"NEXUS:SPECTRA:scholarMaster",enrollments:"NEXUS:SPECTRA:scholarEnrollments"};
 const load=k=>{try{return JSON.parse(localStorage.getItem(k)||"[]");}catch(_){return [];}};const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 const canonical=s=>String(s||"").trim().toUpperCase().replace(/\s+/g," ");
 function imports(){return load(KEYS.imports)}function saveImport(r){const rows=imports(),i=rows.findIndex(x=>x.importId===r.importId);if(i>=0)rows[i]=r;else rows.push(r);save(KEYS.imports,rows);return r;}
 function scholars(){return load(KEYS.scholars)}function saveScholars(rows){save(KEYS.scholars,rows);return rows;}
 function enrollments(){return load(KEYS.enrollments)}function saveEnrollments(rows){save(KEYS.enrollments,rows);return rows;}
 function scholarById(id){return scholars().find(x=>x.scholarId===id)||null}function enrollmentsForScholar(id){return enrollments().filter(x=>x.scholarId===id)}function enrollmentsForRqm(rqm){const k=canonical(rqm);return enrollments().filter(x=>canonical(x.rqmCode)===k)}
 return Object.freeze({KEYS,canonical,imports,saveImport,scholars,saveScholars,enrollments,saveEnrollments,scholarById,enrollmentsForScholar,enrollmentsForRqm});
})();