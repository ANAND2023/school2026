import React, { useEffect, useState } from 'react'
import Heading from '../UI/Heading';
import { useTranslation } from 'react-i18next';
import Input from '../formComponent/Input';
import FullTextEditor from '../../utils/TextEditor';
import { notify } from '../../utils/ustil2';
import { createNursingNotesApi, getNursingNote, deleteNursingNoteAPI } from '../../networkServices/nursingWardAPI';
import Tables from '../UI/customTable';
import moment from 'moment';
import { GetAllAuthorization } from '../../networkServices/BillingsApi';
const NursingNote = (props) => {
    const { patientID, ipdno, transactionID,status } = props?.data || {};
    const [values, setValues] = useState({
        isFinal: 0,
        isView: 0,
    })
    const [auth, setAuth] = useState([])
    const [tableData, setTableData] = useState([]);

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
    const [clearEditor, setClearEditor] = useState(false);
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
            const response = await createNursingNotesApi(payload)
            if (response?.success) {
                notify(response?.message, "success");
                handleBindDetails();
                setButtonType(false)
                setValues({})
                setEditorValue("")
                setClearEditor(true)
            } else {
                notify(response?.message, "error")
                setEditorValue("")
                setClearEditor(false);
            }
        } catch (error) {
            notify(error?.message, "error")
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
            const response = await createNursingNotesApi(payload)
            if (response?.success) {
                notify(response?.message, "success");
                handleBindDetails();
                setButtonType(false)
            } else {
                notify(response?.message, "error")
            }
        } catch (error) {
            notify(error?.message, "error")
        } finally {
            setValues({})
            setEditorValue("")
            setClearEditor(true);
        }
    }
    const handleEditTable = (row) => {

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
    const handleDelete = async (data) => {

        try {
            const payload = {
                ID: data?.Id
            }
            const response = await deleteNursingNoteAPI(payload)
            if (response?.success) {
                notify(response?.message, "success")
                handleBindDetails()
                setValues({})
                setEditorValue(false)
                setButtonType(false)
            } else {
                notify(response?.message, "error")
                setValues({})
                setEditorValue(false)
                setButtonType(false)
            }

        } catch (error) {
            notify(error?.message, "error")
        }
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
            const response = await getNursingNote(transactionID, patientID);
            setTableData(response?.data);
        } catch (error) {
            console.log(error, "Something Went Wrong");
        }
    }
    const handleCheckboxChange = async (name, checked) => {
        setValues({
            ...values,
            isFinal: checked ? 1 : 0
        })
        console.log(values);

    }

    // console.log(auth[0].CanEditNursingNote);

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

                <Heading title={"Nursing Notes"} isBreadcrumb={false} />

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


                                    {/* {buttontype ?
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={(e) => handleSaveNotes(e, "edit")}
                                            >
                                                {t("Update")}
                                            </button>
                                            :
                                        }
                                         */}

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

                                <button
                                    disabled={values?.isFinal === 1 ? true : false}
                                    className="btn btn-sm btn-primary mr-3"
                                    onClick={(e) => handleDraftSaveNotes(e, "add")}
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

export default NursingNote;