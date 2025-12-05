import React, { useEffect, useState } from 'react'
import Heading from '../UI/Heading'
import { useTranslation } from 'react-i18next'
import DatePicker from '../formComponent/DatePicker';
import TimePicker from "../formComponent/TimePicker";
import Input from '../formComponent/Input';
import Tables from '../UI/customTable';
import { bindGasBloodChart, BloodGasChartPrintOutAPI, SaveBloodGasChart, UpdateBloodGasChart } from '../../networkServices/nursingWardAPI';
import moment from 'moment';
import { notify, timeFormateDate } from '../../utils/utils';
import { OpenPDFURL, RedirectURL } from '../../networkServices/PDFURL';
import TextAreaInput from '../formComponent/TextAreaInput';
import { GetAllAuthorization } from '../../networkServices/BillingsApi';

export default function ({ data }) {
    const [t] = useTranslation();
    const { VITE_DATE_FORMAT } = import.meta.env;
const {admitDate}=data
    let iniTialValue = {
        pid: data?.patientID,
        tid: data?.transactionID,
        type: "save",
        actiontaken: "",
        lactate: "",
        basedeficit: "",
        stdBicarbonate: "",
        ph: "",
        pO2: "",
        pcO2: "",
        mode: "",
        site: "",
        rateorP: "",
        peepCPap: "",
        pipmap: "",
        fio2: "",
        NotIssued: "",
        date:new Date()
    }
    const [values, setValues] = useState(iniTialValue)
    const [tbody, setTbody] = useState([1])
 const [auth, setAuth] = useState([]);
    const thead = [
        { width: "1%", name: t("SNo") },
        t("Date"),
        t("Time"),
        t("FiO"),
        t("PIPorMAP"),
        t("PEEPorCPAP"),
        t("RateorP"),
        t("Site"),
        t("Mode"),
        t("pCO"),
        t("pO"),
        t("pH"),
        t("StdBicarb"),
        t("Basedeficit"),
        t("Lactate"),
        // t("Actiontaken"),
         { width: "15%", name: t("Actiontaken") },
        t("EntryBy"),
        { width: "2%", name: t("Edit") },
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
            date: new Date(val?.DATE),
            time: timeFormateDate(val?.TIME),
            fio2: val?.FiO2,
            pipmap: val?.PIPorMAP,
            peepCPap: val?.PEEPorCPAP,
            rateorP: val?.RateorP,
            site: val?.Site,
            mode: val?.MODE,
            pcO2: val?.pCO2,
            pO2: val?.pO2,
            ph: val?.pH,
            stdBicarbonate: val?.StdBicarbonate,
            basedeficit: val?.Basedeficit,
            lactate: val?.Lactate,
            actiontaken: val?.ActionTaken,
            // actiontaken: val?.ActionTaken,
            id: val?.ID,
        }))
    }

    const SearchGasBloodChart = async () => {
        let apiResp = await bindGasBloodChart(data?.transactionID)

        if (apiResp?.success) {
            let data = []
            apiResp?.data?.map((val, i) => {
                let obj = {}
                obj.sno = i + 1
                obj.date = val?.DATE
                obj.time = val?.TIME
                obj.fio2 = val?.FiO2
                obj.pipmap = val?.PIPorMAP
                obj.peepCPap = val?.PEEPorCPAP
                obj.rateorP = val?.RateorP
                obj.site = val?.Site
                obj.mode = val?.MODE
                obj.pcO2 = val?.pCO2
                obj.pO2 = val?.pO2
                obj.ph = val?.pH
                obj.stdBicarbonate = val?.StdBicarbonate
                obj.basedeficit = val?.Basedeficit
                obj.lactate = val?.Lactate
                obj.actiontaken = <p style={{
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  }}>{val?.ActionTaken}</p>
                obj.Username = val?.Username
                obj.edit = <i className="fa fa-edit" aria-hidden="true" onClick={() => { handleEdit(val) }}></i>
                data.push(obj);
            })
            setTbody(data);
            setValues((val) => ({ ...val, fillTimeON: val?.fillTimeON }))
        } else {
            setTbody([])
        }
    }
    useEffect(() => {
        SearchGasBloodChart()
        GetBindAuthorization()
    }, [])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }))
    };

    const SaveBloodGasChartAPI = async (type) => {
        // console.log("27-Aug-2024",moment(values.date).format("DD-MMM-yyyy"))
        if (!values?.date) {
            notify("Date field is required", "error");
            return false
        }



        let apiResp
        if (type === "save") {
            apiResp = await SaveBloodGasChart(values);
        } else {
            apiResp = await UpdateBloodGasChart(values);
        }

        if (apiResp?.success) {
            SearchGasBloodChart();
            setValues(iniTialValue);
            notify(apiResp?.message, "success");
        } else {
            notify(apiResp?.message, "error");
        }

        if (apiResp?.status !== 200) {
            notify(apiResp?.data?.message, "error");
        }


    }

    const BloodGasChartPrintOut = async () => {

        let apiResp = await BloodGasChartPrintOutAPI(values?.tid);
        if (apiResp?.success) {
            RedirectURL(apiResp?.data?.pdfUrl);
        } else {
            notify(apiResp?.message, "error")
        }
        // OpenPDFURL("GasChartPrintOut", values?.tid);

    }
