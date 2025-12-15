// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import MenuItem from "@app/layouts/menu-sidebar/MenuItem.jsx";
// import { Image } from "@profabric/react-components";
// import styled from "styled-components";
// import i18n from "@app/utils/i18n";
// import ReactSelectHead from "../../components/formComponent/ReactSelectHead";
// import logo from "@app/assets/image/logo.png";
// import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
// import { useTranslation } from "react-i18next";
// import DesktopMenuItem from "./DesktopMenuItem";
// import { GetBindMenu } from "../../store/reducers/common/CommonExportFunction";
// import { updateClaims } from "../../networkServices/HeaderApi";
// // import { GetRoleListByEmployeeIDAndCentreID } from "../../store/reducers/common/getRoleListSlice";

// const Version = import.meta.env.VITE_APP_VERSION;

// export const MENU = {
//   commonComponent: [
//     {
//       menuName: i18n.t("Dashboard"),
//       icon: "fas fa-tachometer-alt nav-icon",
//       children: [
//         {
//           childrenName: i18n.t("Dashboard"),
//           icon: "fas fa-regular fa-user",
//           url: "/dashboard",
//           breadcrumb: "Dashboard",
//         },
//       ],
//     },
//   ],
//   frontOffice: [
//     {
//       name: i18n.t("Registration"),
//       icon: "fas fa-regular fa-users",
//       children: [
//         {
//           name: i18n.t("Register_Modify"),
//           icon: "fas fa-regular fa-user",
//           path: "/DirectPatientReg",
//           breadcrumb: "Registration / Register/ Modify",
//         },
//         {
//           name: i18n.t("Patient_Black_List"),
//           icon: "fas fa-regular fa-user",
//           path: "/PatientBlackList",
//           breadcrumb: "Registration / Patient Black List",
//         },
//       ],
//     },

//     {
//       name: i18n.t("Sidebar.FrontOffice.OPD.OPD"),
//       icon: "fas fa-regular fa-users",
//       children: [
//         {
//           name: i18n.t("Sidebar.FrontOffice.OPD.OPD_servicebooking"),
//           icon: "fas fa-regular fa-user",
//           path: "/opd-servicebooking",
//           breadcrumb: "OPD / OPD Service Booking",
//         },
//         {
//           name: i18n.t("Sidebar.FrontOffice.OPD.Confirmation"),
//           icon: "fas fa-regular fa-user",
//           path: "/Confirmation",
//           breadcrumb: "OPD / Confirmation",
//         },
//         // {
//         //   name: i18n.t("Sidebar.FrontOffice.OPD.LabPackageInclude"),
//         //   icon: "fas fa-regular fa-user",
//         //   path: "/opd-lab-package-include",
//         //   breadcrumb: "OPD / Lab Package Include",
//         // },
//         {
//           name: i18n.t("Sidebar.FrontOffice.OPD.opd-setellment"),
//           icon: "fas fa-regular fa-user",
//           path: "/opd-setellment",
//           breadcrumb: "OPD / OPD Setellment",
//         },
//         {
//           name: i18n.t("Sidebar.FrontOffice.OPD.opd-refund"),
//           icon: "fas fa-regular fa-user",
//           path: "/opd-refund",
//           breadcrumb: "OPD / OPD Refund",
//         },
//         {
//           name: i18n.t("Sidebar.FrontOffice.OPD.opd-advance"),
//           icon: "fas fa-regular fa-user",
//           path: "/opd-advance",
//           breadcrumb: "OPD / OPD Advance",
//         },
//         {
//           name: i18n.t("Sidebar.FrontOffice.OPD.card-print"),
//           icon: "fas fa-regular fa-user",
//           path: "/card-print",
//           breadcrumb: "OPD / Card Print",
//         },
//         {
//           name: i18n.t("Sidebar.FrontOffice.OPD.Upload_View_Document"),
//           icon: "fas fa-regular fa-user",
//           path: "/Uploadpatientdocuments",
//           breadcrumb: "OPD / Upload View Document",
//         },
//       ],
//     },

