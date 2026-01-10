import React, { useEffect, useState } from "react";
import Tables from "../../UI/customTable";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { createEmployeeSubmenuMappingBulk, MenuCreatebulk, MenuManagmentgetsubmenus } from "../../../networkServices/MenuMaster";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { GetAllBranches } from "../../../networkServices/AcademicYear";
import { GetAllUsers } from "../../../networkServices/Admin";

const EmployeeSubMenuMapping = () => {
  const localData = useLocalStorage("userData", "get");
  const initialData = {
    employeeId: {},

    subMenuId: {},
  
    branchId: {},
    orgId: localData?.OrganizationId
  };
  const [branch, setBranch] = useState([]);
  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
 const [subMenu, setSubMenu] = useState([]);
 const [allUser, setAllUser] = useState([]);
 

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
          setValues(prev => ({
        ...prev,
        [name]: option,
       
      }));
    // if (name === "employeeId") {
    //   setValues(prev => ({
    //     ...prev,
    //     employeeId: option,
    //     employeeName: option.label
    //   }));
    // }

    // if (name === "subMenuId") {
    //   setValues(prev => ({
    //     ...prev,
    //     subMenuId: option,
    //     subMenuName: option.label
    //   }));
    // }

    // if (name === "branchId") {
    //   setValues(prev => ({
    //     ...prev,
    //     branchId: option
    //   }));
    // }
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
        employeeName: values.employeeId?.label,
        subMenuId: values.subMenuId.value,
        subMenuName: values.subMenuId?.label,
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
      notify("Something went wrong", "error");
    }
  };
  useEffect(() => {
    GetSubMenus();
    getAllUsers();
    getBranch();
  }, []);

  return (
    <>
      <div className="card p-2">
        <Heading title="Employee SubMenu Mapping" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2">
          {/* <ReactSelect
            placeholderName="Employee"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="employeeId"
            dynamicOptions={employeeList}
            handleChange={handleSelect}
            value={values.employeeId}
          /> */}

<ReactSelect
            name="employeeId"
            placeholderName="Select Employee"
            // dynamicOptions={allUser}
            dynamicOptions={handleReactSelectDropDownOptions(allUser, "fullName", "id")}
           respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={handleSelect}
            value={values.employeeId?.value}
          />
          <ReactSelect
            placeholderName="Sub Menu"
            respclass="col-xl-3 col-md-4 col-sm-6 col-12"
            name="subMenuId"
            dynamicOptions={subMenu?.map(item => ({ label: item.name, value: item.id }))}
            handleChange={handleSelect}
            value={values.subMenuId?.value}
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
            value={values.branchId?.value}
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

