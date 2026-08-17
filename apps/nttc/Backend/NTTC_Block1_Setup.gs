/** NEXUS NTTC Block 1 - Google Sheets data-store bootstrap. Standalone, prefix-safe. */
const NTTC_BLOCK1_SCHEMA = Object.freeze({
 NTTC_CONFIG:["Key","Value","Description","UpdatedAt","UpdatedBy"],
 NTTC_APPLICANTS:["ApplicantID","LastName","FirstName","MiddleName","NameExtension","BirthDate","Email","MobileNo","Address","AccountStatus","CreatedAt","UpdatedAt"],
 NTTC_APPLICATIONS:["ApplicationID","ApplicantID","ControlNumber","QualificationCode","QualificationTitle","Status","ApplicantStage","SubmittedAt","CurrentAssignee","Version","CreatedAt","UpdatedAt"],
 NTTC_QUALIFICATIONS:["QualificationCode","Sector","QualificationTitle","NCLevel","MinimumNCLevel","RequiredIWERYears","TRReference","Active"],
 NTTC_REQUIREMENTS:["RequirementCode","RequirementName","RequirementType","QualificationCode","Mandatory","NeedsOriginalVerification","NeedsNotarization","Active"],
 NTTC_CREDENTIALS:["CredentialID","ApplicationID","CredentialType","QualificationCode","CertificateNumber","DateIssued","ExpiryDate","VerifiedStatus","VerifiedBy","VerifiedAt"],
 NTTC_EVIDENCES:["EvidenceID","ApplicationID","Modality","EmployerInstitution","PositionRole","TaskDescription","DateFrom","DateTo","ActualHours","EquivalentHours","EstimatedIWERYears","Status","CreatedAt","UpdatedAt"],
 NTTC_DOCUMENTS:["DocumentID","ApplicationID","RequirementCode","EvidenceID","DriveFileID","FileName","MimeType","Version","DocumentStatus","InternalOnly","UploadedAt","UploadedBy"],
 NTTC_SCREENING:["ScreeningID","ApplicationID","RequirementCode","DocumentID","FindingStatus","Remarks","Modality","ModalityConfirmed","HoursReviewMode","SystemRawHours","SystemEquivalentHours","ApprovedRawHours","ApprovedEquivalentHours","ApprovedEquivalentYears","HoursOverrideReason","ReviewedBy","ReviewedAt"],
 NTTC_DEFICIENCIES:["DeficiencyID","ApplicationID","RequirementCode","Finding","RequiredAction","Status","IssuedAt","CompliedAt","ClosedAt","ClosedBy"],
 NTTC_ASSESSMENTS:["AssessmentID","ApplicationID","AssessmentType","AssessorID","AssessmentStatus","StartedAt","CompletedAt","Remarks"],
 NTTC_EVIDENCE_RATINGS:["RatingID","AssessmentID","EvidenceID","Valid","Authentic","Sufficient","Current","Consistent","Recent","CreditRecommended","Remarks"],
 NTTC_CREDIT_COMPUTATION:["ComputationID","ApplicationID","Route","SourceID","ActualHours","Factor","EquivalentHours","CreditUnits","EquivalentIWERYears","CalculatedAt","CalculatedBy","Finalized"],
 NTTC_APPOINTMENTS:["AppointmentID","ApplicationID","ScheduleDate","TimeFrom","TimeTo","Venue","Instructions","Status","ConfirmedAt","PreferredDate","PreferredTimeFrom","PreferredTimeTo","RescheduleReason","ScheduleRequestStatus","ScheduleDecisionAt","FocalRemarks","CreatedBy","CreatedAt"],
 NTTC_HARDCOPY_RECEIPT:["ReceiptID","ApplicationID","ArrivalAt","PresenceConfirmedBy","HardcopyReceivedAt","ReceivedBy","OriginalsVerified","OriginalsVerifiedAt","ClaimStubNo","ClaimStubPrintedAt","Remarks"],
 NTTC_ENDORSEMENTS:["EndorsementID","ApplicationID","Stage","EndorsedBy","EndorsedAt","TransmittalReference","ROReceivedDate","Remarks"],
 NTTC_CERTIFICATES:["CertificateRecordID","ApplicationID","NTTCCertificateNumber","QualificationTitle","NTTCLevel","DateIssued","ValidUntil","DateReceivedByPO","ReceivedBy","ScanDriveFileID","InternalOnly","RecordedAt","RecordedBy"],
 NTTC_NOTIFICATIONS:["NotificationID","ApplicationID","RecipientType","Recipient","TemplateCode","Subject","Status","QueuedAt","SentAt","ErrorMessage"],
 NTTC_STATUS_HISTORY:["HistoryID","ApplicationID","FromStatus","ToStatus","ApplicantStage","Action","Remarks","ChangedBy","ChangedAt"],
 NTTC_AUDIT_LOG:["AuditID","ApplicationID","EntityType","EntityID","Action","BeforeJSON","AfterJSON","ActorID","ActorRole","Timestamp"],
 NTTC_SETTINGS:["SettingKey","SettingValue","DataType","Description","Active","UpdatedAt","UpdatedBy"]
});
function NTTC_setupDataStore(){
 const id=PropertiesService.getScriptProperties().getProperty("NTTC_SPREADSHEET_ID");
 const ss=id?SpreadsheetApp.openById(id):SpreadsheetApp.getActiveSpreadsheet();
 if(!ss) throw new Error("Set Script Property NTTC_SPREADSHEET_ID or bind this script to the NTTC data spreadsheet.");
 const result=[];
 Object.keys(NTTC_BLOCK1_SCHEMA).forEach(name=>{
   let sh=ss.getSheetByName(name); let created=false;
   if(!sh){sh=ss.insertSheet(name);created=true;}
   const headers=NTTC_BLOCK1_SCHEMA[name];
   if(sh.getMaxColumns()<headers.length) sh.insertColumnsAfter(sh.getMaxColumns(),headers.length-sh.getMaxColumns());
   sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight("bold").setWrap(true);
   sh.setFrozenRows(1); result.push({sheet:name,created});
 });
 NTTC_seedSettings_(ss);
 return result;
}
function NTTC_seedSettings_(ss){
 const sh=ss.getSheetByName("NTTC_SETTINGS");
 const existing=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,1).getValues().flat():[];
 const now=new Date();
 const seeds=[
   ["CONTROL_PREFIX","NTTC-R05-ALB","string","Online application control number prefix",true,now,"SYSTEM"],
   ["CLAIM_PREFIX","CS-NTTC","string","Claim stub number prefix",true,now,"SYSTEM"],
   ["HOURS_PER_WORK_YEAR","2312","number","Actual industry work hours per year from approved IWER portfolio form",true,now,"SYSTEM"],
   ["ONLINE_SUBMISSION_DISCLAIMER","Online submission and acceptance of hard-copy requirements by TESDA Albay Provincial Office do not constitute approval or issuance of the NTTC. Complete applications are transmitted to the TESDA Regional Office for review, processing and issuance.","string","Applicant-facing disclaimer",true,now,"SYSTEM"]
 ];
 seeds.filter(r=>!existing.includes(r[0])).forEach(r=>sh.appendRow(r));
}
