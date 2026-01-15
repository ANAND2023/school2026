import.meta.env = {"BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SSR": false, "VITE_APP_REACT_APP_BASE_URL": "http://175.176.185.254:2005/gateway/", "VITE_APP_VERSION": "HOSPEDIA V11", "VITE_DATE_FORMAT": "DD/MM/YYYY"};import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=48689e06"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=48689e06"; const createRoot = __vite__cjsImport1_reactDom_client["createRoot"];
import { Provider } from "/node_modules/.vite/deps/react-redux.js?v=48689e06";
import App from "/src/App.jsx?t=1768510573909";
import store from "/src/store/store.js?t=1768503358362";
import "/src/utils/i18n.js";
import "/src/index.css";
import "/src/assets/css/theme.css";
import * as serviceWorker from "/src/serviceWorker.js";
import { BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=48689e06";
import __vite__cjsImport10_reactGa4 from "/node_modules/.vite/deps/react-ga4.js?v=48689e06"; const ReactGA = __vite__cjsImport10_reactGa4.__esModule ? __vite__cjsImport10_reactGa4.default : __vite__cjsImport10_reactGa4;
import { PrimeReactProvider } from "/node_modules/.vite/deps/primereact_api.js?v=48689e06";
import "/node_modules/primereact/resources/themes/lara-light-cyan/theme.css";
import __vite__cjsImport13_react from "/node_modules/.vite/deps/react.js?v=48689e06"; const React = __vite__cjsImport13_react.__esModule ? __vite__cjsImport13_react.default : __vite__cjsImport13_react;
import "/node_modules/flag-icon-css/css/flag-icons.min.css";
import "/node_modules/rc-easyui/dist/themes/default/easyui.css";
import "/node_modules/rc-easyui/dist/themes/icon.css";
import "/node_modules/leaflet/dist/leaflet.css";
import "/node_modules/primeicons/primeicons.css";
import "/node_modules/rc-easyui/dist/themes/default/easyui.css";
import "/node_modules/rc-easyui/dist/themes/icon.css";
import "/node_modules/rc-easyui/dist/themes/react.css";
import "/node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "/node_modules/react-quill/dist/quill.snow.css";
const { VITE_NODE_ENV, VITE_GA_ID } = import.meta.env;
if (VITE_NODE_ENV === "production" && VITE_GA_ID) {
  ReactGA.initialize(VITE_GA_ID);
}
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  /* @__PURE__ */ jsxDEV(PrimeReactProvider, { children: /* @__PURE__ */ jsxDEV(Provider, { store, children: /* @__PURE__ */ jsxDEV(BrowserRouter, { children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
    fileName: "C:/Users/Anand/Desktop/school/school2026/src/index.jsx",
    lineNumber: 47,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "C:/Users/Anand/Desktop/school/school2026/src/index.jsx",
    lineNumber: 46,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/Anand/Desktop/school/school2026/src/index.jsx",
    lineNumber: 45,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "C:/Users/Anand/Desktop/school/school2026/src/index.jsx",
    lineNumber: 44,
    columnNumber: 3
  }, this)
);
serviceWorker.unregister();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBOENRO0FBOUNSLFNBQVNBLGtCQUFrQjtBQUMzQixTQUFTQyxnQkFBZ0I7QUFDekIsT0FBT0MsU0FBUztBQUNoQixPQUFPQyxXQUFXO0FBQ2xCLE9BQU87QUFDUCxPQUFPO0FBQ1AsT0FBTztBQUNQLFlBQVlDLG1CQUFtQjtBQUMvQixTQUFTQyxxQkFBcUI7QUFDOUIsT0FBT0MsYUFBYTtBQUNwQixTQUFTQywwQkFBMEI7QUFDbkMsT0FBTztBQUNQLE9BQU9DLFdBQVc7QUFDbEIsT0FBTztBQUVQLE9BQU87QUFDUCxPQUFPO0FBRVAsT0FBTztBQUVQLE9BQU87QUFDUCxPQUFPO0FBQ1AsT0FBTztBQUNQLE9BQU87QUFDUCxPQUFPO0FBQ1AsT0FBTztBQVFQLE1BQU0sRUFBRUMsZUFBZUMsV0FBVyxJQUFJQyxZQUFZQztBQUVsRCxJQUFJSCxrQkFBa0IsZ0JBQWdCQyxZQUFZO0FBQ2hESixVQUFRTyxXQUFXSCxVQUFVO0FBQy9CO0FBRUEsTUFBTUksWUFBWUMsU0FBU0MsZUFBZSxNQUFNO0FBQ2hELE1BQU1DLE9BQU9qQixXQUFXYyxTQUFTO0FBRWpDRyxLQUFLQztBQUFBQSxFQUNILHVCQUFDLHNCQUNDLGlDQUFDLFlBQVMsT0FDUixpQ0FBQyxpQkFDQyxpQ0FBQyxTQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FBSSxLQUROO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FHQSxLQUpGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FLQSxLQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FPQTtBQUNGO0FBTUFkLGNBQWNlLFdBQVciLCJuYW1lcyI6WyJjcmVhdGVSb290IiwiUHJvdmlkZXIiLCJBcHAiLCJzdG9yZSIsInNlcnZpY2VXb3JrZXIiLCJCcm93c2VyUm91dGVyIiwiUmVhY3RHQSIsIlByaW1lUmVhY3RQcm92aWRlciIsIlJlYWN0IiwiVklURV9OT0RFX0VOViIsIlZJVEVfR0FfSUQiLCJpbXBvcnQiLCJlbnYiLCJpbml0aWFsaXplIiwiY29udGFpbmVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInJvb3QiLCJyZW5kZXIiLCJ1bnJlZ2lzdGVyIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbImluZGV4LmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVSb290IH0gZnJvbSBcInJlYWN0LWRvbS9jbGllbnRcIjtcclxuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcclxuaW1wb3J0IEFwcCBmcm9tIFwiQGFwcC9BcHBcIjtcclxuaW1wb3J0IHN0b3JlIGZyb20gXCJAc3RvcmUvc3RvcmVcIjtcclxuaW1wb3J0IFwiLi91dGlscy9pMThuXCI7XHJcbmltcG9ydCBcIi4vaW5kZXguY3NzXCI7XHJcbmltcG9ydCBcIkBhcHAvYXNzZXRzL2Nzcy90aGVtZS5jc3NcIjtcclxuaW1wb3J0ICogYXMgc2VydmljZVdvcmtlciBmcm9tIFwiLi9zZXJ2aWNlV29ya2VyXCI7XHJcbmltcG9ydCB7IEJyb3dzZXJSb3V0ZXIgfSBmcm9tIFwicmVhY3Qtcm91dGVyLWRvbVwiO1xyXG5pbXBvcnQgUmVhY3RHQSBmcm9tIFwicmVhY3QtZ2E0XCI7XHJcbmltcG9ydCB7IFByaW1lUmVhY3RQcm92aWRlciB9IGZyb20gXCJwcmltZXJlYWN0L2FwaVwiO1xyXG5pbXBvcnQgXCJwcmltZXJlYWN0L3Jlc291cmNlcy90aGVtZXMvbGFyYS1saWdodC1jeWFuL3RoZW1lLmNzc1wiO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCBcIi4uL25vZGVfbW9kdWxlcy9mbGFnLWljb24tY3NzL2Nzcy9mbGFnLWljb25zLm1pbi5jc3NcIjsgXHJcblxyXG5pbXBvcnQgJ3JjLWVhc3l1aS9kaXN0L3RoZW1lcy9kZWZhdWx0L2Vhc3l1aS5jc3MnO1xyXG5pbXBvcnQgJ3JjLWVhc3l1aS9kaXN0L3RoZW1lcy9pY29uLmNzcyc7XHJcblxyXG5pbXBvcnQgJ2xlYWZsZXQvZGlzdC9sZWFmbGV0LmNzcyc7XHJcblxyXG5pbXBvcnQgXCJwcmltZWljb25zL3ByaW1laWNvbnMuY3NzXCI7XHJcbmltcG9ydCBcInJjLWVhc3l1aS9kaXN0L3RoZW1lcy9kZWZhdWx0L2Vhc3l1aS5jc3NcIjtcclxuaW1wb3J0IFwicmMtZWFzeXVpL2Rpc3QvdGhlbWVzL2ljb24uY3NzXCI7XHJcbmltcG9ydCBcInJjLWVhc3l1aS9kaXN0L3RoZW1lcy9yZWFjdC5jc3NcIjtcclxuaW1wb3J0IFwiYm9vdHN0cmFwLWljb25zL2ZvbnQvYm9vdHN0cmFwLWljb25zLmNzc1wiO1xyXG5pbXBvcnQgXCJyZWFjdC1xdWlsbC9kaXN0L3F1aWxsLnNub3cuY3NzXCI7XHJcbi8vIGltcG9ydCB7IGxvY2tUYWIgfSBmcm9tIFwiLi9zaW5nbGVUYWJMb2NrXCI7XHJcbi8vIGltcG9ydCBcInByaW1laWNvbnMvcHJpbWVpY29ucy5jc3NcIjtcclxuLy8gaW1wb3J0IFwicmMtZWFzeXVpL2Rpc3QvdGhlbWVzL2RlZmF1bHQvZWFzeXVpLmNzc1wiO1xyXG4vLyBpbXBvcnQgXCJyYy1lYXN5dWkvZGlzdC90aGVtZXMvaWNvbi5jc3NcIjtcclxuLy8gaW1wb3J0IFwicmMtZWFzeXVpL2Rpc3QvdGhlbWVzL3JlYWN0LmNzc1wiO1xyXG4vLyBpbXBvcnQgXCJib290c3RyYXAtaWNvbnMvZm9udC9ib290c3RyYXAtaWNvbnMuY3NzXCI7XHJcbi8vIGltcG9ydCBcInJlYWN0LXF1aWxsL2Rpc3QvcXVpbGwuc25vdy5jc3NcIjtcclxuY29uc3QgeyBWSVRFX05PREVfRU5WLCBWSVRFX0dBX0lEIH0gPSBpbXBvcnQubWV0YS5lbnY7XHJcblxyXG5pZiAoVklURV9OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgJiYgVklURV9HQV9JRCkge1xyXG4gIFJlYWN0R0EuaW5pdGlhbGl6ZShWSVRFX0dBX0lEKTtcclxufVxyXG5cclxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xyXG5jb25zdCByb290ID0gY3JlYXRlUm9vdChjb250YWluZXIpO1xyXG5cclxucm9vdC5yZW5kZXIoXHJcbiAgPFByaW1lUmVhY3RQcm92aWRlcj5cclxuICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxyXG4gICAgICA8QnJvd3NlclJvdXRlcj5cclxuICAgICAgICA8QXBwIC8+XHJcbiAgICAgICAgey8qIDxDb25maXJtYXRpb24gIC8+ICovfVxyXG4gICAgICA8L0Jyb3dzZXJSb3V0ZXI+XHJcbiAgICA8L1Byb3ZpZGVyPlxyXG4gIDwvUHJpbWVSZWFjdFByb3ZpZGVyPlxyXG4pO1xyXG5cclxuXHJcbi8vIElmIHlvdSB3YW50IHlvdXIgYXBwIHRvIHdvcmsgb2ZmbGluZSBhbmQgbG9hZCBmYXN0ZXIsIHlvdSBjYW4gY2hhbmdlXHJcbi8vIHVucmVnaXN0ZXIoKSB0byByZWdpc3RlcigpIGJlbG93LiBOb3RlIHRoaXMgY29tZXMgd2l0aCBzb21lIHBpdGZhbGxzLlxyXG4vLyBMZWFybiBtb3JlIGFib3V0IHNlcnZpY2Ugd29ya2VyczogaHR0cHM6Ly9iaXQubHkvQ1JBLVBXQVxyXG5zZXJ2aWNlV29ya2VyLnVucmVnaXN0ZXIoKTtcclxuIl0sImZpbGUiOiJDOi9Vc2Vycy9BbmFuZC9EZXNrdG9wL3NjaG9vbC9zY2hvb2wyMDI2L3NyYy9pbmRleC5qc3gifQ==