import React, { useEffect, useState } from "react";

import ReactSelect from "../../formComponent/ReactSelect";
import Tables from "../../UI/customTable";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/ustil2";
import { EmployeeBranchMapping, GetAllBranches } from "../../../networkServices/AcademicYear";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { GetAllUsers } from "../../../networkServices/Admin";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
// import { SaveEmployeeBranchMap } from "../../networkServices/EmployeeMaster";

const EmployeeBranchMap = () => {
  const localData = useLocalStorage("userData", "get");
  const initialData = {
    employeeId: null,
    employeeName: "",
    branchId: {},
    branchName: "",
    organisationId: localData?.OrganizationId
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [branch, setBranch] = useState([]);





  const handleSelect = (name, option) => {
    if (name === "employeeId") {
      setValues((prev) => ({
        ...prev,
        employeeId: option.value,
        employeeName: option.label
      }));
    }

    if (name === "branchId") {
      setValues((prev) => ({
        ...prev,
        branchId: option.value,
        branchName: option.label
      }));
    }
  };

  /* =======================
      SAVE
  ======================== */
  const handleSave = async () => {
    if (!values.employeeId || !values.branchId) {
      notify("Employee & Branch required", "error");
      return;
    }
    debugger

    const payload = [
      {
        employeeId: values.employeeId,
        employeeName: values.employeeName,
        branchId: values.branchId,
        branchName: values.branchName,
        organisationId: values.organisationId
      }
    ];


    try {
      const res = await EmployeeBranchMapping(payload);

      // demo success
      //   const res = { success: true };

      if (res?.success) {
        notify("Employee mapped successfully", "success");
        setTableData((prev) => [...prev, payload[0]]);
        setValues(initialData);
      } else {
        notify("Failed", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  const getData = async () => {
    const payload = {
      "employeeId": "",
      "organisationID": values?.organisationId,
      "isAll": 0
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
const getAllUsers = async () => {


    const payload = {
      "pageNumber": 1,
      "pageSize": 30,
      "search": null,
      "lockedOnly": false
    }

    try {
      const res = await GetAllUsers(payload);

      // 🔴 demo purpose (remove this block when API ready)
      //   const res = { success: true };

      if (res?.success) {
        notify(res?.message, "success");
        setAllUser(res?.data?.items || []);
        // setValues(initialData);
      } else {
        notify(res?.message || "Failed", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  useEffect(() => {
    getData();
    getAllUsers();
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
        <Heading title="Employee Branch Mapping" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2">
          <ReactSelect
            name="employeeId"
            placeholderName="Select Employee"
            // dynamicOptions={allUser}
              dynamicOptions={handleReactSelectDropDownOptions(allUser, "fullName", "id")}
            respclass="col-xl-4 col-md-6 col-sm-12"
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
            value={values.branchId}
            respclass="col-xl-4 col-md-6 col-sm-12"
            handleChange={handleSelect}
          />

          <div className="col-xl-4 col-12 text-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save Mapping
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <Tables
          thead={[
            { name: "Employee" },
            { name: "Branch" },
            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            employeeName: item.employeeName,
            branchName: item.branchName,
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

export default EmployeeBranchMap;