const onlyDate = moment(admitDate, "DD-MMM-YYYY hh:mm A").format("DD-MM-YYYY");

    return (
        <>
            <div className="mt-2 spatient_registration_card">
                <form className="patient_registration card">
                    <Heading
                        title={t("Blood Gas Chart")}
                        isBreadcrumb={false} />

                    <div className="row p-2">
                        <div className='col-xl-2 col-md-4 col-sm-6 col-12 d-flex'>

                            <DatePicker
                                className={`custom-calendar `}
                                respclass="vital-sign-date"
                                id="date"
                                name="date"
                                inputClassName={"required-fields"}
                                value={values?.date ? values?.date : ""}
                                handleChange={handleChange}
                                lable={t("Date")}
                                placeholder={VITE_DATE_FORMAT}
                                 minDate={moment(onlyDate, "DD-MM-YYYY").toDate()}
              maxDate={new Date()}
                            />
                            <TimePicker
                                placeholderName={t("Time")}
                                lable={t("Time")}
                                id="time"
                                respclass="vital-sign-time ml-1"
                                name="time"
                                value={values?.time ? values?.time : ""}
                                handleChange={handleChange}
                            />

                        </div>

                        <Input
                            type="text"
                            className="form-control "
                            id="fio2"
                            name="fio2"
                            value={values?.fio2 ? values?.fio2 : ""}
                            handleChange={handleChange}
                            onChange={handleChange}
                            lable={t("FiO")}
                            // lable={"FiO2"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="pipmap"
                            name="pipmap"
                            value={values?.pipmap ? values?.pipmap : ""}
                            onChange={handleChange}
                            lable={t("PIP or MAP")}
                            // lable={"PIP or MAP"}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="peepCPap"
                            name="peepCPap"
                            value={values?.peepCPap ? values?.peepCPap : ""}
                            onChange={handleChange}
                            lable={t("PEEP or CPAP")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="rateorP"
                            name="rateorP"
                            value={values?.rateorP ? values?.rateorP : ""}
                            onChange={handleChange}
                            lable={t("RateorP")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="site"
                            name="site"
                            value={values?.site ? values?.site : ""}
                            onChange={handleChange}
                            lable={t("Site")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="mode"
                            name="mode"
                            value={values?.mode ? values?.mode : ""}
                            onChange={handleChange}
                            lable={t("Mode")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="pcO2"
                            name="pcO2"
                            value={values?.pcO2 ? values?.pcO2 : ""}
                            onChange={handleChange}
                            lable={t("pCO")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="pO2"
                            name="pO2"
                            value={values?.pO2 ? values?.pO2 : ""}
                            onChange={handleChange}
                            lable={t("pO")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            // placeholderLabel={"mmHg"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="ph"
                            name="ph"
                            value={values?.ph ? values?.ph : ""}
                            onChange={handleChange}
                            lable={t("pH")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="stdBicarbonate"
                            name="stdBicarbonate"
                            value={values?.stdBicarbonate ? values?.stdBicarbonate : ""}
                            onChange={handleChange}
                            lable={t("Std Bicarb")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"°C"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="basedeficit"
                            name="basedeficit"
                            value={values?.basedeficit ? values?.basedeficit : ""}
                            onChange={handleChange}
                            lable={t("Base deficit")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholderLabel={"mmHg"}
                        />
                        <Input
                            type="text"
                            className="form-control "
                            id="lactate"
                            name="lactate"
                            value={values?.lactate ? values?.lactate : ""}
                            onChange={handleChange}
                            lable={t("Lactate")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"mmHg"}
                        />
<div className="col-xl-3 col-md-4 col-sm-4 col-12">
                         <TextAreaInput
                                                        lable={t("Action taken")}
                                                        className="w-500 required-fields "
                                                        id="actiontaken"
                                                        placeholder={""}
                                                        rows={3}
                                                        name="actiontaken"
                                                        value={values?.actiontaken ? values?.actiontaken : ""}
                                                        onChange={handleChange}
                                                        maxLength={1000}
                                                    />
                                                    {/* {handleIndicator(values?.actiontaken)} */}
                                                    </div>
                        {/* <Input
                            type="text"
                            className="form-control "
                            // maxLength="200"
                            id="actiontaken"
                            name="actiontaken"
                            value={values?.actiontaken ? values?.actiontaken : ""}
                            onChange={handleChange}
                            lable={t("Action taken")}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        // placeholderLabel={"mmHg"}
                        /> */}
                    </div>
                    <div className="ml-2 mb-2">
                        <button className="btn btn-sm btn-success ml-2" type="button" style={{ float: "right" }} onClick={BloodGasChartPrintOut} >
                            {t("print")}
                        </button>

                        {values?.type === "save" ?

                            <button className="btn btn-sm btn-success"
                            
                             disabled={data?.status==="OUT"?true:false}
                            type="button" style={{ float: "right" }}
                             onClick={() => { SaveBloodGasChartAPI("save") }}
                             >
                                {t("Save")}
                            </button>
                            :
                            <button className="btn btn-sm btn-success" type="button" style={{ float: "right" }} onClick={() => { SaveBloodGasChartAPI("update") }}>
                                {t("Update")}
                            </button>
                        }
                    </div>
                    
                </form>
            </div>
{
    tbody?.length>0 && <div className='patient_registration card'>
                <Heading
                    title={t("result")}
                    isBreadcrumb={false} />

                <Tables
                scrollView="scrollView"
                    thead={thead}
                    tbody={tbody}
                />
            </div>
}
            
        </>
    )
}
