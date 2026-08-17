"use strict";
TAESF.NTTC.ApplicantValidator = (()=>{
  const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MOBILE=/^(?:\+63|0)?9\d{9}$/;
  const LEARNER_ID=/^[A-Z.]{3}-\d{2}-\d{3}-\d{5}-\d{3}$/;

  function normalizeLearnerId(value){
    return String(value||"").trim().toUpperCase().replace(/\s+/g,"");
  }

  function validate(data){
    const errors=[];
    ["learnerId","lastName","firstName","email","mobile","address","dateOfBirth"].forEach(k=>{
      if(!String(data[k]||"").trim()) errors.push(k+" is required.");
    });
    if(data.learnerId && !LEARNER_ID.test(normalizeLearnerId(data.learnerId))){
      errors.push("Please check the Learner ID and enter it in the required format.");
    }
    if(data.email && !EMAIL.test(String(data.email).trim())) errors.push("Enter a valid email address.");
    if(data.mobile && !MOBILE.test(String(data.mobile).replace(/[\s-]/g,""))) errors.push("Enter a valid Philippine mobile number.");
    if(data.dateOfBirth && new Date(data.dateOfBirth) >= new Date()) errors.push("Date of birth must be in the past.");
    return {valid:errors.length===0,errors};
  }
  return Object.freeze({validate,normalizeLearnerId});
})();
