// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { NavLink, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import logo from "../../../public/img/DIGITALV-removebg-preview.7c847aad42c53321dc7e (1).png"
// import { toggleSidebarMenu } from "@app/store/reducers/ui";
// import { X, Search, ChevronRight, ChevronDown, FileText, LayoutDashboard, Users, Settings, Palette } from 'lucide-react';

// // Theme configurations (Kept exactly as provided)
// const THEMES = {
//   dark: {
//     name: 'Dark',
//     sidebarBg: '#0f172a',
//     sidebarHeaderBg: '#020617',
//     sidebarText: '#94a3b8',
//     sidebarTextHover: '#ffffff',
//     sidebarActiveGradient: 'linear-gradient(90deg, rgba(37,99,235,0.15) 0%, transparent 100%)',
//     sidebarGroupHover: 'rgba(255,255,255,0.05)',
//     sidebarChildrenBg: 'rgba(0,0,0,0.2)',
//     searchBg: '#1e293b',
//     searchBorder: '#334155',
//     primary: '#2563eb',
//     activeBorder: '#2563eb'
//   },
//   light: {
//     name: 'Light',
//     sidebarBg: '#ffffff',
//     sidebarHeaderBg: '#f8fafc',
//     sidebarText: '#64748b',
//     sidebarTextHover: '#1e293b',
//     sidebarActiveGradient: 'linear-gradient(90deg, rgba(37,99,235,0.1) 0%, transparent 100%)',
//     sidebarGroupHover: '#f1f5f9',
//     sidebarChildrenBg: '#f8fafc',
//     searchBg: '#f1f5f9',
//     searchBorder: '#e2e8f0',
//     primary: '#2563eb',
//     activeBorder: '#2563eb'
//   },
//   purple: {
//     name: 'Purple',
//     sidebarBg: '#1e1b4b',
//     sidebarHeaderBg: '#0f0a2e',
//     sidebarText: '#a78bfa',
//     sidebarTextHover: '#ffffff',
//     sidebarActiveGradient: 'linear-gradient(90deg, rgba(139,92,246,0.15) 0%, transparent 100%)',
//     sidebarGroupHover: 'rgba(167,139,250,0.1)',
//     sidebarChildrenBg: 'rgba(0,0,0,0.2)',
//     searchBg: '#312e81',
//     searchBorder: '#4c1d95',
//     primary: '#8b5cf6',
//     activeBorder: '#8b5cf6'
//   },
//   green: {
//     name: 'Green',
//     sidebarBg: '#064e3b',
//     sidebarHeaderBg: '#022c22',
//     sidebarText: '#6ee7b7',
//     sidebarTextHover: '#ffffff',
//     sidebarActiveGradient: 'linear-gradient(90deg, rgba(16,185,129,0.15) 0%, transparent 100%)',
//     sidebarGroupHover: 'rgba(110,231,183,0.1)',
//     sidebarChildrenBg: 'rgba(0,0,0,0.2)',
//     searchBg: '#065f46',
//     searchBorder: '#047857',
//     primary: '#10b981',
//     activeBorder: '#10b981'
//   }
// };

// export const MENU = {
//   commonComponent: [
//     {
//       id: "dashboard-static-id",
//       name: "Dashboard",
//       icon: "fas fa-tachometer-alt nav-icon",
//       displayOrder: 0,
//       subMenus: [
//         { 
//           id: "dash-sub-1",
//           name: "Dashboard", 
//           icon: "fas fa-regular fa-user", 
//           pageUrl: "/dashboard", 
//           breadcrumb: "Dashboard"
//         },
//       ],
//     },
//   ],
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
//   const [theme, setTheme] = useState('light');
//   const [showThemeMenu, setShowThemeMenu] = useState(false);
//   const [expandedMenus, setExpandedMenus] = useState({});

//   const currentTheme = THEMES[theme];

