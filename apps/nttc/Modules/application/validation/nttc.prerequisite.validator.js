"use strict";
TAESF.NTTC.PrerequisiteValidator = (()=>{
  const LEVEL={"NC I":1,"NC II":2,"NC III":3,"NC IV":4,"I":1,"II":2,"III":3,"IV":4};
  const NC_NUMBER=/^\d{14}$/;

  function levelNumber(value){
    if(typeof value==="number") return value;
    const s=String(value||"").trim().toUpperCase();
    return LEVEL[s]||Number(String(s).replace(/\D/g,""))||0;
  }
  function parseDate(dateText){
    if(!dateText) return null;
    const d=new Date(dateText+"T00:00:00");
    return isNaN(d.getTime())?null:d;
  }
  function expectedValidity(dateText){
    const d=parseDate(dateText); if(!d) return "";
    const x=new Date(d.getTime()); x.setFullYear(x.getFullYear()+TAESF.NTTC.Constants.CREDENTIAL_VALIDITY_YEARS);
    return x.toISOString().slice(0,10);
  }
  function credentialStillValid(dateText){
    const expiry=expectedValidity(dateText); if(!expiry) return false;
    const d=new Date(expiry+"T23:59:59"); return d>=new Date();
  }
  function ncNumberLooksConsistent(number,issuedOn){
    const n=String(number||"").replace(/\D/g,"");
    if(!NC_NUMBER.test(n)) return false;
    if(!issuedOn) return true;
    const d=parseDate(issuedOn); if(!d) return false;
    return n.slice(0,2)===String(d.getFullYear()).slice(-2);
  }
  function validate(application){
    const errors=[];
    let qualification=null;
    try{ qualification=TAESF.NTTC.QualificationService.get(application.qualificationCode); }
    catch(e){ errors.push(e.message); }
    const nc=application.credentials&&application.credentials.nc||{};
    const tmc=application.credentials&&application.credentials.tmc||{};
    const details=application.applicationDetails||{};

    if(!String(details.tviName||"").trim()) errors.push("TVI / Institution is required.");
    if(!String(details.employmentStatus||"").trim()) errors.push("Employment Status is required.");

    if(!nc.certificateNumber) errors.push("National Certificate number is required.");
    else if(!ncNumberLooksConsistent(nc.certificateNumber,nc.issuedOn)) errors.push("Please check the National Certificate number and date issued. The details do not appear consistent.");
    if(!nc.qualificationCode) errors.push("National Certificate qualification is required.");
    if(qualification&&nc.qualificationCode!==qualification.qualificationCode) errors.push("The National Certificate must be appropriate to the qualification being applied for.");
    if(levelNumber(nc.level)<TAESF.NTTC.Constants.MIN_NC_LEVEL) errors.push("National Certificate must not be lower than NC II.");
    if(qualification&&levelNumber(nc.level)<Number(qualification.ncLevel||2)) errors.push("National Certificate level is lower than the selected qualification level.");
    if(!nc.issuedOn) errors.push("National Certificate date issued is required.");
    else if(!credentialStillValid(nc.issuedOn)) errors.push("The National Certificate appears to be beyond the five-year validity period. Please check the date issued and certificate details.");

    if(!tmc.certificateNumber) errors.push("Trainers Methodology Certificate I number is required.");
    if(String(tmc.level||"").trim().toUpperCase()!=="I"&&String(tmc.level||"").trim()!=="1") errors.push("Trainers Methodology Certificate must be TM Level I.");
    if(!tmc.issuedOn) errors.push("Trainers Methodology Certificate I date issued is required.");
    else if(!credentialStillValid(tmc.issuedOn)) errors.push("The Trainers Methodology Certificate I appears to be beyond the five-year validity period. Please check the date issued and certificate details.");
    return {valid:errors.length===0,errors};
  }
  return Object.freeze({validate,levelNumber,expectedValidity,credentialStillValid,ncNumberLooksConsistent});
})();