//     {
//       name: i18n.t("Sidebar.FrontOffice.Reprint.Reprint"),
//       icon: "fas fa-regular fa-receipt",
//       children: [
//         {
//           name: i18n.t("Sidebar.FrontOffice.Reprint.Receipt-Re-Print"),
//           icon: "fas fa-regular fa-receipt",
//           path: "/ReceiptReprint",
//           breadcrumb: "OPD / Receipt Re-Print",
//         },
//       ],
//     },
//     {
//       name: i18n.t("Tools"),
//       icon: "fas fa-regular fa-receipt",
//       children: [
//         {
//           // name: i18n.t('Sidebar.FrontOffice.Reprint.Receipt-Re-Print'),
//           name: "Debit Credit Note",
//           icon: "fas fa-regular fa-receipt",
//           path: "/DebitCreditNote",
//           breadcrumb: "Tools / Debit Credit Note",
//         },
//         {
//           // name: i18n.t('Sidebar.FrontOffice.Reprint.Receipt-Re-Print'),
//           name: "Expence Voucher",
//           icon: "fas fa-regular fa-receipt",
//           path: "/expense-voucher",
//           breadcrumb: "Tools / Expence Voucher",
//         },
//       ],
//     },
//     {
//       name: "Reports",
//       icon: "fas fa-regular fa-receipt",
//       children: [
//         {
//           name: "Daily Collection",
//           icon: "fas fa-regular fa-receipt",
//           path: "/collection-report",
//           breadcrumb: "Reports / Daily Collection",
//         },
//         {
//           name: "Registration Detail",
//           icon: "fas fa-regular fa-receipt",
//           path: "/registration-report",
//           breadcrumb: "Reports / Registration Detail",
//         },
//         {
//           name: "OPD Balance/Advance Detail",
//           icon: "fas fa-regular fa-receipt",
//           path: "/opd-balance-advance-detail",
//           breadcrumb: "Reports / OPD Balance/Advance Detail",
//         },
//         {
//           name: "Refund Detail",
//           icon: "fas fa-regular fa-receipt",
//           path: "/refund-details",
//           breadcrumb: "Refund Detail",
//         },
//         {
//           name: "Patient Vise Search",
//           icon: "fas fa-regular fa-receipt",
//           path: "/patient-vise-search",
//           breadcrumb: "Reports / Patient Vise Search",
//         },
//         {
//           name: "OPD-Bill Register Report",
//           icon: "fas fa-regular fa-receipt",
//           path: "/opd-billregisterreport",
//           breadcrumb: "Reports / OPD_Bill Register Report",
//         },
//       ],
//     },
//   ],
//   helpDesk: [
//     {
//       name: "Help Desk",
//       icon: "fas fa-tachometer-alt nav-icon",
//       children: [
//         {
//           name: "Panel Detail",
//           icon: "fas fa-regular fa-user",
//           path: "/panel-detail",
//           breadcrumb: "Help Desk / Panel Detail",
//         },
//         {
//           name: "Doctor Timing",
//           icon: "fas fa-regular fa-user",
//           path: "/doctortiming",
//           breadcrumb: "Help Desk / Doctor Timing",
//         },
//         {
//           name: "OPD Package Detail",
//           icon: "fas fa-regular fa-user",
//           path: "/package-detail-opd",
//           breadcrumb: "Help Desk / Doctor Timing",
//         },
//         {
//           name: "Help Desk-IPD",
//           icon: "fas fa-regular fa-user",
//           path: "/help-deskipd",
//           breadcrumb: "Help Desk / Help Desk-IPD",
//         },
//       ],
//     },
//     {
//       name: " Estimate Billing ",
//       icon: "fas fa-tachometer-alt nav-icon",
//       children: [
//         {
//           name: "Surgery Estimate",
//           icon: "fas fa-regular fa-user",
//           path: "/cost-estimation-billing",
//           breadcrumb: "Help Desk / Cost Estimation Billing",
//         },
//         {
//           name: "Cost Estimation Re-print",
//           icon: "fas fa-regular fa-user",
//           path: "/cost-estimation-reprint",
//           breadcrumb: "Help Desk / Cost Estimation Re-print",
//         },
//       ],
//     },
//   ],
//   TokenManagement: [
//     {
//       name: "Token Management",
//       icon: "fas fa-tachometer-alt nav-icon",
//       children: [
//         {
//           name: "Exam Counter Master-----",
//           icon: "fas fa-regular fa-user",
//           path: "/exam-counter-master",
//           breadcrumb: "Token Management / Exam Counter Master",
//         },
//         {
//           name: "Reciept Token Master",
//           icon: "fas fa-regular fa-user",
//           path: "/token-generation-master",
//           breadcrumb: "Token Management / Reciept Token Master",
//         },

