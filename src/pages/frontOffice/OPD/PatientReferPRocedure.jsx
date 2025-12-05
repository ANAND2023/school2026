import React, { useState } from 'react';
import Input from '../../../components/formComponent/Input';
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import Tables from '../../../components/UI/customTable';
import { notify } from '../../../utils/ustil2';
import { OPDPatientReferProcedureDetail, OPDSavePatientESINo, OPDSavePatientReferProcedure } from '../../../networkServices/BillingsApi';
import ReactSelect from '../../../components/formComponent/ReactSelect';
const EsiNOEntry = () => {
     const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    const initialValue = {
        billno: "",
        Type: { label: t("OPD"), value: "0" }

    }
    const [values, setValues] = useState(initialValue);
   
    const handleTableInputChange = (e, index, fieldName) => {
        const { value } = e.target;
        const updatedTableData = [...tableData];
        updatedTableData[index] = { ...updatedTableData[index], [fieldName]: value };
        setTableData(updatedTableData);
    };

    const HandleSave = async () => {
        const payload =
        {
            "billNo": tableData[0]?.BillNo,
            "claimID": tableData[0]?.ClaimID,
            "referNo": tableData[0]?.ReferNo,
            "procedure": tableData[0]?.ASProcedure,
            "transactionID": tableData[0]?.TransactionID,
        }

        const response = await OPDSavePatientReferProcedure(payload)
        if (response?.success) {
            notify(response?.message, "success")
            setTableData([])
        }
        else {
            notify(response?.message, "error")
        }

    };

    const THEAD = [{ name: t("Sr No."), width: "5%" },
    { name: t("Patient Name"), width: "10%" },
    { name: t("UHID"), width: "10%" },
    { name: t("BillNo"), width: "10%" },
    { name: t("Refer No."), width: "10%" },
    { name: t("ClaimID"), width: "10%" },
    { name: t("ASProcedure"), width: "10%" },

    ];
    const handleReactSelectChange = (name, e) => {

        setValues((preV) => ({
            ...preV,
            [name]: e
        }))
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const HandleSearch = async () => {
        let payload = {
            "BillNo": String(values.billno),
            "Type": Number(values.Type?.value)
        };
        try {

            const response = await OPDPatientReferProcedureDetail(payload);
            if (response?.success) {

                setTableData(response.data);

            } else {
                setTableData([]);

            }
        } catch (error) {
            setTableData([]);
            console.log(error, "SomeThing Went Wrong");
        }
    };
    return (
        <div className="patient_registration card">
            <Heading title={t("OPD Esi No. Entry")} isBreadcrumb={true} />
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
                    id="billno"
                    lable={values?.Type?.value === "1" ? t("Bill No./IPD No.") : t("Bill No.")}
                    placeholder=" "
                    value={values.billno}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    name="billno"
                    onChange={handleChange}
                />
                <div className="col-xl-2 col-md-3 col-sm-6 col-12 gap-2">
                    <button className="btn btn-sm btn-primary" onClick={HandleSearch}>
                        {t("Search")}</button>

                </div>
            </div>
            {
                tableData?.length > 0 && <div className="p-2">
                    <Heading title={t("Patient Refer-ASProcedure Updation")} isBreadcrumb={false} />

                    <Tables
                        thead={THEAD}
                        tbody={tableData?.map((val, ind) => ({

                            sn: ind + 1,
                            PatientName: val?.PatientName,
                            PatientID: val?.PatientID,
                            BillNo: val?.BillNo,

                            ReferNo: (
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Refer No"
                                    name="ReferNo"
                                    value={val.ReferNo}
                                    onChange={(e) => handleTableInputChange(e, ind, "ReferNo")}

                                />
                            ),
                            ClaimID: (
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="ClaimID"
                                    name="ClaimID"
                                    value={val.ClaimID}
                                    onChange={(e) => handleTableInputChange(e, ind, "ClaimID")}

                                />
                            ),
                            ASProcedure: (
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="ASProcedure"
                                    name="ASProcedure"
                                    value={val.ASProcedure}
                                    onChange={(e) => handleTableInputChange(e, ind, "ASProcedure")}

                                />
                            ),

                        }))}
                    />

                    <div className="p-2 d-flex justify-content-end">
                        <button className="btn btn-sm btn-primary d-flex justify-items-end" onClick={HandleSave}>
                            {t("Save")}
                        </button>
                    </div>
                </div>
            }


        </div>
    )
}

export default EsiNOEntry;


