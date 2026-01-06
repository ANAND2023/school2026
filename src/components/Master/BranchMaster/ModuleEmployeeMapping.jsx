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
import { MenuManagmentGeModuleBulk } from "../../../networkServices/MenuMaster";

const ModuleEmployeeMapping = () => {
  const localData = useLocalStorage("userData", "get");
  const initialData = {
    employeeId: null,
    employeeName: "",
    moduleId: null,
    moduleName: "",
    branchId: null,
    orgId: localData?.OrganizationId
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [module, setModule] = useState([]);


  const employeeList = [
    { value: "EMP001", label: "Rahul Sharma" },
    { value: "EMP002", label: "Ankit Verma" }
  ];


  const handleSelect = (name, option) => {
    if (!option) return;

    if (name === "employeeId") {
      setValues((prev) => ({
        ...prev,
        employeeId: option.value,
        employeeName: option.label
      }));
    }

    if (name === "moduleId") {
      setValues((prev) => ({
        ...prev,
        moduleId: option.value,
        moduleName: option.label
      }));
    }

    if (name === "branchId") {
      setValues((prev) => ({
        ...prev,
        branchId: option.value
      }));
    }
  };

  /* =======================
      SAVE
  ======================== */
  const handleSave = async () => {
    if (!values.employeeId || !values.moduleId || !values.branchId) {
      notify("Employee, Module & Branch required", "error");
      return;
    }

    const payload = [
      {
        employeeId: values.employeeId,
        employeeName: values.employeeName,
        moduleId: values.moduleId,
        moduleName: values.moduleName,
        branchId: values.branchId,
        orgId: values.orgId
      }
    ];

    console.log("FINAL PAYLOAD 👉", payload);

    try {
      const res = await EmployeeBranchMapping(payload);

      if (res?.success) {
        notify("Mapping saved successfully", "success");
        // setTableData((prev) => [...prev, payload[0]]);
        setValues(initialData);
      } else {
        notify(res?.message || "Failed", "error");
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
  const getData = async () => {
    const payload = {
      employeeId: "",
      organisationID: values?.orgId,
      isAll: 1
    };

    try {
      const res = await GetAllBranches(payload);
      if (res?.success) setBranch(res.data);
      else notify(res?.message, "error");
    } catch {
      notify("Error fetching branches", "error");
    }
  };

  useEffect(() => {
    getData();
    getModuleBulk();
  }, []);

  /* =======================
      DELETE
  ======================== */
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
          <ReactSelect
            name="employeeId"
            placeholderName="Select Employee"
            dynamicOptions={employeeList}
            respclass="col-xl-3 col-md-6 col-sm-12"
            handleChange={handleSelect}
            value={values.employeeId}
          />
 <ReactSelect
            name="branchId"
            placeholderName="Select Branch"
            dynamicOptions={branch?.map((ele) => ({
              label: ele?.name,
              value: ele?.id
            }))}
            respclass="col-xl-3 col-md-6 col-sm-12"
            handleChange={handleSelect}
            value={values.branchId}
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

export default ModuleEmployeeMapping;
