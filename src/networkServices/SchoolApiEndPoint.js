const baseUrlMaster = "master/api/v1/";
const mainUrl = "identity/api/v1/";
const feeUrl = "fee/api/v1/";
const studentUrl = "student/api/v1/";
const fileStorage = `fileStorage/api/v1/`;
// student/api/v1/Enquiry/createenquiry
export const apiUrls = {
  // Auth

  loginAdmin: "identity/api/v1/auth/login",
  BranchMastersGetBranch: "master/api/v1/BranchMasters/GetBranch",
  getModules: "master/api/v1/MenuManagment/get-module-employee-mappings",
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
  // CreateAcademicYear:"academicmaster/CreateAcademicYear",
  // GetAllAcademicYears:"academicmaster/GetAllAcademicYears",

  //file storage
  Imagesupload: `${fileStorage}Images/upload`,
  documentsupload : `${fileStorage}documents/upload`,

  //
  // academicmaster End .....

  // class start ....
  CreateClass: `${baseUrlMaster}academicmaster/CreateClass`,
  GetAllClasses: `${baseUrlMaster}AcademicMaster/GetAllClasses`,
  CreateSection: `${baseUrlMaster}AcademicMaster/CreateSection`,
  GetAllSections: `${baseUrlMaster}AcademicMaster/GetAllSections`,
  CreateSubject: `${baseUrlMaster}AcademicMaster/CreateSubject`,
  GetAllSubjects: `${baseUrlMaster}AcademicMaster/GetAllSubjects`,
  CreateSubjectClassMapping: `${baseUrlMaster}AcademicMaster/CreateSubjectClassMapping`,
  GetAllSubjectClassMappings: `${baseUrlMaster}AcademicMaster/GetAllSubjectClassMappings`,
  CreateBoard: `${baseUrlMaster}AcademicMaster/CreateBoard`,
  GetAllBoards: `${baseUrlMaster}AcademicMaster/GetAllBoards`,
  CreateAcademicYear: `${baseUrlMaster}AcademicMaster/CreateAcademicYear`,
  GetAllAcademicYears: `${baseUrlMaster}AcademicMaster/GetAllAcademicYears`,
  CreateGradingSystem: `${baseUrlMaster}AcademicMaster/CreateGradingSystem`,
  GetAllGradingSystems: `${baseUrlMaster}AcademicMaster/GetAllGradingSystems`,
  CreateSyllabus: `${baseUrlMaster}AcademicMaster/CreateSyllabus`,
  GetAllSyllabus: `${baseUrlMaster}AcademicMaster/GetAllSyllabus`,

  // class end ....

  // branch start ...
  // CreateBranch:"branchmasters/CreateBranch",
  CreateBranch: `${baseUrlMaster}branchmasters/CreateBranch`,
  GetAllBranches: `${baseUrlMaster}branchmasters/GetBranch`,
  EmployeeBranchMapping: `${baseUrlMaster}BranchMasters/EmployeeBranchMapping`,
  createModuleEmployeeMapping: `${baseUrlMaster}MenuManagment/create-module-employee-mapping-bulk`,
  MenuManagmentgetModuleSubmenuMappings: `${baseUrlMaster}MenuManagment/get-module-submenu-mappings`,
  CreateModuleSubmenuMappingBulk: `${baseUrlMaster}MenuManagment/create-module-submenu-mapping-bulk`,
  createEmployeeSubmenuMappingBulk: `${baseUrlMaster}MenuManagment/create-employee-submenu-mapping-bulk`,

  // GetAllBranches:"branchmasters/GetBranch",
  // Createorganisation: "organizationmaster/createorganisation",
  // GetAllOrganisation:"organizationmaster/GetAllOrganisation",
  GetAllOrganisation: `${baseUrlMaster}organizationmaster/GetAllOrganisation`,
  // branch End ...

  // Fee Master Start .....
  createcategory: `${feeUrl}Category/createcategory`,
  updatecategory: `${feeUrl}Category/updatecategory`,
  GetAllCategory: `${feeUrl}Category/GetAllCategory`,
  InsertSubCategory: `${feeUrl}SubCategory/InsertSubCategory`,
  GetAllSubCategory: `${feeUrl}SubCategory/GetAllSubCategory`,
  UpdateSubCategory: `${feeUrl}SubCategory/UpdateSubCategory`,
  ItemInsertItemMaster: `${feeUrl}Item/InsertItemMaster`,
  GetAllItemMaster: `${feeUrl}Item/GetAllItemMaster`,
  // GetClassMonthItemFees: `${feeUrl}FeeRateSchedule/GetClassMonthItemFees`,
  UpdateItemMaster: `${feeUrl}Item/UpdateItemMaster`,
  FeeRateSchedule: `${feeUrl}FeeRateSchedule/InsertFeeRateSchedule`,
  AllFeeRateSchedule: `${feeUrl}FeeRateSchedule/GetAllFeeRateSchedule`,
  InsertFeeRateSchedule: `${feeUrl}FeeRateSchedule/InsertFeeRateSchedule`,
  InsertMonthType: `${feeUrl}MonthType/InsertMonthType`,
  GetAllMonthType: `${feeUrl}MonthType/GetAllMonthType`,
  UpdateBulkItemClassMonthWise: `${feeUrl}ClassWiseFee/UpdateBulkItemClassMonthWise`,
  GetClassMonthFeeDetails: `${feeUrl}ClassWiseFee/GetClassMonthFeeDetails`,
  // UpdateBulkItemClassMonthWise:`${feeUrl}ClassWiseFee/UpdateBulkItemClassMonthWise`,
  // gateway/fee/api/v1/FeeRateSchedule/InsertFeeRateSchedule

  CreateBankAccount: `${baseUrlMaster}feemaster/CreateBankAccount`,
// GetAllBranches:"branchmasters/GetBranch",
// Createorganisation:"organizationmaster/createorganisation",
// GetAllOrganisation:"organizationmaster/GetAllOrganisation",
// GetAllOrganisation:"organizationmaster/GetAllOrganisation",
// GetAllOrganisation:`${baseUrlMaster}organizationmaster/GetAllOrganisation`,
Createorganisation:`${baseUrlMaster}OrganizationMaster/createorganisation`,
// gateway/master/api/v1/OrganizationMaster/createorganisation' \
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
GetClassMonthItemFees:`${feeUrl}FeeRateSchedule/GetClassMonthItemFees`,
UpdateItemMaster:`${feeUrl}Item/UpdateItemMaster`,
FeeRateSchedule:`${feeUrl}FeeRateSchedule/InsertFeeRateSchedule`,
AllFeeRateSchedule:`${feeUrl}FeeRateSchedule/GetAllFeeRateSchedule`,
InsertFeeRateSchedule:`${feeUrl}FeeRateSchedule/InsertFeeRateSchedule`,
InsertMonthType:`${feeUrl}MonthType/InsertMonthType`,
GetAllMonthType:`${feeUrl}MonthType/GetAllMonthType`,
UpdateBulkItemClassMonthWise:`${feeUrl}ClassWiseFee/UpdateBulkItemClassMonthWise`,
InserUpdatetFeeRateSchedule:`${feeUrl}FeeRateSchedule/InserUpdatetFeeRateSchedule`,
GetClassMonthFeeDetails:`${feeUrl}ClassWiseFee/GetClassMonthFeeDetails`,

// UpdateBulkItemClassMonthWise:`${feeUrl}ClassWiseFee/UpdateBulkItemClassMonthWise`,
// gateway/fee/api/v1/FeeRateSchedule/InsertFeeRateSchedule
  CreateBankAccount: `${baseUrlMaster}feemaster/CreateBankAccount`,

  // GetAllBankAccounts:"feemaster/GetAllBankAccounts",
  GetAllBankAccounts: `${baseUrlMaster}feemaster/GetAllBankAccounts`,





  
  CreateFeeConcession: "feemaster/CreateFeeConcession",
  GetAllFeeConcessions: "feemaster/GetAllFeeConcessions",
  CreateFeeHead: "feemaster/CreateFeeHead",
  GetAllFeeHeads: "feemaster/GetAllFeeHeads",
  CreateFeeStructure: "feemaster/CreateFeeStructure",
  GetAllFeeStructures: "feemaster/GetAllFeeStructures",
  CreateLateFeePenalty: "feemaster/CreateLateFeePenalty",
  GetAllLateFeePenalties: "feemaster/GetAllLateFeePenalties",
  // CreatePaymentMode: "feemaster/CreatePaymentMode",
  // GetAllPaymentModes: "feemaster/GetAllPaymentModes",
  CreateScholarship: "feemaster/CreateScholarship",
  GetAllScholarships: "feemaster/GetAllScholarships",
  CreateTax: "feemaster/CreateTax",
  GetAllTaxes: "feemaster/GetAllTaxes",

  // Fee Master End .....

  // Enquiry start.......
  // GetEnquiriesByRange:"Enquiry/GetEnquiriesByDateRange",
  EnquiryCreate: `${studentUrl}Enquiry/createenquiry`,
  getallenquiries: `${studentUrl}Enquiry/getallenquiries`,
  GetEnquiriesByRange: `${studentUrl}Enquiry/GetEnquiriesByDateRange`,
  DeleteEnquiry: `${studentUrl}Enquiry/deleteenquiry`,

  // Enquiry end.......

  // registrtion start.......

  StudentRegister: `${studentUrl}Registration/Create`,

  // StudentGetstudent:`${studentUrl}Student/getstudentlist`,
  getRegistrationlist: `${studentUrl}Registration/getregistrationlist`,
  Registrationbulkcreate: `${studentUrl}Registration/bulkcreate`,

  // registrtion end.......

  // admission start.......

  getadmissionlist: `${studentUrl}Admission/getadmissionlist`,
  AdmissionBulkcreate: `${studentUrl}Admission/bulkcreate`,

  // admission end.......

  // MenuManagment start ....
  MenuManagmentcreatemenubulk: `${baseUrlMaster}MenuManagment/create-menu-bulk`,
  MenuManagmentcreatesubmenubulk: `${baseUrlMaster}MenuManagment/create-submenu-bulk`,
  MenuManagmentgetmenus: `${baseUrlMaster}MenuManagment/get-menus`,
  MenuManagmentgetsubmenus: `${baseUrlMaster}MenuManagment/get-submenus`,
  MenuManagmentCreateModuleBulk: `${baseUrlMaster}MenuManagment/create-module-bulk`,
  MenuManagmentGeModuleBulk: `${baseUrlMaster}MenuManagment/get-modules`,
  MasterCreatePaymentMode: `${baseUrlMaster}PaymentModeMaster/CreatePaymentMode`,
  MasterGetAllPaymentModes: `${baseUrlMaster}PaymentModeMaster/GetAllPaymentModes`,
  CreateTeacherAttendance: `${baseUrlMaster}AttendanceAndClassManagement/CreateTeacherAttendance`,
  // MenuManagment start ....

  //Exam Start
  masterAcademicMastercreate_term: `${baseUrlMaster}AcademicMaster/create_term`,
  AcademicMasterget_all_term: `${baseUrlMaster}AcademicMaster/get_all_term`,
  get_termBranchWise: `${baseUrlMaster}AcademicMaster/get_term`,
  CreateExamType: `${baseUrlMaster}AcademicMaster/CreateExamType`,
  GetAllExamTypes: `${baseUrlMaster}AcademicMaster/GetAllExamTypes`,
  create_exam: `${baseUrlMaster}AcademicMaster/create_exam`,
  get_created_exam: `${baseUrlMaster}AcademicMaster/get_created_exam`,
  create_exam_timetable: `${baseUrlMaster}AcademicMaster/create_exam_timetable`,
  UploadStudentExamMarks: `${baseUrlMaster}StudenExamMarking/UploadStudentExamMarks`,
  GetStudentExamMarks: `${baseUrlMaster}StudenExamMarking/GetStudentExamMarks`,

  //Exam End

  // Users Start ....

  // identity/api/v1/Users/createusers
  UsersCreateUser: `${mainUrl}Users/createusers`,
  UsersGetAllUsers: `${mainUrl}Users/getallusers`,
  // UsersGetAllUsers:`${mainUrl}Users/getallusers`,
  // Usersgetallusers:`${mainUrl}Users/getallusers`,
  // Usersgetuserbyid:`${mainUrl}Users/getuserbyid`,
  // Usersupdateuser:`${mainUrl}Users/updateuser`,
  // Usersdeleteuser:`${mainUrl}Users/deleteuser`,
  // Users end ....
  
};
