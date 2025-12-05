import React, { useEffect, useState } from 'react'
import Heading from '../UI/Heading';
import { useTranslation } from 'react-i18next';
import Input from '../formComponent/Input';
import FullTextEditor from '../../utils/TextEditor';
import { notify } from '../../utils/ustil2';
import { createDoctorNotesApi, getDoctorNoteApi, deleteDoctorNoteAPI } from '../../networkServices/nursingWardAPI';
import Tables from '../UI/customTable';
import moment from 'moment';
import PageDisableOverlay from '../UI/PageDisableOverlay';
import { GetAllAuthorization } from '../../networkServices/BillingsApi';
const NewDoctorNote = (props) => {
    const { patientID, ipdno, transactionID ,status} = props?.data || {};
    const [values, setValues] = useState({
        isFinal: 0,
        isView: 0,
    })
    const [auth, setAuth] = useState([])
    const [tableData, setTableData] = useState([]);
    const [clearEditor, setClearEditor] = useState(false);
    const THEAD = [
        { name: "S.No", width: "10%", textAlign: "center" },
        { name: "Subject", width: "10%", textAlign: "left" },
        // { name: "Notes", width: "20%", textAlign: "left" },
        { name: "Entry By", width: "10%", textAlign: "left" },
        { name: "Entry Date", width: "10%", textAlign: "left" },
        { name: "IPDNo", width: "10%", textAlign: "left" },
        { name: "Action", width: "10%", textAlign: "center" },
    ];

    const [editorValue, setEditorValue] = useState(false);
    const [buttontype, setButtonType] = useState(false);
    const [Editable, setEditable] = useState(false)
    const handleChangeeditor = (value) => {
        setEditorValue(value);
    };
    const { t } = useTranslation()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((val) => ({ ...val, [name]: value }));
    };
    const getAuthDetails = async () => {
        const res = await GetAllAuthorization()
        if (res?.success) {
            setAuth(res?.data)
        } else {
            notify(res?.message, "error")
        }
    }
    const handleSaveNotes = async (e) => {
        if (!values?.subject) {
            notify("Subject Fields Is Required", "warn");
            return;
        }
        const payload = {
            id: values?.id == undefined ? "0" : String(values?.id),
            patientID: String(patientID),
            transactionId: String(transactionID),
            notes: editorValue ? String(editorValue) : "",
            subject: values?.subject ? String(values?.subject) : "",
            ipdno: String(ipdno),
            FinalSave: 1
        }
        try {
            const response = await createDoctorNotesApi(payload)
            if (response?.success) {
                notify(response?.message, "success");
                handleBindDetails();
                setButtonType(false)
                setValues({})
                setEditorValue("")
                setClearEditor(true);
            } else {
                notify(response?.message, "error")
                setEditorValue("")
                setClearEditor(true);
            }
        } catch (error) {
            notify(error?.message, "error")
        }
    }
    const handleEditTable = (row) => {

        if (status === "OUT") {
          notify("Patient is already discharged. Editing is not allowed.", "warn");
            return
        }
        else {

            if (auth[0]?.CanEditNursingForm === 0) {
                notify("You are not authorized to edit this.", "warn");
                return
            }
        }
        setValues({
            ...values,
            subject: row?.Subject,
            id: row?.Id,
            isFinal: row?.FinalSave,
            isView: 0,
        })
        const updated = row?.Notes ?? '';
        setEditorValue(updated);
        setEditable(true)
        setButtonType(true)
    }
    const handleViewTable = (row) => {
        setValues({
            ...values,
            subject: row?.Subject,
            id: row?.Id,
            isFinal: row?.FinalSave,
            isView: 1,
        })
        const updated = row?.Notes ?? '';
        setEditorValue(updated);
        setEditable(true)
    }

    const handleTable = (tableData) => {
        return tableData?.map((item, index) => {
            return {
                Sno: <div className="text-center">{index + 1}</div>,
                subject: item?.Subject,
                // notes: item?.Notes,
                Entry: item?.EntryBy,
                EntryDate: moment(item?.EntryDate).format("DD-MM-YYYY hh:mm A"),
                IPDNo: item?.IPDNo,
                Action: (
                    <div className="p-1">

                        {(auth[0]?.CanEditNursingNote === 1 || item?.FinalSave === 0) ? (
                            <span className="mx-1" onClick={() => handleEditTable(item)}>
                                <i className="fa fa-edit" aria-hidden="true"></i>
                            </span>
                        ) : null}

                        <span className="mx-1" onClick={() => handleViewTable(item)}>
                            <i className="fa fa-eye" aria-hidden="true"></i>
                        </span>
                        {/* <span
                            className="mx-1"
                            onClick={() =>
                                handleDelete(item)
                            }
                        >
                            <i className="fa fa-trash text-danger"></i>
                        </span> */}
                    </div>
                ),
            };
        });
    };
    const handleBindDetails = async () => {
        try {
            const response = await getDoctorNoteApi(transactionID, patientID);
            setTableData(response?.data);
        } catch (error) {
            console.log(error, "Something Went Wrong");
        }
    }

    const handleDraftSaveNotes = async (e) => {
        if (!values?.subject) {
            notify("Subject Fields Is Required", "warn");
            return;
        }
        const payload = {
            id: values?.id == undefined ? "0" : String(values?.id),
            patientID: String(patientID),
            transactionId: String(transactionID),
            notes: editorValue ? String(editorValue) : "",
            subject: values?.subject ? String(values?.subject) : "",
            ipdno: String(ipdno),
            FinalSave: 0
        }
        try {
            const response = await createDoctorNotesApi(payload)
            if (response?.success) {
                notify(response?.message, "success");
                handleBindDetails();
                setClearEditor(true);
            } else {
                notify(response?.message, "error")
                setClearEditor(false);
            }
        } catch (error) {
            notify(error?.message, "error")
        }
        finally {
            setButtonType(false)
            setValues({})
            setEditorValue("")
            setClearEditor(true);
        }
    }


    useEffect(() => {
        handleBindDetails()
        getAuthDetails()
    }, [])

    useEffect(() => {
        if (clearEditor && editorValue) {
            setEditorValue("");
            setClearEditor(false);
        }
    }, [clearEditor, editorValue]);
    return (
        <div className='mt-2 spatient_registration_card'>
            <div className='patient_registration card'>

                <Heading title={"New Doctor Notes"} isBreadcrumb={false} />

                <div className='p-2'>

                    <div className='d-flex justify-content-between flex-wrap'>

                        <Input
                            type="text"
                            className="form-control required-fields"
                            id="subject"
                            name="subject"
                            value={values?.subject ? values?.subject : ""}
                            onChange={handleChange}
                            lable={t("subject")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            placeholder=" "

                        />
                        {!values?.isView &&
                            <div className='col-xl-2 col-md-4 col-sm-6 col-12 p-2 d-sm-block d-none'>
                                <div className='d-flex g-5'>

                                    <button
                                        disabled={values?.isFinal === 1 ? true : false}
                                        className="btn btn-sm btn-primary mr-3"
                                        onClick={(e) => handleDraftSaveNotes(e)}
                                    >
                                        Draft
                                    </button>

                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={(e) => handleSaveNotes(e)}
                                         disabled={status==="OUT"?true:false}
                                    >

                                        {t("Save")}
                                    </button>

                                </div>
                            </div>
                        }
                    </div>

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
                    {!values?.isView &&
                        <div className='col-xl-2 col-md-4 col-sm-6 col-12 p-2  d-sm-none'>
                            <div className='d-flex '>
                                {/* <span >
                                        <label
                                            className="d-flex align-items-center mr-3"
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Checkbox
                                                id="isFinal"
                                                className="mt-2 mr-1"
                                                name="isFinal"
                                                onChange={(e) =>
                                                    handleCheckboxChange(e.target.name, e.target.checked)
                                                }
                                                disabled={values?.isFinal}
                                                checked={values?.isFinal}
                                            />
                                            {t("is Final")}
                                        </label>
                                    </span> */}
                                <button
                                    disabled={values?.isFinal === 1 ? true : false}
                                    className="btn btn-sm btn-primary mr-3"
                                    onClick={(e) => handleDraftSaveNotes(e)}
                                >
                                    Draft
                                </button>

                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={(e) => handleSaveNotes(e)}
                                >

                                    {t("Save")}
                                </button>
                            </div>

                        </div>
                    }

                </div>

                {tableData.length > 0 &&
                    <div className='patient_registration card'>
                        <Heading title={t("Nursing Notes List")} isBreadcrumb={false} />
                        <Tables thead={THEAD} tbody={handleTable(tableData)} />
                    </div>
                }

            </div>
        </div>
    )
}

export default NewDoctorNote;