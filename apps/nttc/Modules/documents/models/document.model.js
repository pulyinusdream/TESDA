"use strict";
TAESF.NTTC.DocumentModel=class{
  constructor(data={}){
    this.documentId=data.documentId||(crypto.randomUUID?crypto.randomUUID():"DOC-"+Date.now()+"-"+Math.random().toString(36).slice(2));
    this.applicationId=data.applicationId||"";this.documentType=data.documentType||"";this.modality=data.modality||"";this.title=String(data.title||"").trim();
    this.fromDate=String(data.fromDate||"").trim();this.toDate=String(data.toDate||"").trim();
    this.claimedHours=data.claimedHours===""||data.claimedHours===undefined?"":Number(data.claimedHours);
    this.systemRawHours=Number(data.systemRawHours||0);this.systemEquivalentHours=Number(data.systemEquivalentHours||0);this.systemEquivalentYears=Number(data.systemEquivalentYears||0);this.modalityFactor=data.modalityFactor===null?null:Number(data.modalityFactor??0);this.computationPolicy=data.computationPolicy||"";
    this.fileName=String(data.fileName||"");this.mimeType=String(data.mimeType||"");this.sizeBytes=Number(data.sizeBytes||0);this.status=data.status||"UPLOADED";this.versionNo=Number(data.versionNo||1);this.supersedesDocumentId=data.supersedesDocumentId||"";this.uploadPurpose=data.uploadPurpose||"INITIAL";this.deficiencyId=data.deficiencyId||"";this.uploadedAt=data.uploadedAt||new Date().toISOString();
  }
};
