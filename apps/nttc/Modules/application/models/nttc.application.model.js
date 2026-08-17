"use strict";
TAESF.NTTC.ApplicationModel = class {
  constructor(data={}){
    this.applicationId=data.applicationId||(crypto.randomUUID?crypto.randomUUID():"NTTCAPP-"+Date.now());
    this.applicantId=data.applicantId||"";
    this.controlNumber=data.controlNumber||"";
    this.status=data.status||TAESF.NTTC.Constants.STATUS.DRAFT;
    this.qualificationCode=data.qualificationCode||"";
    this.qualificationTitle=data.qualificationTitle||"";
    this.sector=data.sector||"";
    this.credentials=data.credentials||{
      nc:{certificateNumber:"",qualificationCode:"",level:"",issuedOn:""},
      tmc:{certificateNumber:"",level:"I",issuedOn:""}
    };
    this.applicationDetails=data.applicationDetails||{tviName:"",employmentStatus:"",yearsTeaching:"",notes:""};
    this.prerequisiteCheck=data.prerequisiteCheck||{valid:false,errors:[],checkedAt:""};
    this.submittedAt=data.submittedAt||"";
    this.createdAt=data.createdAt||new Date().toISOString();
    this.updatedAt=data.updatedAt||this.createdAt;
    this.version=Number(data.version||1);
  }
};
