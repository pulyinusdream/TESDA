"use strict";
TAESF.NTTC.DeficiencyModel=class{
  constructor(data={}){
    this.deficiencyId=data.deficiencyId||(crypto.randomUUID?crypto.randomUUID():"NTTCDEF-"+Date.now()+Math.random());
    this.applicationId=data.applicationId||"";
    this.documentId=data.documentId||"";
    this.requirementCode=data.requirementCode||"";
    this.finding=data.finding||"";
    this.requiredAction=data.requiredAction||"";
    this.status=data.status||"OPEN";
    this.issuedAt=data.issuedAt||new Date().toISOString();
    this.complianceDocumentId=data.complianceDocumentId||"";
    this.compliedAt=data.compliedAt||"";
    this.closedAt=data.closedAt||"";
    this.closedBy=data.closedBy||"";
  }
};
