
export const apiUrls = {
  // Auth

 loginAdmin: "auth/login",
//  loginAdmin: "Auth/login",

 Rolescreaterole: "Roles/createrole",
 Rolesremoverole: "Roles/removerole",
 Rolesdeleterole: "Roles/deleterole",
 Rolesassignrole: "Roles/assignrole",
 Rolesgetroles: "Roles/getroles",


//  Permission Api Start....................
 Permissionscreatepermission: "Permissions/createpermission",
 Permissionsassigntorole: "Permissions/assigntorole",
 Permissionsremovefromrole: "Permissions/removefromrole",
 Permissionsassigntouser: "Permissions/assigntouser",
 Permissionsremovefromuser: "Permissions/removefromuser",
 Permissionsdelete: "Permissions/delete",
 Permissionsgetallpermissions: "Permissions/getallpermissions",

//  Permission Api End....................


// academicmaster Start .....
CreateAcademicYear:"academicmaster/CreateAcademicYear",
GetAllAcademicYears:"academicmaster/GetAllAcademicYears",


// academicmaster End .....

// class start ....
CreateClass:"academicmaster/CreateClass",
GetAllClasses:"academicmaster/GetAllClasses",
CreateSection:"academicmaster/CreateSection",
GetAllSections:"academicmaster/GetAllSections",
CreateSubject:"academicmaster/CreateSubject",
GetAllSubjects:"academicmaster/GetAllSubjects",
// class end ....

// branch start ...
CreateBranch:"branchmasters/CreateBranch",

GetAllBranches:"branchmasters/GetBranch",
Createorganisation:"organizationmaster/createorganisation",
GetAllOrganisation:"organizationmaster/GetAllOrganisation",
// branch End ...
  
// Fee Master Start .....
CreateBankAccount:"feemaster/CreateBankAccount",
GetAllBankAccounts:"feemaster/GetAllBankAccounts",
CreateFeeConcession:"feemaster/CreateFeeConcession",
GetAllFeeConcessions:"feemaster/GetAllFeeConcessions",
CreateFeeHead:"feemaster/CreateFeeHead",
GetAllFeeHeads:"feemaster/GetAllFeeHeads",
CreateFeeStructure:"feemaster/CreateFeeStructure",
GetAllFeeStructures:"feemaster/GetAllFeeStructures",
CreateLateFeePenalty:"feemaster/CreateLateFeePenalty",
GetAllLateFeePenalties:"feemaster/GetAllLateFeePenalties",
CreatePaymentMode:"feemaster/CreatePaymentMode",
GetAllPaymentModes:"feemaster/GetAllPaymentModes",
CreateScholarship:"feemaster/CreateScholarship",
GetAllScholarships:"feemaster/GetAllScholarships",
CreateTax:"feemaster/CreateTax",
GetAllTaxes:"feemaster/GetAllTaxes",

// Fee Master End .....




// registrtion start.......
EnquiryCreateenquiry:"Enquiry/createenquiry",
GetEnquiriesByRange:"Enquiry/GetEnquiriesByDateRange",
// registrtion end.......
}