//         {
//           name: "Modality Master",
//           icon: "fas fa-regular fa-user",
//           path: "/modality-master",
//           breadcrumb: "Token Management / Modality Master",
//         },
//         {
//           name: "online Inv Slot Master",
//           icon: "fas fa-regular fa-user",
//           path: "/online-inv-slot-master",
//           breadcrumb: "Token Management / Investigation Time Slot Master",
//         },
//         {
//           name: "Sample Coll Room Master",
//           icon: "fas fa-regular fa-user",
//           path: "/samplecollroommaster",
//           breadcrumb: "Token Management / Sample Collection Room Master",
//         },
//       ],
//     },
//   ],
//   examinationRoom: [
//     {
//       name: "OPD",
//       icon: "fas fa-tachometer-alt nav-icon",
//       children: [
//         {
//           name: "Examination Room",
//           icon: "fas fa-regular fa-user",
//           path: "/vital-sign",
//           breadcrumb: "Examination Room / OPD / Examination Room",
//         },
//       ],
//     },
//     {
//       name: "Frame menu",
//       icon: "fas fa-tachometer-alt nav-icon",
//       children: [
//         {
//           name: "Vital Sign",
//           icon: "fas fa-regular fa-user",
//           path: "/vital-sign",
//           breadcrumb: "Examination Room / Frame menu / Vital Examination ",
//         },
//         {
//           name: "CPOE Folder",
//           icon: "fas fa-regular fa-user",
//           path: "/cpoe-folder",
//           breadcrumb: "Examination Room / OPD / CPOE Folder",
//         },
//       ],
//     },
//     {
//       name: "Reports",
//       icon: "fas fa-tachometer-alt nav-icon",
//       children: [
//         {
//           name: "Doctor Wise App Summary",
//           icon: "fas fa-regular fa-user",
//           path: "/doctorwiseappsummary",
//           breadcrumb: "Examination Room / Doctor Wise App Summary",
//         },
//         {
//           name: "Doctor Wise App Details",
//           icon: "fas fa-regular fa-user",
//           path: "/doctorwiseappdetails",
//           breadcrumb: "Examination Room / Reports / Doctor Wise App Details",
//         },
//       ],
//     },
   
//   ],
//   Billng: [
//     {
//       name: "IPD",
//       icon: "fas fa-tachometer-alt nav-icon",
//       children: [
//         {
//           name: "IPDAdmissionNew",
//           icon: "fas fa-regular fa-user",
//           path: "/IPDAdmissionNew",
//           breadcrumb: "Billing / IPD / IPDAdmissionNew",
//         },
//       ],
//     },
    
    
   
//   ],
// };

// const StyledBrandImage = styled(Image)`
//   float: left;
//   line-height: 0.8;
//   margin: -1px 8px 0 6px;
//   opacity: 0.8;
//   --pf-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
//     0 6px 6px rgba(0, 0, 0, 0.23) !important;
// `;

// const StyledUserImage = styled(Image)`
//   --pf-box-shadow: 0 3px 6px #00000029, 0 3px 6px #0000003b !important;
// `;

// const MenuSidebar = () => {
//   const localData = useLocalStorage("userData", "get"); // get Data from localStorage
//   const dispatch = useDispatch();
//   const sidebarSkin = useSelector((state) => state.ui.sidebarSkin);
//   const menuItemFlat = useSelector((state) => state.ui.menuItemFlat);
//   const menuChildIndent = useSelector((state) => state.ui.menuChildIndent);
//   const screenSize = useSelector((state) => state.ui.screenSize);
//   const { GetMenuList, GetRoleList } = useSelector(
//     (state) => state.CommonSlice
//   );
//   const [query, setQuery] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   const navigate= useNavigate()
//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setQuery(value);
//     if (value) {
//       const filtered = [...MENU["commonComponent"], ...GetMenuList]
//         .map((category) => {
//           const filteredChildren = category.children.filter((child) =>
//             child.childrenName.toLowerCase().includes(value)
//           );

