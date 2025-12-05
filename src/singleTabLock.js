
const TAB_KEY = "app_tab_lock";

export function lockTab() {
  const existing = localStorage.getItem(TAB_KEY);

  if (existing) {
    
    alert("App is already open in another tab.");
    window.close(); 
    return false;
  }

 
  localStorage.setItem(TAB_KEY, Date.now().toString());


  window.addEventListener("storage", (e) => {
    if (e.key === TAB_KEY && e.newValue === null) {
     
    } else if (e.key === TAB_KEY && e.newValue !== localStorage.getItem(TAB_KEY)) {
      
      alert("Another tab of this app is already open.");
      window.close(); 
    }
  });

 
  window.addEventListener("beforeunload", () => {
    localStorage.removeItem(TAB_KEY);
  });

  return true;
}
