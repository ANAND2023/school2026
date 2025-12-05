import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next';
import SearchComponentByUHIDMobileName from '../../../components/commonComponents/SearchComponentByUHIDMobileName';
import LabeledInput from '../../../components/formComponent/LabeledInput';
import Input from '../../../components/formComponent/Input';
import { Tabfunctionality } from '../../../utils/helpers';
import TextAreaInput from '../../../components/formComponent/TextAreaInput';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { bindPanelByPatientID, OPDgetCMSPanel, opdgetPatientAdvanceCms, opdPatientAdvanceCmsSave, OPDUpdateCMSBillClosed } from '../../../networkServices/opdserviceAPI';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import Modal from '../../../components/modalComponent/Modal';
import EditPatientAdvanceCms from './EditPatientAdvanceCms';



const PatientAdvanceCMS = () => {
    const { t } = useTranslation();
    const [singlePatientData, setSinglePatientData] = useState({})
    const [bodyData, setBodyData] = useState([]);
    const [panelList, setPanelList] = useState([]);
    const [cMSPanelDetails, setCMSPanelDetails] = useState([]);
    const [modalData, setModalData] = useState({ visible: false })
    const [values, setValues] = useState({

        "panelID": "336",
        "patient_ID": "",
        "patientName": "",
        "sancationNo": "",
        "sancationdate": new Date(),
        "serialNo": "",
        "attachment_File": "",
        "amount": "",
        "cash": "",
        "remarks": "",
        "iD_NO": "",
        "oN_OFF_LINE": "1",
        "patientStatus": "1"

    });

    const PATIENT_STATUS = [
        { label: t("Open"), value: "1" },
        { label: t("Close"), value: "0" },
    ]
    const ON_OFF_OPTIONS = [
        { label: t("ON"), value: "1" },
        { label: t("OFF"), value: "0" },
    ]

    const getPatientAdvanceCms = async (data) => {
        debugger
        try {
            let payload = {
                "type": 0,
                "patientID": data?.MRNo
            }
            const response = await opdgetPatientAdvanceCms(payload);
            if (response?.success) {
                setBodyData(response?.data || []);
            }
            else{
                 setBodyData( []);
            }

        } catch (error) {
            console.error("Error in getPatientAdvanceCms:", error);

        }
    }

    // const handlebindPanelByPatientID = async (data) => {
    //     try {
    //         debugger
    //         const response = await bindPanelByPatientID(data?.MRNo);
    //         if (response?.success) {
    //             setPanelList(response?.data || []);
    //         }
    //         else {
    //             setPanelList([]);
    //         }
    //     } catch (error) {
    //         console.error("Error in handlebindPanelByPatientID:", error);

    //     }
    // }
    const getCMSPanel = async (data) => {
        try {
            debugger
            const response = await OPDgetCMSPanel(data?.MRNo);
            if (response?.success) {
                setPanelList(response?.data || []);
            }
            else {
                setPanelList([]);
            }
        } catch (error) {
            console.error("Error in handlebindPanelByPatientID:", error);

        }
    }
    useEffect(()=>{
        getCMSPanel()
    },[])
    const handleSinglePatientData = (data) => {
        
        setSinglePatientData(data);
        getPatientAdvanceCms(data);
        // handlebindPanelByPatientID(data);
    };

    const sendReset = () => {
        setSinglePatientData({});
        setValues(
            {

                "panelID": "",
                "patient_ID": "",
                "patientName": "",
                "sancationNo": "",
                "sancationdate": new Date(),
                "serialNo": "",
                "attachment_File": "",
                "amount": "",
                "cash": "",
                "remarks": "",
                "iD_NO": "",
                "oN_OFF_LINE": "1",
                "patientStatus": "1"

            }
        )

    }

    const handleSave = async () => {

        try {

            debugger
            let payload = {
                "panelID": values?.panelID?.value ? values?.panelID?.value : values?.panelID || "",
                "patient_ID": singlePatientData?.MRNo,
                "patientName": singlePatientData?.PatientName,
                "sancationNo": values?.sancationNo || "",
                "sancationdate": moment(values?.sancationdate).format("YYYY-MM-DD"),
                "serialNo": values?.serialNo || "",
                "attachment_File": "",
                "amount": Number(values?.amount) || 0,
                "cash": Number(values?.cash) || 0,
                "remarks": values?.remarks || "",
                "iD_NO": values?.iD_NO || "",
                "oN_OFF_LINE": values?.oN_OFF_LINE?.value ? values?.oN_OFF_LINE?.value : values?.oN_OFF_LINE || "",
                // "patientStatus": values?.patientStatus
            }

            const response = await opdPatientAdvanceCmsSave(payload)

            if (response?.success) {
                getPatientAdvanceCms(singlePatientData);
                notify(response?.message, "success");
                setValues({
                    "panelID": "",
                    "patient_ID": "",
                    "patientName": "",
                    "sancationNo": "",
                    "sancationdate": new Date(),
                    "serialNo": "",
                    "attachment_File": "",
                    "amount": "",
                    "cash": "",
                    "remarks": "",
                    "iD_NO": "",
                    "oN_OFF_LINE": "",
                    "patientStatus": ""
                });
            }
            else {
                notify(response?.message, "error");
            }

        } catch (error) {
            console.error("Error in handleSave:", error);

        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }
    const handleReactSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }))
    }