//           if (filteredChildren.length > 0) {
//             return {
//               ...category,
//               children: filteredChildren,
//             };
//           }
//           return null;
//         })
//         .filter((category) => category !== null);

//       setFilteredData(filtered);
//     } else {
//       setFilteredData([...MENU["commonComponent"], ...GetMenuList]);
//     }
//   };

//   const handleUpdateClaims = async (roleID, centreID) => {
//     const data = await updateClaims(String(roleID), String(centreID));

//     if (data?.success) {
//       // useLocalStorage("userData", "set", data?.data?.loginResponse);
//       useLocalStorage("token", "set", data?.data?.token);
//       return data
//     }
//   };
//     // role bind
//     const handleChangeRole = async (e) => {
//       const { value } = e;
//       // useLocalStorage("userData", "set", { ...localData, defaultRole: value });
//       try {
//         let apiResp = await handleUpdateClaims(value, localData?.defaultCentre);
//         await dispatch(
//           GetBindMenu({
//             RoleID: value,
//           })
//         );
//       //  useLocalStorage("userData", "set", { ...localData, defaultRole: value });
//       useLocalStorage("userData", "set", { ...localData, defaultRole: value, deptLedgerNo: apiResp?.data?.loginResponse?.deptLedgerNo,roleName:apiResp?.data?.loginResponse?.roleName });
//         navigate("/dashboard");
//       } catch (error) {
//         console.error("Error occurred:", error);
//       }
//     };


//   useEffect(() => {
//     if (GetMenuList?.length > 0) {
//       setFilteredData([...MENU["commonComponent"], ...GetMenuList]);
//     }
//   }, [GetMenuList]);


//   return ["lg", "md"].includes(screenSize) ? (
//     <DesktopMenuItem filteredData={filteredData} />
//   ) : (
//     <aside className={`main-sidebar sidebar_border ${sidebarSkin}`}>
//       <Link to="#" className="brand-link">
//         <StyledBrandImage
//           className="logoStyle"
//           src={logo}
//           alt="AdminLTE Logo"
//           width={33}
//           height={30}
//           rounded
//         />
//         <span className="brand-text font-weight-bold ml-3 mt-3">{Version}</span>
//       </Link>
//       <div className="sidebar">
//         <div className="row mt-3  bindrole">
//           <ReactSelectHead
//             placeholderName="Select Role"
//             dynamicOptions={GetRoleList?.map((ele) => {
//               return {
//                 label: ele?.roleName,
//                 value: ele?.roleID,
//               };
//             })}
//             searchable={true}
//             respclass="col-12"
//             value={Number(localData?.defaultRole)}
//             handleChange={handleChangeRole}
//           />
//         </div>
//         <div className="row bindrole">
//           <div className="col-12">
//             <input
//               type="text"
//               className="form-control search_Items"
//               id="search"
//               name="search"
//               label=""
//               value={query}
//               onChange={handleSearch}
//               placeholder="Search"
//               respclass="col-12"
//             />
//             <i className="fa fa-search search_icon" aria-hidden="true"></i>
//           </div>
//         </div>

//         <nav className="mt-2">
//           <ul
//             className={`nav  nav-sidebar flex-column${
//               menuItemFlat ? " nav-flat" : ""
//             }${menuChildIndent ? " nav-child-indent" : ""}`}
//             role="menu"
//           >
//             {filteredData?.map((menuItem) => (
//               <MenuItem
//                 key={menuItem.name + menuItem.path}
//                 menuItem={menuItem}
//                 isSearched={Boolean(query)}
//               />
//             ))}
//           </ul>
//         </nav>
//       </div>
//     </aside>
//   );
// };

// export default MenuSidebar;

// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { NavLink, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import i18n from "@app/utils/i18n";
// import { toggleSidebarMenu } from "@app/store/reducers/ui";
// import { GetBindMenu } from "../../store/reducers/common/CommonExportFunction";
// import { X, Search, ChevronRight, FileText, LayoutDashboard, Users, Stethoscope, Settings } from 'lucide-react';

// // Static Menu Definition
// export const MENU = {
//   commonComponent: [
//     {
//       menuName: "Dashboard",
//       icon: "fas fa-tachometer-alt nav-icon",
//       children: [
//         { childrenName: "Dashboard", icon: "fas fa-regular fa-user", url: "/dashboard", breadcrumb: "Dashboard" },
//       ],
//     },
//   ],
//   // ... rest of your static menu structure
// };

// const MenuSidebar = () => {
//   const [t] = useTranslation();
//   const dispatch = useDispatch();
//   const location = useLocation();
  
//   // Redux State
//   const { GetMenuList } = useSelector((state) => state.CommonSlice);
//   const menuSidebarCollapsed = useSelector((state) => state.ui.menuSidebarCollapsed);
//   const screenSize = useSelector((state) => state.ui.screenSize);
  
//   const [query, setQuery] = useState("");
//   const [menuData, setMenuData] = useState([]);

//   useEffect(() => {
//     // Combine Static and Dynamic Menu Data
//     const combined = [...(MENU?.commonComponent || []), ...(GetMenuList || [])];
//     setMenuData(combined);
//   }, [GetMenuList]);

//   const filteredMenu = useMemo(() => {
//     if (!query) return menuData;
//     return menuData.map(category => {
//       const matchingChildren = category.children?.filter(child => 
//         child.childrenName?.toLowerCase().includes(query.toLowerCase())
//       );
//       if (matchingChildren?.length > 0) return { ...category, children: matchingChildren };
//       return null;
//     }).filter(Boolean);
//   }, [query, menuData]);

//   const handleCloseMobile = () => {
//      if (screenSize === 'xs' || screenSize === 'sm') {
//          dispatch(toggleSidebarMenu());
//      }
//   };

//   const getIcon = (iconClass) => {
//       // Map your custom icon classes to Lucide icons here
//       if(iconClass?.includes('tachometer')) return LayoutDashboard;
//       if(iconClass?.includes('user')) return Users;
//       return FileText; // Default
//   };

//   return (
//     <>
//       <aside className={`md-sidebar ${menuSidebarCollapsed ? 'closed' : ''}`}>
//         <div className="md-sidebar-header">
//            <div className="md-logo-box">iD</div>
//            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>itDose</div>
//            <button className="md-icon-btn d-lg-none ml-auto" onClick={() => dispatch(toggleSidebarMenu())} style={{color:'white'}}>
//               <X size={20} />
//            </button>
//         </div>

//         <div style={{ padding: '1rem 1rem 0 1rem' }}>
//           <div style={{ position: 'relative', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
//              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }}/>
//              <input 
//                 type="text" 
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search..."
//                 style={{
//                   width: '100%', backgroundColor: 'transparent', border: 'none',
//                   padding: '8px 8px 8px 32px', color: 'white', fontSize: '0.85rem', outline: 'none'
//                 }}
//              />
//           </div>
//         </div>
//                 {console.log(filteredMenu,"filteredMenu")}
//         <div className="md-sidebar-content">
//           {filteredMenu.map((category, index) => (
//             <div key={index}>
//                <div className="md-nav-group-label">{t(category.menuName || category.name)}</div>
//                {category.children?.map((child, cIndex) => {
//                   const Icon = getIcon(child.icon || category.icon);
//                   const isActive = location.pathname === (child.url || child.path);
                  
//                   return (
//                     <NavLink 
//                       key={cIndex}
//                       to={child.url || child.path || "#"}
//                       state={{ data: child.breadcrumb }}
//                       className={`md-nav-item ${isActive ? 'active' : ''}`}
//                       onClick={handleCloseMobile}
//                     >
//                        <div className="md-nav-icon">
//                           {/* Fallback to FontAwesome if Lucide icon logic doesn't match */}
//                           {Icon === FileText ? <i className={child.icon || "fas fa-circle"} /> : <Icon size={18} />}
//                        </div>
//                        <span className="md-nav-text">{t(child.childrenName || child.name)}</span>
//                        {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.8 }} />}
//                     </NavLink>
//                   );
//                })}
//             </div>
//           ))}
//         </div>
//       </aside>
      
