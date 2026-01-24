import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import Tables from "../../UI/customTable";
import Heading from "../../UI/Heading";

import {

  GetAllBranches
} from "../../../networkServices/AcademicYear";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { CreateModuleSubmenuMappingBulk, MenuManagmentGeModuleBulk, MenuManagmentgetModuleSubmenuMappings, MenuManagmentgetsubmenus } from "../../../networkServices/MenuMaster";
import { notify } from "../../../utils/utils";
import Input from "../../formComponent/Input";
import MultiSelectComp from "../../formComponent/MultiSelectComp";
import { useTranslation } from "react-i18next";

const ModuleSubmenuMapping = () => {
    const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");
  console.log("localData", localData)
  const initialData = {
    subMenu: [],
    branch: {},
    module: {},
    order: "",
    // orgId: localData?.OrganizationId
  };

  const [values, setValues] = useState(initialData);

  const [tableData, setTableData] = useState([]);
  const [subMenu, setSubMenu] = useState([]);
  const [module, setModule] = useState([]);
  const [branch, setBranch] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelect = (name, option) => {
    setValues((prev) => ({ ...prev, [name]: option }));
  };
    const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({ ...values, [name]: selectedOptions });
  };
  
  const getData = async () => {
    const payload = {
      "employeeId": "",
      "organisationID": localData?.OrganizationId,
      "isAll": 1
    }
    try {
      const res = await GetAllBranches(payload);
      if (res?.success)
        setBranch(res.data);
      else notify(res?.message, "error");
    } catch {
      notify("Error fetching data", "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getMapping = async () => {
    if (!values.module || !values.subMenu) {
      notify("Module & SubMenu required", "error");
      return;
    }

    const payload =
    {
      "moduleId": values.module?.value,
      "subMenuId": values.subMenu?.value
    }
    try {
      const res = await MenuManagmentgetModuleSubmenuMappings(payload);
      
      if (res?.success) {
        notify(res?.message, "success");
        setTableData(res?.data)
        // setValues(initialData);
      } else {
        notify(res?.message || "Failed", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  const handleSave = async () => {
    if (!values.module || !values.subMenu) {
      notify("Module & SubMenu required", "error");
      return;
    }


    const payload =values.subMenu.map((subMenuItem) =>(
      {
        "moduleId": values.module?.value,
        "moduleName": values.module?.label,
        "subMenuId": subMenuItem?.code,    
        "subMenuName": subMenuItem?.name,
        "displayOrder": values.order,
        "branchId": values.branch?.value,
        "orgId": localData?.OrganizationId
    })
  )

    try {
      const res = await CreateModuleSubmenuMappingBulk(payload);
      console.log("res",res)
      if (res?.success) {
        notify(res?.message, "success");
        // setTableData(res?.data)
        // setValues(initialData);
      } else {
        notify(res?.message || res?.data?.message, "error");
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };
  const GetSubMenus = async () => {
    const payload =
    {
      "searchText": "",
      "isAll": 1,
      "orgId": "5bbf859d-9907-4117-aead-c260d030d335",
      "branchId": "",
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
      "branchId": "",
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
      <div className="card">
        <Heading title="Module SubMenu Mapping" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2 ">
          <ReactSelect
            name="branch"
            placeholderName="Select Branch"
            dynamicOptions={branch?.map((ele) => ({
              label: ele?.name,
              value: ele?.id
            }))}
            value={values.branch}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={handleSelect}
          />
          <ReactSelect
            name="module"
            placeholderName="Select Module"
            dynamicOptions={module?.map((ele) => ({
              label: ele?.name,
              value: ele?.id
            }))}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={handleSelect}
            value={values.module}
          />
         
           <MultiSelectComp
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="subMenu"
            id="subMenu"
            placeholderName={t("subMenu")}
            // dynamicOptions={module}
            dynamicOptions={subMenu?.map((ele) => ({
              name: ele?.name,
              code: ele?.id
            }))}
            handleChange={handleMultiSelectChange}
            value={values?.subMenu}
          />
          <Input
            name="order"
            placeholder=""
            value={values.order}
            lable="Display Order"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            className="form-control"
            onChange={handleChange}
          />


          <div className="col-xl-3 col-md-4 col-sm-6 col-12 ">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Mapping
            </button>
            
      
          {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12 text-end"> */}
            <button className="btn btn-sm btn-primary ml-2" onClick={getMapping}>
              Get Mapping
            </button>
          {/* </div> */}
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <Tables
          thead={[
            { name: "module Name" },
            { name: "SubMenu Name" },
            { name: "Display Order" },
            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            moduleName: item.moduleName,
            subMenuName: item.subMenuName,
            displayOrder: item.displayOrder == "0" ? "0" : item.displayOrder,

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
