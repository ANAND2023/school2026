import React, { useState } from "react";
import Input from "../../formComponent/Input";
import Tables from "../../UI/customTable";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/utils";
import { MenuCreatebulk } from "../../../networkServices/MenuMaster";

const ModuleEmployeeMap = () => {
  const initialData = {
    name: "",
    code: "",
    description: "",
    icon: "",
    displayOrder: "",
    branchId: null,
    orgId: "ORG001"
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);

  /* ================= OPTIONS ================= */
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
    if (!values.name || !values.code) {
      notify("Name & Code required", "error");
      return;
    }

    const payload = [
      {
        name: values.name,
        code: values.code,
        description: values.description,
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
        notify("Module Saved Successfully", "success");
      } else {
        notify(res?.message || "Failed", "error");
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

  return (
    <div className="card p-2">
      <Heading title="Module Master" isBreadcrumb={false} />

      {/* ================= FORM ================= */}
      <div className="row p-2 g-2">

        <Input
          type="text"
          name="name"
          value={values.name}
          lable="Module Name"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
           className="form-control"
        />

        <Input
          type="text"
          name="code"
          value={values.code}
          lable="Module Code"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
           className="form-control"
        />

        <Input
          type="text"
          name="description"
          value={values.description}
          lable="Description"
          respclass="col-xl-3 col-md-6 col-sm-12 col-12"
          onChange={handleChange}
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
          respclass="col-xl-1 col-md-4 col-sm-6 col-12"
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
          { name: "Name" },
          { name: "Code" },
          { name: "Description" },
          { name: "Icon" },
          { name: "Order" },
          { name: "Action" }
        ]}
        tbody={tableData.map((item, index) => ({
          name: item.name,
          code: item.code,
          description: item.description,
          icon: <i className={`${item.icon} me-2`}></i>,
          Order: item.displayOrder,
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
  );
};

export default ModuleEmployeeMap;