const handleEdit = (item) => {
        
        setModalData({
            visible: true,
            width: "30vw",
            Heading: "60vh",
            label: t("Update Amount"),
            footer: <></>,
            Component: <EditPatientAdvanceCms valuesData={item} setModalData={setModalData} getPatientAdvanceCms={getPatientAdvanceCms}  />,

        })

    }

const handleBillClose=async()=>{
    const payload={
  "patientId": singlePatientData?.MRNo,
}
    try {
        const response=await OPDUpdateCMSBillClosed(payload)
        if(response?.success){
            notify(response?.message,"success")
            setBodyData([])
        }
        else{
  notify(response?.message,"error")
        }
    } catch (error) {
        console.log("error",error)
    }
}

    return (
        <div className="card patient_registration border">
            <Heading
                title={t("Search Patient")}
                isBreadcrumb={true}
            />
            {Object.keys(singlePatientData)?.length === 0 ? (
                <SearchComponentByUHIDMobileName onClick={handleSinglePatientData} />
            ) : (
                // <div className="">
                //     <Heading
                //         title={t("Patient Details")}
                //         isBreadcrumb={false}
                //     />
                //     <div className="p-2">
                //         <div className="row">


                //             <LabeledInput
                //                 label={t("UHID")}
                //                 value={singlePatientData?.MRNo}
                //                 className={"w-100"}
                //             />
                //             <LabeledInput
                //                 label={t("Patient Name")}
                //                 value={singlePatientData?.PatientName}
                //                 className={"w-100"}
                //             />
                //             <LabeledInput
                //                 label={t("Age/Gender")}
                //                 value={singlePatientData?.AgeGender}
                //                 className={"w-100"}
                //             />
                //             <LabeledInput
                //                 label={t("Panel")}
                //                 value={singlePatientData?.PanelName || ""}
                //                 className={"w-100"}
                //             />
                //         </div>
                //     </div>
                // </div>
                <>

                    <div className="patient_registration card">
                        <Heading
                            title={t("Patient Details")}
                            isBreadcrumb={false}
                        />
                        <div className="row p-2">
                            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                                <div className="d-flex align-items-center">
                                    <div
                                        style={{
                                            border: "1px solid #447dd5",
                                            padding: "2px 5px",
                                            borderRadius: "3px",
                                            backgroundColor: "#447dd5",
                                            color: "white",
                                            marginRight: "3px",
                                        }}
                                        onClick={sendReset}
                                    >
                                        <i className="fa fa-search " aria-hidden="true"></i>
                                    </div>
                                    <LabeledInput
                                        label={t("UHID")}
                                        value={singlePatientData?.MRNo}
                                        className={" w-100"}
                                    />
                                </div>
                            </div>
                            {/* <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                                <LabeledInput
                                    label={t("UHID")}
                                    value={singlePatientData?.MRNo}
                                    className={"mb-2"}
                                />
                            </div> */}
                            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                                <LabeledInput
                                    label={t("Patient Name")}
                                    value={singlePatientData?.PatientName}
                                    className={"mb-2"}
                                />
                            </div>
                            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
                                <LabeledInput
                                    label={t("Age/Gender")}
                                    value={singlePatientData?.AgeGender}
                                    className={"mb-2"}
                                />
                            </div>
                            
                                <ReactSelect
                                    placeholderName={t("InSurancePanel")}
                                    id={"panelID"}
                                    searchable={true}
                                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                                    value={values?.panelID}
                                    name={"panelID"}
                                    dynamicOptions={handleReactSelectDropDownOptions(panelList, "PanelName", "PanelID")}
                                    handleChange={handleReactSelect}
                                    removeIsClearable={true}

                                />
                            

 <button
                                    className="btn btn-sm btn-success px-3 ml-2"
                                    type="button"
                                    onClick={handleBillClose}
                                >
                                    {t("Bill Close")}
                                </button>
                        </div>

                    </div>
                    <div className="patient_registration card mt-2">
                        <Heading
                            title={t("Patient Advance CMS Details")}
                            isBreadcrumb={false}
                        />
                        <div className="row p-2">
                            <Input
                                type="number"
                                className="form-control"
                                lable={t("Sancation No")}
                                placeholder=" "
                                id="sancationNo"
                                name="sancationNo"
                                onChange={handleChange}
                                value={values?.sancationNo}
                                required={true}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                onKeyDown={Tabfunctionality}
                            />
                            <DatePicker
                                className="custom-calendar"
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                id="sancationdate"
                                name="sancationdate"
                                value={
                                    values.sancationdate
                                        ? moment(values?.sancationdate, "YYYY-MM-DD").toDate()
                                        : null
                                }
                                handleChange={handleChange}
                                lable={t("Sancation Date")}
                            // placeholder={VITE_DATE_FORMAT}
                            />
                            <Input
                                type="number"
                                className="form-control"
                                lable={t("Sancation amount")}
                                placeholder=" "
                                id="amount"
                                name="amount"
                                onChange={handleChange}
                                value={values?.amount}
                                required={true}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                onKeyDown={Tabfunctionality}
                            />
                            <Input
                                type="number"
                                className="form-control"
                                lable={t("Cash Amount")}
                                placeholder=" "
                                id="cash"
                                name="cash"
                                onChange={handleChange}
                                value={values?.cash}
                                required={true}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                onKeyDown={Tabfunctionality}
                            />
                            <Input
                                type="number"
                                className="form-control"
                                lable={t("Serial No")}
                                placeholder=" "
                                id="serialNo"
                                name="serialNo"
                                onChange={handleChange}
                                value={values?.serialNo}
                                required={true}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                onKeyDown={Tabfunctionality}
                            />

                            <ReactSelect
                                placeholderName={t("Patient Status")}
                                name="patientStatus"
                                value={values?.patientStatus}
                                handleChange={handleReactSelect}
                                dynamicOptions={PATIENT_STATUS}
                                searchable={true}
                                id={"patientStatus"}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            />
                            <Input
                                type="text"
                                className="form-control"
                                lable={t("ID No")}
                                placeholder=" "
                                id="iD_NO"
                                name="iD_NO"
                                onChange={handleChange}
                                value={values?.iD_NO}
                                required={true}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                                onKeyDown={Tabfunctionality}
                            />
                            <ReactSelect
                                placeholderName={t("ON/FF LINE")}
                                name="oN_OFF_LINE"
                                value={values?.oN_OFF_LINE}
                                handleChange={handleReactSelect}
                                dynamicOptions={ON_OFF_OPTIONS}
                                searchable={true}
                                id={"oN_OFF_LINE"}
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            />
                            <TextAreaInput
                                id="remarks"
                                lable={t("Remarks")}

                                className="w-1/2 h-24"
                                name="remarks"
                                value={values?.remarks}
                                onChange={handleChange}
                                placeholder=" "
                                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            />
                            <div>
                                <button
                                    className="btn btn-sm btn-success px-3 ml-2"
                                    type="button"
                                    onClick={handleSave}
                                >
                                    {t("Save")}
                                </button>
                            </div>
                        </div>

                    </div>
                   { bodyData?.length>0 &&
                   <div className="patient_registration card mt-2">
                        <Heading
                            title={t("Patient Advance CMS Details")}
                            isBreadcrumb={false}
                        />
                        <div className="row p-2">
                            <Tables
                                thead={[

                                    { name: t("S.No"), width: "1%" },
                                    { name: t("Patient Name"), width: "1%" },
                                    { name: t("Sancation No.") },
                                    { name: t("Sancation Date") },
                                    { name: t("Sancation Amount") },
                                    { name: t("Cash Amount") },
                                    { name: t("Entry Date") },
                                    { name: t("Serial No"), width: "1%" },
                                    { name: t("Remarks"), width: "1%" },
                                    { name: t("Emp Name"), width: "1%" },
                                    { name: t("Action"), width: "1%" },

                                ]}
                                tbody={bodyData?.map((item, index) => (
                                    {
                                        sNO: index + 1,
                                        patientName: item?.Name,
                                        sancationNo: item?.Sancationno,
                                        sancationdate: item?.Sancationdate,
                                        sancationAmount: item?.Amount,
                                        cashAmount: item?.Cash,
                                        entryDate: item?.EntryDate,
                                        serialNo: item?.SerialNo,
                                        remarks: item?.Remarks,
                                        empName: item?.EmpName,
                                        action:<i onClick={()=>handleEdit(item)} className="fa fa-edit me-1"></i> ,
                                    }
                                ))}


                            />

                        </div>

                    </div>}

                </>
            )}
             {modalData?.visible && (
                                <Modal
                                    visible={modalData?.visible}
                                    setVisible={() => { setModalData({ visible: false }) }}
                                    modalData={modalData?.URL}
                                    modalWidth={modalData?.width}
                                    Header={modalData?.label}
                                    buttonType="button"
                                    footer={modalData?.footer}
                                >
                                    {modalData?.Component}
                                </Modal>
                            )}
        </div>
    )
}

export default PatientAdvanceCMS