//       {/* Mobile Backdrop */}
//       {!menuSidebarCollapsed && (screenSize === 'xs' || screenSize === 'sm') && (
//           <div className="md-backdrop" onClick={() => dispatch(toggleSidebarMenu())}></div>
//       )}
//     </>
//   );
// };

// export default MenuSidebar;


import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "@app/utils/i18n";
import logo from "../../../public/img/DIGITALV-removebg-preview.7c847aad42c53321dc7e (1).png"
import { toggleSidebarMenu } from "@app/store/reducers/ui";
import { X, Search, ChevronRight, ChevronDown, FileText, LayoutDashboard, Users, Stethoscope, Settings, Palette } from 'lucide-react';

// Theme configurations
const THEMES = {
  dark: {
    name: 'Dark',
    sidebarBg: '#0f172a',
    sidebarHeaderBg: '#020617',
    sidebarText: '#94a3b8',
    sidebarTextHover: '#ffffff',
    sidebarActiveGradient: 'linear-gradient(90deg, rgba(37,99,235,0.15) 0%, transparent 100%)',
    sidebarGroupHover: 'rgba(255,255,255,0.05)',
    sidebarChildrenBg: 'rgba(0,0,0,0.2)',
    searchBg: '#1e293b',
    searchBorder: '#334155',
    primary: '#2563eb',
    activeBorder: '#2563eb'
  },
  light: {
    name: 'Light',
    sidebarBg: '#ffffff',
    sidebarHeaderBg: '#f8fafc',
    sidebarText: '#64748b',
    sidebarTextHover: '#1e293b',
    sidebarActiveGradient: 'linear-gradient(90deg, rgba(37,99,235,0.1) 0%, transparent 100%)',
    sidebarGroupHover: '#f1f5f9',
    sidebarChildrenBg: '#f8fafc',
    searchBg: '#f1f5f9',
    searchBorder: '#e2e8f0',
    primary: '#2563eb',
    activeBorder: '#2563eb'
  },
  purple: {
    name: 'Purple',
    sidebarBg: '#1e1b4b',
    sidebarHeaderBg: '#0f0a2e',
    sidebarText: '#a78bfa',
    sidebarTextHover: '#ffffff',
    sidebarActiveGradient: 'linear-gradient(90deg, rgba(139,92,246,0.15) 0%, transparent 100%)',
    sidebarGroupHover: 'rgba(167,139,250,0.1)',
    sidebarChildrenBg: 'rgba(0,0,0,0.2)',
    searchBg: '#312e81',
    searchBorder: '#4c1d95',
    primary: '#8b5cf6',
    activeBorder: '#8b5cf6'
  },
  green: {
    name: 'Green',
    sidebarBg: '#064e3b',
    sidebarHeaderBg: '#022c22',
    sidebarText: '#6ee7b7',
    sidebarTextHover: '#ffffff',
    sidebarActiveGradient: 'linear-gradient(90deg, rgba(16,185,129,0.15) 0%, transparent 100%)',
    sidebarGroupHover: 'rgba(110,231,183,0.1)',
    sidebarChildrenBg: 'rgba(0,0,0,0.2)',
    searchBg: '#065f46',
    searchBorder: '#047857',
    primary: '#10b981',
    activeBorder: '#10b981'
  }
};

// Static Menu Definition
export const MENU = {
  commonComponent: [
    {
      menuName: "Dashboard",
      icon: "fas fa-tachometer-alt nav-icon",
      children: [
        { childrenName: "Dashboard", icon: "fas fa-regular fa-user", url: "/dashboard", breadcrumb: "Dashboard" },
      ],
    },
  ],
  // ... rest of your static menu structure
};

