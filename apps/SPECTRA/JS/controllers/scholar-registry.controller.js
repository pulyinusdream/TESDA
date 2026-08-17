"use strict";
NEXUS_SPECTRA.Controllers.ScholarRegistry=(()=>{
 function initialize(){
  const root=document;
  root.addEventListener("input",e=>{if(e.target.matches("#sharedScholarSearch"))NEXUS_SPECTRA.Views.ScholarRegistry.render();});
  root.addEventListener("change",e=>{if(e.target.matches("#sharedScholarSchool,#sharedScholarQualification,#sharedScholarStatus"))NEXUS_SPECTRA.Views.ScholarRegistry.render();});
  NEXUS_SPECTRA.Views.ScholarRegistry.render();
 }
 return Object.freeze({initialize});
})();