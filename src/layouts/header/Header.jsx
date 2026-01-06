// import React, { useCallback, useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleSidebarMenu } from "@app/store/reducers/ui";
// import NotificationsDropdown from "@app/layouts/header/notifications-dropdown/NotificationsDropdown";
// import LanguagesDropdown from "@app/layouts/header/languages-dropdown/LanguagesDropdown";
// import Themedropdown from "@app/layouts/header/Theme-dropdown";
// import { toggleFullScreen } from "../../utils/helpers";
// import SubMenuDropdown from "@app/layouts/header/submenu-dropdown/SubMenuDropdown";
// import OverlayDropdown from "./overlay-dropdown";
// import i18next from 'i18next';
// import i18n from 'i18next';
// import { useNavigate } from "react-router-dom";
// import UserDropdown from "./user-dropdown/UserDropdown";
// import ReactSelectHead from "../../components/formComponent/ReactSelectHead";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import {
//   GetBindMenu,
//   GetRoleListByEmployeeIDAndCentreID,
//   // getBindPanelList,
//   getEmployeeWise,
//   // getNotification,
// } from "../../store/reducers/common/CommonExportFunction";
// import { logoutAction } from "../../store/reducers/AuthSlice/logoutSlice";
// import { updateClaims } from "../../networkServices/HeaderApi";
// import logoitdose from "../../assets/image/logoitdose.png";
// import { getBindCategory } from "../../store/reducers/TokenManagementSlice/CommonExportFunction";
// import SpeechToTextWithSpeechOutput from "../../components/SpeechToTextWithSpeechOutput";
// import { GetLangaugeAPI } from "../../store/reducers/dashboardSlice/CommonFunction";
// import { Bell, Building2, ChevronDown, LogOut, Menu, Moon, Search, Sun, Palette } from "lucide-react";

// // Theme configurations - same as MenuSidebar
// const THEMES = {
//   dark: { name: 'Dark', primary: '#2563eb', headerBg: 'white' },
//   light: { name: 'Light', primary: '#2563eb', headerBg: 'white' },
//   purple: { name: 'Purple', primary: '#8b5cf6', headerBg: 'white' },
//   green: { name: 'Green', primary: '#10b981', headerBg: 'white' }
// };

// const Header = React.memo(() => {
//   const [routeFlag, setRouteFlag] = useState(false);
//   const localData = useLocalStorage("userData", "get");
//   const [t] = useTranslation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [theme, setTheme] = useState('dark');
  
//   const navbarVariant = useSelector((state) => state.ui.navbarVariant);
//   const headerBorder = useSelector((state) => state.ui.headerBorder);
//   const screenSize = useSelector((state) => state.ui.screenSize);
//   const { GetEmployeeWiseCenter, GetMenuList, GetRoleList } = useSelector(
//     (state) => state?.CommonSlice
//   );
//   const signout = useSelector((state) => state.logoutSlice);

//   const currentTheme = THEMES[theme];

//   useEffect(() => {
//     // Load saved theme from localStorage
//     const savedTheme = localStorage.getItem('sidebarTheme');
//     if (savedTheme && THEMES[savedTheme]) {
//       setTheme(savedTheme);
//     }
//   }, []);

//   // Listen for theme changes from localStorage (when changed in sidebar)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const savedTheme = localStorage.getItem('sidebarTheme');
//       if (savedTheme && THEMES[savedTheme]) {
//         setTheme(savedTheme);
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
    
//     // Poll for changes (since storage event doesn't fire in same tab)
//     const interval = setInterval(() => {
//       handleStorageChange();
//     }, 500);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       clearInterval(interval);
//     };
//   }, []);

//   const handleToggleMenuSidebar = () => {
//     dispatch(toggleSidebarMenu());
//   };

//   const getContainerClasses = useCallback(() => {
//     let classes = `main-header navbar navbar-expand ${navbarVariant}`;
//     if (headerBorder) {
//       classes = `${classes} border-bottom-0`;
//     }
//     return classes;
//   }, [navbarVariant, headerBorder]);

//   const handleToggleSidebar = () => {
//     dispatch(toggleSidebarMenu());
//   };

//   const logOut = () => {
//     dispatch(
//       logoutAction({
//         roleID: localData?.defaultRole,
//         employeeID: localData?.employeeID,
//         centreID: localData?.centreID,
//       })
//     );
//     setRouteFlag(true);
//   };

