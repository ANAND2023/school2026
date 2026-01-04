import React, { useState } from "react";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/utils";
import { MenuCreatebulk } from "../../../networkServices/MenuMaster";

const SubMenuBulk = () => {
  const initialData = {
    menuId: null,
    name: "",
    code: "",
    pageUrl: "",
    icon: "",
    displayOrder: "",
    branchId: null,
    orgId: "ORG001"
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);

  /* ================= OPTIONS ================= */
  const menuList = [
    { label: "Master Menu", value: "MENU001" },
    { label: "Academic Menu", value: "MENU002" }
  ];

  const branchList = [
    { label: "Main Branch", value: "BR001" },
    { label: "City Branch", value: "BR002" }
  ];

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, option) => {
    setValues(prev => ({ ...prev, [name]: option }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!values.menuId || !values.name || !values.code) {
      notify("Menu, Name & Code required", "error");
      return;
    }

    const payload = [
      {
        menuId: values.menuId.value,
        name: values.name,
        code: values.code,
        pageUrl: values.pageUrl,
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
        setTableData(prev => [...prev, payload[0]]);
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

  return (
    <>
      <div className="card p-2">
        <Heading title="Sub Menu Master" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2">
          <ReactSelect
            placeholderName="Parent Menu"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="menuId"
            dynamicOptions={menuList}
            handleChange={handleSelect}
            value={values.menuId}
          />

          <Input
            type="text"
            name="name"
            value={values.name}
            lable="Sub Menu Name"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <Input
            type="text"
            name="code"
            value={values.code}
            lable="Code"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <Input
            type="text"
            name="pageUrl"
            value={values.pageUrl}
            lable="Page URL"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <Input
            type="text"
            name="icon"
            value={values.icon}
            lable="Icon"
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
          />

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
            { name: "Menu" },
            { name: "Name" },
            { name: "Code" },
            { name: "URL" },
            { name: "Order" },
            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            menu: item.menuId,
            name: item.name,
            code: item.code,
            url: item.pageUrl,
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
    </>
  );
};

export default SubMenuBulk;