const MenuSidebar = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Redux State
  const { GetMenuList } = useSelector((state) => state.CommonSlice);
  const menuSidebarCollapsed = useSelector((state) => state.ui.menuSidebarCollapsed);
  const screenSize = useSelector((state) => state.ui.screenSize);
  
  const [query, setQuery] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [theme, setTheme] = useState('light');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  // State to track expanded menu groups (by menuName)
  const [expandedMenus, setExpandedMenus] = useState({});

  const currentTheme = THEMES[theme];

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('sidebarTheme');
    if (savedTheme && THEMES[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Combine Static and Dynamic Menu Data
    const combined = [...(MENU?.commonComponent || []), ...(GetMenuList || [])];
    setMenuData(combined);
  }, [GetMenuList]);

  // Search Filter
  const filteredMenu = useMemo(() => {
    if (!query) return menuData;
    return menuData.map(category => {
      const matchingChildren = category.children?.filter(child => 
        child.childrenName?.toLowerCase().includes(query.toLowerCase())
      );
      if (matchingChildren?.length > 0) return { ...category, children: matchingChildren };
      return null;
    }).filter(Boolean);
  }, [query, menuData]);

  // Auto-expand menu if search query is present
  useEffect(() => {
    if (query) {
      const allExpanded = {};
      filteredMenu.forEach(group => {
        if(group) allExpanded[group.menuName] = true;
      });
      setExpandedMenus(allExpanded);
    }
  }, [query, filteredMenu]);

  const handleToggleGroup = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const handleCloseMobile = () => {
     if (screenSize === 'xs' || screenSize === 'sm') {
         dispatch(toggleSidebarMenu());
     }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('sidebarTheme', newTheme);
    setShowThemeMenu(false);
  };

  const getIcon = (iconClass) => {
      if(iconClass?.includes('tachometer')) return LayoutDashboard;
      if(iconClass?.includes('user')) return Users;
      return FileText; 
  };

  return (
    <>
      <aside 
        className={`md-sidebar ${menuSidebarCollapsed ? 'closed' : ''}`}
        style={{
          backgroundColor: currentTheme.sidebarBg,
          borderRight: `1px solid ${currentTheme.searchBorder}`
        }}
      >
        <div 
          className="md-sidebar-header"
          style={{
            backgroundColor: currentTheme.sidebarHeaderBg,
            borderBottom: `1px solid ${currentTheme.searchBorder}`
          }}
        >
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <div style={{
               width: '32px',
               height: '32px',
               background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.activeBorder})`,
               borderRadius: '8px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontWeight: 'bold',
               color: 'white',
               fontSize: '1rem'
             }}>
               D
             </div>
             <span style={{ 
               fontSize: '1.1rem', 
               fontWeight: '700',
               color: currentTheme.sidebarTextHover
             }}>
               Digital Vidya
             </span>
           </div>
           <button 
             className="md-icon-btn d-lg-none ml-auto"
             onClick={() => dispatch(toggleSidebarMenu())} 
             style={{color: currentTheme.sidebarTextHover}}
           >
              <X size={20} />
           </button>
        </div>

        <div style={{ padding: '1rem 1rem 0 1rem' }}>
          <div style={{ 
            position: 'relative', 
            backgroundColor: currentTheme.searchBg, 
            borderRadius: '8px', 
            border: `1px solid ${currentTheme.searchBorder}` 
          }}>
             <Search size={14} style={{ 
               position: 'absolute', 
               left: '10px', 
               top: '10px', 
               color: currentTheme.sidebarText 
             }}/>
             <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                style={{
                  width: '100%', 
                  backgroundColor: 'transparent', 
                  border: 'none',
                  padding: '8px 8px 8px 32px', 
                  color: currentTheme.sidebarTextHover, 
                  fontSize: '0.85rem', 
                  outline: 'none'
                }}
             />
          </div>
        </div>

        <div className="md-sidebar-content">
        
          {menuData.map((group, index) => {
           
             if (!group) return null;
             
             const isExpanded = !!expandedMenus[group.menuName];
             const MainIcon = getIcon(group.icon);

             if (query && !filteredMenu.find(m => m?.menuName === group.menuName)) return null;

             const childrenToRender = query 
                ? (filteredMenu.find(m => m?.menuName === group.menuName)?.children || [])
                : group.children;

             return (
               <div key={index} className="md-menu-group">
                 <div 
                    className={`md-nav-group-header ${isExpanded ? 'active' : ''}`} 
                    onClick={() => handleToggleGroup(group.menuName)}
                    style={{
                      color: isExpanded ? currentTheme.primary : currentTheme.sidebarText,
                      backgroundColor: isExpanded ? currentTheme.sidebarGroupHover : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) {
                        e.currentTarget.style.backgroundColor = currentTheme.sidebarGroupHover;
                        e.currentTarget.style.color = currentTheme.sidebarTextHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = currentTheme.sidebarText;
                      }
                    }}
                 >
                    <div className="flex items-center gap-3">
                        <MainIcon size={16} className="md-group-icon" />
                        <span className="md-group-title">{t(group.menuName)}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                 </div>

                 <div 
                   className={`md-nav-children ${isExpanded ? 'expanded' : ''}`}
                   style={{
                     backgroundColor: currentTheme.sidebarChildrenBg
                   }}
                 >
                   {childrenToRender?.map((child, cIndex) => {
                      const ChildIcon = getIcon(child.icon);
                      const isActive = location.pathname === (child.url || child.path);
                      
                      return (
                        <NavLink 
                          key={cIndex}
                          to={child.url || child.path || "#"}
                          state={{ data: child.breadcrumb }}
                          className={`md-nav-item ${isActive ? 'active' : ''}`}
                          onClick={handleCloseMobile}
                          style={{
                            color: isActive ? currentTheme.sidebarTextHover : currentTheme.sidebarText,
                            borderLeftColor: isActive ? currentTheme.activeBorder : 'transparent',
                            background: isActive ? currentTheme.sidebarActiveGradient : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.color = currentTheme.sidebarTextHover;
                              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.color = currentTheme.sidebarText;
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                           <div className="md-nav-icon">
                              {ChildIcon === FileText ? (
                                <div 
                                  className="md-dot"
                                  style={{
                                    backgroundColor: isActive ? currentTheme.primary : 'currentColor',
                                    opacity: isActive ? 1 : 0.5,
                                    boxShadow: isActive ? `0 0 5px ${currentTheme.primary}` : 'none'
                                  }}
                                ></div>
                              ) : (
                                <ChildIcon size={16} />
                              )}
                           </div>
                           <span className="md-nav-text">{t(child.childrenName || child.name)}</span>
                        </NavLink>
                      );
                   })}
                 </div>
               </div>
             );
          })}
        </div>

        {/* Theme Switcher at Bottom */}
        <div style={{
          padding: '1rem',
          borderTop: `1px solid ${currentTheme.searchBorder}`,
          minWidth: '280px'
        }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: currentTheme.searchBg,
                border: `1px solid ${currentTheme.searchBorder}`,
                borderRadius: '8px',
                color: currentTheme.sidebarTextHover,
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.sidebarGroupHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.searchBg;
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={16} />
                <span>{currentTheme.name} Theme</span>
              </div>
              <ChevronDown size={14} />
            </button>

            {showThemeMenu && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                right: 0,
                marginBottom: '8px',
                backgroundColor: currentTheme.sidebarBg,
                border: `1px solid ${currentTheme.searchBorder}`,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000
              }}>
                {Object.entries(THEMES).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: theme === key ? currentTheme.sidebarGroupHover : 'transparent',
                      border: 'none',
                      color: theme === key ? currentTheme.primary : currentTheme.sidebarText,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: theme === key ? '600' : '400',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.sidebarGroupHover;
                      e.currentTarget.style.color = currentTheme.sidebarTextHover;
                    }}
                    onMouseLeave={(e) => {
                      if (theme !== key) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = currentTheme.sidebarText;
                      }
                    }}
                  >
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: t.primary
                    }}></div>
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
      
      {/* Mobile Backdrop */}
      {!menuSidebarCollapsed && (screenSize === 'xs' || screenSize === 'sm') && (
          <div className="md-backdrop" onClick={() => dispatch(toggleSidebarMenu())}></div>
      )}
    </>
  );
};

export default MenuSidebar;