//   // Helper for icons
//   const getIcon = (iconClass) => {
//     if(!iconClass) return FileText;
//     const lowerClass = iconClass.toLowerCase();
//     if(lowerClass.includes('tachometer')) return LayoutDashboard;
//     if(lowerClass.includes('user')) return Users;
//     if(lowerClass.includes('setting')) return Settings;
//     return FileText; 
//   };

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('sidebarTheme');
//     if (savedTheme && THEMES[savedTheme]) {
//       setTheme(savedTheme);
//     }
//   }, []);

//   useEffect(() => {
//     const dynamicMenu = Array.isArray(GetMenuList) ? GetMenuList : [];
//     const combined = [...(MENU?.commonComponent || []), ...dynamicMenu];
//     combined.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
//     setMenuData(combined);
//   }, [GetMenuList]);

//   const filteredMenu = useMemo(() => {
//     if (!query) return menuData;
//     return menuData.map(category => {
//       const matchingChildren = category.subMenus?.filter(child => 
//         child.name?.toLowerCase().includes(query.toLowerCase())
//       );
//       if (matchingChildren?.length > 0) {
//         return { ...category, subMenus: matchingChildren };
//       }
//       return null;
//     }).filter(Boolean);
//   }, [query, menuData]);

//   useEffect(() => {
//     if (query) {
//       const allExpanded = {};
//       filteredMenu.forEach(group => {
//         if(group) allExpanded[group.name] = true;
//       });
//       setExpandedMenus(allExpanded);
//     }
//   }, [query, filteredMenu]);

//   const handleToggleGroup = (groupName) => {
//     if (menuSidebarCollapsed) return; // Prevent expanding when collapsed
//     setExpandedMenus(prev => ({
//       ...prev,
//       [groupName]: !prev[groupName]
//     }));
//   };

//   const handleCloseMobile = () => {
//      if (screenSize === 'xs' || screenSize === 'sm') {
//          dispatch(toggleSidebarMenu());
//      }
//   };

//   const handleThemeChange = (newTheme) => {
//     setTheme(newTheme);
//     localStorage.setItem('sidebarTheme', newTheme);
//     setShowThemeMenu(false);
//   };

//   return (
//     <>
//       <aside 
//         className={`md-sidebar ${menuSidebarCollapsed ? 'closed' : ''}`}
//         style={{
//           backgroundColor: currentTheme.sidebarBg,
//           borderRight: `1px solid ${currentTheme.searchBorder}`,
//           // PERFORMANCE FIXES:
//           whiteSpace: 'nowrap', // Prevents text wrapping lag
//           overflow: 'hidden',   // Ensures no scrollbars appear during transition
//           willChange: 'width',  // Hints browser to optimize for width changes
//           transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth easing
//         }}
//       >
//         {/* Header */}
//         <div 
//           className="md-sidebar-header"
//           style={{
//             backgroundColor: currentTheme.sidebarHeaderBg,
//             borderBottom: `1px solid ${currentTheme.searchBorder}`,
//             overflow: 'hidden', // Clip logo when shrinking
//             height: '64px', // Enforce fixed height
//             display: 'flex',
//             alignItems: 'center'
//           }}
//         >
//            <div style={{ 
//              display: 'flex', 
//              alignItems: 'center', 
//              gap: '12px',
//              opacity: menuSidebarCollapsed ? 0 : 1, // Fade out logo
//              transition: 'opacity 0.2s',
//              pointerEvents: menuSidebarCollapsed ? 'none' : 'auto'
//            }}>
//              <img 
//                src={logo} 
//                alt="Logo" 
//                style={{
//                  width:"200px", 
//                  maxWidth: 'unset' // Prevent img trying to resize responsively during transition
//                }}
//              />
//            </div>
//            <button 
//              className="md-icon-btn d-lg-none ml-auto"
//              onClick={() => dispatch(toggleSidebarMenu())} 
//              style={{color: currentTheme.sidebarTextHover}}
//            >
//               <X size={20} />
//            </button>
//         </div>

