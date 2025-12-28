import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function Breadcrumb({ path }) {
  const location = useLocation();
  const [theme, setTheme] = useState('dark');
  const { GetMenuList } = useSelector((state) => state?.CommonSlice);
  const [name, setName] = useState('');
  const THEMES = {
    dark: { name: 'Dark', primary: '#2563eb', headerBg: 'white' },
    light: { name: 'Light', primary: '#2563eb', headerBg: 'white' },
    purple: { name: 'Purple', primary: '#8b5cf6', headerBg: 'white' },
    green: { name: 'Green', primary: '#10b981', headerBg: 'white' }
  };
  const findChildByUrl = (menuArray, url) => {
    for (let menu of menuArray) {
      for (let child of menu.children) {
        if (child.url === url) {
          return child;
        }
      }
    }
    return null;
  };
  useEffect(() => {
    const result = findChildByUrl(GetMenuList, location?.pathname);
    setName(result?.breadcrumb)
  }, [GetMenuList?.length])
  const currentTheme = THEMES[theme];



  // const [theme, setTheme] = useState('dark');
  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('sidebarTheme');
    if (savedTheme && THEMES[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);
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

  console.log("currentTheme.headerBg", currentTheme.headerBg)
  return (
    <div className="pb-1 cursor-pointer font-weight-bold ml-1 mt-2 text-nowrap"
    style={{ color: currentTheme.primary }}
    >
      <i className="fa fa-home" aria-hidden="true"
        // style={{ color: currentTheme.headerBg }}
        style={{ color: currentTheme.primary }}
      ></i>

      {path ? path : name}
    </div>
  );
}
