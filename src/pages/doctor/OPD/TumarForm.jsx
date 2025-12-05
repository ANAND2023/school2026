import React, { useEffect, useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/formComponent/Input';
import { useDispatch } from 'react-redux';
import { CentreWiseCacheByCenterID } from '../../../store/reducers/common/CommonExportFunction';
import { notify } from '../../../utils/ustil2';
import {
    getConditionOfPatientDropdownApi,
} from '../../../networkServices/nursingWardAPI';
import moment from 'moment';
import Tables from '../../../components/UI/customTable';
import { exportToExcel } from '../../../utils/exportLibrary';
import { MRDPatientInfoApi } from '../../../networkServices/MRDApi';
import FullTextEditor from '../../../utils/TextEditor';
import { DoctorGetTumorSavedData, DoctorSaveTumarBordMeeting, DoctorUpdateStatus } from '../../../networkServices/DoctorApi';
import ReportDatePicker from '../../../components/ReportCommonComponents/ReportDatePicker';

const TumarForm = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { VITE_DATE_FORMAT } = import.meta.env;
  
    const [patientRaw, setPatientRaw] = useState(null);
    const [editorValue, setEditorValue] = useState(false);
    const [values, setValues] = useState({
        Id: 0,
        toDate: new Date(),
        fromDate: new Date(),
        MeetingDate: new Date(),
        MeetingNo: ""
    })
    console.log("values", values)
    const [datalist, setDataList] = useState([])
    const [patientDropdown, setPatientDropdown] = useState([]);
    const [Editable, setEditable] = useState(false)
    const [clearEditor, setClearEditor] = useState(false);

    const Thead = [
        { name: t("S.No."), width: "1%" },
        { name: t("Reg No"), width: "2%" },
        { name: t("Name"), width: "3%" },
        { name: t("Meeting Date"), width: "3%" },
        { name: t("Entry Date"), width: "4%" },
        { name: t("description By"), width: "80%" },
        // { name: t("ID"), width: "10%" },
        { name: t("Action"), width: "2%" },
    ]


    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setValues((val) => ({ ...val, [name]: value }));
    }

    const CentreWiseCacheByCenterIDAPI = async () => {
        await dispatch(CentreWiseCacheByCenterID({}));
    }
    const fetchdata = async () => {
        try {

            const response = await getConditionOfPatientDropdownApi()
            if (response?.success) {
                setPatientDropdown(response?.data)
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")

        }
    }

    const fetchList = async () => {

        try {
            const params = {
                fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
                toDate: moment(values?.toDate).format("YYYY-MM-DD"),
                PatientID:""
            }

            const resp = await DoctorGetTumorSavedData(params);       if (resp?.success) {
                setDataList(resp?.data);
            } else {
             
                notify(resp?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }
    const handleExcel = async () => {

        try {
            const params = {
                fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
                toDate: moment(values?.toDate).format("YYYY-MM-DD"),
                 PatientID:""
            }

            const resp = await DoctorGetTumorSavedData(params);
            if (resp?.success) {
      // 🔹 Clean descr (remove <div>, <p>, etc.)
      const cleanedData = resp.data.map(item => ({
        ...item,
        descr: item?.descr
          ? item.descr.replace(/<\/?[^>]+(>|$)/g, "") // strip all HTML tags
          : ""
      }));

      exportToExcel(cleanedData, "Tumor Form");
            // if (resp?.success) {
            //     exportToExcel(resp?.data, "Tumar Form");
            } else {
                
                notify(resp?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }

    useEffect(() => {
        CentreWiseCacheByCenterIDAPI()
        fetchdata()
        fetchList()
    }, [])



    const handleSubmit = async () => {
        
        const payload = {
            "uhid": patientRaw?.PatientID ?? "",
            "meetinG_NO": String(values?.MeetingNo ?? ""),
            "descr": editorValue ?? "",
            "meetingDate": moment(values?.MeetingDate).format("YYYY-MM-DD"),
            "id": values?.Id??0
        }

        try {
            const response = await DoctorSaveTumarBordMeeting(payload);
            if (response?.success) {
                notify(response?.message, "success")
                setEditorValue("");
                setClearEditor(false);
 fetchList()
                setPatientRaw(null)
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }

    const handleEditRequest = (item) => {
        setPatientRaw(true)
        handleSearchByRegNo(item?.cr_no)
        
        setValues({
            ...values,
            Id: item?.ID,
            MeetingNo:String(item?.Meeting_No),
           MeetingDate: new Date(item?.Meeting_Date)
        });
        setEditorValue(item?.descr)
    }
    const handleDeleteRequest = async (ID) => {
        try {
            const resp = await DoctorUpdateStatus(ID);
            if (resp?.success) {
                notify(resp?.message, "success")
                fetchList()
             
            } else {
                notify(resp?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }

    const handleChangeeditor = (value) => {
        setEditorValue(value);
    };
    const handleSearchByRegNo = async (regNo) => {
        debugger
        setPatientRaw(null);
        if (!regNo ) {
            notify("Please enter Registration No.", "warn");
            return;
        }

        try {
            const res = await MRDPatientInfoApi(regNo);
            if (res?.success) {
                setPatientRaw(res?.data);
                
            } else {
                notify(res?.message, "error");
            }

        } catch (err) {
            notify(err?.message, "error");

        }
    };
    return (
        <div className=" card">
            <Heading isBreadcrumb={true} />
            <div className="row p-2">
                <Input
                    type="text"
                    className="form-control"
                    id="regNo"
                    lable={"Reg. No"}
                    placeholder=" "
                    value={values.regNo}
                    respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                    name="regNo"
                    onChange={handleChange}
                />
                <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                    <button className="btn btn-sm btn-primary me-2"
                    disabled={!!values?.Id }
                    onClick={()=>handleSearchByRegNo(values.regNo)}>
                        {t("Search")}
                    </button>

                </div>
            </div>


            {patientRaw && <> <Heading isBreadcrumb={false} title={"Issue Details"} />
                <div className="row p-2">
                    <Input
                        className={"form-control"}
                        readOnly={true}
                        lable={"CR No"}
                        value={patientRaw?.PatientID}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="crNo"
                    />

                    <Input
                        type="text"
                        id="dobOrAge"
                        className={"form-control"}
                        readOnly={true}

                        lable={"Date Of Birth / Age"}
                        value={patientRaw?.age}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="dobOrAge"
                        onChange={handleChange}
                    />

                    <Input
                        type="text"
                        id="patientName"
                        lable={"Patient Name"}
                        className={"form-control"}
                        readOnly={true}
                        value={patientRaw?.PName}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="patientName"
                        onChange={handleChange}
                    />

                    <Input
                        type="text"
                        id="doctorName"
                        className={"form-control"}
                        readOnly={true}
                        lable={"Doctor Name"}
                        value={patientRaw?.DoctorName}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="doctorName"
                        onChange={handleChange}
                    />



                </div>

                <div>
                    <Heading title={t("Blood Transfution")} />
                    <div className="row m-2">
                        <ReportDatePicker
                            className="custom-calendar"
                            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            id="MeetingDate"
                            name="MeetingDate"
                            lable={t("Meeting Date")}
                            values={values}
                            setValues={setValues}
                        // max={values?.MeetingDate}
                        />
                        
                        <Input
                            type="text"
                            className={"form-control "}
                            lable={t("Meeting No")}
                            placeholder=" "
                            name="MeetingNo"
                            onChange={handleInputChange}
                            value={values?.MeetingNo}
                            // required={false}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12 px-1"
                        />
                        <div className='col-sm-12'>

                            <FullTextEditor
                                value={editorValue}
                                // value={getTest}
                                setValue={handleChangeeditor}
                                EditTable={Editable}
                                setEditTable={setEditable}
                                clear={clearEditor}
                            />
                        </div>

                    </div>
                    <div className="p-2 d-flex justify-content-end">
                        <button
                            className="btn btn-sm btn-success"
                            onClick={handleSubmit}
                        >
                            {/* {("Save")} */}
                            {values?.Id ? t("Update") : t("Save")}
                        </button>
                         {
                                    !!values?.Id && <button
                                        className="btn btn-sm btn-success ml-2"
                                        onClick={() => {
                                            setValues(() => ({
                                                regNo: "",
                                                fromDate: new Date(),
                                                toDate: new Date()
                                            })),
                                                setPatientRaw(null);
                                        }}

                                    >
                                        Cancel
                                    </button>
                                }

                    </div>
                </div>
            </>}


            <Heading title={t("Tumor Board Meeting")} />
            <div className='row m-2 '>
                <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id="fromDate"
                    name="fromDate"
                    lable={t("fromDate")}
                    values={values}
                    setValues={setValues}
                    max={values?.toDate}
                />
                <ReportDatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    id="toDate"
                    name="toDate"
                    lable={t("toDate")}
                    values={values}
                    setValues={setValues}
                    max={new Date()}
                    min={values?.fromDate}
                />
               
                <button
                    className="btn btn-sm btn-success"
                    onClick={fetchList}
                >
                    {t("Search")}
                </button>
                <button
                    className="btn btn-sm btn-success ml-2"
                    type="button"
                    onClick={handleExcel}
             
                >
                    {t("Excel")}
                </button>
            </div>
            <>
                {datalist?.length > 0 && (
                    <div>
                        <Heading title={"TUMOR BOARD MEETING DETAILS LIST"} isBreadcrumb={false} />
                        <Tables thead={Thead} tbody={datalist?.map((item, index) => ({
                            "S.No": index + 1,
                            "Reg No": item?.cr_no,
                            "Name": item?.Pname,
                            "Meeting_Date": item?.Meeting_Date,
                            "EntryDate": `${moment(item?.EntryDateTime).format("DD-MM-YYYY")} ${moment(item?.EntryDateTime).format("hh:mm A")}`,
                            "description": (
                                <div   style={{
      whiteSpace: "normal",   // allow wrapping
      wordWrap: "break-word", // break long words
      overflowWrap: "anywhere", // modern way
      maxWidth: "100%" // optional: fix column width
    }} dangerouslySetInnerHTML={{ __html: item?.descr }} />
                            ),

                            // "ID": item?.ID,
                            "Action": (
                                <>
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={() => {
                                            handleEditRequest(item);
                                        }}
                                    >
                                        <i className='fas fa-edit'></i>
                                    </button>
                                    <button
                                        className="btn btn-secondary ml-2"
                                        type="button"
                                        onClick={() => {
                                            handleDeleteRequest(item?.ID);
                                        }}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </button>
                                   
                                </>
                            )
                        }))} />
                    </div>
                )}
            </>


        </div>
    )
}

export default TumarForm