//         {/* Search Bar - Hidden when collapsed to prevent squishing */}
//         <div style={{ 
//             padding: '1rem 1rem 0 1rem',
//             opacity: menuSidebarCollapsed ? 0 : 1,
//             height: menuSidebarCollapsed ? '0px' : 'auto',
//             transition: 'opacity 0.2s',
//             visibility: menuSidebarCollapsed ? 'hidden' : 'visible'
//           }}>
//           <div style={{ 
//             position: 'relative', 
//             backgroundColor: currentTheme.searchBg, 
//             borderRadius: '8px', 
//             border: `1px solid ${currentTheme.searchBorder}` 
//           }}>
//              <Search size={14} style={{ 
//                position: 'absolute', 
//                left: '10px', 
//                top: '10px', 
//                color: currentTheme.sidebarText 
//              }}/>
//              <input 
//                 type="text" 
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search..."
//                 style={{
//                   width: '100%', 
//                   backgroundColor: 'transparent', 
//                   border: 'none',
//                   padding: '8px 8px 8px 32px', 
//                   color: currentTheme.sidebarTextHover, 
//                   fontSize: '0.85rem', 
//                   outline: 'none'
//                 }}
//              />
//           </div>
//         </div>

//         {/* Menu Content */}
//         <div className="md-sidebar-content">
//           {filteredMenu.map((group, index) => {
//              if (!group) return null;
             
//              const isExpanded = !!expandedMenus[group.menuName];
//              const MainIcon = getIcon(group.icon);
//              const childrenToRender = group.subMenus || [];
//              const groupKey = group.id || index;

