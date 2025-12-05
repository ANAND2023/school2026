import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading'
import Input from '../../../components/formComponent/Input'
import DatePicker from '../../../components/formComponent/DatePicker'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { getDiscountApprovalApi, updateDiscountApprovalApi } from '../../../networkServices/BillingsApi'
import { notify } from '../../../utils/ustil2'
import Tables from '../../../components/UI/customTable'
import TextAreaModal from '../../../components/modalComponent/Utils/TextAreaModal'
import Modal from '../../../components/modalComponent/Modal'

function PatientDiscountApproval() {
    const { t } = useTranslation()
    const { VITE_DATE_FORMAT } = import.meta.env;
    const THEAD = [
        t("Sr.No"),
        // t("Transaction ID"),
        t("IPD No."),
        t("Patient Name"),
        // t("Age/Gender"),
        // t("Mobile"),
        t("Discount By"),
        t("Discount Amount"),
        t("Total Bill Amount"),
        t("Discount ApprovedBy"),
        t("Discount Approval Date"),
        t("Discount Approval Remarks"),
        t("Action"),

    ];
    const [handleModelData, setHandleModelData] = useState({});
    // const [modalData, setModalData] = useState({
    //     key:"hello"
    // });

    const [values, setValues] = useState({
        ipdNo: "",
        patientId: "",
        patientName: "",
        fromDate: new Date(),
        toDate: new Date(),
        status: "0",

    })
    const [tableData, setTableData] = useState([])

     const getRowClass = (val, index) => {
    let data = tableData?.[index];
    // console.log("sss-----", data);
    if (data?.discountApprovalStatus === 1) {
      return "color-indicator-24-bg";
    } 
    else if (data?.discountApprovalStatus === 2) {
      return "color-indicator-21-bg";
    } 

    
  };

    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }
    const handleReactSelectChange = (name, value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value.value,
        }));
    }
    console.log(tableData, "egfyfe")
    const handleGetDiscountList = async () => {
        try {

            const res = await getDiscountApprovalApi(values)
            if (res?.success) {
                setTableData(res?.data)
            } else {
                notify(res?.message, "warn")
                setTableData([])
            }

        } catch (error) {
            notify(error?.message, "error")
        }

    }

    const handleApproveDiscount = async (data) => {

        console.log(data)
        debugger
        if (!data?.insufficientRemarks) {
            notify("Remarks is required", "warn")
            return
        }

        const payload = {
            ipdNo:data?.IPDNo,
            remark: data?.insufficientRemarks,
            transactionId: data?.TransactionID,
            status: "1"
        };
        try {
            const response = await updateDiscountApprovalApi(payload);
            if (response.success) {
                setIsOpen()
                notify(response?.message, "success");
                handleGetDiscountList()
            }
            else {
                notify(response?.message, "error");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    };

    // console.log(modalData, "mods")
    const handleApproveModal = (data) => {



        setHandleModelData({
            label: t("Approve Discount"),
            buttonName: t("Approve"),
            width: "30vw",
            isOpen: true,
            modalData: data,
            Component: (
                <TextAreaModal
                    handleChangeModel={setHandleModelData}
                    modalData={handleModelData}  
                    label={t("Reason")}
                />
            ),
            handleInsertAPI: handleApproveDiscount,
            extrabutton: <></>,
        });
    };






    return (
        <div className="card patient_registration border">
            <Heading isBreadcrumb={true} />
            <div className="p-2">
                <div className="row">
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("IPD No")}
                        placeholder=" "
                        id="ipdNo"
                        name="ipdNo"
                        onChange={handleChange}
                        value={values?.ipdNo}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Patient ID")}
                        placeholder=" "
                        id="patientId"
                        name="patientId"
                        onChange={handleChange}
                        value={values?.patientId}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <Input
                        type="text"
                        className="form-control"
                        lable={t("Patient Name")}
                        placeholder=" "
                        id="patientName"
                        name="patientName"
                        onChange={handleChange}
                        value={values?.patientName}
                        required={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="fromDate"
                        name="fromDate"
                        value={
                            values.fromDate
                                ? moment(values?.fromDate, "YYYY-MM-DD").toDate()
                                : null
                        }
                        handleChange={handleChange}
                        lable={t("FromDate")}
                        placeholder={VITE_DATE_FORMAT}
                    />
                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="toDate"
                        name="toDate"
                        value={
                            values.toDate
                                ? moment(values?.toDate, "YYYY-MM-DD").toDate()
                                : null
                        }
                        handleChange={handleChange}
                        lable={t("ToDate")}
                        placeholder={VITE_DATE_FORMAT}
                    />
                    <ReactSelect
                        placeholderName={t("STATUS")}
                        name="status"
                        value={`${values?.status?.value}`}
                        handleChange={handleReactSelectChange}
                        dynamicOptions={[
                            { label: "Pending", value: "0" },
                            { label: "Accepted", value: "1" },
                            { label: "Rejected", value: "2" }

                        ]}
                        searchable={true}
                        id={"status"}
                        removeIsClearable={true}
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    />
                    <div className="col-xl-2 col-md-4 col-sm-6 col-12">

                        <button className='btn btn-primary' onClick={handleGetDiscountList}>Search</button>
                    </div>
                </div>
            </div>

            {tableData?.length > 0 && (

                <div className="card">
                    <Heading title={"Issued Files"} isBreadcrumb={false} />
                    <div>
                        <Tables
                            thead={THEAD}
                            tbody={tableData?.map((item, index) =>
                                [
                                    index + 1,
                                    // item?.TransactionID,
                                    item?.IPDNo,
                                    item?.PatientName,
                                    // item?.Age,
                                    // item?.Mobile,
                                    item?.DiscountGivenBy,
                                    `₹ ${item?.DiscountOnBill}`,
                                    `₹ ${item?.TotalBilledAmt}`,
                                    item?.discountApprovalStatus === 0 ? ("-"):item?.DiscountApprovedBy,
                                    item?.discountApprovalStatus === 0 ? ("-"):item?.DiscountApprovalDate,
                                    item?.discountApprovalStatus === 0 ? ("-"):item?.discountApprovalRemarks,
                                    item?.discountApprovalStatus === 1 || item?.CanApproveDiscount === 0 ? ("-") : (

                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={() => {
                                                handleApproveModal(item);
                                            }}
                                        >
                                            {/* <i className='fas fa-check'></i> */}
                                            Approve
                                        </button>),


                                ])}
                                getRowClass={getRowClass}
                                tableHeight={"scrollView"}
                        />
                    </div>
                </div>
            )}

            {handleModelData?.isOpen && (
                <Modal
                    visible={handleModelData?.isOpen}
                    setVisible={setIsOpen}
                    modalWidth={handleModelData?.width}
                    Header={t(handleModelData?.label)}
                    buttonType={"submit"}
                    buttons={handleModelData?.extrabutton}
                    buttonName={handleModelData?.buttonName}
                    modalData={handleModelData?.modalData}
                    setModalData={setHandleModelData}
                    footer={handleModelData?.footer}
                    handleAPI={handleModelData?.handleInsertAPI}
                >
                    {handleModelData?.Component}
                </Modal>
            )}

        </div>
    )
}

export default PatientDiscountApproval