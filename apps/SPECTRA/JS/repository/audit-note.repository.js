"use strict";
NEXUS_SPECTRA.Repository.AuditNotes=(()=>{
 const KEY="NEXUS:SPECTRA:attendanceAuditNotes";
 function all(){try{return JSON.parse(localStorage.getItem(KEY)||"[]");}catch(_){return [];}}
 function save(row){const rows=all(),i=rows.findIndex(x=>x.noteId===row.noteId);if(i>=0)rows[i]=row;else rows.push(row);localStorage.setItem(KEY,JSON.stringify(rows));return row;}
 function byTransaction(no){return all().filter(x=>x.transactionNo===no);}
 function find(no,stage,reportId,scholarNo){return all().find(x=>x.transactionNo===no&&x.stage===stage&&x.reportId===reportId&&Number(x.scholarNo)===Number(scholarNo))||null;}
 return Object.freeze({all,save,byTransaction,find});
})();