//   const handleThemeToggle = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   const handleUpdateClaims = async (roleID, centreID) => {
//     const data = await updateClaims(String(roleID), String(centreID));

//     if (data?.success) {
//       useLocalStorage("userData", "set", data?.data?.loginResponse);
//       useLocalStorage("token", "set", data?.data?.token);
//     }
//     return data
//   };

//   // const handleChangeCentre = async (e) => {
//   //   const { value } = e?.target;
//   //   debugger
//   //   await handleUpdateClaims(localData?.defaultRole, value);

//   //   // window.location.reload();

//   //   await useLocalStorage("userData", "set", {
//   //     ...localData,
//   //     defaultCentre: value,
//   //   });

//   //   await dispatch(
//   //     GetRoleListByEmployeeIDAndCentreID({
//   //       branchId: localData?.defaultCentre,
//   //       orgId: localData?.OrganizationId,
//   //     })
//   //   );
//   // };

//   //  const handleChangeRole = async (e) => {
//   //   const { value } = e.target
//   //   try {
//   //     const apiResp = await handleUpdateClaims(value, localData?.defaultCentre);
//   //     await dispatch(
//   //       GetBindMenu({
//   //         RoleID: value,
//   //       })
//   //     );
//   //     useLocalStorage("userData", "set", { 
//   //       ...localData, 
//   //       defaultRole: value, 
//   //       deptLedgerNo: apiResp?.data?.loginResponse?.deptLedgerNo, 
//   //       roleName: apiResp?.data?.loginResponse?.roleName 
//   //     });
//   //     navigate("/dashboard");
//   //   } catch (error) {
//   //     console.error("Error occurred:", error);
//   //   }
//   // };

//   // ... inside Header component

//   const handleChangeCentre = async (e) => {
//     const newCentreId = e?.target?.value;
    
//     // 1. Update Claims (Backend Session)
//     await handleUpdateClaims(localData?.defaultRole, newCentreId);

//     // 2. Update LocalStorage
//     const updatedUserData = {
//       ...localData,
//       defaultCentre: newCentreId,
//     };
//     useLocalStorage("userData", "set", updatedUserData);

//     // 3. Fetch New Roles for this Centre
//     const roleResponse = await dispatch(
//       GetRoleListByEmployeeIDAndCentreID({
//         branchId: newCentreId,
//         orgId: localData?.OrganizationId,
//       })
//     ).unwrap();

//     // 4. Automatically select the first role of the new centre to prevent mismatch
//     if(roleResponse?.data && roleResponse.data.length > 0) {
//         const newRoleId = roleResponse.data[0].id;
        
//         // Update LocalStorage again with new Role
//         updatedUserData.defaultRole = newRoleId;
//         useLocalStorage("userData", "set", updatedUserData);
        
//         // 5. Fetch Menu for new Centre + new Role
//         await dispatch(
//             GetBindMenu({
//             employeeId: localData?.UserId,
//             roleId: newRoleId,
//             branchId: newCentreId,
//             organizationId: localData?.OrganizationId
//             })
//         );
        
//         // 6. Navigate to Dashboard to reset view
//         navigate("/dashboard");
//         // Optional: window.location.reload() if pure React state isn't clearing old data enough
//     }
//   };

//   const handleChangeRole = async (e) => {
//     const newRoleId = e.target.value;
    
//     try {
//       // 1. Update Claims
//       const apiResp = await handleUpdateClaims(newRoleId, localData?.defaultCentre);
      
//       // 2. Update Local Storage
//       const updatedUserData = {
//         ...localData,
//         defaultRole: newRoleId,
//         // Optional: Update extra fields if backend returns them
//         deptLedgerNo: apiResp?.data?.loginResponse?.deptLedgerNo || localData.deptLedgerNo,
//         roleName: apiResp?.data?.loginResponse?.roleName || localData.roleName
//       };
//       useLocalStorage("userData", "set", updatedUserData);

//       // 3. Fetch Menu
//       await dispatch(
//         GetBindMenu({
//           employeeId: localData?.UserId,
//           roleId: newRoleId,
//           branchId: localData?.defaultCentre,
//           organizationId: localData?.OrganizationId
//         })
//       );
      
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Error changing role:", error);
//     }
//   };



