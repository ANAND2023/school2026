const baseUrlMaster = "master/api/v1/";
const mainUrl = "identity/api/v1/";
const feeUrl = "fee/api/v1/";
const studentUrl = "student/api/v1/";
// student/api/v1/Enquiry/createenquiry
export const apiUrls = {
  // Auth

 loginAdmin: "identity/api/v1/auth/login",
 BranchMastersGetBranch: "master/api/v1/BranchMasters/GetBranch",
 getModules: "master/api/v1/MenuManagment/get-modules",
 getMenuWithSubmenus: "master/api/v1/MenuManagment/get-menu-with-submenus",
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
// CreateBranch:"branchmasters/CreateBranch",
CreateBranch:`${baseUrlMaster}branchmasters/CreateBranch`,
GetAllBranches:`${baseUrlMaster}branchmasters/GetBranch`,
EmployeeBranchMapping:`${baseUrlMaster}BranchMasters/EmployeeBranchMapping`,
MenuManagmentgetModuleSubmenuMappings:`${baseUrlMaster}MenuManagment/get-module-submenu-mappings`,
CreateModuleSubmenuMappingBulk:`${baseUrlMaster}MenuManagment/create-module-submenu-mapping-bulk`,
createEmployeeSubmenuMappingBulk:`${baseUrlMaster}MenuManagment/create-employee-submenu-mapping-bulk`,

// GetAllBranches:"branchmasters/GetBranch",
Createorganisation:"organizationmaster/createorganisation",
// GetAllOrganisation:"organizationmaster/GetAllOrganisation",
GetAllOrganisation:`${baseUrlMaster}organizationmaster/GetAllOrganisation`,
// branch End ...
  
// Fee Master Start .....
createcategory:`${feeUrl}Category/createcategory`,
updatecategory:`${feeUrl}Category/updatecategory`,
GetAllCategory:`${feeUrl}Category/GetAllCategory`,
InsertSubCategory:`${feeUrl}SubCategory/InsertSubCategory`,
GetAllSubCategory:`${feeUrl}SubCategory/GetAllSubCategory`,
UpdateSubCategory:`${feeUrl}SubCategory/UpdateSubCategory`,
ItemInsertItemMaster:`${feeUrl}Item/InsertItemMaster`,
GetAllItemMaster:`${feeUrl}Item/GetAllItemMaster`,
UpdateItemMaster:`${feeUrl}Item/UpdateItemMaster`,



CreateBankAccount:`${baseUrlMaster}feemaster/CreateBankAccount`,

// GetAllBankAccounts:"feemaster/GetAllBankAccounts",
GetAllBankAccounts:`${baseUrlMaster}feemaster/GetAllBankAccounts`,
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




// Enquiry start.......
// GetEnquiriesByRange:"Enquiry/GetEnquiriesByDateRange",
EnquiryCreate:`${studentUrl}Enquiry/createenquiry`,
getallenquiries:`${studentUrl}Enquiry/getallenquiries`,
GetEnquiriesByRange:`${studentUrl}Enquiry/GetEnquiriesByDateRange`,

// Enquiry end.......




// registrtion start.......

StudentRegister:`${studentUrl}Student/register`,
StudentGetstudent:`${studentUrl}Student/getstudentlist`,

// registrtion end.......





  // MenuManagment start ....
MenuManagmentcreatemenubulk:`${baseUrlMaster}MenuManagment/create-menu-bulk`,
MenuManagmentcreatesubmenubulk:`${baseUrlMaster}MenuManagment/create-submenu-bulk`,
MenuManagmentgetmenus:`${baseUrlMaster}MenuManagment/get-menus`,
MenuManagmentgetsubmenus:`${baseUrlMaster}MenuManagment/get-submenus`,
MenuManagmentCreateModuleBulk:`${baseUrlMaster}MenuManagment/create-module-bulk`,
MenuManagmentGeModuleBulk:`${baseUrlMaster}MenuManagment/get-modules`,
  // MenuManagment start ....



  // Users Start ....

  // identity/api/v1/Users/createusers
  UsersCreateUser:`${mainUrl}Users/createusers`,
  UsersGetAllUsers:`${mainUrl}Users/getallusers`,
  // Usersgetallusers:`${mainUrl}Users/getallusers`,
  // Usersgetuserbyid:`${mainUrl}Users/getuserbyid`,
  // Usersupdateuser:`${mainUrl}Users/updateuser`,
  // Usersdeleteuser:`${mainUrl}Users/deleteuser`,
  // Users end ....
}