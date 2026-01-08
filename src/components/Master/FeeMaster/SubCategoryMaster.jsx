import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import Tables from "../../UI/customTable";
import Heading from "../../UI/Heading";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { createcategory, GetAllCategory, GetAllSubCategory, InsertSubCategory, updatecategory, UpdateSubCategory } from "../../../networkServices/FeeMaster";
import ReactSelect from "../../formComponent/ReactSelect";

const SubCategoryMaster = () => {
  const initialData = {
    id: null,
    categoryName: {},
    displayName: "",
    subCategoryName: ""
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
   const handleSelect = (name, option) => {
    setValues((prev) => ({ ...prev, [name]: option }));
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSave = async () => {
    if (!values.displayName) {
      notify("Category Name & Display Name required", "error");
      return;
    }

    const payload = 
    {
  "categoryId": values.categoryName?.value,
  "name": values?.subCategoryName,
  "displayName": values.displayName,
}
    
const update={
    "id": values.id,
  "name":  values?.subCategoryName,
  "displayName": values.displayName,
}

    try {
      const res = isEdit
        ? await UpdateSubCategory(update)
        : await InsertSubCategory(payload);

      if (res?.success) {
        notify(res?.message, "success");
        getAllSubCategory();
        setValues(initialData);
        setIsEdit(false);
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Something went wrong", "error");
    }
  };

  const getAllCategory = async () => {
    try {
      const res = await GetAllCategory();
      if (res?.success) {
        setAllCategory(res?.data);
      }
    } catch {
      notify("Failed to load categories", "error");
    }
  };
  const getAllSubCategory = async () => {
    try {
      const res = await GetAllSubCategory();
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
    //   categoryName: item.id,
      displayName: item.displayName,
      subCategoryName: item.name,
    //   remarks: item.remarks
    });
    setIsEdit(true);
  };

  useEffect(() => {
    getAllCategory();
    getAllSubCategory();
  }, []);

  return (
    <div className="card p-2">
      <Heading title="Sub Category Master" isBreadcrumb={false} />

      {/* ================= FORM ================= */}
      <div className="row p-2">
           <ReactSelect
                    placeholderName="categoryName"
                    respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                    name="categoryName"
                    dynamicOptions={handleReactSelectDropDownOptions(allCategory, "categoryName", "id")}
                    handleChange={handleSelect}
                    value={values.categoryName}
                  />
        <Input
          name="subCategoryName"
          placeholder=""
          value={values.subCategoryName}
          lable="Sub Category Name"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
           className="form-control"
          onChange={handleChange}
        />

        <Input
          name="displayName"
          value={values.displayName}
           placeholder=""
          lable="Display Name"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
           className="form-control"
          onChange={handleChange}
        />

        

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
           { name: "Sub Category Name" },
          { name: "Display Name" },
         
          { name: "Action" }
        ]}
        tbody={tableData.map((item) => ({
          categoryName: item.categoryName,
          subCategoryName: item.name,
          displayName: item.displayName,
         
          action: (
            <button
              className="btn btn-sm btn-warning"
              onClick={() => handleEdit(item)}
            >
              ✏️
            </button>
          )
        }))}
      />
    </div>
  );
};

export default SubCategoryMaster;
