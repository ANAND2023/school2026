import React, { useState } from 'react';
import Input from '../../../components/formComponent/Input';
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import Tables from '../../../components/UI/customTable';
import { notify } from '../../../utils/ustil2';
import { OPDESIPatientDetail, OPDSavePatientESINo } from '../../../networkServices/BillingsApi';
const EsiNOEntry = () => {
    const [tableData, setTableData] = useState([]);
    const initialValue = {
        uhid: "",
        ESIInsuranceName: "",
        ESIInsuranceNo: ""
    }
    const [values, setValues] = useState(initialValue);
    const { t } = useTranslation();
    const handleTableInputChange = (e, index, fieldName) => {
        const { value } = e.target;
        const updatedTableData = [...tableData];
        updatedTableData[index] = { ...updatedTableData[index], [fieldName]: value };
        setTableData(updatedTableData);
    };

    const HandleSave = async () => {
        const payload = {
            "patientID": tableData[0]?.PatientID,
            "insuranceNo": tableData[0]?.ESIInsuranceNo,
            "insuranceName": tableData[0]?.ESIInsuranceName,
        }
        const response = await OPDSavePatientESINo(payload)
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
    { name: t("ESI Insurance No."), width: "10%" },
    { name: t("ESI Insurance Name"), width: "10%" },

    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const HandleSearch = async () => {
        let payload = {
            "PatientID": String(values.uhid),
        };
        try {

            const response = await OPDESIPatientDetail(payload);
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
                <Input
                    type="text"
                    className="form-control"
                    id="uhid"
                    lable={t("UHID")}
                    placeholder=" "
                    value={values.uhid}
                    respclass="col-xl-2 col-md-3 col-sm-6 col-12"
                    name="uhid"
                    onChange={handleChange}
                />
                <div className="col-xl-2 col-md-3 col-sm-6 col-12 gap-2">
                    <button className="btn btn-sm btn-primary" onClick={HandleSearch}>
                        {t("Search")}</button>

                </div>
            </div>
            {
                tableData?.length > 0 && <div className="p-2">
                    <Heading title={t("OPD Esi No. Entry")} isBreadcrumb={false} />

                    <Tables
                        thead={THEAD}
                        tbody={tableData?.map((val, ind) => ({

                            sn: ind + 1,
                            PatientName: val?.PatientName,
                            PatientID: val?.PatientID,

                            ESIInsuranceNo: (
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="ESI Insurance No"
                                    name="ESIInsuranceNo"
                                    value={val.ESIInsuranceNo}
                                    onChange={(e) => handleTableInputChange(e, ind, "ESIInsuranceNo")}

                                />
                            ),
                            ESIInsuranceName: (
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="ESI Insurance Name"
                                    name="ESIInsuranceName"
                                    value={val.ESIInsuranceName}
                                    onChange={(e) => handleTableInputChange(e, ind, "ESIInsuranceName")}

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


