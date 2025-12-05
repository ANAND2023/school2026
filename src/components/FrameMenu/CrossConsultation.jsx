import React, { useEffect, useState } from 'react'
import ReactSelect from '../formComponent/ReactSelect'
import Heading from '../UI/Heading'
import TextAreaInput from '../formComponent/TextAreaInput'
import { useTranslation } from 'react-i18next'
import { notify } from '../../utils/ustil2'
import { getNursingWardCrossConsultationsByTransactionIDApi, NursingWardCrossConsultationStatusApi, saveNursingWardCrossConsultationsApi } from '../../networkServices/nursingWardAPI'
import { useSelector } from 'react-redux'
import Tables from '../UI/customTable'
import moment from 'moment'
import Modal from '../modalComponent/Modal'
import ModalRemarks from '../modalComponent/Utils/modelRemark'

const CrossConsultation = (props) => {
    const { t } = useTranslation();

    const THEAD = [
        t("Sr.No"),
        t("Patient ID"),
        t("Doctor Name"),
        t("Message"),
        t("Date"),
        t("Action"),

    ];
    const { ipdno, transactionID, patientID,status } = props?.data || {};
    const { GetBindAllDoctorConfirmationData } = useSelector(
        (state) => state.CommonSlice
    );
    const [tableData, setTableData] = useState([]);
    const [modalData, setModalData] = useState({});
    // const [SecondModal, setSecondModal] = useState({});
    const [values, setValues] = React.useState({
        doctor: "",
        comment: "",
    });
    const [payload, setPayload] = useState({})
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }
    const fetchData = async () => {
        try {
            const response = await getNursingWardCrossConsultationsByTransactionIDApi(transactionID);
            if (response?.success) {
                setTableData(response?.data || []);
            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            notify(error?.message || "Error fetching Cross Consultation data", "error");
        }
    }

    const handleSave = async () => {
        const payload = {
            id: 0,
            patientID: patientID || 0,
            transactionId: transactionID || 0,
            ipdNo: ipdno || "",
            description: values?.comment || "",
            roleID: '',
            doctorID: values?.doctor?.value || "",
            doctorName: values?.doctor?.label || "",
        }
        try {
            const response = await saveNursingWardCrossConsultationsApi(payload);
            if (response?.success) {
                notify(response?.message);
                setValues({
                    doctor: "",
                    comment: "",
                });
                fetchData();
            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            notify(error?.message || "Error saving Cross Consultation", "error");

        }
    }

    const handleChangeModel = (inputData) => {
        setModalData((prev) => ({
            ...prev,
            id: inputData?.id,   // keep id if needed
            remarks: inputData?.advanceReason,
        }));
        // setPayload({ ...inputData, remarks: inputData?.advanceReason })
    };


    const handleUpdateSecondModelAPI = async (inputData) => {

        const payloadData = {
            id: inputData?.id,
            type: 3,
            remarks: inputData?.remarks
        }

        try {
            const response = await NursingWardCrossConsultationStatusApi(payloadData)
            if (response?.success) {
                notify(response?.message, "success");
                fetchData();
                setModalData((prev) => ({ ...prev, isOpen: false }));
            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            console.error("API Error:", error);
        }

    };

    // const apicall = (e,) => {
    //     debugger
    //     console.log(e)
    // }

    //     console.log("Save clicked", updatedPayload, e, data);
    // };
    const handleRemarkModelAPI = (row) => {
        setPayload(row)
        setModalData({
            label: "Add Remarks",
            width: "50vw",
            isOpen: true,
            Component: <ModalRemarks
                inputData={row}
                handleChangeModel={handleChangeModel} />,
            handleStateInsertAPI: handleUpdateSecondModelAPI,
            extrabutton: <></>,
            // modalData: {...modalData?.modalData,data},

        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Heading isBreadcrumb={true} />
            <div className='card '>
                <div className="row p-2">
                    <ReactSelect
                        className="form-control"
                        respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        lable={t("Doctor")}
                        name="doctor"
                        id="doctor"
                        value={values?.doctor}
                        dynamicOptions={[
                            ...GetBindAllDoctorConfirmationData.map((item) => {
                                return {
                                    label: item?.Name,
                                    value: item?.DoctorID,
                                };
                            }),
                        ]} handleChange={(name, val) => setValues((prev) => ({ ...prev, doctor: val }))}
                        placeholder={t("Select Doctor")}
                        removeIsClearable={true}

                    />
                    <TextAreaInput className='form-control' respclass="col-xl-2 col-md-4 col-sm-4 col-12" lable='Comment' name="comment" rows={3} value={values?.comment} maxLength={500} onChange={handleChange} />
                    <button className='btn btn-primary ml-2' 
                      disabled={status==="OUT"?true:false}
                    onClick={handleSave}>{t("Save")}</button>
                </div>
            </div>

            {tableData?.length > 0 && (
                <Tables
                    thead={THEAD}
                    tbody={tableData?.map((item, index) => ({
                        sno: index + 1,
                        patientName: item?.PatientID,
                        doctorName: item?.DoctorName,
                        message: item?.Description,
                        date: moment(item?.EntryDate).format("DD-MMM-yyyy"),
                        Action: (
                            <>
                                {(item?.STATUS === 0 || item?.STATUS === 2) && (
                                    <button className='btn btn-primary' onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemarkModelAPI(item);
                                    }}
                                    >
                                        <i className="fa fa-check-circle" aria-hidden="true"></i>
                                    </button>
                                )}
                            </>
                        )

                    }))}
                />

            )}
            {modalData?.isOpen && (
                <Modal
                    visible={modalData?.isOpen}
                    setVisible={(val) => setModalData((prev) => ({ ...prev, isOpen: val }))}
                    modalWidth={modalData?.width}
                    Header={t(modalData?.label)}
                    buttonType="button"
                    buttonName="Save"
                    buttons={modalData?.extrabutton}
                    modalData={modalData}
                    setModalData={setModalData}
                    handleAPI={modalData?.handleStateInsertAPI}
                >
                    {modalData?.Component}
                </Modal>
            )}
        </>
    )
}

export default CrossConsultation