"use strict";
TAESF.NTTC.ApplicantModel = class {
  constructor(data={}){
    this.applicantId = data.applicantId || (crypto.randomUUID ? crypto.randomUUID() : "APP-" + Date.now());
    this.learnerId = String(data.learnerId||"").trim().toUpperCase();
    this.lastName = String(data.lastName||"").trim();
    this.firstName = String(data.firstName||"").trim();
    this.middleName = String(data.middleName||"").trim();
    this.extensionName = String(data.extensionName||"").trim();
    this.email = String(data.email||"").trim().toLowerCase();
    this.mobile = String(data.mobile||"").trim();
    this.address = String(data.address||"").trim();
    this.dateOfBirth = String(data.dateOfBirth||"").trim();
    this.placeOfBirth = String(data.placeOfBirth||"").trim();
    this.heightM = String(data.heightM||"").trim();
    this.weightKg = String(data.weightKg||"").trim();
    this.telephone = String(data.telephone||"").trim();
    this.institutionAddress = String(data.institutionAddress||"").trim();
    this.sex = String(data.sex||"").trim();
    this.civilStatus = String(data.civilStatus||"").trim();
    this.highestEducation = String(data.highestEducation||"").trim();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || this.createdAt;
  }
  get fullName(){
    return [this.firstName,this.middleName,this.lastName,this.extensionName].filter(Boolean).join(" ");
  }
};
