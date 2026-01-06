import React, { useState } from "react";
import Input from "../../formComponent/Input";
import Tables from "../../UI/customTable";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/utils";
import { MenuCreatebulk } from "../../../networkServices/MenuMaster";

const ModuleSubMenuMap = () => {
  const initialData = {
    moduleId: null,
    moduleName: "",
    subMenuId: null,
    subMenuName: "",
    icon: "",
    displayOrder: "",
    branchId: null,
    orgId: "ORG001"
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);

  /* ================= OPTIONS ================= */
  const moduleList = [
    { label: "Master Module", value: "MOD001" },
    { label: "Academic Module", value: "MOD002" }
  ];

  const subMenuList = [
    { label: "Subject Menu", value: "SUB001" },
    { label: "Exam Menu", value: "SUB002" }
  ];

  const branchList = [
    { label: "Main Branch", value: "BR001" },
    { label: "City Branch", value: "BR002" }
  ];

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, option) => {
    setValues((prev) => ({ ...prev, [name]: option }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!values.moduleId || !values.subMenuId) {
      notify("Module & SubMenu required", "error");
      return;
    }

    const payload = [
      {
        moduleId: values.moduleId.value,
        moduleName: values.moduleId.label,
        subMenuId: values.subMenuId.value,
        subMenuName: values.subMenuId.label,
        icon: values.icon,
        displayOrder: Number(values.displayOrder),
        branchId: values.branchId?.value,
        orgId: values.orgId
      }
    ];

    console.log("FINAL PAYLOAD 👉", payload);

    try {
      const res = await MenuCreatebulk(payload);
      if (res?.success) {
        setTableData((prev) => [...prev, payload[0]]);
        setValues(initialData);
        notify("Mapping Saved Successfully", "success");
      } else {
        notify(res?.message || "Failed", "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };

  /* ================= EDIT / DELETE ================= */
  const handleEdit = (item, index) => {
    setValues({
      moduleId: moduleList.find(m => m.value === item.moduleId),
      moduleName: item.moduleName,
      subMenuId: subMenuList.find(s => s.value === item.subMenuId),
      subMenuName: item.subMenuName,
      icon: item.icon,
      displayOrder: item.displayOrder,
      branchId: branchList.find(b => b.value === item.branchId),
      orgId: item.orgId
    });
    // Remove the old row, so on Save it updates
    const data = [...tableData];
    data.splice(index, 1);
    setTableData(data);
  };

  const handleDelete = (index) => {
    const data = [...tableData];
    data.splice(index, 1);
    setTableData(data);
  };

  return (
    <div className="card p-2">
      <Heading title="Module ↔ SubMenu Mapping" isBreadcrumb={false} />

      {/* ================= FORM ================= */}
      <div className="row p-2 g-2">

        <ReactSelect
          placeholderName="Module"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="moduleId"
          dynamicOptions={moduleList}
          handleChange={handleSelect}
          value={values.moduleId}
             className="form-control"
        />

        <ReactSelect
          placeholderName="SubMenu"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="subMenuId"
          dynamicOptions={subMenuList}
          handleChange={handleSelect}
          value={values.subMenuId}
             className="form-control"
        />

        <Input
          type="text"
          name="icon"
          value={values.icon}
          lable="Icon (fa-solid fa-user)"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
             className="form-control"
        />

        <Input
          type="number"
          name="displayOrder"
          value={values.displayOrder}
          lable="Display Order"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
             className="form-control"
        />

        <ReactSelect
          placeholderName="Branch"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="branchId"
          dynamicOptions={branchList}
          handleChange={handleSelect}
          value={values.branchId}
             className="form-control"
        />

        <div className="col-12 text-end mt-2">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <Tables
        thead={[
          { name: "Module" },
          { name: "SubMenu" },
          { name: "Icon" },
          { name: "Order" },
          { name: "Branch" },
          { name: "Action" }
        ]}
        tbody={tableData.map((item, index) => ({
          module: item.moduleName,
          subMenu: item.subMenuName,
          icon: <i className={`${item.icon} me-2`}></i>,
          Order: item.displayOrder,
          branch: branchList.find(b => b.value === item.branchId)?.label || "",
          action: (
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-warning"
                onClick={() => handleEdit(item, index)}
              >
                ✏️
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(index)}
              >
                🗑️
              </button>
            </div>
          )
        }))}
      />
    </div>
  );
};

export default ModuleSubMenuMap;
