import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import Modal from "../../../components/modalComponent/Modal";
import { notify } from "../../../utils/utils";
import { AddBankAccount,GetAllBankAccounts } from "../../../networkServices/FeeMaster";
import Input from "../../formComponent/Input";
import { getEmployeeWise } from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useSelector } from "react-redux";
import ReactSelect from "../../formComponent/ReactSelect";


function CreateBankAccount() {
      const dispatch = useDispatch();
  const localData = useLocalStorage("userData", "get");
    const { GetEmployeeWiseCenter, GetMenuList, GetRoleList } = useSelector(
      (state) => state?.CommonSlice
    );
  const [t] = useTranslation();

  /* ================= INITIAL DATA (BANK PAYLOAD) ================= */
  const initialData = {
    context: {
      orgId: "5bbf859d-9907-4117-aead-c260d030d335",
      branchId: "",
    },
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    isDefault: false,
    branchId: {value:"3436b5be-7dd9-43b0-9de8-82d80d8c4683"}
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});

  /* ================= HANDLE CHANGE ================= */
      const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        if(name==="branchId"){
          getData(value?.value)}

    };
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

  /* ================= API ================= */
  const getData = async (branchId) => {
    const payload={
  "orgId": values?.context.orgId??"5bbf859d-9907-4117-aead-c260d030d335",
  "branchId": values?.branchId?.value??branchId,
  "isAll": 1
}
    try {
      const res = await GetAllBankAccounts(payload);
      if (res?.success) setTableData(res.data);
      else notify(res?.message, "error");
    } catch {
      notify("Error fetching bank accounts", "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const payload =
    {
  "context": {
    "orgId": values?.context.orgId,
    "branchId": values?.branchId?.value
  },
  "bankName": values?.bankName,
  "accountNumber": values?.accountNumber,
  "ifscCode": values?.ifscCode,
  "branchName": values?.branchName,
  "isDefault": Boolean(values.isDefault),
}
    
    
    // {
    //   ...values,
    //   isDefault: Boolean(values.isDefault),
    // };

    try {
      const res = await AddBankAccount(payload);
      if (res?.success) {
        notify(res.message, "success");
        setValues(initialData);
        getData();
      } else {
        notify(res?.message, "error");
      }
    } catch {
      notify("Error saving bank account", "error");
    }
  };

  const setIsOpen = () => {
    setHandleModelData((v) => ({ ...v, isOpen: false }));
  };
   useEffect(() => {
    if (localData?.UserId) {
      dispatch(getEmployeeWise({ 
        employeeId: localData?.UserId,
        OrganizationId: localData?.OrganizationId
      }));
    }
  }, [dispatch]);
  /* ================= JSX ================= */
  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          modalData={modalData}
          setModalData={setModalData}
        >
          {handleModelData?.Component}
        </Modal>
      )}

      <div className="card p-1">
        <Heading title={t("Create Bank Account")} isBreadcrumb={false} />

        <div className="row p-2">
          {/* ===== CONTEXT ===== */}
          <Input
            className="form-control required-fields"
            name="orgId"
            value={values.context.orgId}
            lable="Organization Id"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={(e) => handleChange(e, "context")}
          />
<ReactSelect
                        placeholderName="Branch"
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="branchId"
                        // dynamicOptions={branchList}
                        dynamicOptions={GetEmployeeWiseCenter?.map((ele) => ({
                            value: ele.id,
                            label: ele.name
                        }))}
                        handleChange={handleSelect}
                        value={values.branchId}
                        className="form-control"
                    />
        
          <Input
            className="form-control required-fields"
            name="bankName"
            value={values.bankName}
            lable="Bank Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
          />

          <Input
            className="form-control required-fields"
            name="accountNumber"
            value={values.accountNumber}
            lable="Account Number"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
          />

          <Input
            className="form-control required-fields"
            name="ifscCode"
            value={values.ifscCode}
            lable="IFSC Code"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
          />

          <Input
            className="form-control"
            name="branchName"
            value={values.branchName}
            lable="Bank Branch Name"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            onChange={handleChange}
          />

          {/* ===== DEFAULT ===== */}
          <div className="col-xl-2 col-md-4 col-sm-4 col-12 d-flex align-items-center mt-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={values.isDefault}
              onChange={handleChange}
              name="isDefault"
            />
            <label className="mb-0 ml-2">{t("Is Default")}</label>
          </div>

          {/* ===== BUTTON ===== */}
          <div className="col-12 text-right">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              {t("Save Bank Account")}
            </button>
          </div>
        </div>

        {/* ===== TABLE ===== */}

       <Tables
    thead={[
        { name: "ORG" },
        { name: "Branch" },
        { name: "Bank Name" },
        { name: "Account No" },
        { name: "IFSC Code" },
        { name: "Bank Branch" },
        { name: "Default" },
        { name: "Action" }
    ]}
    tbody={tableData.map((item) => ({
        orgName: item.context?.orgName,
        branch: item.context?.branchName,
        bankName: item.bankName,
        accountNumber: item.accountNumber,
        ifscCode: item.ifscCode,
        branchName: item.branchName,
        isDefault: item.isDefault ? (
            <span className="badge bg-success">Yes</span>
        ) : (
            <span className="badge bg-secondary">No</span>
        ),
        action: (
            <div className="d-flex gap-2">
                <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(item.rawData)}
                >
                    ✏️
                </button>
                <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.rawData.id)}
                >
                    🗑️
                </button>
            </div>
        )
    }))}
/>

        {/* <Tables
          thead={[{ name: "Bank Name" }, { name: "Account No" }, { name: "Action" }]}
          tbody={tableData?.map((item) => ({
            "Bank Name": item?.bankName,
            "Account No": item?.accountNumber,
            action: (
              <div className="row gap-2">
                <button className="btn btn-sm">
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button className="btn btn-sm">
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            ),
          }))}
        /> */}
      </div>
    </>
  );
}

export default CreateBankAccount;