//   useEffect(() => {
//     if (localData?.UserId) {
//       dispatch(getEmployeeWise({ 
//         employeeId: localData?.UserId,
//         OrganizationId: localData?.OrganizationId
//       }));
//     }
//   }, [dispatch]);

//   // useEffect(() => {
//   //   dispatch(
//   //     getNotification({
//   //       RoleID: localData?.defaultRole,
//   //       EmployeeID: localData?.employeeID,
//   //       CentreID: localData?.defaultCentre,
//   //     })
//   //   );
//   // }, []);

 

//   useEffect(() => {
//     if (routeFlag && signout.success) {
//       window.location.reload();
//       navigate("/login");
//     }
//   }, [signout.success]);

//   let translation = {}
//   const loadTranslations = async (lng, lngkey) => {
//     try {
//       const apiResp = await GetLangaugeAPI(lngkey)
//       if (apiResp?.success) {
//         apiResp?.data?.map((val) => {
//           translation[val["FIELDNAME"]] = val["DISPLAYNAME"]
//         })
//       }
//       i18n.addResourceBundle(lng, 'translation', translation, true, true);
//       i18n.changeLanguage(lng);
//     } catch (error) {
//       console.error(`Error fetching translations for ${lng}:`, error);
//     }
//   };

//   // useEffect(() => {
//   //   dispatch(getBindCategory());
//   //   loadTranslations(localData?.empLanguageCode, localData?.empLanguage)

//   //   dispatch(
//   //     getBindPanelList({
//   //       PanelGroup: "ALL",
//   //     })
//   //   );
//   // }, []);

//   // const activeCentre = GetEmployeeWiseCenter?.find(c => c.CentreID == localData?.defaultCentre) || "null";
//   const activeCentre = GetEmployeeWiseCenter?.find(c => c.id == localData?.defaultCentre) || null;
//   const activeRole = GetRoleList?.find(r => r.id == localData?.defaultRole) || null;
//   console.log(activeCentre,"activeCentre")
//   return (
//     <header className="md-header" style={{ backgroundColor: currentTheme.headerBg }}>
//       {/* LEFT SECTION */}
//       <div className="md-header-left">
//         <button 
//           className="md-icon-btn"
//           onClick={handleToggleSidebar} 
//           title="Toggle Sidebar"
//         >
//           <Menu size={20} />
//         </button>

