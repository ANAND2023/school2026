import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebarMenu } from "@app/store/reducers/ui";
import NotificationsDropdown from "@app/layouts/header/notifications-dropdown/NotificationsDropdown";
import LanguagesDropdown from "@app/layouts/header/languages-dropdown/LanguagesDropdown";
import Themedropdown from "@app/layouts/header/Theme-dropdown";
import { toggleFullScreen } from "../../utils/helpers";
import SubMenuDropdown from "@app/layouts/header/submenu-dropdown/SubMenuDropdown";
import OverlayDropdown from "./overlay-dropdown";
import i18next from 'i18next';
import i18n from 'i18next';
import { useNavigate } from "react-router-dom";
// import { GetRoleListByEmployeeIDAndCentreID } from "../../store/reducers/getRoleListSlice";
// import getEmployewiseCentre from "../../store/reducers/common/getEmployewiseCentre";
import UserDropdown from "./user-dropdown/UserDropdown";
import ReactSelectHead from "../../components/formComponent/ReactSelectHead";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import {
  GetBindMenu,
  GetRoleListByEmployeeIDAndCentreID,
  getBindPanelList,
  getEmployeeWise,
  getNotification,
} from "../../store/reducers/common/CommonExportFunction";
import { logoutAction } from "../../store/reducers/AuthSlice/logoutSlice";
import { updateClaims } from "../../networkServices/HeaderApi";
import logoitdose from "../../assets/image/logoitdose.png";
import { getBindCategory } from "../../store/reducers/TokenManagementSlice/CommonExportFunction";
import SpeechToTextWithSpeechOutput from "../../components/SpeechToTextWithSpeechOutput";
import { GetLangaugeAPI } from "../../store/reducers/dashboardSlice/CommonFunction";
import { Bell, Building2, ChevronDown, LogOut, Menu, Moon, Search, Sun } from "lucide-react";