//              return (
//                <div key={groupKey} className="md-menu-group">
//                  {/* Parent Menu Item */}
//                  <div 
//                     className={`md-nav-group-header ${isExpanded ? 'active' : ''}`} 
//                     onClick={() => handleToggleGroup(group.name)}
//                     style={{
//                       color: isExpanded ? currentTheme.primary : currentTheme.sidebarText,
//                       backgroundColor: isExpanded ? currentTheme.sidebarGroupHover : 'transparent',
//                       cursor: 'pointer'
//                     }}
//                     onMouseEnter={(e) => {
//                       if (!isExpanded) {
//                         e.currentTarget.style.backgroundColor = currentTheme.sidebarGroupHover;
//                         e.currentTarget.style.color = currentTheme.sidebarTextHover;
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (!isExpanded) {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = currentTheme.sidebarText;
//                       }
//                     }}
//                  >
//                     <div className="flex items-center gap-3" style={{ minWidth: '24px' }}>
//                         <MainIcon size={16} className="md-group-icon" />
//                         <span className="md-group-title" style={{ 
//                           opacity: menuSidebarCollapsed ? 0 : 1,
//                           transition: 'opacity 0.1s' 
//                         }}>
//                           {t(group.name)}
//                         </span>
//                     </div>
//                     {/* Hide Chevron when collapsed */}
//                     {!menuSidebarCollapsed && childrenToRender.length > 0 && (
//                         isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
//                     )}
//                  </div>

//                  {/* Child Menu Items */}
//                  {childrenToRender.length > 0 && (
//                     <div 
//                     className={`md-nav-children ${isExpanded ? 'expanded' : ''}`}
//                     style={{
//                         backgroundColor: currentTheme.sidebarChildrenBg,
//                         display: isExpanded && !menuSidebarCollapsed ? 'block' : 'none'
//                     }}
//                     >
//                     {childrenToRender.map((child, cIndex) => {
//                         const ChildIcon = getIcon(child.icon);
//                         const isActive = location.pathname === child.pageUrl;
                        
//                         return (
//                             <NavLink 
//                             key={child.id || cIndex}
//                             to={child.pageUrl || "#"}
//                             state={{ data: child.breadcrumb || child.name }}
//                             className={`md-nav-item ${isActive ? 'active' : ''}`}
//                             onClick={handleCloseMobile}
//                             style={{
//                                 color: isActive ? currentTheme.sidebarTextHover : currentTheme.sidebarText,
//                                 borderLeftColor: isActive ? currentTheme.activeBorder : 'transparent',
//                                 background: isActive ? currentTheme.sidebarActiveGradient : 'transparent',
//                             }}
//                             onMouseEnter={(e) => {
//                                 if (!isActive) {
//                                 e.currentTarget.style.color = currentTheme.sidebarTextHover;
//                                 e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
//                                 }
//                             }}
//                             onMouseLeave={(e) => {
//                                 if (!isActive) {
//                                 e.currentTarget.style.color = currentTheme.sidebarText;
//                                 e.currentTarget.style.backgroundColor = 'transparent';
//                                 }
//                             }}
//                             >
//                             <div className="md-nav-icon" style={{ minWidth: '20px' }}>
//                                 {ChildIcon === FileText ? (
//                                     <div 
//                                     className="md-dot"
//                                     style={{
//                                         backgroundColor: isActive ? currentTheme.primary : 'currentColor',
//                                         opacity: isActive ? 1 : 0.5,
//                                         boxShadow: isActive ? `0 0 5px ${currentTheme.primary}` : 'none'
//                                     }}
//                                     ></div>
//                                 ) : (
//                                     <ChildIcon size={16} />
//                                 )}
//                             </div>
//                             <span className="md-nav-text" style={{ 
//                               opacity: menuSidebarCollapsed ? 0 : 1,
//                               whiteSpace: 'nowrap' 
//                             }}>
//                               {t(child.name)}
//                             </span>
//                             </NavLink>
//                         );
//                     })}
//                     </div>
//                  )}
//                </div>
//              );
//           })}
//         </div>

//         {/* Theme Switcher */}
//         <div style={{
//           padding: '1rem',
//           borderTop: `1px solid ${currentTheme.searchBorder}`,
//           minWidth: '280px',
//           display: menuSidebarCollapsed ? 'none' : 'block' // Hide completely when collapsed
//         }}>
//            {/* ... Theme switcher code remains same, just hidden on collapse ... */}
//            <div style={{ position: 'relative' }}>
//             <button
//               onClick={() => setShowThemeMenu(!showThemeMenu)}
//               style={{
//                 width: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 padding: '0.75rem 1rem',
//                 backgroundColor: currentTheme.searchBg,
//                 border: `1px solid ${currentTheme.searchBorder}`,
//                 borderRadius: '8px',
//                 color: currentTheme.sidebarTextHover,
//                 cursor: 'pointer',
//                 fontSize: '0.85rem',
//                 fontWeight: '600',
//                 transition: 'all 0.2s'
//               }}
//             >
//               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <Palette size={16} />
//                 <span>{currentTheme.name} Theme</span>
//               </div>
//               <ChevronDown size={14} />
//             </button>
//             {/* Theme Dropdown code... (omitted for brevity, same as before) */}
//             {showThemeMenu && (
//               <div style={{
//                 position: 'absolute',
//                 bottom: '100%',
//                 left: 0,
//                 right: 0,
//                 marginBottom: '8px',
//                 backgroundColor: currentTheme.sidebarBg,
//                 border: `1px solid ${currentTheme.searchBorder}`,
//                 borderRadius: '8px',
//                 overflow: 'hidden',
//                 boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
//                 zIndex: 1000
//               }}>
//                 {Object.entries(THEMES).map(([key, t]) => (
//                   <button
//                     key={key}
//                     onClick={() => handleThemeChange(key)}
//                     style={{
//                       width: '100%',
//                       padding: '0.75rem 1rem',
//                       backgroundColor: theme === key ? currentTheme.sidebarGroupHover : 'transparent',
//                       border: 'none',
//                       color: theme === key ? currentTheme.primary : currentTheme.sidebarText,
//                       textAlign: 'left',
//                       cursor: 'pointer',
//                       fontSize: '0.85rem',
//                       fontWeight: theme === key ? '600' : '400',
//                       transition: 'all 0.2s',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px'
//                     }}
//                   >
//                     <div style={{
//                       width: '12px',
//                       height: '12px',
//                       borderRadius: '50%',
//                       backgroundColor: t.primary
//                     }}></div>
//                     {t.name}
//                   </button>
//                 ))}
//               </div>
//             )}
//            </div>
//         </div>
//       </aside>
      
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
import logo from "../../../public/img/DIGITALV-removebg-preview.7c847aad42c53321dc7e (1).png"
import { toggleSidebarMenu } from "@app/store/reducers/ui";
import { X, Search, ChevronRight, ChevronDown, FileText, LayoutDashboard, Users, Settings, Palette } from 'lucide-react';

// Theme configurations (Kept exactly as provided)
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

export const MENU = {
  commonComponent: [
    {
      id: "dashboard-static-id",
      name: "Dashboard",
      icon: "fas fa-tachometer-alt nav-icon",
      displayOrder: 0,
      subMenus: [
        { 
          id: "dash-sub-1",
          name: "Dashboard", 
          icon: "fas fa-regular fa-user", 
          pageUrl: "/dashboard", 
          breadcrumb: "Dashboard"
        },
      ],
    },
  ],
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
  const [expandedMenus, setExpandedMenus] = useState({});

  const currentTheme = THEMES[theme];

  // Helper for icons
  const getIcon = (iconClass) => {
    if(!iconClass) return FileText;
    const lowerClass = iconClass.toLowerCase();
    if(lowerClass.includes('tachometer')) return LayoutDashboard;
    if(lowerClass.includes('user')) return Users;
    if(lowerClass.includes('setting')) return Settings;
    return FileText; 
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('sidebarTheme');
    if (savedTheme && THEMES[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const dynamicMenu = Array.isArray(GetMenuList) ? GetMenuList : [];
    const combined = [...(MENU?.commonComponent || []), ...dynamicMenu];
    combined.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    setMenuData(combined);
  }, [GetMenuList]);

  const filteredMenu = useMemo(() => {
    if (!query) return menuData;
    return menuData.map(category => {
      const matchingChildren = category.subMenus?.filter(child => 
        child.name?.toLowerCase().includes(query.toLowerCase())
      );
      if (matchingChildren?.length > 0) {
        return { ...category, subMenus: matchingChildren };
      }
      return null;
    }).filter(Boolean);
  }, [query, menuData]);

  useEffect(() => {
    if (query) {
      const allExpanded = {};
      filteredMenu.forEach(group => {
        if(group) allExpanded[group.name] = true;
      });
      setExpandedMenus(allExpanded);
    }
  }, [query, filteredMenu]);

  const handleToggleGroup = (groupName) => {
    if (menuSidebarCollapsed) return; // Prevent expanding when collapsed
    setExpandedMenus(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
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

  return (
    <>
      <aside 
        className={`md-sidebar ${menuSidebarCollapsed ? 'closed' : ''}`}
        style={{
          backgroundColor: currentTheme.sidebarBg,
          borderRight: `1px solid ${currentTheme.searchBorder}`,
          // PERFORMANCE FIXES:
          whiteSpace: 'nowrap', // Prevents text wrapping lag
          overflow: 'hidden',   // Ensures no scrollbars appear during transition
          willChange: 'width',  // Hints browser to optimize for width changes
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth easing
        }}
      >
        {/* Header */}
        <div 
          className="md-sidebar-header"
          style={{
            backgroundColor: currentTheme.sidebarHeaderBg,
            borderBottom: `1px solid ${currentTheme.searchBorder}`,
            overflow: 'hidden', // Clip logo when shrinking
            height: '64px', // Enforce fixed height
            display: 'flex',
            alignItems: 'center'
          }}
        >
           <div style={{ 
             display: 'flex', 
             alignItems: 'center', 
             gap: '12px',
             opacity: menuSidebarCollapsed ? 0 : 1, // Fade out logo
             transition: 'opacity 0.2s',
             pointerEvents: menuSidebarCollapsed ? 'none' : 'auto'
           }}>
             <img 
               src={logo} 
               alt="Logo" 
               style={{
                 width:"200px", 
                 maxWidth: 'unset' // Prevent img trying to resize responsively during transition
               }}
             />
           </div>
           <button 
             className="md-icon-btn d-lg-none ml-auto"
             onClick={() => dispatch(toggleSidebarMenu())} 
             style={{color: currentTheme.sidebarTextHover}}
           >
              <X size={20} />
           </button>
        </div>

        {/* Search Bar - Hidden when collapsed to prevent squishing */}
        <div style={{ 
            padding: '1rem 1rem 0 1rem',
            opacity: menuSidebarCollapsed ? 0 : 1,
            height: menuSidebarCollapsed ? '0px' : 'auto',
            transition: 'opacity 0.2s',
            visibility: menuSidebarCollapsed ? 'hidden' : 'visible'
          }}>
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

        {/* Menu Content */}
        <div className="md-sidebar-content">
          {filteredMenu.map((group, index) => {
             if (!group) return null;
             
             // --- FIX HERE: Changed from group.menuName to group.name ---
             const isExpanded = !!expandedMenus[group.name];
             // ------------------------------------------------------------
             
             const MainIcon = getIcon(group.icon);
             const childrenToRender = group.subMenus || [];
             const groupKey = group.id || index;

             return (
               <div key={groupKey} className="md-menu-group">
                 {/* Parent Menu Item */}
                 <div 
                    className={`md-nav-group-header ${isExpanded ? 'active' : ''}`} 
                    onClick={() => handleToggleGroup(group.name)}
                    style={{
                      color: isExpanded ? currentTheme.primary : currentTheme.sidebarText,
                      backgroundColor: isExpanded ? currentTheme.sidebarGroupHover : 'transparent',
                      cursor: 'pointer'
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
                    <div className="flex items-center gap-3" style={{ minWidth: '24px' }}>
                        <MainIcon size={16} className="md-group-icon" />
                        <span className="md-group-title" style={{ 
                          opacity: menuSidebarCollapsed ? 0 : 1,
                          transition: 'opacity 0.1s' 
                        }}>
                          {t(group.name)}
                        </span>
                    </div>
                    {/* Hide Chevron when collapsed */}
                    {!menuSidebarCollapsed && childrenToRender.length > 0 && (
                        isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    )}
                 </div>

                 {/* Child Menu Items */}
                 {childrenToRender.length > 0 && (
                    <div 
                    className={`md-nav-children ${isExpanded ? 'expanded' : ''}`}
                    style={{
                        backgroundColor: currentTheme.sidebarChildrenBg,
                        display: isExpanded && !menuSidebarCollapsed ? 'block' : 'none'
                    }}
                    >
                    {childrenToRender.map((child, cIndex) => {
                        const ChildIcon = getIcon(child.icon);
                        const isActive = location.pathname === child.pageUrl;
                        
                        return (
                            <NavLink 
                            key={child.id || cIndex}
                            to={child.pageUrl || "#"}
                            state={{ data: child.breadcrumb || child.name }}
                            className={`md-nav-item ${isActive ? 'active' : ''}`}
                            onClick={handleCloseMobile}
                            style={{
                                color: isActive ? currentTheme.sidebarTextHover : currentTheme.sidebarText,
                                borderLeftColor: isActive ? currentTheme.activeBorder : 'transparent',
                                background: isActive ? currentTheme.sidebarActiveGradient : 'transparent',
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
                            <div className="md-nav-icon" style={{ minWidth: '20px' }}>
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
                            <span className="md-nav-text" style={{ 
                              opacity: menuSidebarCollapsed ? 0 : 1,
                              whiteSpace: 'nowrap' 
                            }}>
                              {t(child.name)}
                            </span>
                            </NavLink>
                        );
                    })}
                    </div>
                 )}
               </div>
             );
          })}
        </div>

        {/* Theme Switcher */}
        <div style={{
          padding: '1rem',
          borderTop: `1px solid ${currentTheme.searchBorder}`,
          minWidth: '280px',
          display: menuSidebarCollapsed ? 'none' : 'block' // Hide completely when collapsed
        }}>
           {/* ... Theme switcher code remains same, just hidden on collapse ... */}
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
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={16} />
                <span>{currentTheme.name} Theme</span>
              </div>
              <ChevronDown size={14} />
            </button>
            {/* Theme Dropdown code... (omitted for brevity, same as before) */}
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
      
      {!menuSidebarCollapsed && (screenSize === 'xs' || screenSize === 'sm') && (
          <div className="md-backdrop" onClick={() => dispatch(toggleSidebarMenu())}></div>
      )}
    </>
  );
};

export default MenuSidebar;