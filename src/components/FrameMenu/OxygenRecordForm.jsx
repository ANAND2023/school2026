import React, { useEffect, useState } from 'react'
import Heading from '../UI/Heading'
import { useTranslation } from 'react-i18next'
import DatePicker from '../formComponent/DatePicker';
import TimePicker from "../formComponent/TimePicker";
import ReactSelect from '../formComponent/ReactSelect';
import Tables from '../UI/customTable';
import { BindAvailablenurse, BindGetEquipmentMasterAll, bindOxygenData, bindOxygenRecord, SaveOxygenRecord, UpdateOxygenRecord, validateOxygenRecord, nursingoffbiomatricOxygenRecordApi } from '../../networkServices/nursingWardAPI';
import { handleReactSelectDropDownOptions, notify, reactSelectOptionList, timeFormateDate } from '../../utils/utils';
import moment from 'moment';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import Modal from '../modalComponent/Modal';
import OxygenRecordModel from '../modalComponent/Utils/OxygenRecordModel'
import { GetAllAuthorization } from '../../networkServices/BillingsApi';

const OxygenRecordForm = ({ data }) => {
    const {admitDate}=data
    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
    const TypeOfTherapy = [];
    const [auth, setAuth] = useState([]);
    console.log("firstauth", auth)
    for (let i = 1; i <= 12; i++) {
        TypeOfTherapy.push({ label: i.toString(), value: i.toString() });
    }

    const [availableNurse, setAvailableNurse] = useState([])
    const [tbody, setTbody] = useState([])
    const [equipmentlist, setEquipment] = useState([])
    let userData = useLocalStorage("userData", "get");

    let iniTialValue = { oxygenID: "", oxygenDateON: new Date(), nurseTimeOn: userData?.employeeID, timeOnCreatedBy: userData?.employeeID, patientID: data?.patientID, transactionID: data?.transactionID, type: "save", fillTimeON: 0 }
    const [values, setValues] = useState(iniTialValue)
    const [modalData, setModalData] = useState({});
    const [handleModelData, setHandleModelData] = useState({});
    const setIsOpen = () => {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
    };


    const thead = [
        { width: "1%", name: t("SNO") },
        t("DateON"),
        t("TimeON"),
        t("TimeONNurse"),
        t("DateOFF"),
        t("TimeOFF"),
        t("TimeOFFNurse"),
        // t("Therapy"),
        t("Equipment"),
        { width: "1%", name: t("Edit") },
    ]


    const GetBindAuthorization = async () => {
        try {
            const datas = await GetAllAuthorization();
            if (datas?.success) {
                setAuth(datas?.data);
            }
            else {
                console.log("error", datas?.message)
            }

        } catch (error) {
            console.log(error);
        }
    };
    const handleEdit = (val) => {
        
        if (data?.status === "OUT") {
          notify("Patient is already discharged. Editing is not allowed.", "warn");
            return
        }
        else {

            if (auth[0]?.CanEditNursingForm === 0) {
                notify("You are not authorized to edit this.", "warn");
                return
            }
        }
        setValues((item) => ({
            ...iniTialValue,
            type: "edit",
            oxygenDateON: new Date(val?.OxygenDateON),
            timeOn: timeFormateDate(val?.OxygenTimeON),
            nurseTimeOn: val?.NurseTimeON,
            timeOff: timeFormateDate(val?.OxygenTimeOFF),
            nurseTimeOff: val?.NurseTimeOFf,
            dateOff: new Date(val?.OxygenDateOFF),
            typeOfTherapy: val?.TypeOfTherapy,
            equipment: { label: val?.Equipment, value: val?.EquipmentId },
            isOxygenData: false,
            oxygenID: val?.ID,
        }))
    }

    const UpdateHandle = async (data ,originalRecord) => {
        
        try {

            const onDateTime = moment(
                `${moment(data.OxygenDateON).format('YYYY-MM-DD')} ${data.OxygenTimeON}`,
                // `${moment(originalRecord.OxygenDateON).format('YYYY-MM-DD')} ${originalRecord.OxygenTimeON}`,
                'YYYY-MM-DD h:mm A'
            );
            
            const offDateTime = moment(
                `${moment(data.dateOff).format('YYYY-MM-DD')} ${moment(data.timeOff).format('HH:mm')}`,
                'YYYY-MM-DD HH:mm'
            );
            if (offDateTime.isBefore(onDateTime)) {
                notify("Time OFF cannot be earlier than Time ON.", "error");
                return;
            }


            const payload = {
                oxygenID: data?.id ?? "",
                dateOff: data?.dateOff ?? "",
                timeOff: data?.timeOff ?? "",
                nurseTimeOff: data?.nurseTimeOff ?? "",
                typeOfTherapy: data?.typeOfTherapy ?? "",
            }
            
            const response = await nursingoffbiomatricOxygenRecordApi(payload)
            if (response?.success) {
                notify(response?.message, "success");
                setIsOpen();
                setValues(iniTialValue);
                SearchOxygenDataAPI()
                
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }
    const handleChangeModel = (inputData) => {
        setModalData(inputData)
    }
   
 const handleOpenModel = (value, index) => {
        setHandleModelData({
            label: t("Oxygen Record Model"),
            buttonName: t("update"),
            width: "40vw",
            isOpen: true,
            Component: <OxygenRecordModel inputData={value} handleChangeModel={handleChangeModel} />,
            handleInsertAPI: (modalData) => UpdateHandle(modalData, value),
            extrabutton: <></>,
        })

    }
    const SearchOxygenDataAPI = async () => {
        let apiResp = await bindOxygenRecord(data?.transactionID)
        if (apiResp?.success) {
            let data = []
            apiResp?.data?.map((val, i) => {
                let obj = {}
                obj.sno = i + 1
                obj.oxygenDateON = val?.OxygenDateON
                obj.timeOn = val?.OxygenTimeON
                obj.nurseTimeOn = val?.NurseTimeONBy
                obj.dateOff = val?.OxygenDateOFF
                obj.timeOff = val?.OxygenTimeOFF
                obj.nurseTimeOff = val?.NurseTimeOffBy
                // obj.typeOfTherapy = val?.TypeOfTherapy
                obj.equipment = val?.Equipment
                obj.edit = <>
                    <span className='btn btn-sm '>
                        <i className="fa fa-edit" aria-hidden="true" onClick={() => { handleEdit(val) }}></i>
                    </span>
                    <button className="btn btn-sm btn-primary ml-2" onClick={() => { handleOpenModel(val, i) }}>Off</button>
                </>
                data.push(obj);
            })
            setTbody(data);
            // setValues((val) => ({ ...val, fillTimeON: val?.fillTimeON,  }))
        } else {
            setTbody([])
        }
        let bindOxygenDetails = await bindOxygenData(data?.transactionID);
        if (bindOxygenDetails?.success) {
            const time = new Date();
            if (bindOxygenDetails?.data[0]?.OxygenTimeON) {
                const [hours, minutes, period] = bindOxygenDetails?.data[0]?.OxygenTimeON.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
                time.setHours(period === "PM" && hours !== "12" ? +hours + 12 : hours === "12" && period === "AM" ? 0 : +hours);
                time.setMinutes(+minutes);
            }
            setValues((val) => ({
                ...val,
                oxygenDateON: new Date(bindOxygenDetails?.data[0]?.OxygenDateON),
                timeOn: time,
                nurseTimeOn: bindOxygenDetails?.data[0]?.NurseTimeON,
                typeOfTherapy: bindOxygenDetails?.data[0]?.TypeOfTherapy,
                isOxygenData: true,
                // equipment: bindOxygenDetails?.data[0]?.Equipment,

            }))
        }

    }

    const bindNurseList = async () => {
        let availableNurses = await BindAvailablenurse();
        if (availableNurses?.success) {
            setAvailableNurse(availableNurses?.data)
        }
    }
    const bindequipment = async () => {
        try {
            let response = await BindGetEquipmentMasterAll();
            if (response?.success) {
                const data = reactSelectOptionList(
                    response?.data,
                    "Equipment",
                    "EquipmentId"
                );
                setEquipment(data)
            } else {
                notify(response?.message, "error");
            }
        } catch (error) {
            notify(error?.message, "error");
        }
    }


    useEffect(() => {
        SearchOxygenDataAPI()
        bindNurseList()
        bindequipment()
        GetBindAuthorization()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    };


    const ErrorHandling = () => {
        let errors = {};
        errors.id = [];
        if (!values?.oxygenDateON) {
            errors.oxygenDateON = "Oxygen Date ON Field Is Required";
        }
        if (!values?.timeOn) {
            errors.timeOn = "Time On Field Is Required";
        }
        if (!values?.nurseTimeOn) {
            errors.nurseTimeOn = "Nurse Time On Field Is Required";
        }
        // if (!values?.nurseTimeOff && values?.fillTimeON) {
        //     errors.nurseTimeOff = "Nurse Time Off Field Is Required";
        // }
        // if (!values?.dateOff && values?.fillTimeON) {
        //     errors.dateOff = "Date Off Field Is Required";
        // }
        // if (!values?.timeOff && values?.fillTimeON) {
        //     errors.timeOff = "Time Off Field Is Required";
        // }
        // if (!values?.typeOfTherapy) {
        //     errors.typeOfTherapy = "Type Of Therapy Field Is Required";
        // }
        return errors;
    };

    const SaveOxygenForm = async (type) => {
        const customerrors = ErrorHandling();
        if (Object.keys(customerrors)?.length > 1) {
            if (Object.values(customerrors)[0]) {
                notify(Object.values(customerrors)[1], "error");
            }
            return false;
        }
        values.oxygenDateON = moment(values.oxygenDateON).format("yyyy-MM-DD")
        // values.dateOff = moment(values.dateOff).format("yyyy-MM-DD")
        values.timeOn = moment(values?.timeOn).format("HH:mm")
        // values.timeOff = moment(values?.timeOff).format("HH:mm")

        let apiResp
        if (type === "save") {
            let validationOxyResp = await validateOxygenRecord(values);
            
            if (!validationOxyResp?.success) {
                const payload = {
                    oxygenID: 0,
                    dateOn: values?.oxygenDateON,
                    patientID: values?.patientID,
                    transactionID: values?.transactionID,
                    timeOnCreatedBy: values?.timeOnCreatedBy,
                    oxygenDateON: values?.oxygenDateON,
                    timeOn: values?.timeOn,
                    // dateOff: values?.dateOff,
                    // timeOff: values?.timeOff,
                    nurseTimeOn: values?.nurseTimeOn?.value ? values?.nurseTimeOn?.value : values?.nurseTimeOn,
                    // nurseTimeOff: values?.nurseTimeOff?.value
                    //     ? values?.nurseTimeOff?.value
                    //     : "0",
                    // typeOfTherapy: values?.typeOfTherapy?.value,
                    equipment: values?.equipment?.label ? values?.equipment?.label : values?.equipment ?? "",
                    equipmentId: values?.equipment?.value ? values?.equipment?.value : values?.equipment ?? "",
                }
                apiResp = await SaveOxygenRecord(payload);
            } else {
                notify(validationOxyResp.message, "error");
            }
        } else {

            //   payload.nurseTimeOn = payload.nurseTimeOn?.value
            //     ? payload.nurseTimeOn?.value
            //     : payload.nurseTimeOn;
            //   payload.nurseTimeOff = payload.nurseTimeOff?.value
            //     ? payload.nurseTimeOff?.value
            //     : payload.nurseTimeOff;
            // payload.typeOfTherapy = payload.typeOfTherapy?.value
            //     ? payload.typeOfTherapy?.value
            //     : payload.typeOfTherapy;

            const payload = {
                OxygenID: values?.oxygenID ?? 0,
                dateOn: values?.oxygenDateON,
                patientID: values?.patientID,
                transactionID: values?.transactionID,
                timeOnCreatedBy: values?.timeOnCreatedBy,
                oxygenDateON: values?.oxygenDateON,
                timeOn: values?.timeOn,
                // dateOff: values?.dateOff ?? "",
                // timeOff: values?.timeOff,
                nurseTimeOn: values.nurseTimeOn?.value
                    ? values.nurseTimeOn?.value
                    : values.nurseTimeOn,
                // nurseTimeOff: values?.nurseTimeOff?.value
                //     ? values?.nurseTimeOff?.value
                //     : values.nurseTimeOff,
                typeOfTherapy: values?.typeOfTherapy?.value ? values?.typeOfTherapy?.value : values?.typeOfTherapy,
                equipment: values?.equipment?.label ? values?.equipment?.label : values?.equipment,
                equipmentId: values?.equipment?.value ? values?.equipment?.value : values?.equipment ?? "",
            }
            apiResp = await UpdateOxygenRecord(payload);
        }
        if (apiResp?.success) {
            SearchOxygenDataAPI();
            setValues(iniTialValue);
            notify(apiResp.message, "success");
        } else {
            notify(apiResp.message, "error");
        }


    }

    const handleReactSelect = (name, value) => {
        setValues((val) => ({ ...val, [name]: value }));
    };

const onlyDate = moment(admitDate, "DD-MMM-YYYY hh:mm A").format("DD-MM-YYYY");

    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <form className="patient_registration card">
                    <Heading
                        title={t("Oxygen Usage Recording Sheet")}
                        isBreadcrumb={false} />

                    <div className="row p-2">
                        <div className='col-xl-2 col-md-4 col-sm-6 col-12 d-flex'>

                            <DatePicker
                                className={`custom-calendar `}
                                respclass="vital-sign-date"
                                id="oxygenDateON"
                                name="oxygenDateON"
                                inputClassName={"required-fields"}
                                value={values?.oxygenDateON ? values?.oxygenDateON : ""}
                                handleChange={handleChange}
                                // disable={values?.isOxygenData ? true : false}
                                lable={t("DateON")}
                                placeholder={VITE_DATE_FORMAT}
                                maxDate={new Date()}
                                 minDate={moment(onlyDate, "DD-MM-YYYY").toDate()}
                                             
                            />
                            <TimePicker
                                placeholderName={t("TimeON")}
                                lable={t("TimeON")}
                                id="timeOn"
                                respclass="vital-sign-time ml-1"
                                className="required-fields"
                                name="timeOn"
                                value={values?.timeOn ? values?.timeOn : ""}
                                handleChange={handleChange}
                                disable={values?.isOxygenData ? true : false}
                            />

                        </div>




                        <ReactSelect
                            placeholderName={t("NurseTimeON")}
                            dynamicOptions={handleReactSelectDropDownOptions(availableNurse, "NAME", "EmployeeID")}
                            name="nurseTimeOn"
                            inputId="nurseTimeOn"
                            requiredClassName={"required-fields"}
                            value={values?.nurseTimeOn ? values?.nurseTimeOn : ""}
                            removeIsClearable={true}
                            handleChange={handleReactSelect}
                            searchable={true}
                            isDisabled={values?.nurseTimeOn ? true : false}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />

                        {/* <div className='col-xl-2 col-md-4 col-sm-6 col-12 d-flex'>

                            <DatePicker
                                className={`custom-calendar `}
                                respclass="vital-sign-date"
                                id="dateOff"
                                name="dateOff"
                                inputClassName={"required-fields"}
                                value={values?.dateOff ? values?.dateOff : ""}
                                handleChange={handleChange}
                                lable={t("DateOFF")}
                                placeholder={VITE_DATE_FORMAT}
                            />
                            <TimePicker
                                placeholderName={t("TimeOFF")}
                                lable={t("TimeOFF")}
                                id="timeOff"
                                className="required-fields"
                                respclass="vital-sign-time ml-1"
                                name="timeOff"
                                value={values?.timeOff ? values?.timeOff : ""}
                                handleChange={handleChange}
                            />

                        </div> */}
                        {/* <ReactSelect
                            placeholderName={t("Nurse Time Off")}
                            name="nurseTimeOff"
                            inputId="nurseTimeOff"
                            requiredClassName={"required-fields"}
                            dynamicOptions={handleReactSelectDropDownOptions(availableNurse, "NAME", "EmployeeID")}
                            value={values?.nurseTimeOff ? values?.nurseTimeOff : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />
                        <ReactSelect
                            placeholderName={t("Type Of Therapy")}
                            dynamicOptions={TypeOfTherapy}
                            name="typeOfTherapy"
                            requiredClassName={"required-fields"}
                            inputId="typeOfTherapy"
                            value={values?.typeOfTherapy ? values?.typeOfTherapy : ""}
                            handleChange={handleReactSelect}
                            searchable={true}
                            removeIsClearable={true}
                            isDisabled={values?.isOxygenData ? true : false}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        /> */}

                        <ReactSelect
                            placeholderName={t("Select Equipment")}
                            name="equipment"
                            requiredClassName={"required-fields"}
                            inputId="equipment"
                            dynamicOptions={handleReactSelectDropDownOptions(equipmentlist, "label", "value")}
                            value={values?.equipment?.value ? values?.equipment?.value : values?.equipment}
                            handleChange={handleReactSelect}
                            searchable={true}
                            removeIsClearable={true}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        />

                        <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                            {values?.type === "save" ?
                                <button
                                    className="btn btn-sm btn-success"
                                    // style={{float:"right"}}
                                    disabled={data?.status === "OUT" ? true : false}
                                    type="button"
                                    onClick={() => { SaveOxygenForm("save") }}
                                >
                                    {t("save")}
                                </button> :
                                <button
                                    className="btn btn-sm btn-success "
                                    type="button"
                                    onClick={() => { SaveOxygenForm("update") }}
                                >
                                    {t("Update")}
                                </button>
                            }
                        </div>


                        {/* <div className="ml-2 mb-2 d-flex justify-content-end" >
                        <button className="btn btn-sm btn-success mr-2" type="button" >
                            {t("NursingWard.VitalSign.Save")}
                        </button>
                    </div> */}
                    </div>
                </form>
            </div>
            <div className="mt-2 spatient_registration_card card">


                <Tables
                    thead={thead}
                    tbody={tbody}
                />
            </div>
            {handleModelData?.isOpen && (
                <Modal
                    visible={handleModelData?.isOpen}
                    setVisible={setIsOpen}
                    modalWidth={handleModelData?.width}
                    Header={t(handleModelData?.label)}
                    buttonType={"submit"}
                    buttons={handleModelData?.extrabutton}
                    buttonName={handleModelData?.buttonName}
                    modalData={modalData}
                    setModalData={setModalData}
                    footer={handleModelData?.footer}
                    handleAPI={handleModelData?.handleInsertAPI}
                >
                    {handleModelData?.Component}
                </Modal>
            )}
        </>
    )
}

export default OxygenRecordForm;