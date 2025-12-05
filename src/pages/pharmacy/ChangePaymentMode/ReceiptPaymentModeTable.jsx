import React, { useEffect, useState } from "react";
import Tables from "../../../components/UI/customTable";
import { Tooltip } from "primereact/tooltip";
import { useTranslation } from "react-i18next";
import {
  BindPaymentModePanelWise,
  getBankMaster,
} from "../../../networkServices/PaymentGatewayApi";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { PharmacyPharmacyIssueResetAmount, UpdatePaymentModeApi } from "../../../networkServices/pharmecy";
import Input from "../../../components/formComponent/Input";
import Modal from "../../../components/modalComponent/Modal";

const ReceiptReprintTable = (props) => {
  const { tbody, isUpdateMode, SearchBillPrintAPI, handleCustomSelect } = props;
  const [t] = useTranslation();
  const [modalHandlerState, setModalHandlerState] = useState({
    header: null,
    show: false,
    size: null,
    component: null,
    footer: null,
    modalData: null,
  });

  const [clearAmoutReason, setClearAmoutReason] = useState('');

  const [paymentMode, setPaymentMode] = useState({});
  const [bankName, setBankName] = useState("");
  const [refNo, setRefNo] = useState("");
  const [Remarks, setRemarks] = useState("");

  const [bodyData, setBodyData] = useState(tbody);
  const [selectedData, setSelectedData] = useState();
  const [dropDownState, setDropDownState] = useState({
    ListPaymentmode: [],
    ListBankMaster: [],
  });

  useEffect(() => {
    setBodyData(tbody);
  }, [tbody]);

  const BindPaymentModeDetail = async () => {
    try {
      const res = await BindPaymentModePanelWise({ PanelID: 1 });

      if (res?.success) {
        const filtered = res?.data?.filter(
          (item) =>
            item?.PaymentMode !== "Credit" &&
            item?.PaymentMode !== "Patient-Advance"
        );

        setDropDownState((val) => ({
          ...val,
          ListPaymentmode: handleReactSelectDropDownOptions(
            filtered,
            "PaymentMode",
            "PaymentModeID"
          ),
        }));
      }
    } catch (error) {
      console.log("Error fetching payment modes:", error);
    }
  };

  const fetchGetBankMaster = async () => {
    try {
      const res = await getBankMaster();

      if (res?.success) {
        setDropDownState((prev) => ({
          ...prev,
          ListBankMaster: handleReactSelectDropDownOptions(
            res?.data,
            "BankName",
            "Bank_ID"
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to load bank master data:", error);
    }
  };

  useEffect(() => {
    BindPaymentModeDetail();
    fetchGetBankMaster();
  }, []);

  const handleChangePaymentMode = (name, e) => {
    console.log("Selected Payment Mode:", e);
    setPaymentMode(e);

    const lowerCaseMode = e?.label?.toLowerCase();

    if (["upi", "online payment"].includes(lowerCaseMode)) {
      setBankName(null);
    }
  };


  const handleChangeBankName = (name, e) => {
    console.log("Selected Bank Name:", e);
    setBankName(e);
  };

  const handleInput = (e) => {
    debugger
    const { name, value } = e.target;
    if (name === "Remarks") {
      setRemarks(value);
      return;
    }
    console.log("Ref No Input:", value);
    setRefNo(value);
  };

  const UpdateReceiptApi = async () => {
    if (Remarks?.length === 0) return notify("Kindly Enter Remarks", "error");
    const payload = {
      receiptpaymentdetailRowID: selectedData?.ReceiptpaymentdetailRowID,
      receiptID: selectedData?.ReceiptpaymentdetailRowID || 0,
      receiptNo: selectedData?.ReceiptNo || "",
      newPaymentModeID: paymentMode?.PaymentModeID || 0,
      newPaymentMode: paymentMode?.PaymentMode || "",
      newBankName: bankName?.BankName || "",
      newRefNo: refNo || "",
      oldPaymentModeID: paymentMode?.PaymentModeID || 0,
      oldPaymentMode: selectedData?.PaymentMode || "",
      oldBankName: selectedData?.BankName || "",
      oldRefNo: refNo?.RefNo || "",
      ledgerTransactionNo: selectedData?.LedgerTransactionNo || "",
      ledgerNoDr: selectedData?.LedgerNoDr || "",
      amount: selectedData?.Amount || 0,
      ChangeRemark: Remarks || "",
    };

    try {
      const res = await UpdatePaymentModeApi(payload);
      if (res?.success) {
        SearchBillPrintAPI();
        notify("Updated Successfully", "success");
        setPaymentMode("");
        setBankName("");
        setRefNo("");
        setRemarks("")
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  const handleReset = async (reason,ele) => {
    debugger
    if(reason?.length === 0 || !reason) return notify("Kindly Enter Reset reason","error")
    const payload = {
      "receiptpaymentdetailRowID": Number(ele?.ReceiptpaymentdetailRowID),
      "receiptNo": String(ele?.ReceiptNo),
      "ResetRemark": reason || ""
    }
    try {

      const response = await PharmacyPharmacyIssueResetAmount(payload)
      if (response?.success) {
        notify(response?.message, "success")
        SearchBillPrintAPI()
        setModalHandlerState({
              show: false,
              component: null,
              size: null,
              modalData: "",
            })
      }
      else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  console.log(clearAmoutReason, "clearAmoutReason")
  const clearAmtModal = (ele) => {
    setModalHandlerState(
      {
        header: t("Clear Amt"),
        show: true,
        size: "20vw",
        api: (modalData) => handleReset(modalData,ele),
        // footer: <></>,
      }
    )

  }

  const THEAD = [
    t("SrNo"),
    t("Receipt No"),
    t("Date"),
    t("Payment Mode"),
    t("Amount"),
    t("Bank Name"),
    t("Ref No"),
    t("Select"),
  ];

  return (
    <>

      {modalHandlerState?.show && (
        <Modal
          visible={modalHandlerState?.show}
          setVisible={() =>
            setModalHandlerState({
              show: false,
              component: null,
              size: null,
              modalData: "",
            })

          }
          modalWidth={modalHandlerState?.size}
          Header={modalHandlerState?.header}
          footer={modalHandlerState?.footer}
          handleAPI={modalHandlerState?.api}
          modalData={modalHandlerState?.modalData}
        >
          <div className="row">
            <Input
              lable={t("Reason")}
              className="form-control required-fields"
              id="Reason"
              name="Reason"
              value={modalHandlerState?.modalData}
              onChange={(e) => setModalHandlerState({ ...modalHandlerState, modalData: e.target.value })}
              respclass={"col-xl-12 col-md-12 col-sm-12 col-12"}
            />
          </div>
        </Modal>
      )}
      {bodyData?.map((item, index) => (
        <Tooltip
          key={index}
          target={`#doctorName-${index}, #visitType-${index}`}
          position="top"
        />
      ))}

      <Tables
        thead={THEAD}
        tbody={bodyData?.map((ele, index) => ({
          "Sr. No.": index + 1,
          ReceiptNo: ele?.ReceiptNo,
          Date: ele?.ReceiptDateTime,
          PaymentMode: ele?.PaymentMode,
          Amount: ele?.Amount === 0 ? "0" : ele?.Amount,
          BankName: ele?.BankName,
          RefNo: ele?.RefNo,
          select: (
            <>
              <span
                onClick={() => {
                  setSelectedData(ele);

                  setPaymentMode(
                    dropDownState.ListPaymentmode.find(
                      (pm) => pm.label === ele.PaymentMode
                    ) || null
                  );
                  setBankName(
                    dropDownState.ListBankMaster.find(
                      (b) =>
                        b.label?.toLowerCase().trim() ===
                        ele.BankName?.toLowerCase().trim()
                    ) || null
                  );


                  setRefNo(ele.RefNo || "");
                }}
              >
                <i className="fa fa-edit text-center" aria-hidden="true"></i>
              </span>
              {
                ele?.RecieptType === "IPD" && <button className="btn btn-primary save-button mx-2" onClick={() => clearAmtModal(ele)


                }>
                  Clear Amt
                </button>
              }

            </>
          ),
        }))}
        style={{ maxHeight: "60vh" }}
      />

      {selectedData && (
        <div className="row p-2">
          <ReactSelect
            placeholderName={"PaymentMode"}
            id="type"
            inputId="type"
            name="PaymentMode"
            handleChange={handleChangePaymentMode}
            searchable={true}
            value={paymentMode?.value}
            removeIsClearable={true}
            dynamicOptions={dropDownState?.ListPaymentmode}
            respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
          />
          {paymentMode?.label !== "Cash" && (
            <>
              <ReactSelect
                placeholderName={"Bank Name"}
                inputId="bankName"
                name="BankName"
                value={bankName?.value}
                handleChange={handleChangeBankName}
                searchable={true}
                removeIsClearable={true}
                dynamicOptions={dropDownState?.ListBankMaster}
                respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
              />
              <Input
                lable={t("RefNo")}
                className="form-control"
                id="refNo"
                name="RefNo"
                value={refNo}
                onChange={handleInput}
                respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
              />
            </>
          )}
          <Input
            lable={t("Remarks")}
            className="form-control required-fields"
            id="Remarks"
            name="Remarks"
            value={Remarks}
            onChange={handleInput}
            respclass={"col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"}
          />

          <button className="btn btn-primary save-button mx-2" onClick={UpdateReceiptApi}>
            Save
          </button>
        </div>
      )}
    </>
  );
};

export default ReceiptReprintTable;
