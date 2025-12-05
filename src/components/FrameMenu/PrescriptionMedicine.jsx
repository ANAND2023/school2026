import React, { useEffect, useState } from 'react'
import { AUTOCOMPLETE_STATE, PRESCRIBED_MEDICINE } from '../../utils/constant';
import Heading from '../UI/Heading';
import { useTranslation } from 'react-i18next';
import { createNursingMedicineRequestApi, deleteNursingMedicineRequestApi, getNursingMedicinegroupRequest, getNursingMedicineRequestApi } from '../../networkServices/DoctorApi';
import { notify } from '../../utils/ustil2';
import Tables from '../UI/customTable';
import moment from 'moment';
import PrescribedMedicineCrud from '../UI/customTable/doctorTable/ViewConsultationtable/ComponentPrescription/PrescribeMedicineCrud';
import DatePicker from '../formComponent/DatePicker';

const PrescriptionMedicine = ({ data }) => {
    console.log(data);
    const { transactionID, patientId } = data;
    const { VITE_DATE_FORMAT } = import.meta.env;
    const [tags, setTags] = useState({
        "Prescribed Medicine": [PRESCRIBED_MEDICINE],
    });

    const { t } = useTranslation()
    const Thead = [
        { name: t("S.No"), width: "1%" },
        { name: t("Date"), width: "10%" },
        { name: t("name"), width: "10%" },
        { name: t("Action"), width: "1%" },
    ]
    const [presTable, setPresTable] = useState([

    ]);
    const [list, setList] = useState([])
    const [values, setValues] = useState({
        prescreptionDate: new Date()
    })
    const [doctorTopSuggestions, setDoctorTopSuggestions] = useState([

    ]);

    const handleSave = async (event) => {
        // event.preventDefault();
        const KEYS_NAME = "Prescribed Medicine";

        const formData = tags[KEYS_NAME]?.map((item) => {
            // Extract values and filter out any entries where all values are empty
            const values = {
                Name: item.Name?.value || "",
                Dose: item.Dose?.value || "",
                Time: item.Time?.value || "",
                Duration: item.Duration?.value || "",
                Meal: item.Meal?.value || "",
                Route: item.Route?.value || "",
                ID: item?.ID || "",
                Remarks: item.Remarks?.value || "",
            };

            // Check if all values are empty
            const isEmpty = Object.values(values).every(
                (value) => value?.trim() === ""
            );

            return isEmpty ? null : values;
        }).filter((item) => item !== null);
        try {
            const payload = formData.length > 0 && formData?.map((item) => ({
                id: item?.ID ? item?.ID : 0,
                patientId: patientId,
                transactionId: transactionID,
                prescreptionDate: moment(values?.prescreptionDate)?.format("YYYY-MM-DD"),
                name: item?.Name ? item?.Name : "",
                dose: item?.Dose,
                route: item?.Route,
                duration: item?.Duration,
                meal: item?.Meal,
                time: item?.Time,
                remarks: item?.Remarks,
            }))
            const response = await createNursingMedicineRequestApi(payload)
            if (response?.success) {
                notify(response?.message, "success")
                fetchData(transactionID)
            } else {
                notify(response?.message, "error")

            }
        } catch (error) {
            notify(error?.message, "error")
        }
    };
    const handleDelete = async (ID) => {
        const payload = {
            id: ID
        }
        try {
            const response = await deleteNursingMedicineRequestApi(payload)
            if (response?.success) {
                fetchData(transactionID)
            } else {
                notify(response?.message, "error")
                setList([])
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };
    const fetchData = async (transactionID) => {
        try {
            const response = await getNursingMedicinegroupRequest(transactionID)
            if (response?.success) {
                notify(response?.message, "success")
                setList(response?.data)
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }
    useEffect(() => {
        fetchData(transactionID)
    }, [])

    const handleEdit = async (item) => {
        try {
           const date=moment(item?.PrescreptionDate).format("YYYY-MM-DD")
            const response = await getNursingMedicineRequestApi(date, item?.TransactionId)
            if (response?.success) {
                notify(response?.message, "success")

                const formattedData = response.data?.map(row => ({
                    Name: {
                        value: row?.NAME || "",
                        ID: row?.Id?.toString() || "", // or `row?.transactionId` if needed
                        isDisable: true,
                    },
                    Dose: {
                        value: row?.dose || "",
                        isDisable: true,
                    },
                    Time: {
                        value: row?.TIME || "",
                        isDisable: true,
                    },
                    Duration: {
                        value: row?.duration || "",
                        isDisable: true,
                    },
                    Meal: {
                        value: row?.meal || "",
                        isDisable: true,
                    },
                    Route: {
                        value: "", // Not available in response, leaving blank
                        isDisable: true,
                    },
                    Remarks: {
                        value: row?.remarks || "",
                        isDisable: true,
                    },
                    ID:row?.Id
                    
                }));
                setTags((prev) => ({
                    ...prev,
                    "Prescribed Medicine": formattedData,
                }))
                setValues({
                    ...values,
                    prescreptionDate:date
                })
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }


    return (
        <div className='mt-2 spatient_registration_card'>
            <div className='patient_registration card'>
                <Heading isBreadcrum="false" title={t("Prescribe Medicine")} />
                <div className='row p-2'>

                    <DatePicker
                        className="custom-calendar"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        id="prescreptionDate"
                        name="prescreptionDate"
                        value={
                            values.prescreptionDate
                                ? moment(values?.prescreptionDate, "YYYY-MM-DD").toDate()
                                : null
                        }
                        handleChange={handleChange}
                        lable={t("prescreption Date")}
                        placeholder={VITE_DATE_FORMAT}
                    />
                    <PrescribedMedicineCrud
                        isDesktop={false}
                        isShowFirst={true}
                        tags={tags}
                        setTags={setTags}
                        type={"FromPage"}
                        presTable={presTable}
                        setPresTable={setPresTable}
                        apiData={doctorTopSuggestions}
                    />

                    <div className='p-2 text-right'>
                        <button
                            className="btn btn-sm btn-primary mx-2 "
                            onClick={handleSave}
                        >
                            {t("save")}
                        </button>
                    </div>
                </div>
            </div>
            {list?.length > 0 &&
                <>
                    <Heading title={"Prescribe Medicine List"} className="mt-2" />
                    <Tables thead={Thead}
                        tbody={list?.map((item, index) => ({
                            Sno: index + 1,
                            Date: moment(item?.PrescreptionDate).format("DD-MM-YYYY"),
                            name: item?.MedicationNames,
                            edit: (
                                <div className='d-flex'>

                                    <button
                                        className="btn btn-primary ml-2"
                                        type="button"
                                        onClick={() => {
                                            handleEdit(item)
                                        }}
                                    >
                                        {t("Edit")}
                                    </button>
                                    
                                </div>
                            ),
                        }))}
                        scrollView={"scrollView"}
                    />
                </>
            }

        </div>
    )
}

export default PrescriptionMedicine;