import React, { useState, useEffect } from 'react'; // Import useEffect
import Input from '../../../components/formComponent/Input';
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import { BillingEsiBillPrint, BillingToolBillClaimDetails, BillingToolSaveBillClaimDetails, OPDConsolidatedReport, OPDGetConsolidatedDetail } from '../../../networkServices/Tools';
import Tables from '../../../components/UI/customTable';
import { notify } from '../../../utils/ustil2';
import { exportToExcel } from '../../../utils/exportLibrary';
import { RedirectURL } from '../../../networkServices/PDFURL';
import ReactSelect from '../../../components/formComponent/ReactSelect';

const EsiconsolidatedBill = () => {
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState({});
    const [allSelected, setAllSelected] = useState(false);


    const [values, setValues] = useState({
        fromDate: new Date(),
        toDate: new Date(),
        regNo: "",
        IPD: "",
        billNo: "",
        Type: { label: t("OPD"), value: "0" }
    });

    const { VITE_DATE_FORMAT } = import.meta.env;


    const handleSelectAll = (e) => {
        const isSelected = e.target.checked;
        setAllSelected(isSelected);
        const newSelectedRows = {};
        if (isSelected) {
            tableData.forEach((_, index) => {
                newSelectedRows[index] = true;
            });
        }
        setSelectedRows(newSelectedRows);
    };

    const handleRowSelect = (e, index) => {
        const isSelected = e.target.checked;
        // Keep previous selections and update the current one
        setSelectedRows(prev => ({
            ...prev,
            [index]: isSelected
        }));
    };

    // Effect to update the "Select All" checkbox if all rows are manually selected/deselected
    useEffect(() => {
        if (tableData.length > 0 && Object.keys(selectedRows).length > 0) {
            const allAreSelected = tableData.every((_, index) => selectedRows[index]);
            setAllSelected(allAreSelected);
        } else {
            setAllSelected(false);
        }
    }, [selectedRows, tableData]);
    // -------------------------------------------
    console.log("tableData", tableData)
    const HandleSave = async () => {

        const selectedDataToSave = tableData.filter((_, index) => selectedRows[index]);

        if (selectedDataToSave.length > 0) {
            const payload =
            {
                billNo: selectedDataToSave?.map((val) => String(val?.BillNo)

                ),
                Type: Number(values?.Type?.value)
            }


            console.log("Data to be saved:", payload);
            const response = await OPDConsolidatedReport(payload)
            if (response?.success) {
                // HandleSearch();
                debugger
                RedirectURL(response?.data?.pdfUrl);
                //  notify(response?.message, "success")
            }
            else {
                notify(response?.message, "error")
            }

        } else {
            notify("No rows selected to Print.", "warn");
        }
    };
    const HandleesiPrint = async () => {

        const selectedDataToSave = tableData.filter((_, index) => selectedRows[index]);
        console.log("selectedDataToSave", selectedDataToSave)
        if (selectedDataToSave.length > 0) {
            const payload =


            {
                "patientId": selectedDataToSave[0]?.PatientID,
                "billNolist": selectedDataToSave?.map((val) =>
                ({
                    billNo: String(val?.BillNo)
                }))

                //   "billNo": selectedDataToSave?.map((val) => String(val?.BillNo))


            }
            // { "tid": "58",
            //     billNo: selectedDataToSave?.map((val) => String(val?.BillNo)

            //     )
            // }


            console.log("Data to be saved:", payload);
            const response = await BillingEsiBillPrint(payload)
            if (response?.success) {
                // HandleSearch();
                debugger
                RedirectURL(response?.data);
                //  notify(response?.message, "success")
            }
            else {
                notify(response?.message, "error")
            }

        } else {
            notify("No rows selected to Print.", "warn");
        }
    };

    const THEAD = [
        // Select All
        { name: <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />, width: "5%" },
        { name: t("Sr No."), width: "5%" },
        { name: t("Patient Name"), width: "10%" },
        { name: t("UHID"), width: "10%" },
        { name: t("Bill No."), width: "10%" },
        { name: t("Bill Date"), width: "5%" },
        { name: t("ESI Claim ID"), width: "5%" },
        { name: t("ESI Insurance No"), width: "5%" },
        { name: t("ESI Procedure"), width: "5%" },
    ];


    const searchHandleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevState) => ({
            ...prevState,
            [name]: value, // DatePicker passes the date object directly
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleReactSelectChange = (name, e) => {

        setValues((preV) => ({
            ...preV,
            [name]: e
        }))
    };

    const HandleSearch = async () => {
        // if(!values.regNo){
        //     notify("Please Fill UHID","warn")
        //     return
        // }
        let payload =

        {
            "fromDate": moment(values.fromDate).format("YYYY-MM-DD"),
            "toDate": moment(values.toDate).format("YYYY-MM-DD"),
            "billNo": String(values.billNo),
            "patientID": String(values.regNo),
            "IPDNo": String(values?.IPD),
            "Type": Number(values?.Type?.value)

        }
        try {
            // dispatch(setLoading(true));
            const response = await OPDGetConsolidatedDetail(payload);
            if (response?.success) {
                // Augment data with fields for controlled inputs to prevent warnings
                const augmentedData = response.data.map(item => ({
                    ...item,
                    diagnosis: item.diagnosis || "",
                    ClaimID: "", // Editable claim ID field
                    RefNo: "" // Editable insurance card field
                }));
                setTableData(response.data);

                setSelectedRows({});
                setAllSelected(false);
            } else {
                setTableData([]);
                // notify(response?.message, "success")
            }
        } catch (error) {
            setTableData([]);
            console.log(error, "SomeThing Went Wrong");
        } finally {
            // dispatch(setLoading(false));
        }
    };

    return (
        <div className="patient_registration card">
            <Heading title={t("Billing Claim Details")} isBreadcrumb={true} />
            <div className="row p-2">
                <ReactSelect
                    placeholderName={t("Type")}
                    id={"Type"}
                    searchable={true}
                    respclass="col-xl-1 col-md-2 colt-sm-6 col-12"
                    dynamicOptions={[
                        { label: t("OPD"), value: "0" },
                        { label: t("IPD"), value: "1" },
                    ]}

                    name="Type"
                    handleChange={handleReactSelectChange}
                    value={values.Type?.value}
                />
                <Input
                    type="text"
                    className="form-control"
                    id="regNo"
                    lable={t("UHID")}
                    placeholder=" "
                    value={values.regNo}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    name="regNo"
                    onChange={handleChange}
                />
                {values?.Type?.value === "1" &&
                    <Input
                        type="text"
                        className="form-control"
                        id="IPD"
                        lable={t("IPD No.")}
                        placeholder=" "
                        value={values?.IPD}
                        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                        name="IPD"
                        onChange={handleChange}
                    />}
                <Input
                    type="text"
                    className="form-control"
                    id="billNo"
                    lable={t("bill No.")}
                    placeholder=" "
                    value={values.billNo}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    name="billNo"
                    onChange={handleChange}
                />
                <DatePicker
                    className="custom-calendar"
                    id="From Data"
                    name="fromDate"
                    lable={t("From Date")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    value={values.fromDate}
                    maxDate={new Date()}
                    handleChange={searchHandleChange}
                />
                <DatePicker
                    className="custom-calendar"
                    id="toDate"
                    name="toDate"
                    lable={t("To Date")}
                    value={values.toDate}
                    maxDate={new Date()}
                    handleChange={searchHandleChange}
                    placeholder={VITE_DATE_FORMAT}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                />
                <button className="btn btn-sm btn-primary" onClick={HandleSearch}>
                    {t("Search")}
                </button>
                <div className="col-xl-2 col-md-3 col-sm-6 col-12 gap-2">


                    {
                        tableData?.length > 0 &&
                        <button className="btn btn-sm btn-primary ml-2" onClick={HandleSave}>
                            {t("Print")}
                        </button>
                    }
                    {
                        tableData?.length > 0 &&
                        <button className="btn btn-sm btn-primary ml-2" onClick={HandleesiPrint}>
                            {t("P2 Esi Print")}
                        </button>
                    }

                </div>
            </div>
            {
                tableData?.length > 0 && <div className="">
                    <Heading title={t("Billing Details")} isBreadcrumb={false} />

                    <Tables
                        thead={THEAD}
                        tbody={tableData?.map((val, ind) => ({
                            select: (
                                <input
                                    type="checkbox"
                                    checked={!!selectedRows[ind]}
                                    onChange={(e) => handleRowSelect(e, ind)}
                                />
                            ),
                            sn: ind + 1,
                            PatientName: val?.PatientName,
                            PatientID: val?.PatientID,
                            BillNo: val?.BillNo,
                            BillDate: val?.BillDate,
                            ESIClaimID: val?.ESIClaimID,
                            ESIInsuranceNo: val?.ESIInsuranceNo,
                            ESIProcedure: val?.ESIProcedure,

                        }))}
                    />


                </div>
            }


        </div>
    )
}

export default EsiconsolidatedBill;


