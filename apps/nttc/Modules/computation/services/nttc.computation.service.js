"use strict";
TAESF.NTTC.Computation = (() => {
  const C=TAESF.NTTC.Constants;
  function n(v){const x=Number(v);return Number.isFinite(x)?x:0;}
  function directEquivalentHours(modality,actualHours){const factor=C.MODALITY_FACTOR[modality];if(factor===undefined)throw new Error(`Unsupported direct IWER modality: ${modality}`);return n(actualHours)*factor;}
  function directIwerYears(modality,actualHours){return directEquivalentHours(modality,actualHours)/C.HOURS_PER_WORK_YEAR;}
  function teachingCreditUnits(years){const y=Math.floor(n(years));return y<3?0:Math.min(19,y-2);}
  function modalityCreditUnits(equivalentHours){return Math.floor(n(equivalentHours)/C.HOURS_PER_CREDIT_UNIT);}
  function totalUnitsToYears(totalUnits){const u=Math.floor(n(totalUnits));if(u<2)return 0;return Math.min(5,u*0.25);}
  function teachingEquivalency({teachingYears=0,modalityEquivalentHours=0}){const teachingUnits=teachingCreditUnits(teachingYears),modalityUnits=modalityCreditUnits(modalityEquivalentHours),eligible=teachingUnits>=1&&modalityUnits>=1,totalUnits=teachingUnits+modalityUnits;return{teachingUnits,modalityUnits,totalUnits,eligible,equivalentIwerYears:eligible?totalUnitsToYears(totalUnits):0};}
  function dateParts(fromDate,toDate){
    const from=new Date(`${fromDate}T00:00:00`),to=new Date(`${toDate}T00:00:00`);if(Number.isNaN(from.getTime())||Number.isNaN(to.getTime())||to<from)return null;
    let cursor=new Date(from),months=0;while(true){const next=new Date(cursor);next.setMonth(next.getMonth()+1);if(next<=to){months++;cursor=next;}else break;}
    const remainder=Math.max(0,Math.floor((to-cursor)/86400000)+1);return{months,remainderDays:remainder};
  }
  function systemRawHoursFromDates(fromDate,toDate){
    const p=dateParts(fromDate,toDate);if(!p)return 0;
    // Prescribed Form A note: 1 day = 8 hours; 22 days per month.
    const creditedDays=(p.months*22)+Math.min(p.remainderDays,22);return creditedDays*8;
  }
  function modalityFactor(modality){if(Object.prototype.hasOwnProperty.call(C.MODALITY_FACTOR,modality))return C.MODALITY_FACTOR[modality];if(["INTERNATIONAL_IMMERSION","INTERNATIONAL_TRAINING"].includes(modality))return 2;return null;}
  function estimateEvidence(fromDate,toDate,modality){
    const rawHours=systemRawHoursFromDates(fromDate,toDate),factor=modalityFactor(modality),recognized=!!C.IWER_MODALITIES[modality];
    const equivalentHours=factor===null?rawHours:rawHours*factor;
    return{recognized,rawHours,factor,equivalentHours,equivalentYears:equivalentHours/C.HOURS_PER_WORK_YEAR,policy:"FORM_A_22_DAYS_MONTH_8_HOURS_DAY",annualDivisor:C.HOURS_PER_WORK_YEAR};
  }
  function modalitySetCheck(application,documents){
    const iwer=(documents||[]).filter(d=>d.documentType===C.DOCUMENT_TYPES.IWER_EVIDENCE),errors=[];
    iwer.forEach(d=>{if(!C.IWER_MODALITIES[d.modality])errors.push(`${d.title||d.fileName}: unrecognized IWER modality.`);});
    const teaching=iwer.some(d=>d.modality==="TEACHING_EQUIVALENCY");
    if(teaching){const years=n(application?.applicationDetails?.yearsTeaching);const supplemental=iwer.some(d=>["INDUSTRY_IMMERSION","DTP_DTS","TECHNICAL_CONSULTING","INTERNATIONAL_IMMERSION","INTERNATIONAL_TRAINING"].includes(d.modality));if(years<3)errors.push("Teaching Experience / Credit Equivalency requires at least three years of teaching experience.");if(!supplemental)errors.push("Teaching Experience / Credit Equivalency requires supporting evidence from another recognized qualifying modality.");}
    return{valid:errors.length===0,errors};
  }
  function prerequisiteCheck({ncValid,ncLevel=0,minimumNcLevel=2,tmc1Valid}){const findings=[];if(!ncValid)findings.push("A valid National Certificate is required.");if(n(ncLevel)<n(minimumNcLevel))findings.push(`National Certificate must be at least NC ${minimumNcLevel}.`);if(!tmc1Valid)findings.push("A valid Trainers Methodology Certificate I is required.");return{passed:findings.length===0,findings};}
  return Object.freeze({directEquivalentHours,directIwerYears,teachingCreditUnits,modalityCreditUnits,totalUnitsToYears,teachingEquivalency,systemRawHoursFromDates,estimateEvidence,modalitySetCheck,prerequisiteCheck});
})();
