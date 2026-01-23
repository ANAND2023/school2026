import React, { Fragment, Suspense, lazy, useEffect, useState, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "@app/components/loader/Loading";
import ErrorBoundary from "../layouts/error-Boundary";
import Layout from "@app/layouts";
import Authenticated from "@app/Guard/Authenticated.jsx";
import Guest from "@app/Guard/Guest.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import {
  GetBindMenu,
  getEmployeeWise,
  GetRoleListByEmployeeIDAndCentreID,
} from "../store/reducers/common/CommonExportFunction";
import { Toaster } from "react-hot-toast";

function RenderRoute() {
  // debugger
  const { GetMenuList } = useSelector((state) => state?.CommonSlice);
  // Get raw value from localStorage without triggering re-renders on every update inside this component
  const localData = JSON.parse(localStorage.getItem("userData")); 
  const dispatch = useDispatch();
  const [waitForRoute, setWaitForRoute] = useState(true);
  
  // Ref to prevent double-firing in Strict Mode or due to re-renders
  const dataFetchedRef = useRef(false);

  const fetchData = async () => {
    // debugger
    // If no user data, stop waiting and let auth guards handle redirect
    if (!localData?.UserId) {
      setWaitForRoute(false);
      return;
    }

    try {
      // 1. Fetch Branches
      const employeeResult = await dispatch(getEmployeeWise({
        employeeId: localData?.UserId,
        OrganizationId: localData?.OrganizationId
      })).unwrap();

      const branchList = employeeResult?.data;
      if (!branchList || branchList.length === 0) {
        setWaitForRoute(false);
        return;
      }

      // 2. Determine Active Branch (Prefer LS value, fallback to 1st item)
      let currentBranchId = localData?.defaultCentre;
      const isBranchValid = branchList.find(b => b.id == currentBranchId);
      
      if (!currentBranchId || !isBranchValid) {
        currentBranchId = branchList[0]?.id;
        // Update Redux/LS silently if needed, but we use the ID for next call immediately
      }

      // 3. Fetch Roles
      const roleResult = await dispatch(
        GetRoleListByEmployeeIDAndCentreID({
       
          empID: localData?.UserId,
        })
      ).unwrap();

      const roleList = roleResult?.data;
      if (!roleList || roleList.length === 0) {
        setWaitForRoute(false);
        return;
      }

      // 4. Determine Active Role
      let currentRoleId = localData?.defaultRole;
      const isRoleValid = roleList.find(r => r.moduleId == currentRoleId);
      
      if (!currentRoleId || !isRoleValid) {
        currentRoleId = roleList[0]?.moduleId;
      }

      // 5. Fetch Menu
      await dispatch(
        GetBindMenu({
          employeeId: localData?.UserId,
          roleId: currentRoleId,
          branchId: currentBranchId,
          organizationId: localData?.OrganizationId
        })
      );

      setWaitForRoute(false);
    } catch (error) {
      console.error("Initialization error:", error);
      setWaitForRoute(false);
    }
  };

  useEffect(() => {
    // debugger
    if (GetMenuList && GetMenuList.length > 0) {
      setWaitForRoute(false);
      return;
    }

    // Only fetch if we haven't fetched yet
    if (dataFetchedRef.current) return;
    
    if (localData?.UserId) {
      dataFetchedRef.current = true;
      fetchData();
    } else {
      setWaitForRoute(false);
    }
  }, [localData?.UserId]); // Empty dependency array = run once on mount

  if (waitForRoute) {
    return <Loading />;
  }

  // --- Route Mapping Logic ---
  const getAllUrls = [];
  
  // Add static routes
  getAllUrls.push("/academicmaster");
  getAllUrls.push("/display-name-master");
  getAllUrls.push("/doctor-departmentMapping");
  getAllUrls.push("/revenue-analysis-dashboard");
  getAllUrls.push("/set-doctors");
  getAllUrls.push("/display-doctors");
  getAllUrls.push("/menu");
  getAllUrls.push("/mapping-master");
  getAllUrls.push("/fee-master");
  getAllUrls.push("/enq");
  getAllUrls.push("/registration");
  getAllUrls.push("/registration-form");
  getAllUrls.push("/admission");
  getAllUrls.push("/users");
  getAllUrls.push("/class-master");
  getAllUrls.push("/section-master");
  getAllUrls.push("/subject-master");
  getAllUrls.push("/subject-class-mapping");
  getAllUrls.push("/board");
  getAllUrls.push("/academic-year");
  getAllUrls.push("/grading-system");
  getAllUrls.push("/create-syllabus");
  getAllUrls.push("/payment-mode");
  getAllUrls.push("/menu");
  getAllUrls.push("/branch");
  getAllUrls.push("/fee-rate-schedule");
  getAllUrls.push("/exam-type");
  getAllUrls.push("/exam-term");
  getAllUrls.push("/exam-type");
  getAllUrls.push("/create-exam");
  getAllUrls.push("/exam-timetable");
  getAllUrls.push("/master-class-section");
  getAllUrls.push("/master-organization");
  getAllUrls.push("/master-exam");
  getAllUrls.push("/master-exam");
  getAllUrls.push("/marks-upload");
  getAllUrls.push("/get-marks-upload");
  getAllUrls.push("/module-employee-mapping");
  getAllUrls.push("/submenu-employee-mapping");
  getAllUrls.push("/category-master");
  getAllUrls.push("/organization-master");
  getAllUrls.push("/period");
  getAllUrls.push("/bell-schedule");
  getAllUrls.push("/student-attendance");
  getAllUrls.push("/teacher-attendance");
  getAllUrls.push("/time-table");
  getAllUrls.push("/create-role");
  getAllUrls.push("/teacher-time-table");
  getAllUrls.push("/assign-role");
  // Add dynamic routes from Menu
  if (GetMenuList?.length > 0) {
    GetMenuList.forEach((menu) => {
      menu?.subMenus?.forEach((child) => {
        if(child.pageUrl) getAllUrls.push(child.pageUrl.toLowerCase());
      });
    });
  }

  // Filter routes based on permissions
  const bindroutes = allRoutes["roleRoutes"].reduce((acc, current) => {
    if (getAllUrls.includes(current?.path.toLowerCase())) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <ErrorBoundary fallback={<h1>Oops-Page failed to load</h1>}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            {[...allRoutes["commonRoutes"], ...bindroutes]?.map((route, index) => {
              const Component = route?.component;
              const Layout = route?.layout || Fragment;
              const Guard = route?.Guard || Fragment;
              return (
                <Route
                  path={route?.path}
                  exact={route?.exact}
                  key={index}
                  element={
                    <Guard>
                      <Layout>
                        <Component />
                      </Layout>
                    </Guard>
                  }
                />
              );
            })}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default RenderRoute;



const allRoutes = {
  commonRoutes: [
    // {
    //   Guard: Authenticated,
    //   layout: Layout,
    //   path: "*",
    //   component: lazy(() => import("@app/pages/NotFound.jsx")),
    //   exact: true,
    // },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/dashboard",
      component: lazy(() => import("@app/pages/Dashboard.jsx")),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/ViewConsultation",
      component: lazy(
        () => import("@app/pages/doctor/OPD/ViewConsultation.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/prescription-multi-print",
      component: lazy(
        () => import("@app/pages/doctor/OPD/PrescriptionMultiPrint.jsx")
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/doctor-departmentMapping",
      component: lazy(
        () =>
          import(
            "@app/pages/doctor/doctorDepartmentMapping/DoctorDepartmentMapping.jsx"
          )
      ),
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/doctor-related-opd-report",
      component: lazy(
        () => import("@app/pages/doctor/Report/DoctorsRelatedOPDReports.jsx")
      ),
      exact: true,
    },
    {
      Guard: Guest,
      path: "/login",
      component: lazy(() => import("../modules/login/Login")),
      exact: true,
    },
    {
      Guard: Guest,
      path: "/set-doctors",
      component: lazy(() => import("../pages/doctor/SetDoctorForDisplay.jsx")),
      exact: true,
    },
    {
      Guard: Guest,
      path: "/display-doctors",
      component: lazy(() => import("../pages/doctor/DisplayDoctors.jsx")),
      exact: true,
    },
    {
      path: "/ForgetPassword",
      component: lazy(() => import("@app/modules/login/ForgetPassword.jsx")),
      exact: true,
    },

    {
      path: "/pre-registration",
      component: lazy(() => import("@app/modules/Registration/Registraion.jsx")),
      exact: true,
    },
    {
      path: "/file/:randomString",
      component: lazy(() => import("@app/pages/Redirector.jsx")),
      exact: true,
    },
  ],
  roleRoutes: [
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/EnquirySubMenu1",
      component: lazy(
        () => import("@app/pages/EnquirySubMenu.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/mapping-master",
      component: lazy(
        () => import("@app/components/Master/MappingMaster.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/registration",
      component: lazy(
        () => import("@app/components/School/Registration/AllRegistration.jsx")
      ),
 
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/registration-form",
      component: lazy(
        () => import("@app/components/School/Registration/StudentRegistration.jsx")
      ),
 
      exact: true,
    },

    {
      Guard: Authenticated,
      layout: Layout,
      path: "/fee-master",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/FeeMaster.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/category-master",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/CategoryMaster.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/sub-category-master",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/SubCategoryMaster.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/item-master",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/ItemMaster.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/month-semester-master",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/InsertMonthType.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/class-wise-item-rate-mapping",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/ClassWiseItemRateMapping.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/create-tax",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/CreateTax.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/fee-collection",
      component: lazy(
        () => import("@app/components/Master/Billing/FeeCollection.jsx")
      ),
    
      exact: true,
    },

    // C:\Users\Anand\Desktop\school\school2026\src\components\Master\Billing\FeeCollection.jsx
    // {
    //   Guard: Authenticated,
    //   layout: Layout,
    //   path: "/create-payment-mode",
    //   component: lazy(
    //     () => import("@app/components/Master/FeeMaster/CreatePaymentMode.jsx")
    //   ),
    
    //   exact: true,
    // },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/scholarship",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/CreateScholarship.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/bank-account",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/CreateBankAccount.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/fee-concession",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/CreateFeeConcession.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/late-fee-penalty",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/CreateLateFeePenalty.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/enq",
      component: lazy(
        () => import("@app/components/EnquiryMaster/Enquiry.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/admission",
      component: lazy(
        () => import("@app/components/Master/Admission/Admission.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/users",
      component: lazy(
        () => import("@app/components/Master/Users.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/class-master",
      component: lazy(
        () => import("@app/components/Master/ClassMaster.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/section-master",
      component: lazy(
        () => import("@app/components/Master/SectionMaster.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/subject-master",
      component: lazy(
        () => import("@app/components/Master/Subject.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/subject-class-mapping",
      component: lazy(
        () => import("@app/components/Master/SubjectClassMapping.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/board",
      component: lazy(
        () => import("@app/components/Master/CreateBoard.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/academic-year",
      component: lazy(
        () => import("@app/components/Master/CreateAcademicYear.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/grading-system",
      component: lazy(
        () => import("@app/components/Master/GradingSystem.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/create-syllabus",
      component: lazy(
        () => import("@app/components/Master/CreateSyllabus.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/payment-mode",
      component: lazy(
        () => import("@app/components/Master/PaymentMode.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/exam-type",
      component: lazy(
        () => import("@app/components/Master/Exam/ExamType.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/exam-term",
      component: lazy(
        () => import("@app/components/Master/Exam/CreateTerm.jsx")
      ),
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/branch",
      component: lazy(
        () => import("@app/components/Master/Branch.jsx")
      ),
    
      exact: true,
    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/menu",
      component: lazy(
        () => import("@app/components/Master/MenuMaster/Menu.jsx")
      ),
    
      exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/fee-rate-schedule",
      component: lazy(
        () => import("@app/components/Master/FeeMaster/FeeRateSchedule.jsx")
      ),
    // C:\Users\Anand\Desktop\school\school2026\src\components\Master\FeeMaster\FeeRateSchedule.jsx
      exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/exam-type",
      component: lazy(
        () => import("@app/components/Master/Exam/ExamType.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/create-exam",
      component: lazy(
        () => import("@app/components/Master/Exam/CreateExam.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/exam-timetable",
      component: lazy(
        () => import("@app/components/Master/Exam/ExamTimetable.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/master-class-section",
      component: lazy(
        () => import("@app/components/Master/MasterClassSection.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/master-organization",
      component: lazy(
        () => import("@app/components/Master/MasterOrganization.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/master-exam",
      component: lazy(
        () => import("@app/components/Master/Exam/ExamMaster.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/marks-upload",
      component: lazy(
        () => import("@app/components/Master/Exam/MarksUpload.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/get-marks-upload",
      component: lazy(
        () => import("@app/components/Master/Exam/GetMarksUpload.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/module-employee-mapping",
      component: lazy(
        () => import("@app/components/Master/BranchMaster/ModuleEmployeeMapping.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/submenu-employee-mapping",
      component: lazy(
        () => import("@app/components/Master/BranchMaster/EmployeeSubMenuMapping.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/module-submenu-mapping",
      component: lazy(
        () => import("@app/components/Master/BranchMaster/ModuleSubmenuMapping.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/user-submenu-mapping",
      component: lazy(
        () => import("@app/components/Master/BranchMaster/EmployeeSubMenuMapping.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/module",
      component: lazy(
        () => import("@app/components/Master/ModuleMaster/ModuleBulk.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/organization-master",
      component: lazy(
        () => import("@app/components/Master/OrganizationMaster.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/period",
      component: lazy(
        () => import("@app/components/TimeTableManagement/CreatePeriod.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/bell-schedule",
      component: lazy(
        () => import("@app/components/TimeTableManagement/BellSchedule.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/time-table",
      component: lazy(
        () => import("@app/components/TimeTableManagement/TimeTable.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/teacher-time-table",
      component: lazy(
        () => import("@app/components/TimeTableManagement/TeachersTimeTable.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/student-attendance",
      component: lazy(
        () => import("@app/components/AttendanceManagement/StudentAttendance.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/teacher-attendance",
      component: lazy(
        () => import("@app/components/AttendanceManagement/GetTeacherAttendance.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/student-attendance-list",
      component: lazy(
        () => import("@app/components/AttendanceManagement/StudentAttendanceList.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/create-role",
      component: lazy(
        () => import("@app/components/Permissions/CreateRole.jsx")
      ),exact: true,

    },
    {
      Guard: Authenticated,
      layout: Layout,
      path: "/assign-role",
      component: lazy(
        () => import("@app/components/Permissions/Assignrole.jsx")
      ),exact: true,

    },
    // C:\Users\Anand\Desktop\school\school2026\src\components\Permissions\CreateRole.jsx
    // C:\Users\Anand\Desktop\school\school2026\src\components\TimeTableManagement\TimeTable.jsx
    // C:\Users\Anand\Desktop\school\school2026\src\components\AttendanceManagement\GetTeacherAttendance.jsx
    // C:\Users\Anand\Desktop\school\school2026\src\components\AttendanceManagement\StudentAttendance.jsx
    
    // C:\Users\Anand\Desktop\school\school2026\src\components\TimeTableManagement\CreatePeriod.jsx
    // C:\Users\Anand\Desktop\school\school2026\src\components\AttendanceManagement\CreatePeriod.jsx
// C:\Users\Anand\Desktop\school\school2026\src\components\Master\OrganizationMaster.jsx

    // C:\Users\Anand\Desktop\school\school2026\src\components\Master\ModuleMaster\ModuleBulk.jsx
     ],
};
