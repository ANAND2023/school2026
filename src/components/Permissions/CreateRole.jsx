import React, { useEffect, useState } from "react";

import Tables from "../UI/customTable";
import Heading from "../UI/Heading";
import { notify } from "../../utils/utils";
import { createcategory, GetAllCategory, updatecategory } from "../../networkServices/FeeMaster";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import Input from "../formComponent/Input";
import { RolesCreateRole } from "../../networkServices/Admin";

const CreateRole = () => {

  const localData = useLocalStorage("userData", "get");
  const initialData = {
    id: null,
    RoleName: "",
    Description: "",
    remarks: ""
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSave = async () => {
    if (!values.RoleName || !values.Description) {
      notify("Category Name & Display Name required", "error");
      return;
    }

    const payload = {
        
  "name":  values.RoleName,
  "description": values.Description,

    //   RoleName: values.RoleName,
    //   Description: values.Description,
    //   remarks: values.remarks,
    //   OrgId: localData?.OrganizationId,
    //   BranchId: localData?.defaultCentre
    };

    try {
      const res = isEdit
        ? await updatecategory({ id: values.id, ...payload })
        : await RolesCreateRole(payload);

      if (res?.success) {
        notify(res?.message, "success");
        getAllCategory();
        setValues(initialData);
        setIsEdit(false);
      } else {
        notify(res?.data?.message, "error");
      }
    } catch {
      notify("Something went wrong", "error");
    }
  };

  const getAllCategory = async () => {
    try {
      const res = await GetAllCategory(localData?.OrganizationId, localData?.defaultCentre);
      if (res?.success) {
        setTableData(res?.data);
      }
    } catch {
      notify("Failed to load categories", "error");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setValues({
      id: item.id,
      RoleName: item.RoleName,
      Description: item.Description,
      remarks: item.remarks
    });
    setIsEdit(true);
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <div className="card">
      <Heading title="Category Master" isBreadcrumb={false} />

      {/* ================= FORM ================= */}
      <div className="row p-2">
        <Input
          name="RoleName"
          placeholder=""
          value={values.RoleName}
          lable="Role Name"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
           className="form-control"
          onChange={handleChange}
        />

        <Input
          name="Description"
          value={values.Description}
           placeholder=""
          lable="Description"
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
           className="form-control"
          onChange={handleChange}
        />
{/* 
        <Input
          name="remarks"
          value={values.remarks}
          lable="Remarks"
          // respclass="col-xl-2 col-md-4 col-sm-6 col-12"
           respclass="col-md-4"
           className="form-control"
          onChange={handleChange}
        /> */}

        <div
         className="col-xl-1 col-md-4 col-sm-6 col-12 text-end">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <Tables
        thead={[
          { name: "Category Name" },
          { name: "Display Name" },
          { name: "Remarks" },
          { name: "Action" }
        ]}
        tbody={tableData.map((item) => ({
          RoleName: item.RoleName,
          Description: item.Description,
          remarks: item.remarks,
          action: <>

              <div
                className="d-flex align-items-center justify-content-center gap-2"
              // className="row gap-2"
              >
                <button
                  id="editBtn"
                  onclick="handleEdit(item.id)"
                  title="Edit"
                  className="d-flex align-items-center justify-content-center"
                >
                  <i class=" bi-pencil-square"></i>
                </button>

                <button
                  id="deleteBtn"
                  onclick="handleDelete(item.id)"
                  title="Delete"
                >
                  <i class="bi-trash3"></i>
                </button>
              </div>

            </>,
        }))}
      />
    </div>
  );
};

export default CreateRole;
