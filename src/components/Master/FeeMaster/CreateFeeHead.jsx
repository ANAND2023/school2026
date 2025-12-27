import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import { notify } from "../../../utils/utils";
import {
 
    AddFeeHead,
  GetAllFeeHeads,
} from "../../../networkServices/FeeMaster";
import Input from "../../formComponent/Input";

function CreateFeeHead() {
  const [t] = useTranslation();

  /* ================= INITIAL STATE ================= */
  const initialData = {
    context: {
      orgId: "",
      branchId: "",
    },
    name: "",
    code: "",
    description: "",
    isRefundable: false,
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e, parent = null) => {
    const { name, value, type, checked } = e.target;

    if (parent) {
      setValues((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [name]: value,
        },
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  /* ================= GET DATA ================= */
  const getData = async () => {
    const payload = {
      orgId: values.context.orgId,
      branchId: values.context.branchId,
      isAll: 1,
    };

    try {
      const res = await GetAllFeeHeads(payload);
      if (res?.success) {
        setTableData(res.data);
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Error fetching fee heads", "error");
    }
  };

  useEffect(() => {
    // optional auto-load
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!values.name || !values.code) {
      notify("Fee Head Name & Code are required", "error");
      return;
    }

    const payload = {
      context: values.context,
      name: values.name,
      code: values.code,
      description: values.description,
      isRefundable: Boolean(values.isRefundable),
    };

    try {
      const res = await AddFeeHead(payload);
      if (res?.success) {
        notify(res.message, "success");
        setValues(initialData);
        getData();
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Error saving fee head", "error");
    }
  };

  /* ================= JSX ================= */
  return (
    <div className="card p-1">
      <Heading title={t("Create Fee Head")} isBreadcrumb={false} />

      <div className="row p-2">
        {/* ===== CONTEXT ===== */}
        <Input
          className="form-control required-fields"
          name="orgId"
          value={values.context.orgId}
          lable="Organization Id"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={(e) => handleChange(e, "context")}
        />

        <Input
          className="form-control required-fields"
          name="branchId"
          value={values.context.branchId}
          lable="Branch Id"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={(e) => handleChange(e, "context")}
        />

        {/* ===== NAME ===== */}
        <Input
          className="form-control required-fields"
          name="name"
          value={values.name}
          lable="Fee Head Name"
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== CODE ===== */}
        <Input
          className="form-control required-fields"
          name="code"
          value={values.code}
          lable="Fee Head Code"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== DESCRIPTION ===== */}
        <Input
          className="form-control"
          name="description"
          value={values.description}
          lable="Description"
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== IS REFUNDABLE ===== */}
        <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex align-items-center mt-4">
          <input
            type="checkbox"
            checked={values.isRefundable}
            onChange={handleChange}
            name="isRefundable"
            className="mr-2"
          />
          <label className="mb-0 ml-2">
            {t("Is Refundable")}
          </label>
        </div>

        {/* ===== BUTTON ===== */}
        <div className="col-12 text-right mt-3">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            {t("Save Fee Head")}
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <Tables
        thead={[
          { name: "Name" },
          { name: "Code" },
          { name: "Refundable" },
        ]}
        tbody={tableData?.map((item) => ({
          Name: item?.name,
          Code: item?.code,
          Refundable: item?.isRefundable ? "Yes" : "No",
        }))}
      />
    </div>
  );
}

export default CreateFeeHead;