const Header = React.memo(() => {
  const [routeFlag, setRouteFlag] = useState(false);
  const localData = useLocalStorage("userData", "get"); // get Data from localStorage
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navbarVariant = useSelector((state) => state.ui.navbarVariant);
  const headerBorder = useSelector((state) => state.ui.headerBorder);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const { GetEmployeeWiseCenter, GetMenuList, GetRoleList } = useSelector(
    (state) => state?.CommonSlice
  );
  const signout = useSelector((state) => state.logoutSlice);
  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  const getContainerClasses = useCallback(() => {
    let classes = `main-header navbar navbar-expand ${navbarVariant}`;
    if (headerBorder) {
      classes = `${classes} border-bottom-0`;
    }
    return classes;
  }, [navbarVariant, headerBorder]);

  /**
   * Logout function to handle user logout API Implement.
   */

  const handleToggleSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  const logOut = () => {
    dispatch(
      logoutAction({
        roleID: localData?.defaultRole,
        employeeID: localData?.employeeID,
        centreID: localData?.centreID,
      })
    );
    setRouteFlag(true);
    // localStorage.clear();
    // navigate("/login");
    // notify("Sucessfully logout", "success");
  };
    const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // Add logic to switch theme context/css if needed
    // document.body.classList.toggle('dark-mode');
  };



  const handleUpdateClaims = async (roleID, centreID) => {
    const data = await updateClaims(String(roleID), String(centreID));

    if (data?.success) {
      useLocalStorage("userData", "set", data?.data?.loginResponse);
      useLocalStorage("token", "set", data?.data?.token);
    }
    return data
  };

  const handleChangeCentre = async (e) => {
    const { value } = e?.target;

    await handleUpdateClaims(localData?.defaultRole, value);

    window.location.reload();

    await useLocalStorage("userData", "set", {
      ...localData,
      defaultCentre: value,
    });

    await dispatch(
      GetRoleListByEmployeeIDAndCentreID({
        employeeID: localData?.employeeID,
        centreID: value,
      })
    );
  };

  /**
   * Make an API request for MasterPage/EmployeeWiseCentreList.
   *
   * @param {parametre} EmployeeID - The parametre for EmployeeID from localStorage
   * @param {API Implement Name} options - API for MasterPage/EmployeeWiseCentreList.
   */
useEffect(() => {
  if (localData?.employeeID) {
    dispatch(getEmployeeWise({ employeeID: localData?.employeeID }));
  }
}, [dispatch]);

useEffect(() => {
  dispatch(
    getNotification({
      RoleID: localData?.defaultRole,
      EmployeeID: localData?.employeeID,
      CentreID: localData?.defaultCentre,
    })
  );
}, []);

  // role bind
  const handleChangeRole = async (e) => {
    debugger
    const { value } = e.target
    try {
      const apiResp = await handleUpdateClaims(value, localData?.defaultCentre);
      await dispatch(
        GetBindMenu({
          RoleID: value,
        })
      );
      useLocalStorage("userData", "set", { ...localData, defaultRole: value, deptLedgerNo: apiResp?.data?.loginResponse?.deptLedgerNo, roleName: apiResp?.data?.loginResponse?.roleName });
      // useLocalStorage("userData", "set", { ...localData, ...apiResp?.data?.loginResponse });
      // useLocalStorage("userData", "set", apiResp?.data?.loginResponse);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

useEffect(() => {
  if (routeFlag && signout.success) {
    window, location.reload();
    navigate("/login");
  }
}, [signout.success]);

  let translation = {}
  const loadTranslations = async (lng, lngkey) => {
    try {
      const apiResp = await GetLangaugeAPI(lngkey)
      if (apiResp?.success) {
        apiResp?.data?.map((val) => {
          translation[val["FIELDNAME"]] = val["DISPLAYNAME"]
        })
      }
      i18n.addResourceBundle(lng, 'translation', translation, true, true);
      i18n.changeLanguage(lng);
    } catch (error) {
      console.error(`Error fetching translations for ${lng}:`, error);
    }
  };


useEffect(() => {
  dispatch(getBindCategory());
  loadTranslations(localData?.empLanguageCode, localData?.empLanguage)

  // Jha jha per All jaiga hard code common h
  // dispatch(
  //   GetBindAllDoctorConfirmation({
  //     Department: "All",
  //   })
  // )
  dispatch(
    getBindPanelList({
      PanelGroup: "ALL",
    })
  );
}, []);

  const activeCentre = GetEmployeeWiseCenter?.find(c => c.CentreID == localData?.defaultCentre) || null;
  const activeRole = GetRoleList?.find(r => r.roleID == localData?.defaultRole) || null;

//   return (
//     <>
//       <nav className={getContainerClasses()} style={{ position: "relative" }} >
//         <ul className="navbar-nav">
//           {["lg", "md"].includes(screenSize) ? (
//             <div className="img-conatiner">
//               <div style={{ width: "70%", margin: "auto" }}>
//                 <img src={logoitdose} className="img-fluid" />
//               </div>
//             </div>
//           ) : (
//             <li className="nav-item">
//               <button
//                 onClick={handleToggleMenuSidebar}
//                 type="button"
//                 className="nav-link mobilerespBars"
//               >
//                 <i className="fas fa-bars" />
//               </button>
//             </li>
//           )}
//         </ul>
//         <ul className="navbar-nav ml-6"></ul>

//         <ul className="navbar-nav ml-auto selectHRes">
//           <li className="nav-item savetheme">
//             <div type="button" className=" headerboxsize">
//               <ReactSelectHead
//                 placeholderName="Select Centre"
//                 dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
//                   return { label: ele.CentreName, value: ele.CentreID };
//                 })}
//                 searchable={true}
//                 value={Number(localData?.defaultCentre)}
//                 respclass="roll-off"
//                 handleChange={handleChangeCentre}
//                 plcN="center"
//               />
//             </div>
//           </li>

//           {["lg", "md"].includes(screenSize) && (
//             <li className="nav-item savetheme">
//               <div type="button" className=" headerboxsize">
//                 <ReactSelectHead
//                   placeholderName="Select Role"
//                   dynamicOptions={GetRoleList?.map((ele) => {
//                     return {
//                       label: ele?.roleName,
//                       value: ele?.roleID,
//                     };
//                   })}
//                   searchable={true}
//                   respclass="col-12 roll-off"
//                   value={Number(localData?.defaultRole)}
//                   handleChange={handleChangeRole}
//                   //  respclass="roll-off"
//                   plcN="center"
//                 />
//               </div>
//             </li>
//           )}

//           <li className="nav-item d-md-none">
//             <div type="button">
//               {/* <i className="fa fa-ellipsis-v" aria-hidden="true"></i> */}
//               <SubMenuDropdown />
//             </div>
//           </li>
//           <li className="nav-item position-relative d-none d-md-flex px-1">
//             <Themedropdown />
//           </li>
//           {/* <li className="nav-item">
//           <OverLay />
//           </li> */}
//           {/* <li className="nav-item">
//             <button type="button" className="nav-link">
//               <i className="fa fa-solid fa-star"></i>
//             </button>
//           </li> */}
//           <li className="nav-item d-none d-md-flex px-1">
//             <div type="button">
//               <i
//                 className="fa fa-home text-white"
//                 aria-hidden="true"
//                 onClick={() => navigate("/dashboard")}
//               ></i>
//             </div>
//           </li>
//           <li className="nav-item d-none d-md-flex px-1">
//             <NotificationsDropdown />
//           </li>

//           <li className="nav-item d-none d-md-flex pr-2 ">
//             <div>
//               {/* <OverLay /> */}
//               <OverlayDropdown />
//             </div>
//           </li>
//           <li className="nav-item d-none d-md-flex px-2">
//             <div onClick={toggleFullScreen}>
//               <i className="fa fa-arrows-alt text-white" aria-hidden="true"></i>
//             </div>
//           </li>


//           <li className="nav-item d-none d-md-flex">
//             <button type="button" className="nav-link" >

//               <SpeechToTextWithSpeechOutput />
//               {/* <i className="fas fa-solid fa-microphone"></i> */}
//             </button>
//           </li>

//           <li className="nav-item d-none d-md-flex ">
//             <LanguagesDropdown />
//           </li>

//           <li className="nav-item d-none d-md-flex">
//             <button type="button" className="nav-link d-flex">
//               <UserDropdown setDropdownOpen={setDropdownOpen} dropdownOpen={dropdownOpen} />
//               <label className="control-label ml-1 d-none d-lg-block text-white">
//                 {localData?.empName}
//               </label>
//             </button>
//           </li>
//           {/* <li className="nav-item">
//           <button
//             type="button"
//             className="nav-link"
//             onClick={handleToggleControlSidebar}
//           >
//             <i className="fas fa-th-large" />
//           </button>
//         </li> */}
//           <li className="nav-item d-none d-md-flex">
//             <button type="button" className="nav-link" onClick={logOut}>
//               <i className="fas fa-sign-out-alt"></i>
//             </button>
//           </li>
//         </ul>
//       </nav>
//       {/* <Header1 /> */}
//     </>
//   );
// });
  return (
    <header className="md-header">
      {/* LEFT SECTION */}
      <div className="md-header-left">
        <button className="md-icon-btn" onClick={handleToggleSidebar} title="Toggle Sidebar">
          <Menu size={20} />
        </button>

        {/* Centre Selector */}
        <div className="md-selector-wrapper d-none-mobile" style={{ position: 'relative' }}>
          <button className="md-selector-btn">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} className="text-blue-600" style={{ color: '#2563eb' }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px', display: 'block' }}>
                {activeCentre?.CentreName || "Select Centre"}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </button>
          {/* Overlay Select for native functionality */}
          <select
            className="md-select-overlay"
            value={localData?.defaultCentre}
            onChange={(e)=>handleChangeCentre(e)}
          >
            {GetEmployeeWiseCenter?.map((ele) => (
              <option key={ele.CentreID} value={ele.CentreID}>{ele.CentreName}</option>
            ))}
          </select>
        </div>

        {/* Role Selector */}
        <div className="md-selector-wrapper d-none-mobile" style={{ position: 'relative' }}>
          <button className="md-selector-btn">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
              <span>{activeRole?.roleName || "Select Role"}</span>
            </div>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </button>
          <select
            className="md-select-overlay"
            value={localData?.defaultRole}
            onChange={(e)=>handleChangeRole(e)}
          >
            {GetRoleList?.map((ele) => (
              <option key={ele.roleID} value={ele.roleID}>{ele.roleName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="md-header-right">
        {/* <div className="md-global-search">
          <Search size={14} className="md-search-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input type="text" className="md-search-input" placeholder="Search pages..." />
        </div> */}

        <button className="md-icon-btn" onClick={handleThemeToggle} title="Switch Theme">
          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button className="md-icon-btn">
          <Bell size={20} />
          <span className="md-badge-dot"></span>
        </button>

        <div className="md-user-profile">
          <div className="d-none-mobile" style={{ textAlign: 'right', lineHeight: '1.2', marginRight: '8px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>
              {localData?.empName}
            </div>
            {/* <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {localData?.roleName}
            </div> */}
          </div>
          <div className="md-avatar">
            {localData?.empName ? localData.empName.charAt(0) : "U"}
          </div>
        </div>

        <button className="md-icon-btn" style={{ color: '#ef4444' }} onClick={logOut} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
});

export default Header;



// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toggleSidebarMenu } from "@app/store/reducers/ui";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import {
//   GetBindMenu,
//   GetRoleListByEmployeeIDAndCentreID,
//   getBindPanelList,
//   getEmployeeWise,
//   getNotification,
// } from "../../store/reducers/common/CommonExportFunction";
// import { logoutAction } from "../../store/reducers/AuthSlice/logoutSlice";
// import { updateClaims } from "../../networkServices/HeaderApi";
// import { getBindCategory } from "../../store/reducers/TokenManagementSlice/CommonExportFunction";
// import { GetLangaugeAPI } from "../../store/reducers/dashboardSlice/CommonFunction";
// import i18n from 'i18next';

// // New Icons (Install lucide-react or replace with <i> tags)
// import { Menu, ChevronDown, Building2, Search, Bell, LogOut, Sun, Moon } from 'lucide-react';

// const Header = React.memo(() => {
//   const [t] = useTranslation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const localData = useLocalStorage("userData", "get");
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // Redux Selectors
//   const { GetEmployeeWiseCenter, GetRoleList } = useSelector((state) => state?.CommonSlice || {});

//   const handleToggleSidebar = () => {
//     dispatch(toggleSidebarMenu());
//   };
//   console.log(GetEmployeeWiseCenter, "GetEmployeeWiseCenter")
//   // --- API & Logic Functions ---
//   const logOut = () => {
//     dispatch(
//       logoutAction({
//         roleID: localData?.defaultRole,
//         employeeID: localData?.employeeID,
//         centreID: localData?.centreID,
//       })
//     );
//     navigate("/login");
//   };

//   const handleUpdateClaims = async (roleID, centreID) => {
//     const data = await updateClaims(String(roleID), String(centreID));
//     if (data?.success) {
//       useLocalStorage("userData", "set", data?.data?.loginResponse);
//       useLocalStorage("token", "set", data?.data?.token);
//     }
//     return data;
//   };

//   const handleChangeCentre = async (e) => {
//     const value = e.target.value;
//     await handleUpdateClaims(localData?.defaultRole, value);
//     window.location.reload();
//     await useLocalStorage("userData", "set", { ...localData, defaultCentre: value });
//     await dispatch(
//       GetRoleListByEmployeeIDAndCentreID({
//         employeeID: localData?.employeeID,
//         centreID: value,
//       })
//     );
//   };

//   const handleChangeRole = async (e) => {
//     const value = e.target.value;
//     try {
//       const apiResp = await handleUpdateClaims(value, localData?.defaultCentre);
//       await dispatch(GetBindMenu({ RoleID: value }));
//       useLocalStorage("userData", "set", {
//         ...localData,
//         defaultRole: value,
//         deptLedgerNo: apiResp?.data?.loginResponse?.deptLedgerNo,
//         roleName: apiResp?.data?.loginResponse?.roleName
//       });
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Error occurred:", error);
//     }
//   };

  // const handleThemeToggle = () => {
  //   setIsDarkMode(!isDarkMode);
  //   // Add logic to switch theme context/css if needed
  //   // document.body.classList.toggle('dark-mode');
  // };

//   console.log(GetRoleList, "GetRoleList")

//   useEffect(() => {
//     if (localData?.employeeID) {
//       dispatch(getEmployeeWise({ employeeID: localData?.employeeID }));
//       dispatch(getNotification({
//         RoleID: localData?.defaultRole,
//         EmployeeID: localData?.employeeID,
//         CentreID: localData?.defaultCentre,
//       }));
//     }
//     dispatch(getBindCategory());
//     dispatch(getBindPanelList({ PanelGroup: "ALL" }));

//     // Language Logic
//     const loadTranslations = async (lng, lngkey) => {
//       try {
//         const apiResp = await GetLangaugeAPI(lngkey)
//         if (apiResp?.success) {
//           let translation = {}
//           apiResp?.data?.map((val) => {
//             translation[val["FIELDNAME"]] = val["DISPLAYNAME"]
//           })
//           i18n.addResourceBundle(lng, 'translation', translation, true, true);
//           i18n.changeLanguage(lng);
//         }
//       } catch (error) { console.error(error); }
//     };
//     loadTranslations(localData?.empLanguageCode, localData?.empLanguage);
//   }, [dispatch]);

  // const activeCentre = GetEmployeeWiseCenter?.find(c => c.CentreID == localData?.defaultCentre) || null;
  // const activeRole = GetRoleList?.find(r => r.roleID == localData?.defaultRole) || null;

//   return (
//     <header className="md-header">
//       {/* LEFT SECTION */}
//       <div className="md-header-left">
//         <button className="md-icon-btn" onClick={handleToggleSidebar} title="Toggle Sidebar">
//           <Menu size={20} />
//         </button>

//         {/* Centre Selector */}
//         <div className="md-selector-wrapper d-none-mobile" style={{ position: 'relative' }}>
//           <button className="md-selector-btn">
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <Building2 size={16} className="text-blue-600" style={{ color: '#2563eb' }} />
//               <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px', display: 'block' }}>
//                 {activeCentre?.CentreName || "Select Centre"}
//               </span>
//             </div>
//             <ChevronDown size={14} style={{ color: '#94a3b8' }} />
//           </button>
//           {/* Overlay Select for native functionality */}
//           <select
//             className="md-select-overlay"
//             value={localData?.defaultCentre}
//             onChange={handleChangeCentre}
//           >
//             {GetEmployeeWiseCenter?.map((ele) => (
//               <option key={ele.CentreID} value={ele.CentreID}>{ele.CentreName}</option>
//             ))}
//           </select>
//         </div>

//         {/* Role Selector */}
//         <div className="md-selector-wrapper d-none-mobile" style={{ position: 'relative' }}>
//           <button className="md-selector-btn">
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
//               <span>{activeRole?.roleName || "Select Role"}</span>
//             </div>
//             <ChevronDown size={14} style={{ color: '#94a3b8' }} />
//           </button>
//           <select
//             className="md-select-overlay"
//             value={localData?.defaultRole}
//             onChange={handleChangeRole}
//           >
//             {GetRoleList?.map((ele) => (
//               <option key={ele.roleID} value={ele.roleID}>{ele.roleName}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* RIGHT SECTION */}
//       <div className="md-header-right">
//         <div className="md-global-search">
//           <Search size={14} className="md-search-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
//           <input type="text" className="md-search-input" placeholder="Search pages..." />
//         </div>

//         <button className="md-icon-btn" onClick={handleThemeToggle} title="Switch Theme">
//           {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
//         </button>

//         <button className="md-icon-btn">
//           <Bell size={20} />
//           <span className="md-badge-dot"></span>
//         </button>

//         <div className="md-user-profile">
//           <div className="d-none-mobile" style={{ textAlign: 'right', lineHeight: '1.2', marginRight: '8px' }}>
//             <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>
//               {localData?.empName}
//             </div>
//             <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
//               {localData?.roleName}
//             </div>
//           </div>
//           <div className="md-avatar">
//             {localData?.empName ? localData.empName.charAt(0) : "U"}
//           </div>
//         </div>

//         <button className="md-icon-btn" style={{ color: '#ef4444' }} onClick={logOut} title="Logout">
//           <LogOut size={18} />
//         </button>
//       </div>
//     </header>
//   );
// });

// export default Header;



