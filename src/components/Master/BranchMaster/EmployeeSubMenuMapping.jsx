import React, { useEffect, useState } from "react";
import Tables from "../../UI/customTable";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/utils";
import { createEmployeeSubmenuMappingBulk, MenuCreatebulk, MenuManagmentgetsubmenus } from "../../../networkServices/MenuMaster";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { GetAllBranches } from "../../../networkServices/AcademicYear";

const EmployeeSubMenuMapping = () => {
  const localData = useLocalStorage("userData", "get");
  const initialData = {
    employeeId: null,
    employeeName: "",
    subMenuId: null,
    subMenuName: "",
    branchId: null,
    orgId: localData?.OrganizationId
  };
  const [branch, setBranch] = useState([]);
  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
 const [subMenu, setSubMenu] = useState([]);
  /* ================= OPTIONS ================= */
  const employeeList = [
    { label: "Rahul Sharma", value: "EMP001" },
    { label: "Ankit Verma", value: "EMP002" }
  ];

  const subMenuList = [
    { label: "Student Master", value: "SUB001" },
    { label: "Fee Master", value: "SUB002" }
  ];

  const branchList = [
    { label: "Main Branch", value: "BR001" },
    { label: "City Branch", value: "BR002" }
  ];

  const getBranch = async () => {
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
   const GetSubMenus = async () => {
            const payload =
            {
                "searchText": "",
                "isAll": 1,
                "orgId": values?.orgId,
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
  const handleSelect = (name, option) => {
    if (name === "employeeId") {
      setValues(prev => ({
        ...prev,
        employeeId: option,
        employeeName: option.label
      }));
    }

    if (name === "subMenuId") {
      setValues(prev => ({
        ...prev,
        subMenuId: option,
        subMenuName: option.label
      }));
    }

    if (name === "branchId") {
      setValues(prev => ({
        ...prev,
        branchId: option
      }));
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!values.employeeId || !values.subMenuId) {
      notify("Employee & SubMenu required", "error");
      return;
    }

    const payload = [
      {
        employeeId: values.employeeId.value,
        employeeName: values.employeeName,
        subMenuId: values.subMenuId.value,
        subMenuName: values.subMenuName,
        branchId: values.branchId?.value,
        orgId: values.orgId
      }
    ];
    try {
      const res = await createEmployeeSubmenuMappingBulk(payload);
      if (res?.success) {
        
        setValues(initialData);
        notify("Saved Successfully", "success");
      } else {
        notify(res?.message, "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (index) => {
    const data = [...tableData];
    data.splice(index, 1);
    setTableData(data);
  };

  useEffect(() => {
    GetSubMenus();
    getBranch();
  }, []);

  return (
    <>
      <div className="card p-2">
        <Heading title="Employee SubMenu Mapping" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2">
          <ReactSelect
            placeholderName="Employee"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="employeeId"
            dynamicOptions={employeeList}
            handleChange={handleSelect}
            value={values.employeeId}
          />

          <ReactSelect
            placeholderName="Sub Menu"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="subMenuId"
            dynamicOptions={subMenu?.map(item => ({ label: item.name, value: item.id }))}
            handleChange={handleSelect}
            value={values.subMenuId}
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
          {/* <ReactSelect
            placeholderName="Branch"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="branchId"
            dynamicOptions={branchList}
            handleChange={handleSelect}
            value={values.branchId}
          /> */}

          <div className="col-12 text-end mt-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <Tables
          thead={[
            { name: "Employee" },
            { name: "Sub Menu" },
            { name: "Branch" },
            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            employee: item.employeeName,
            submenu: item.subMenuName,
            branch: item.branchId,
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

export default EmployeeSubMenuMapping;

