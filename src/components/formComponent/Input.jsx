import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "primereact/tooltip";
import { FaTimes } from "react-icons/fa";

function Input({
  type,
  name,
  className,
  respclass,
  id,
  placeholder,
  lable,
  value,
  onKeyDown,
  required,
  display,
  onChange,
  disabled,
  readOnly,
  defaultValue,
  isUpperCase,
  onBlur,
  inputRef,
  removeFormGroupClass,
  onInput,
  max,
  min,
  key,
  showTooltipCount,
  maxLength,
  tabIndex,
  isArrow,
  placeholderLabel,
  style,
  clear
}) {


  
    const [theme, setTheme] = useState('dark');
  
    useEffect(() => {
      // Load saved theme from localStorage
      const savedTheme = localStorage.getItem('sidebarTheme');
      if (savedTheme && THEMES[savedTheme]) {
        setTheme(savedTheme);
      }
    }, []);
    const THEMES = {
      dark: { name: 'Dark', primary: '#2563eb', headerBg: 'white' },
      light: { name: 'Light', primary: '#2563eb', headerBg: 'white' },
      purple: { name: 'Purple', primary: '#8b5cf6', headerBg: 'white' },
      green: { name: 'Green', primary: '#10b981', headerBg: 'white' }
    };
  
  
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
    const currentTheme = THEMES[theme];
  

  const [t] = useTranslation();

  const customStyle = style?style:{ textAlign: display ?? "left"  }

  const handleInput = (e) => {
    if (onInput) {
      onInput(e);
    }
    const inputValue = e.target.value;
    e.target.value = inputValue
      .replace(/^\s+/g, "")
      .replace(/(\d)\s+(\d)/g, "$1$2");
  };

  const handleClear = () => {
    if (onChange) {
      const fakeEvent = {
        target: { name, value: "" }
      };
      onChange(fakeEvent);
    }
  };
  return (
    <>
      <Tooltip
        target={`#${id}`}
        position="top"
        content={
          t(lable) +
          ` ${
            showTooltipCount
              ? t("Count : ") + (value?.length ? value?.length : "0")
              : ""
          }`
        }
        event="focus"
        className="ToolTipCustom"
      />

      <div className={`${respclass} custominputbox`}>
        <div className={removeFormGroupClass ? "" : "form-group"}>
          <input
          style={customStyle}
            type={type}
            className={className}
            id={id}
            name={name}
            placeholder={placeholder}
            value={isUpperCase?value?.toUpperCase():value}
            onKeyDown={onKeyDown}
            key={key}
            onChange={onChange}
            autoComplete="off"
            step={type === "number" ? "0.01" : ""}
            required={required}
            ref={inputRef}
            onBlur={onBlur}
            max={max}
            min={min}
            // style={{ textAlign: display ?? "left"  }}
            onInput={handleInput}
            disabled={disabled ? disabled : false}
            readOnly={readOnly}
            maxLength={maxLength}
          />
           {clear && value && (
            <FaTimes
              className="clear-icon"
              onClick={handleClear}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#888"
              }}
            />
          )
          }
          {lable && (
            <label htmlFor={id} className="lable truncate"
             style={{ color: currentTheme.primary }}
            >
              {lable}
            </label>
          )}
          <span className="placeholderLabel">{placeholderLabel}</span>
        </div>
      </div>
    </>
  );
}

export default Input;


