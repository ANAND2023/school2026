import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from '../../../components/UI/customTable'
import Heading from "../../../components/UI/Heading";
import { notify } from "../../../utils/utils";
import { GetDrugFormularyPdf, NabhManualGetNabhDetail, NabhManualGetNabhpdf } from "../../../networkServices/InventoryApi";

const NABHManual = () => {
  const [t] = useTranslation();
 
 const data= [
  {
    "ID": "AAC 1 a-d_SCOPE OF SERVICES",
    "fileName": "AAC 1 a-d_SCOPE OF SERVICES"
  },
  {
    "ID": "AAC 2 d_Management During Non-Availability Of Bed",
    "fileName": "AAC 2 d_Management During Non-Availability Of Bed"
  },
  {
    "ID": "AAC 2 e_Prioritizing of patients",
    "fileName": "AAC 2 e_Prioritizing of patients"
  },
  {
    "ID": "AAC 2-a,b,c REGISTRATION AND ADMISSION PROCESS",
    "fileName": "AAC 2-a,b,c REGISTRATION AND ADMISSION PROCESS"
  },
  {
    "ID": "AAC 3-b_TRANSFER-OUT REFERRAL POLICY",
    // "fileName": "AAC 3-b_TRANSFER-OUT REFERRAL POLICY"
    "fileName": "AAC 3-b_TRANSFER-OUT REFERAL POLICY"
  },
  {
    "ID": "AAC 4 a-g_Initial assessment",
    "fileName": "AAC 4 a-g_Initial assessment"
  },
  {
    "ID": "AAC 5 a-e_Re-assessment & Observation",
    "fileName": "AAC 5 a-e_Re-assessment & Observation"
  },
  {
    "ID": "AAC 6 a-j_ Laboratory Services",
    // "fileName": "AAC 6 a-j_Laboratory Services"
    "fileName": "AAC 6 a-j_ Laboratory Services"
  },
  {
    "ID": "AAC 7 a,c,f Laboratory Quality Assurance Programme_",
    "fileName": "AAC 7 a,c,f Laboratory Quality Assurance Programme_"
  },
  {
    "ID": "AAC 7 b,d,e_verification and validation",
    "fileName": "AAC 7 b,d,e_verification and validation"
  },
  {
    "ID": "AAC 8 a-d_Laboratory Safety Program",
    // "fileName": "AAC 8 a-d_Laboratory Safety Program"
    "fileName": "AAC 8 a-d_Laboratory Safety Program"
   
  
  },
  {
    "ID": "AAC 9 a-d,h_SCOPE OF IMAGING SERVICES",
    "fileName": "AAC 9 a-d,h_SCOPE OF IMAGING SERVICES"
  },
  {
    "ID": "AAC 9 e_Identification and safe and timely transportation of patients To and from imaging services",
    "fileName": "AAC 9 e_Identification and safe and timely transportation of patients To and from imaging services"
  },
  {
    "ID": "AAC 9 f_TURN AROUND TIME",
    "fileName": "AAC 9 f_TURN AROUND TIME"
  },
  {
    "ID": "AAC 9 g_CRITICAL RESULTS",
    "fileName": "AAC 9 g_CRITICAL RESULTS"
  },
  {
    "ID": "AAC 9 i_REPORTS RECALL POLICY",
    "fileName": "AAC 9 i_REPORTS RECALL POLICY"
  },
  {
    "ID": "AAC 9 j_OUT SOURCED SERVICES",
    "fileName": "AAC 9 j_OUT SOURCED SERVICES"
  },
  {
    "ID": "AAC 10 a-h_Imaging Quality assurance",
    "fileName": "AAC 10 a-h_Imaging Quality assurance"
  },
  {
    "ID": "AAC 11 a-g_Imaging safety programme",
    "fileName": "AAC 11 a-g_Imaging safety programme"
  },
  {
    "ID": "AAC 12 a-e, g-i_ MULTIDISCIPLINARY APPROACH IN PATIENT CARE",
    "fileName": "AAC 12 a-e, g-i_ MULTIDISCIPLINARY APPROACH IN PATIENT CARE"
  },
  {
    "ID": "AAC 12 f-INTERNAL REFERRAL",
    // "fileName": "AAC 12 f-INTERNAL REFERRAL"
    "fileName": "AAC 12 f-INTERNAL REFERRAL "
  },
  {
    "ID": "AAC 13 a,b,e,f_Discharge process",
    "fileName": "AAC 13 a,b,e,f_Discharge process"
  },
  {
    "ID": "AAC 13 c-d_Discharge against medical advice",
    "fileName": "AAC 13 c-d_Discharge against medical advice"
  },
  {
    "ID": "AAC 14_Discharge summary",
    "fileName": "AAC 14_Discharge summary"
  },
  {
    "ID": "ANTIBIOGRAM SHEET SEP OCT NOV.old",
    "fileName": "ANTIBIOGRAM SHEET SEP OCT NOV.old"
  },
  {
    "ID": "ANTIBIOGRAM SHEET SEP OCT NOV",
    "fileName": "ANTIBIOGRAM SHEET SEP OCT NOV"
  },
  {
    "ID": "Billing Manual",
    "fileName": "Billing Manual"
  },
  {
    "ID": "Biomedical Engineering Manual",
    "fileName": "Biomedical Engineering Manual"
  },
  {
    "ID": "COP 1 a-h_UNIFORM CARE TO PATIENTS",
    "fileName": "COP 1 a-h_UNIFORM CARE TO PATIENTS"
  },
  {
    "ID": "COP 1 e_Clinical pathways",
    "fileName": "COP 1 e_Clinical pathways"
  },
  {
    "ID": "COP 2 a-c,f_Emergency services, crowd management &Re-assessment of patients",
    "fileName": "COP 2 a-c,f_Emergency services, crowd management &Re-assessment of patients"
  },
  {
    "ID": "COP 2 d_The organisation manages MLC cases in accordance with statutory requirements",
    "fileName": "COP 2 d_The organisation manages MLC cases in accordance with statutory requirements"
  },
  {
    "ID": "COP 2 e_SYSTEM OF TRIAGE",
    "fileName": "COP 2 e_SYSTEM OF TRIAGE"
  },
  {
    "ID": "COP 2 g,h_Admission, Discharge to home & Transfer to another organization is documented",
    "fileName": "COP 2 g,h_Admission, Discharge to home & Transfer to another organization is documented"
  },
  {
    "ID": "COP 2 i_ EMERGENCY QUALITY ASSURANCE PROGRAMME",
    "fileName": "COP 2 i_ EMERGENCY QUALITY ASSURANCE PROGRAMME"
  },
  {
    "ID": "COP 2 j_BROUGHT DEAD AND DEATH ON ARRIVAL",
    "fileName": "COP 2 j_BROUGHT DEAD AND DEATH ON ARRIVAL"
  },
  {
    "ID": "COP 3 a-i_AMBULANCE SERVICES",
    "fileName": "COP 3 a-i_AMBULANCE SERVICES"
  },
  {
    "ID": "COP 5 a-f_CARDIOPULMONARY RESUSCITATION",
    "fileName": "COP 5 a-f_CARDIOPULMONARY RESUSCITATION"
  },
  {
    "ID": "COP 6 a-g_Nursing care is provided to patients in consonance with clinical protocols",
    "fileName": "COP 6 a-g_Nursing care is provided to patients in consonance with clinical protocols"
  },
  {
    "ID": "COP 7 a-h_Clinical Procedures are performed in a safe manner",
    "fileName": "COP 7 a-h_Clinical Procedures are performed in a safe manner"
  },
  {
    "ID": "COP 7_PROCEDURAL SEDATION POLICY",
    "fileName": "COP 7_PROCEDURAL SEDATION POLICY"
  },
  {
    "ID": "COP 8_POLICY ON TRANSFUSION OF BLOOD AND BLOOD PRODUCTS",
    "fileName": "COP 8_POLICY ON TRANSFUSION OF BLOOD AND BLOOD PRODUCTS"
  },
  {
    "ID": "COP 9 e INTENSIVE CARE AND HIGH DEPEDENCY UNIT. POLICY ON NON –AVAILABILITY OF BEDS",
    // "fileName": "COP 9 e INTENSIVE CARE AND HIGH DEPEDENCY UNIT. POLICY ON NON –AVAILABILITY OF BEDS"
    "fileName": "COP 9 e INTENSIVE CARE AND HIGH DEPEDENCY UNIT. POLICY  ON  NON –AVAILABILITY OF BEDS"
  },
  {
    "ID": "COP 9 g-h_INTENSIVE CARE AND HIGH DEPEDENCY UNIT",
    "fileName": "COP 9 g-h_INTENSIVE CARE AND HIGH DEPEDENCY UNIT"
  },
  {
    "ID": "COP 9_Admission & Discharge Criteria",
    "fileName": "COP 9_Admission & Discharge Criteria"
  },
  {
    "ID": "COP 10 a-g_The Organisation provides safe Obstetric practices",
    "fileName": "COP 10 a-g_The Organisation provides safe Obstetric practices"
  },
  {
    "ID": "COP 10_ANTENATAL SERVICES",
    "fileName": "COP 10_ANTENATAL SERVICES"
  },
  {
    "ID": "COP 11 a-g_The Organisation provides safe Paediatric Services",
    "fileName": "COP 11 a-g_The Organisation provides safe Paediatric Services"
  },
  {
    "ID": "COP 11 c_Those who care for children have age specific competency",
    "fileName": "COP 11 c_Those who care for children have age specific competency"
  },
  {
    "ID": "COP 13_Anaesthesia services are provided in a consistent and safe manner",
    "fileName": "COP 13_Anaesthesia services are provided in a consistent and safe manner"
  },
  {
    "ID": "COP 14_Surgical Services are provided in a consistent and safe manner",
    "fileName": "COP 14_Surgical Services are provided in a consistent and safe manner"
  },
  {
    "ID": "COP 16 a-c_CARE OF VULNERABLE PATIENTS",
    "fileName": "COP 16 a-c_CARE OF VULNERABLE PATIENTS"
  },
  {
    "ID": "COP 16 d_PRESSURE ULCER",
    "fileName": "COP 16 d_PRESSURE ULCER"
  },
  {
    "ID": "COP 16 e_DVT Policy",
    "fileName": "COP 16 e_DVT Policy"
  },
  {
    "ID": "COP 16 f_RESTRAINT POLICY",
    "fileName": "COP 16 f_RESTRAINT POLICY"
  },
  {
    "ID": "COP 17_Pain management for patients is done in a consistent manner",
    "fileName": "COP 17_Pain management for patients is done in a consistent manner"
  },
  {
    "ID": "COP 18_REHABILITATIVE SERVICES",
    "fileName": "COP 18_REHABILITATIVE SERVICES"
  },
  {
    "ID": "COP 19_Nutritional Therapy is provided to patients consistently and collaboratively",
    // "fileName": "COP 19_Nutritional Therapy is provided to patients consistently and collaboratively"
    "fileName": "COP 19_Nutritional Therapy  is provided to patients consistently and collaboratively"
  },
  {
    "ID": "COP 20_END OF LIFE CARE",
    "fileName": "COP 20_END OF LIFE CARE"
  },
  {
    "ID": "CSSD Manual",
    "fileName": "CSSD Manual"
  },
  {
    "ID": "Dialysis Manual",
    "fileName": "Dialysis Manual"
  },
  {
    "ID": "Diet and Nutrition Manual",
    "fileName": "Diet and Nutrition Manual"
  },
  {
    "ID": "Disaster Manual",
    "fileName": "Disaster Manual"
  },
  {
    "ID": "Emergency Manual",
    "fileName": "Emergency Manual"
  },
  {
    "ID": "FMS 1 a-e_SYSTEM TO PROVIDE A SAFE AND SECURE ENVIRONMENT",
    "fileName": "FMS 1 a-e_SYSTEM TO PROVIDE A SAFE AND SECURE ENVIRONMENT"
  },
  {
    "ID": "FMS 2 a-f_Organizations environment and facilities operate in a planned manner",
    "fileName": "FMS 2 a-f_Organizations environment and facilities operate in a planned manner"
  },
  {
    "ID": "FMS 2 b_Utility Management Programme",
    "fileName": "FMS 2 b_Utility Management Programme"
  },
  {
    "ID": "FMS 2 g_Initiatives towards an energy efficient and Environmental friendly Hospital",
    // "fileName": "FMS 2 g_Initiatives towards an energy efficient and Environmental friendly Hospital"
    "fileName": "FMS 2 g_Initiatives towards an energy efficient and Environmental friendly Hospital  "
  },
  {
    "ID": "FMS 3 a-c_Operational planning identifies areas which need to have extra security and describes access to different areas in the hospital by staff, patients and visitor",
    "fileName": "FMS 3 a-c_Operational planning identifies areas which need to have extra security and describes access to different areas in the hospital by staff, patients and visitor"
  },
  {
    "ID": "FMS 3 d_IDENTIFICATION AND DISPOSAL OF MATERIALS NOT IN USE",
    "fileName": "FMS 3 d_IDENTIFICATION AND DISPOSAL OF MATERIALS NOT IN USE"
  },
  {
    "ID": "FMS 3 e-f_Management of hazardous materials",
    "fileName": "FMS 3 e-f_Management of hazardous materials"
  },
  {
    "ID": "FMS 4 a-g_Operational and Maintenance plan",
    "fileName": "FMS 4 a-g_Operational and Maintenance plan"
  },
  {
    "ID": "FMS 4 c- electrical systems_0001",
    "fileName": "FMS 4 c- electrical systems_0001"
  },
  {
    "ID": "FMS 4 c HVAC_0001",
    "fileName": "FMS 4 c HVAC_0001"
  },
  {
    "ID": "FMS 4 c-facility_0001",
    "fileName": "FMS 4 c-facility_0001"
  },
  {
    "ID": "HIC 1 e_INFECTION CONTROL COMMITTEE",
    "fileName": "HIC 1 e_INFECTION CONTROL COMMITTEE"
  },
  {
    "ID": "HIC 1 f_INFECTION CONTROL TEAM",
    "fileName": "HIC 1 f_INFECTION CONTROL TEAM"
  },
  {
    "ID": "HIC 2 b_Identification Of High-Risk areas & activities",
    "fileName": "HIC 2 b_Identification Of High-Risk areas & activities"
  },
  {
    "ID": "HIC 2 c_PERSONAL PROTECTIVE EUIPMENTS",
    "fileName": "HIC 2 c_PERSONAL PROTECTIVE EUIPMENTS"
  },
  {
    "ID": "HIC 2 d_HAND HYGIENE",
    "fileName": "HIC 2 d_HAND HYGIENE"
  },
  {
    "ID": "HIC 2 e_ISOLATIONBARRIER NURSING",
    "fileName": "HIC 2 e_ISOLATIONBARRIER NURSING"
  },
  {
    "ID": "HIC 3 a_Infection control practices for high risk areas",
    "fileName": "HIC 3 a_Infection control practices for high risk areas"
  },
  {
    "ID": "HIC 3 d_SAFE INJECTION & INFUSION PRACTICES",
    "fileName": "HIC 3 d_SAFE INJECTION & INFUSION PRACTICES"
  },
  {
    "ID": "HIC 3 g_ANTIMICROBIAL STEWARDSHIP PROGRAMME",
    // "fileName": "HIC 3 g_ANTIMICROBIAL STEWARDSHIP PROGRAMME"
    "fileName": "HIC 3 g_ANTIMICROBIAL STEWARDSHIP  PROGRAMME"
  },
  {
    "ID": "HIC 4 a_ENGINEERING CONTROL",
    "fileName": "HIC 4 a_ENGINEERING CONTROL"
  },
  {
    "ID": "HIC 4 b_INFECTION CONTROL RISK ASSESSMENT DURING CONSTRUCTION AND RENOVATION",
    "fileName": "HIC 4 b_INFECTION CONTROL RISK ASSESSMENT DURING CONSTRUCTION AND RENOVATION"
  },
  {
    "ID": "HIC 4 c_HOUSEKEEPING PROCEDURES",
    "fileName": "HIC 4 c_HOUSEKEEPING PROCEDURES"
  },
  {
    "ID": "HIC 4 d_BIO-MEDICAL WASTEMANAGEMENT",
    "fileName": "HIC 4 d_BIO-MEDICAL WASTEMANAGEMENT"
  },
  {
    "ID": "HIC 4 e_LINEN AND LAUNDRY",
    "fileName": "HIC 4 e_LINEN AND LAUNDRY"
  },
  {
    "ID": "HIC 4 f_KITCHEN SANITATION AND",
    "fileName": "HIC 4 f_KITCHEN SANITATION AND"
  },
  {
    "ID": "HIC 5 a-d_HOSPITAL ACQUIRED INFECTION",
    "fileName": "HIC 5 a-d_HOSPITAL ACQUIRED INFECTION"
  },
  {
    "ID": "HIC 6 e_MDRO",
    "fileName": "HIC 6 e_MDRO"
  },
  {
    "ID": "HIC 7 a-b_CLEANING, DISINFECTION &",
    "fileName": "HIC 7 a-b_CLEANING, DISINFECTION &"
  },
  {
    "ID": "HIC 7 a-f_CSSD Policy",
    "fileName": "HIC 7 a-f_CSSD Policy"
  },
  {
    "ID": "HIC 7 c_Reprocessing of Instruments",
    "fileName": "HIC 7 c_Reprocessing of Instruments"
  },
  {
    "ID": "HIC 7 e_Recall in the sterilization System and Biological Indicator Testing & Reporting",
    "fileName": "HIC 7 e_Recall in the sterilization System and Biological Indicator Testing & Reporting"
  },
  {
    "ID": "HIC 8 b_IMMUNIZATION POLICY",
    "fileName": "HIC 8 b_IMMUNIZATION POLICY"
  },
  {
    "ID": "HIC 8 c_WORK RESTRICTIONS FOR HCW WITH TRANSMISSIBLE INFECTION",
    "fileName": "HIC 8 c_WORK RESTRICTIONS FOR HCW WITH TRANSMISSIBLE INFECTION"
  },
  {
    "ID": "HIC 8 e_Blood and body fluid exposure",
    "fileName": "HIC 8 e_Blood and body fluid exposure"
  },
  {
    "ID": "HIC_ANTI-BIOTIC POLICY",
    "fileName": "HIC_ANTI-BIOTIC POLICY"
  },
  {
    "ID": "HIC_viral marker screening",
    "fileName": "HIC_viral marker screening"
  },
  {
    "ID": "HIC-1 j_Reporting of Notifiable Diseases",
    "fileName": "HIC-1 j_Reporting of Notifiable Diseases"
  },
  {
    "ID": "high risk list",
    "fileName": "high risk list"
  },
  {
    "ID": "Housekeeping Manual",
    "fileName": "Housekeeping Manual"
  },
  {
    "ID": "HRM 1 a_MANPOWER PLANNING",
    // "fileName": "HRM 1 a_MANPOWER PLANNING"
    "fileName": "HRM 1 a_MANPOWER  PLANNING"
  },
  {
    "ID": "HRM 1 b-c_Staff Mix and Contingency Plan",
    "fileName": "HRM 1 b-c_Staff Mix and Contingency Plan"
  },
  {
    "ID": "HRM 1 d_JOB DESCRIPTION AND JOB SPECIFICATION",
    "fileName": "HRM 1 d_JOB DESCRIPTION AND JOB SPECIFICATION"
  },
  {
    "ID": "HRM 1 e-g_Background Check, Organogram and exit interview",
    "fileName": "HRM 1 e-g_Background Check, Organogram and exit interview"
  },
  {
    "ID": "HRM 2 a,b_STAFF RECRUITMENT POLICY",
    "fileName": "HRM 2 a,b_STAFF RECRUITMENT POLICY"
  },
  {
    "ID": "HRM 2 c_CODE OF CONDUCT",
    "fileName": "HRM 2 c_CODE OF CONDUCT"
  },
  {
    "ID": "HRM 2 c-d_Administrative Procedures for Human Resource Management",
    "fileName": "HRM 2 c-d_Administrative Procedures for Human Resource Management"
  },
  {
    "ID": "HRM 3 a-i_Induction training for staff",
    "fileName": "HRM 3 a-i_Induction training for staff"
  },
  {
    "ID": "HRM 3_EMPLOYEE RIGHTS AND RESPONSIBILITIES",
    "fileName": "HRM 3_EMPLOYEE RIGHTS AND RESPONSIBILITIES"
  },
  {
    "ID": "HRM 4 a-f_On-going programme for professional training & development of staff",
    "fileName": "HRM 4 a-f_On-going programme for professional training & development of staff"
  },
  {
    "ID": "HRM 5 a-f_Staff are appropriately trained based on their specific job description",
    "fileName": "HRM 5 a-f_Staff are appropriately trained based on their specific job description"
  },
  {
    "ID": "HRM 6 a-g_Staff are trained in safety and quality –related aspects",
    "fileName": "HRM 6 a-g_Staff are trained in safety and quality –related aspects"
  },
  {
    "ID": "HRM 7 a-e_Performance Appraisal",
    "fileName": "HRM 7 a-e_Performance Appraisal"
  },
  {
    "ID": "HRM 8 a-f_Performance Appraisal",
    "fileName": "HRM 8 a-f_Performance Appraisal"
  },
  {
    "ID": "HRM 9 a-e_The Organisation promotes staff well-being and addresses their health & safety needs",
    "fileName": "HRM 9 a-e_The Organisation promotes staff well-being and addresses their health & safety needs"
  },
  {
    "ID": "HRM 10 a-d_Personnel Information of staff",
    "fileName": "HRM 10 a-d_Personnel Information of staff"
  },
  {
    "ID": "HRM 11 a-f_Credentialing &Privileging of Medical professionals",
    "fileName": "HRM 11 a-f_Credentialing &Privileging of Medical professionals"
  },
  {
    "ID": "HRM 12 a-f_Credentialing & Privileging of Nursing professionals",
    "fileName": "HRM 12 a-f_Credentialing & Privileging of Nursing professionals"
  },
  {
    "ID": "HRM 13 a-e_Credentialing &Privileging of Paramedical professionals",
    "fileName": "HRM 13 a-e_Credentialing &Privileging of Paramedical professionals"
  },
  {
    "ID": "ICU-HDU Manual",
    "fileName": "ICU-HDU Manual"
  },
  {
    "ID": "IMS 1 a_The organization identifies the",
    // "fileName": "IMS 1 a_The organization identifies the"
    "fileName": "IMS 1 a_The organization identifies the "
  },
  {
    "ID": "IMS 1 b-c, g_Information needs are captured & disseminated; IT acquisitions are commensurate with the identified needs and contribution of data as per law",
    "fileName": "IMS 1 b-c, g_Information needs are captured & disseminated; IT acquisitions are commensurate with the identified needs and contribution of data as per law"
  },
  {
    "ID": "IMS 1 d_A maintenance plan for information technology and communication network is implemented",
    "fileName": "IMS 1 d_A maintenance plan for information technology and communication network is implemented"
  },
  {
    "ID": "IMS 1 e_Contingency plan ensures continuity of information capture, integration and dissemination",
    "fileName": "IMS 1 e_Contingency plan ensures continuity of information capture, integration and dissemination"
  },
  {
    "ID": "IMS 1 f_The organisation ensures that information resources are accurate and meet stakeholder requirements",
    "fileName": "IMS 1 f_The organisation ensures that information resources are accurate and meet stakeholder requirements"
  },
  {
    "ID": "IMS 2 a-b,e_The organisation has processes in place for management and control of data and information",
    "fileName": "IMS 2 a-b,e_The organisation has processes in place for management and control of data and information"
  },
  {
    "ID": "IMS 2 c_The organisation disseminates the information in a timely and accurate manner",
    "fileName": "IMS 2 c_The organisation disseminates the information in a timely and accurate manner"
  },
  {
    "ID": "IMS 2 d_The organisation stores and retrieves data according to its information needs",
    "fileName": "IMS 2 d_The organisation stores and retrieves data according to its information needs"
  },
  {
    "ID": "IMS 3 a-c,e-g_The patients cared for in the organisation have a complete and accurate medical record",
    // "fileName": "IMS 3 a-c,e-g_The patients cared for in the organisation have a complete and accurate medical record"
    "fileName": "IMS 3 a-c.e-g_The patients cared for in the organisation have a complete and accurate medical record"
  },
  {
    "ID": "IMS 3 d_Authorised staffs make entry in the medical record",
    "fileName": "IMS 3 d_Authorised staffs make entry in the medical record"
  },
  {
    "ID": "IMS 4_The medical records reflect the continuity of care",
    "fileName": "IMS 4_The medical records reflect the continuity of care"
  },
  {
    "ID": "IMS 5 a-d_The organisation maintains the confidentiality, integrity and security of records, data and information",
    "fileName": "IMS 5 a-d_The organisation maintains the confidentiality, integrity and security of records, data and information"
  },
  {
    "ID": "IMS 5 e-f_The organisation discloses privileged health information as authorised by patients and or required by law",
    "fileName": "IMS 5 e-f_The organisation discloses privileged health information as authorised by patients and or required by law"
  },
  {
    "ID": "IMS 6 a_The organisation has an effective process for documentation control",
    "fileName": "IMS 6 a_The organisation has an effective process for documentation control"
  },
  {
    "ID": "IMS 6 b-d_The organisation ensures availability of current and relevant documents, records, data and information and provides for retention & the destruction of the sa",
    "fileName": "IMS 6 b-d_The organisation ensures availability of current and relevant documents, records, data and information and provides for retention & the destruction of the sa"
  },
  {
    "ID": "IMS 6_POLICY FOR RETENTION OF HOSPITAL DOCUMENTS",
    "fileName": "IMS 6_POLICY FOR RETENTION OF HOSPITAL DOCUMENTS"
  },
  {
    "ID": "IMS 7 a-g_The organisation carries out a review of medical records",
    "fileName": "IMS 7 a-g_The organisation carries out a review of medical records"
  },
  {
    "ID": "Infection Control Manual",
    "fileName": "Infection Control Manual"
  },
  {
    "ID": "IT Manual",
    "fileName": "IT Manual"
  },
  {
    "ID": "look alike september 2024",
    "fileName": "look alike september 2024"
  },
  {
    "ID": "Material Management Department Manual",
    "fileName": "Material Management Department Manual"
  },
  {
    "ID": "Medical Record Department Manual",
    "fileName": "Medical Record Department Manual"
  },
  {
    "ID": "MOM 1 a-e_Pharmacy Services and usage of medication is done safely",
    "fileName": "MOM 1 a-e_Pharmacy Services and usage of medication is done safely"
  },
  {
    "ID": "MOM 2 a-d_DRUG FORMULARY",
    "fileName": "MOM 2 a-d_DRUG FORMULARY"
  },
  {
    "ID": "MOM 2 e_PROCUREMENT PROCESS OF MEDICATIONS",
    "fileName": "MOM 2 e_PROCUREMENT PROCESS OF MEDICATIONS"
  },
  {
    "ID": "MOM 2 f_PROCUREMENT PROCESS OF NON FORMULARY MEDICATIONS",
    "fileName": "MOM 2 f_PROCUREMENT PROCESS OF NON FORMULARY MEDICATIONS"
  },
  {
    "ID": "MOM 3 a_Medications Storage",
    "fileName": "MOM 3 a_Medications Storage"
  },
  {
    "ID": "MOM 3 b_Policy on Inventory Control PracticesTechniques",
    "fileName": "MOM 3 b_Policy on Inventory Control PracticesTechniques"
  },
  {
    "ID": "MOM 3 e_High risk medications including Look alike, Sound Alike (LASA) medications and different concentrations of the same medications are stored physically apart",
    "fileName": "MOM 3 e_High risk medications including Look alike, Sound Alike (LASA) medications and different concentrations of the same medications are stored physically apart"
  },
  {
    "ID": "MOM 3 f-g_EMERGENCY MEDICINES (CRASH CART POLICY)",
    // "fileName": "MOM 3 f-g_EMERGENCY MEDICINES (CRASH CART POLICY)"
    "fileName": "MOM 3 f-g_EMERGENCY MEDICINES    (CRASH CART POLICY)"
  },
  {
    "ID": "MOM 4 a-h_Prescription of Medications",
    "fileName": "MOM 4 a-h_Prescription of Medications"
  },
  {
    "ID": "MOM 4 e_Verbal Order Policy",
    "fileName": "MOM 4 e_Verbal Order Policy"
  },
  {
    "ID": "MOM 5 a-d_Medication Order Policy",
    "fileName": "MOM 5 a-d_Medication Order Policy"
  },
  {
    "ID": "MOM 6 a_Safe Dispensing of Medications",
    "fileName": "MOM 6 a_Safe Dispensing of Medications"
  },
  {
    "ID": "MOM 6 b_Medication recalls are handled",
    // "fileName": "MOM 6 b_Medication recalls are handled"
    "fileName": "MOM 6 b_Medication recalls are handled "
  },
  {
    "ID": "MOM 6 c_Near Expiry Medications are Handled Effectively",
    "fileName": "MOM 6 c_Near Expiry Medications are Handled Effectively"
  },
  {
    "ID": "MOM 6 d-e_LABELLING REQUIREMENTS",
    "fileName": "MOM 6 d-e_LABELLING REQUIREMENTS"
  },
  {
    "ID": "MOM 6 f_Pharmacy Return Medications",
    "fileName": "MOM 6 f_Pharmacy Return Medications"
  },
  {
    "ID": "MOM 7 a-g,i_Medications are administered safely",
    "fileName": "MOM 7 a-g,i_Medications are administered safely"
  },
  {
    "ID": "MOM 7 h_Tubing Misconnection during administration prevention policy",
    "fileName": "MOM 7 h_Tubing Misconnection during administration prevention policy"
  },
  {
    "ID": "MOM 7 j-k_Policy on self-administration of medication & Outside Medication brought by patient",
    "fileName": "MOM 7 j-k_Policy on self-administration of medication & Outside Medication brought by patient"
  },
  {
    "ID": "MOM 8 a-b_Monitoring after Medication Administration",
    "fileName": "MOM 8 a-b_Monitoring after Medication Administration"
  },
  {
    "ID": "MOM 8 c-f_Near Misses, Medication Errors and Adverse Drug Reaction",
    "fileName": "MOM 8 c-f_Near Misses, Medication Errors and Adverse Drug Reaction"
  },
  {
    "ID": "MOM 9 a-c,e_Schedule X Drugs (Inj Ketamine)– Procurement, storage, Issue, Usage, Administration and Discard Policy",
    "fileName": "MOM 9 a-c,e_Schedule X Drugs (Inj Ketamine)– Procurement, storage, Issue, Usage, Administration and Discard Policy"
  },
  {
    "ID": "MOM 9 a-c-e_Narcotics Drugs– Procurement, storage, Issue, Usage, Administration and Discard Policy",
    "fileName": "MOM 9 a-c-e_Narcotics Drugs– Procurement, storage, Issue, Usage, Administration and Discard Policy"
  },
  {
    "ID": "MOM 9 a-e_CHEMOTHERAPEUTIC DRUGS",
    "fileName": "MOM 9 a-e_CHEMOTHERAPEUTIC DRUGS"
  },
  {
    "ID": "MOM 10 a-d_Procurement, Storage, Stocking, Issuance and Usage of Implantable Prosthesis and Medical Devices",
    "fileName": "MOM 10 a-d_Procurement, Storage, Stocking, Issuance and Usage of Implantable Prosthesis and Medical Devices"
  },
  {
    "ID": "MOM 10 e_Implantable prosthesis & medical devices recall",
    "fileName": "MOM 10 e_Implantable prosthesis & medical devices recall"
  },
  {
    "ID": "MOM 11 a-e_Acquisition of Medical Supplies and Consumables",
    "fileName": "MOM 11 a-e_Acquisition of Medical Supplies and Consumables"
  },
 
  {
    "ID": "NICU Manual",
    "fileName": "NICU Manual"
  },
  {
    "ID": "Nuclear Medicine Manual",
    "fileName": "Nuclear Medicine Manual"
  },
  {
    "ID": "Nursing Care Manual",
    "fileName": "Nursing Care Manual"
  },
  {
    "ID": "Nursing Empowerment Policy",
    "fileName": "Nursing Empowerment Policy"
  },
  {
    "ID": "OT Manual",
    "fileName": "OT Manual"
  },
  {
    "ID": "OUT BREAK POLICY-HIC 1 j_0001",
    "fileName": "OUT BREAK POLICY-HIC 1 j_0001"
  },
  {
    "ID": "Paediatrics Manual",
    "fileName": "Paediatrics Manual"
  },
  {
    "ID": "Pharmacy Manual",
    "fileName": "Pharmacy Manual"
  },
  {
    "ID": "PICU Manual",
    "fileName": "PICU Manual"
  },
  {
    "ID": "PRE 1 a-e_PATIENT AND FAMILY RIGHTS AND RESPONSIBILITIES",
    "fileName": "PRE 1 a-e_PATIENT AND FAMILY RIGHTS AND RESPONSIBILITIES"
  },
  {
    "ID": "PRE 2 a-l_PATIENT AND FAMILY RIGHTS- DECISION MAKING PROCESS",
    "fileName": "PRE 2 a-l_PATIENT AND FAMILY RIGHTS- DECISION MAKING PROCESS"
  },
  {
    "ID": "PRE 3 a-g_PATIENT AND FAMILY EDUCATION ON MAKING INFORMED DECISIONS",
    "fileName": "PRE 3 a-g_PATIENT AND FAMILY EDUCATION ON MAKING INFORMED DECISIONS"
  },
  {
    "ID": "PRE 4 a-e_DOCUMENTED PROCEDURE FOR OBTAINING INFORMED CONSENT",
    "fileName": "PRE 4 a-e_DOCUMENTED PROCEDURE FOR OBTAINING INFORMED CONSENT"
  },
  {
    "ID": "PRE 4 d_CONSENT AND SURROGATE DECISION MAKING",
    "fileName": "PRE 4 d_CONSENT AND SURROGATE DECISION MAKING"
  },
  {
    "ID": "PRE 5 a-i_PATIENT AND FAMILY RIGHTS TO INFORMATION AND EDUCATION ABOUT THEIR HEALTHCARE NEEDS",
    "fileName": "PRE 5 a-i_PATIENT AND FAMILY RIGHTS TO INFORMATION AND EDUCATION ABOUT THEIR HEALTHCARE NEEDS"
  },
  {
    "ID": "PRE 6 a-d_PATIENT AND FAMILY RIGHTS TO INFORMATION ON EXPECTED COSTS",
    "fileName": "PRE 6 a-d_PATIENT AND FAMILY RIGHTS TO INFORMATION ON EXPECTED COSTS"
  },
  {
    "ID": "PRE 7 a-f_PATIENTS FEEDBACK AND COMPLAINT REDRESSAL MECHANISM",
    "fileName": "PRE 7 a-f_PATIENTS FEEDBACK AND COMPLAINT REDRESSAL MECHANISM"
  },
  {
    "ID": "PRE 8 a_EFFECTIVE COMMUNICATION WITH PATIENTS AND FAMILIES",
    "fileName": "PRE 8 a_EFFECTIVE COMMUNICATION WITH PATIENTS AND FAMILIES"
  },
  {
    "ID": "PRE 8 b-e_ENHANCED COMMUNICATION",
    "fileName": "PRE 8 b-e_ENHANCED COMMUNICATION"
  },
  {
    "ID": "PSQ 1 a-i_The organisation implements a structured patient safety Programme",
    "fileName": "PSQ 1 a-i_The organisation implements a structured patient safety Programme"
  },
  {
    "ID": "PSQ 1 b_Quality Improvement Program & Quality Assurance",
    "fileName": "PSQ 1 b_Quality Improvement Program & Quality Assurance"
  },
  {
    "ID": "PSQ 2 b-g_Quality Improvement Program & Quality Assurance",
    // "fileName": "PSQ 2 b-g_Quality Improvement Program & Quality Assurance"
    "fileName": "PSQ 2 b-g_-Quality Improvement Program & Quality Assurance"
  },
  {
    "ID": "PSQ 2 g_Audits are conducted at regular intervals",
    "fileName": "PSQ 2 g_Audits are conducted at regular intervals"
  },
  {
    "ID": "PSQ 3 a-d_The organisation identifies key indicators to monitor the structures, processes and outcomes, which are used as tools for continual improvement",
    "fileName": "PSQ 3 a-d_The organisation identifies key indicators to monitor the structures, processes and outcomes, which are used as tools for continual improvement"
  },
  {
    "ID": "PSQ 3 f-i_Verification and Validation of Data",
    "fileName": "PSQ 3 f-i_Verification and Validation of Data"
  },
  {
    "ID": "PSQ 4_The organisation uses appropriate quality improvement tools for its quality improvement activities",
    "fileName": "PSQ 4_The organisation uses appropriate quality improvement tools for its quality improvement activities"
  },
  {
    "ID": "PSQ 5_There is an established system for clinical Audit",
    "fileName": "PSQ 5_There is an established system for clinical Audit"
  },
  {
    "ID": "PSQ 6_The Patient Safety & Quality Improvement programme are supported by the management",
    "fileName": "PSQ 6_The Patient Safety & Quality Improvement programme are supported by the management"
  },
  {
    "ID": "PSQ 7 b_SENTINEL EVENT POLICY",
    "fileName": "PSQ 7 b_SENTINEL EVENT POLICY"
  },
  {
    "ID": "PSQ 7_Incidents are collected and analysed to ensure continual quality improvement",
    "fileName": "PSQ 7_Incidents are collected and analysed to ensure continual quality improvement"
  },
  {
    "ID": "Radiation Oncology Manual",
    "fileName": "Radiation Oncology Manual"
  },
  {
    "ID": "RADIOLOGY MANUAL",
    "fileName": "RADIOLOGY MANUAL"
  },
  {
    "ID": "ROM 1 a-h_The organization identifies those responsible for governance and their roles are defined",
    "fileName": "ROM 1 a-h_The organization identifies those responsible for governance and their roles are defined"
  },
  {
    "ID": "ROM 2 a-e_The leaders manage the organisation in an ethical manner",
    // "fileName": "ROM 2 a-e_The leaders manage the organisation in an ethical manner"
    "fileName": "ROM 2 a-e_The leaders manage the organisation in  an ethical manner"
  },
  {
    "ID": "ROM 3 a-f_The organisation is headed by a leader who shall be responsible for operating the organisation on a day to day basis",
    "fileName": "ROM 3 a-f_The organisation is headed by a leader who shall be responsible for operating the organisation on a day to day basis"
  },
  {
    "ID": "ROM 4 a-e_The organization displays professionalism in its functioning",
    "fileName": "ROM 4 a-e_The organization displays professionalism in its functioning"
  },
  {
    "ID": "ROM 4 f,g_Service standards",
    "fileName": "ROM 4 f,g_Service standards"
  },
  {
    "ID": "ROM 5 a-c_Management ensures that patient safety aspects and risk management issues are an integral part of patient care and hospital management",
    "fileName": "ROM 5 a-c_Management ensures that patient safety aspects and risk management issues are an integral part of patient care and hospital management"
  },
  {
    "ID": "ROM 5 d_Implementation of systems for internal and external reporting of system and process failures",
    "fileName": "ROM 5 d_Implementation of systems for internal and external reporting of system and process failures"
  },
  {
    "ID": "ROM 5 e-f_OUTSOURCED SERVICES",
    "fileName": "ROM 5 e-f_OUTSOURCED SERVICES"
  },
  {
    "ID": "Safety Manual",
    "fileName": "Safety Manual"
  },
  {
    "ID": "sound alike september 2024",
    "fileName": "sound alike september 2024"
  },
  {
    "ID": "surgical final 2024-25",
    "fileName": "surgical final 2024-25"
  },
  {
    "ID": "TPA Manual",
    "fileName": "TPA Manual"
  },
  {
    "ID": "Verbal Order Medication List 2024",
    "fileName": "Verbal Order Medication List 2024"
  }
]
 const [tableData, setTableData] = useState(data)
  // const getItems = async () => {
  //   try {
  //     const response = await NabhManualGetNabhDetail();
  //     if (response.success) {
  //       setTableData(response.data)
  //     } else {
  //       notify(apiResp?.message, "error");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching department data:", error);
  //     notify(apiResp?.message, "error");
  //   }
  // };


  // useEffect(() => {
  //   getItems()
  // }, [])

  const THEAD = [
    { name: t("S.No."), width: "0.2%" },
    { name: t("NABHMANUAL")},
    { name: t("Download"), width: "5%" },
  ]
const HandlePrint = async (fileName) => {
  const url = `/NABH/Nabh Manual/${fileName}.pdf`;

  console.log("print URL:", url);

  // NEW URL for print window
  const printURL = `${window.location.origin}${url}`;

  window.open(printURL, "_blank");
};

  // const HandlePrint = async (FileName) => {
  //   console.log("FileName",`/NABH/Nabh Manual/${FileName}`)
    
  // };
  // const HandlePrint = async (ID) => {
  //   try {
  //     const response = await NabhManualGetNabhpdf(ID);
  
  //     if (response.success && response.data) {
  //       const base64Data = response.data;
  //       const byteCharacters = atob(base64Data);
  //       const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
  //       const byteArray = new Uint8Array(byteNumbers);
  //       const blob = new Blob([byteArray], { type: 'application/pdf' });
  //       const pdfURL = URL.createObjectURL(blob);
  //       window.open(pdfURL, "_blank");
  //       notify("success", "PDF opened successfully");
  //       getItems();
  
  //     } else {
  //       notify(response?.message || "Failed to load PDF", "error");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching PDF data:", error);
  //     notify("Error fetching PDF", "error");
  //   }
  // };
  

  return (
    <div className=" spatient_registration_card card">
      <Heading title={t("Nabh Manual")} isBreadcrumb={true} />
      <div className="patient_registration card">
        <div className="row">
          <div className="col-12">
            <Tables
              thead={THEAD}
              tbody={tableData?.map((val, ind) => ({
                Sno: ind + 1,
                title: val?.fileName,
                download: <span onClick={() => HandlePrint(val?.fileName)}><i className="fa fa-print text-print" /></span>
                // download: <span onClick={() => HandlePrint(val.ID)}><i className="fa fa-print text-print" /></span>
                ,
              }))}
              tableHeight={"scrollView"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NABHManual