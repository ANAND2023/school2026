import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import Tables from "../../UI/customTable";
import Heading from "../../UI/Heading";
import {
  EmployeeBranchMapping,
  GetAllBranches,
  ModuleEmployeeBranchMapping
} from "../../../networkServices/AcademicYear";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { MenuManagmentGeModuleBulk } from "../../../networkServices/MenuMaster";
import { GetAllUsers } from "../../../networkServices/Admin";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import MultiSelectComp from "../../formComponent/MultiSelectComp";
import { useTranslation } from "react-i18next";


const ModuleEmployeeMapping = () => {
  const localData = useLocalStorage("userData", "get");
  console.log("localData", localData)
  const initialData = {
    employeeId: null,
    employeeName: "",
    moduleId: null,
    module: [],
    moduleName: "",
   
    orgId: localData?.OrganizationId
  };
  const [t] = useTranslation();
  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [module, setModule] = useState([]);
  const [allUser, setAllUser] = useState([]);


  const handleSelect = (name, option) => {
    setValues((prev) => ({
      ...prev,
      [name]: option,

    }));
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({ ...values, [name]: selectedOptions });
  };

  const handleSave = async () => {
    
    if (!values.module ) {
      notify("Employee, Module ", "error");
      return;
    }

    const payload =

      values?.module?.length > 0 ? values?.module.map((mod) => ({
        "employeeId": values?.employeeId?.value ?? "",
        "employeeName": values?.employeeId?.label ?? "",
        "moduleId": mod?.code ?? "",
        "moduleName": mod?.name ?? "",
        "branchId": localData?.defaultCentre ?? "",
        "orgId": localData?.OrganizationId

      })) : []

    try {
      const res = await ModuleEmployeeBranchMapping(payload);

      if (res?.success) {
        notify(res?.message, "success");
        setValues(initialData);
      } else {
        notify(res?.message || res?.data?.message, "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  const getModuleBulk = async () => {

debugger
    const payload =
    {
      "searchText": "",
      "isAll": 1,
        "branchId": localData?.defaultCentre ?? "",
        "orgId": localData?.OrganizationId??"",
      // "orgId": "5bbf859d-9907-4117-aead-c260d030d335",
      // "branchId": "",
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
      // notify("Something went wrong", "error");
    }
  };
  
  const getAllUsers = async () => {
    const payload = {
      "pageNumber": 1,
      "pageSize": 30,
      "search": null,
      "lockedOnly": false
    }

    try {
      const res = await GetAllUsers(payload);
      if (res?.success) {
        notify(res?.message, "success");
        setAllUser(res?.data?.items || []);
      } else {
        notify(res?.message || "Failed", "error");
      }
    } catch (error) {
      // notify("Something went wrong", "error");
    }
  };

  useEffect(() => {
    // getData();
    getAllUsers();
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
        <Heading title="Employee Module Branch Mapping" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2">
          {/* <ReactSelect
            name="employeeId"
            placeholderName="Select Employee"
            dynamicOptions={employeeList}
            respclass="col-xl-3 col-md-6 col-sm-12"
            handleChange={handleSelect}
            value={values.employeeId}
          /> */}
         
          {/* <ReactSelect
            name="branchId"
            placeholderName="Select Branch"
            dynamicOptions={branch?.map((ele) => ({
              label: ele?.name,
              value: ele?.id
            }))}
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            handleChange={handleSelect}
            value={values.branchId}
          /> */}
           <ReactSelect
            name="employeeId"
            placeholderName="Select Employee"
            // dynamicOptions={allUser}
            dynamicOptions={handleReactSelectDropDownOptions(allUser, "fullName", "id")}
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            handleChange={handleSelect}
            value={values.employeeId}
          />
          {/* <ReactSelect
            name="moduleId"
            placeholderName="Select Module"
            dynamicOptions={module?.map((ele) => ({
              label: ele?.name,
              value: ele?.id
            }))}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={handleSelect}
            value={values.moduleId}
          /> */}
          <MultiSelectComp
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="module"
            id="module"
            placeholderName={t("module")}
            // dynamicOptions={module}
            dynamicOptions={module?.map((ele) => ({
              name: ele?.name,
              code: ele?.id
            }))}
            handleChange={handleMultiSelectChange}
            value={values?.module}
          />


          <div className="col-xl-3 col-md-4 col-sm-6 col-12">
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
            // { name: "Branch" },
            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            employeeName: item.employeeName,
            moduleName: item.moduleName,
            // branchId: item.branchId,
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

export default ModuleEmployeeMapping;
