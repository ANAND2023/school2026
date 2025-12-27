import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import { notify } from "../../../utils/utils";
import {
  AddFeeStructure,
  GetAllFeeStructures,
} from "../../../networkServices/FeeMaster";
import Input from "../../formComponent/Input";

function CreateFeeStructure() {
  const [t] = useTranslation();

  /* ================= INITIAL STATE ================= */
  const initialData = {
    context: {
      orgId: "",
      branchId: "",
    },
    name: "",
    academicYearId: "",
    totalAmount: "",
    isInstallmentAllowed: false,
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
    const payload = 
    {
  "orgId": "string",
  "branchId": "string",
  "isAll": 0
}

    // {
    //   orgId: values.context.orgId,
    //   branchId: values.context.branchId,
    //   isAll: 1,
    // };

    try {
      const res = await GetAllFeeStructures(payload);
      if (res?.success) {
        setTableData(res.data);
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Error fetching fee structures", "error");
    }
  };

  useEffect(() => {
    // optional auto load after org/branch select
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (
      !values.context.orgId ||
      !values.context.branchId ||
      !values.name ||
      !values.academicYearId ||
      !values.totalAmount
    ) {
      notify("All required fields are mandatory", "error");
      return;
    }

    const payload = {
      context: values.context,
      name: values.name,
      academicYearId: values.academicYearId,
      totalAmount: Number(values.totalAmount),
      isInstallmentAllowed: Boolean(values.isInstallmentAllowed),
    };

    try {
      const res = await AddFeeStructure(payload);
      if (res?.success) {
        notify(res.message, "success");
        setValues(initialData);
        getData();
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Error saving fee structure", "error");
    }
  };

  /* ================= JSX ================= */
  return (
    <div className="card p-1">
      <Heading title={t("Create Fee Structure")} isBreadcrumb={false} />

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

        {/* ===== STRUCTURE NAME ===== */}
        <Input
          className="form-control required-fields"
          name="name"
          value={values.name}
          lable="Fee Structure Name"
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== ACADEMIC YEAR ===== */}
        <Input
          className="form-control required-fields"
          name="academicYearId"
          value={values.academicYearId}
          lable="Academic Year Id"
          respclass="col-xl-3 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== TOTAL AMOUNT ===== */}
        <Input
          className="form-control required-fields"
          type="number"
          name="totalAmount"
          value={values.totalAmount}
          lable="Total Amount"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
        />

        {/* ===== INSTALLMENT ===== */}
        <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex align-items-center mt-4">
          <input
            type="checkbox"
            checked={values.isInstallmentAllowed}
            onChange={handleChange}
            name="isInstallmentAllowed"
            className="mr-2"
          />
          <label className="mb-0 ml-2">
            {t("Installment Allowed")}
          </label>
        </div>

        {/* ===== BUTTON ===== */}
        <div className="col-12 text-right mt-3">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            {t("Save Fee Structure")}
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <Tables
        thead={[
          { name: "Name" },
          { name: "Academic Year" },
          { name: "Total Amount" },
          { name: "Installment" },
        ]}
        tbody={tableData?.map((item) => ({
          Name: item?.name,
          "Academic Year": item?.academicYearId,
          "Total Amount": item?.totalAmount,
          Installment: item?.isInstallmentAllowed ? "Yes" : "No",
        }))}
      />
    </div>
  );
}

export default CreateFeeStructure;
