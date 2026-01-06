import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import Tables from "../../UI/customTable";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/ustil2";
import {
  EmployeeBranchMapping,
  GetAllBranches
} from "../../../networkServices/AcademicYear";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { MenuManagmentGeModuleBulk, MenuManagmentgetModuleSubmenuMappings, MenuManagmentgetsubmenus } from "../../../networkServices/MenuMaster";

const ModuleSubmenuMapping = () => {
  const localData = useLocalStorage("userData", "get");
  const initialData = {
    
    subMenuId: {},
  
    moduleId: null,
    moduleName: "",
  
    // orgId: localData?.OrganizationId
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [subMenu, setSubMenu] = useState([]);
  const [module, setModule] = useState([]);


  const handleSelect = (name, option) => {
    if (!option) return;

    if (name === "subMenuId") {
      setValues((prev) => ({
        ...prev,
        subMenuId: option.value,
        subMenuName: option.label
      }));
    }

    if (name === "moduleId") {
      setValues((prev) => ({
        ...prev,
        moduleId: option.value,
        moduleName: option.label
      }));
    }

   
  };

  /* =======================
      SAVE
  ======================== */
  const handleSave = async () => {
    if (!values.moduleId || !values.subMenuId) {
      notify("Module & SubMenu required", "error");
      return;
    }

    const payload = 
      {
  "moduleId": values.moduleId,
  "subMenuId": values.subMenuId
}
    try {
      const res = await MenuManagmentgetModuleSubmenuMappings(payload);

      if (res?.success) {
        notify(res?.message, "success");
       
        setValues(initialData);
      } else {
        notify(res?.message || "Failed", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
   const GetSubMenus = async () => {
          const payload =
          {
              "searchText": "",
              "isAll": 1,
              "orgId": "5bbf859d-9907-4117-aead-c260d030d335",
              "branchId":  "",
              // "branchId": "3436b5be-7dd9-43b0-9de8-82d80d8c4683",
              "isActive": 0
          }
  
          try {
              const res = await MenuManagmentgetsubmenus(payload);
              if (res?.success) {
                  setSubMenu(res?.data);
  
  
              } else {
                  notify(res?.message, "error");
              }
          } catch (error) {
              notify("Something went wrong", "error");
          }
      };
 const getModuleBulk = async () => {


    const payload =
    {
      "searchText": "",
      "isAll": 1,
      "orgId": "5bbf859d-9907-4117-aead-c260d030d335",
      "branchId":  "",
      // "branchId": "3436b5be-7dd9-43b0-9de8-82d80d8c4683",
      "isActive": 0
    }
 
    try {
      const res = await MenuManagmentGeModuleBulk(payload);
      if (res?.success) {
        setModule(res?.data)
        // setTableData(res?.data);
        // setValues(initialData);
        notify(res?.message, "success");
      } else {
        notify(res?.message, "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };


  useEffect(() => {
   
    GetSubMenus();
    getModuleBulk();
  }, []);

  const handleDelete = (index) => {
    const data = [...tableData];
    data.splice(index, 1);
    setTableData(data);
    notify("Mapping removed", "success");
  };

  return (
    <>
      <div className="card p-2">
        <Heading title="Module SubMenu Mapping" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2">
          
 <ReactSelect
            name="subMenuId"
            placeholderName="Select SubMenu"
            dynamicOptions={subMenu?.map((ele) => ({
              label: ele?.name,
              value: ele?.id
            }))}
            respclass="col-xl-3 col-md-6 col-sm-12"
            handleChange={handleSelect}
            value={values.subMenuId}
          />
          <ReactSelect
            name="moduleId"
            placeholderName="Select Module"
            dynamicOptions={module?.map((ele) => ({
              label: ele?.name,
              value: ele?.id
            }))}
            respclass="col-xl-3 col-md-6 col-sm-12"
            handleChange={handleSelect}
            value={values.moduleId}
          />

         

          <div className="col-xl-3 col-12 text-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save Mapping
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <Tables
          thead={[
            { name: "Employee" },
            { name: "Module" },
            { name: "Branch" },
            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            employeeName: item.employeeName,
            moduleName: item.moduleName,
            branchId: item.branchId,
            action: (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(index)}
              >
                🗑️
              </button>
            )
          }))}
        />
      </div>
    </>
  );
};

export default ModuleSubmenuMapping;