//         {/* Centre Selector */}
//         <div className="md-selector-wrapper d-none-mobile" style={{ position: 'relative' }}>
//           <button 
//             className="md-selector-btn"
//             style={{ borderColor: currentTheme.primary + '30' }}
//           >
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <Building2 size={16} style={{ color: currentTheme.primary }} />
//               <span style={{ 
//                 whiteSpace: 'nowrap', 
//                 overflow: 'hidden', 
//                 textOverflow: 'ellipsis', 
//                 maxWidth: '180px', 
//                 display: 'block' 
//               }}>
//                 {activeCentre?.name || "Select Branch"}
//               </span>
//             </div>
//             <ChevronDown size={14} style={{ color: '#94a3b8' }} />
//           </button>
//           <select
//             className="md-select-overlay"
//             value={localData?.defaultCentre}
//             onChange={(e)=>handleChangeCentre(e)}
//           >
//             {console.log(localData?.defaultCentre,"localData?.defaultCentre")}
//             {GetEmployeeWiseCenter?.map((ele) => (
//               <option key={ele.id} value={ele.id}>{ele.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Role Selector */}
//         <div className="md-selector-wrapper d-none-mobile" style={{ position: 'relative' }}>
//           <button 
//             className="md-selector-btn"
//             style={{ borderColor: currentTheme.primary + '30' }}
//           >
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <span style={{ 
//                 width: '8px', 
//                 height: '8px', 
//                 borderRadius: '50%', 
//                 backgroundColor: currentTheme.primary, 
//                 display: 'inline-block' 
//               }}></span>
//               <span>{activeRole?.name || "Select Module"}</span>
//             </div>
//             <ChevronDown size={14} style={{ color: '#94a3b8' }} />
//           </button>
//           <select
//             className="md-select-overlay"
//             value={localData?.defaultRole}
//             onChange={(e)=>handleChangeRole(e)}
//           >
//             {GetRoleList?.map((ele) => (
//               <option key={ele.id} value={ele.id}>{ele.name}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* RIGHT SECTION */}
//       <div className="md-header-right">
//         <button 
//           className="md-icon-btn" 
//           onClick={handleThemeToggle} 
//           title="Switch Theme"
//           style={{ 
//             color: isDarkMode ? currentTheme.primary : '#64748b' 
//           }}
//         >
//           {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
//         </button>

//         <button className="md-icon-btn" title="Notifications">
//           <Bell size={20} />
//           <span className="md-badge-dot"></span>
//         </button>

//         <div className="md-user-profile">
//           <div className="d-none-mobile" style={{ 
//             textAlign: 'right', 
//             lineHeight: '1.2', 
//             marginRight: '8px' 
//           }}>
//             <div style={{ 
//               fontSize: '0.85rem', 
//               fontWeight: '600', 
//               color: '#1e293b' 
//             }}>
//               {localData?.empName}
//             </div>
//           </div>
//           <div 
//             className="md-avatar"
//             style={{
//               background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.primary}dd)`
//             }}
//           >
//             {localData?.empName ? localData.empName.charAt(0) : "U"}
//           </div>
//         </div>

//         <button 
//           className="md-icon-btn" 
//           style={{ color: '#ef4444' }} 
//           onClick={logOut} 
//           title="Logout"
//         >
//           <LogOut size={18} />
//         </button>
//       </div>
//     </header>
//   );
// });

// export default Header;



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
import { Bell, Building2, ChevronDown, LogOut, Menu, Moon, Search, Sun, Palette } from "lucide-react";

// Theme configurations
const THEMES = {
  dark: { name: 'Dark', primary: '#2563eb', headerBg: 'white' },
  light: { name: 'Light', primary: '#2563eb', headerBg: 'white' },
  purple: { name: 'Purple', primary: '#8b5cf6', headerBg: 'white' },
  green: { name: 'Green', primary: '#10b981', headerBg: 'white' }
};

const Header = React.memo(() => {
  const [routeFlag, setRouteFlag] = useState(false);
  const localData = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  const navbarVariant = useSelector((state) => state.ui.navbarVariant);
  const headerBorder = useSelector((state) => state.ui.headerBorder);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const { GetEmployeeWiseCenter, GetMenuList, GetRoleList } = useSelector(
    (state) => state?.CommonSlice
  );
  const signout = useSelector((state) => state.logoutSlice);

  const currentTheme = THEMES[theme];

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('sidebarTheme');
    if (savedTheme && THEMES[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  // Listen for theme changes from localStorage (when changed in sidebar)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem('sidebarTheme');
      if (savedTheme && THEMES[savedTheme]) {
        setTheme(savedTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes (since storage event doesn't fire in same tab)
    const interval = setInterval(() => {
      handleStorageChange();
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

 

  // --- CHANGED: Improved Branch Change Logic ---
  const handleChangeCentre = async (e) => {
    const newCentreId = e?.target?.value;
    debugger
    

    // 2. Fetch Roles for the new centre
    const roleAction = await dispatch(
      GetRoleListByEmployeeIDAndCentreID({
        branchId: newCentreId,
        orgId: localData?.OrganizationId,
      })
    );

    // 3. Determine the correct Role ID (First available role in the new centre)
    let newRoleId = localData?.defaultRole;
    
    // Check if the action was successful and has data
    if (roleAction?.payload?.data && roleAction.payload.data.length > 0) {
      // Automatically select the first role to prevent mismatch
      newRoleId = roleAction.payload.data[0].id;
    }

    // 4. Update LocalStorage with New Centre AND New Role
    const updatedData = {
      ...localData,
      defaultCentre: newCentreId,
      defaultRole: newRoleId
    };
    useLocalStorage("userData", "set", updatedData);

    // 5. Fetch Menu using the NEW Role and NEW Centre
    await dispatch(
      GetBindMenu({
        employeeId: localData?.UserId,
        roleId: newRoleId,
        branchId: newCentreId,
        organizationId: localData?.OrganizationId
      })
    );
    
    // 6. Navigate to refresh view
    navigate("/dashboard");
  };

  // --- CHANGED: Improved Role Change Logic ---
  const handleChangeRole = async (e) => {
    debugger
    const newRoleId = e.target.value;
    try {
      // 1. Update Claims
      // const apiResp = await handleUpdateClaims(newRoleId, localData?.defaultCentre);
      
      // 2. Update LocalStorage
      useLocalStorage("userData", "set", {
        ...localData,
        defaultRole: newRoleId,
        deptLedgerNo: localData.deptLedgerNo,
        roleName:  localData.roleName
      });

      // 3. Fetch Menu explicitly for the new role
      await dispatch(
        GetBindMenu({
          employeeId: localData?.UserId,
          roleId: newRoleId,
          branchId: localData?.defaultCentre,
          organizationId: localData?.OrganizationId
        })
      );
      
      // 4. Navigate
      navigate("/dashboard");
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    if (localData?.UserId) {
      dispatch(getEmployeeWise({
        employeeId: localData?.UserId,
        OrganizationId: localData?.OrganizationId
      }));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(
  //     getNotification({
  //       RoleID: localData?.defaultRole,
  //       EmployeeID: localData?.employeeID,
  //       CentreID: localData?.defaultCentre,
  //     })
  //   );
  // }, []);

  // useEffect(() => {
  //   if (routeFlag && signout.success) {
  //     // window.location.reload();
  //     // navigate("/login");
  //   }
  // }, [signout.success]);

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

  // useEffect(() => {
  //   dispatch(getBindCategory());
  //   loadTranslations(localData?.empLanguageCode, localData?.empLanguage)

  //   dispatch(
  //     getBindPanelList({
  //       PanelGroup: "ALL",
  //     })
  //   );
  // }, []);

  const activeCentre = GetEmployeeWiseCenter?.find(c => c.id == localData?.defaultCentre) || null;
  const activeRole = GetRoleList?.find(r => r.id == localData?.defaultRole) || null;

  return (
    <header className="md-header" style={{ backgroundColor: currentTheme.headerBg }}>
      {/* LEFT SECTION */}
      <div className="md-header-left">
        <button 
          className="md-icon-btn"
          onClick={handleToggleSidebar} 
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Centre Selector */}
        <div className="md-selector-wrapper d-none-mobile" style={{ position: 'relative' }}>
          <button 
            className="md-selector-btn"
            style={{ borderColor: currentTheme.primary + '30' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} style={{ color: currentTheme.primary }} />
              <span style={{ 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                maxWidth: '180px', 
                display: 'block' 
              }}>
                {activeCentre?.name || "Select Branch"}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </button>
          <select
            className="md-select-overlay"
            value={localData?.defaultCentre || ""}
            onChange={(e) => handleChangeCentre(e)}
          >
            {GetEmployeeWiseCenter?.map((ele) => (
              <option key={ele.id} value={ele.id}>{ele.name}</option>
            ))}
          </select>
        </div>

        {/* Role Selector */}
        <div className="md-selector-wrapper d-none-mobile" style={{ position: 'relative' }}>
          <button 
            className="md-selector-btn"
            style={{ borderColor: currentTheme.primary + '30' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: currentTheme.primary, 
                display: 'inline-block' 
              }}></span>
              <span>{activeRole?.name || "Select Module"}</span>
            </div>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </button>
          <select
            className="md-select-overlay"
            value={localData?.defaultRole || ""}
            onChange={(e) => handleChangeRole(e)}
          >
            {GetRoleList?.map((ele) => (
              <option key={ele.id} value={ele.id}>{ele.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="md-header-right">
        <button 
          className="md-icon-btn" 
          onClick={handleThemeToggle} 
          title="Switch Theme"
          style={{ 
            color: isDarkMode ? currentTheme.primary : '#64748b' 
          }}
        >
          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button className="md-icon-btn" title="Notifications">
          <Bell size={20} />
          <span className="md-badge-dot"></span>
        </button>

        <div className="md-user-profile">
          <div className="d-none-mobile" style={{ 
            textAlign: 'right', 
            lineHeight: '1.2', 
            marginRight: '8px' 
          }}>
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: '600', 
              color: '#1e293b' 
            }}>
              {localData?.empName}
            </div>
          </div>
          <div 
            className="md-avatar"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.primary}dd)`
            }}
          >
            {localData?.empName ? localData.empName.charAt(0) : "U"}
          </div>
        </div>

        <button 
          className="md-icon-btn" 
          style={{ color: '#ef4444' }} 
          onClick={logOut} 
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
});

export default Header;