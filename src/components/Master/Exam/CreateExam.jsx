import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { t } from "i18next";
import Input from "../../formComponent/Input";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/ustil2";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { AcademicMasterget_all_term, create_exam, get_created_exam, GetAllExamTypes } from "../../../networkServices/School/exam";
import DatePicker from "../../formComponent/DatePicker";
import moment from "moment";
import Tables from "../../UI/customTable";

const CreateExam = () => {
    const { GetEmployeeWiseCenter } = useSelector(
        (state) => state?.CommonSlice
    );

    const userData = useLocalStorage("userData", "get");
    const { VITE_DATE_FORMAT } = import.meta.env;
    const initialState = {
        examName: "",
        examTypeId: { label: "", value: "" },
        term: { label: "", value: "" },
        branch: { label: "", value: "" },
        startDate: "",
        endDate: "",
        resultPublishDate: ""
    };

    const [values, setValues] = useState(initialState);
    const [term, setTerm] = useState([]);
    const [type, setType] = useState([]);
    const [tableData, setTableData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name, option) => {
        setValues((prev) => ({ ...prev, [name]: option }));
    };


    const fetchTerms = async () => {
        try {
            const response = await AcademicMasterget_all_term();
            // Checking response structure based on your provided JSON
            if (response && Array.isArray(response)) {
                setTerm(response);
            } else if (response?.success && response?.data) {
                setTerm(response.data);
            } else {
                setTerm([]);
            }
        } catch (error) {
            console.error("Error fetching terms:", error);
            setTerm([]);
        }
    };
    const ExamTypesGet = async () => {
        try {
            const response = await GetAllExamTypes();
            // Checking response structure based on your provided JSON
            if (response && Array.isArray(response)) {
                setType(response);
            } else if (response?.success && response?.data) {
                setType(response.data);
            } else {
                setType([]);
            }
        } catch (error) {
            console.error("Error fetching terms:", error);
            setType([]);
        }
    };
    const handleSave = async () => {
        if (!values.examName || !values.term.value || !values.branch.value) {
            notify(t("Please fill all mandatory fields"), "error");
            return;
        }

        const payload = {
            examName: values.examName,
            examTypeId: values.examTypeId?.value,
            termId: values.term.value,
            termName: values.term.label,
            startDate: moment(values.startDate).format("YYYY-MM-DD"),
            endDate: moment(values.endDate).format("YYYY-MM-DD"),
            resultPublishDate: moment(values.resultPublishDate).format("YYYY-MM-DD"),
            orgId: userData?.OrganizationId,
            orgName: userData?.OrganizationName ?? "Digital Vidhaya Sarthi Organization",
            branchId: values.branch.value,
            branchName: values.branch.label
        };
        try {
            const res = await create_exam(payload);
            if (res?.success) notify(t("Exam created successfully"), "success");
            else notify(t("Error creating exam"), "error");
        } catch (error) {
            console.log("error", error)
        }
    };
    const getAllExam = async (branch, term) => {
       

        const payload =
        {
            "orgId": userData?.OrganizationId,
            "branchId": values.branch.value,
            "examId": "",
            "termId": values.term.value,
        }

        try {
            const res = await get_created_exam(payload);
            if (res?.success) {
                setTableData(res?.data);
                notify(t("Exam created successfully"), "success");

            }
            else notify(t("Error creating exam"), "error");
        } catch (error) {
            console.log("error", error)
        }
    };

    useEffect(() => {
        fetchTerms();
        ExamTypesGet();
        getAllExam();
    }, []);
    useEffect(() => {
       
        getAllExam(values.branch?.value, values.term?.value, );
    }, [values.branch, values.term, ]);
    return (
        <>
            <div className="card border">
                <Heading title={t("Create Exam")} />

                <div className="card-body">
                    <div className="row">

                        <Input
                            lable={t("Exam Name")}
                            name="examName"
                            className="form-control"
                            value={values.examName}
                            onChange={handleChange}
                            respclass="col-md-4"
                        />



                        <ReactSelect
                            placeholderName="Term"
                            name="term"
                            className="form-control"
                            value={values.term}
                            handleChange={handleSelect}
                            respclass="col-md-4"
                            dynamicOptions={term?.map((b) => ({
                                value: b.id,
                                label: b.termName
                            }))}
                        />
                        <ReactSelect
                            placeholderName="Exam Type"
                            name="examTypeId"
                            className="form-control"
                            value={values.examTypeId}
                            handleChange={handleSelect}
                            respclass="col-md-4"
                            dynamicOptions={type?.map((b) => ({
                                value: b.id,
                                label: b.examTypeName
                            }))}
                        />

                        <ReactSelect
                            placeholderName="Branch"
                            className="form-control"
                            name="branch"
                            value={values.branch}
                            handleChange={handleSelect}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                            dynamicOptions={GetEmployeeWiseCenter?.map((b) => ({
                                value: b.id,
                                label: b.name
                            }))}
                        />
                        <DatePicker
                            id="startDate"
                            name="startDate"
                            placeholder={VITE_DATE_FORMAT}
                            lable={t("Start Date ")}
                            className="custom-calendar"
                            value={values?.startDate}
                            handleChange={handleChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        // maxDate={values?.toDate}
                        />
                        <DatePicker
                            id="endDate"
                            name="endDate"
                            placeholder={VITE_DATE_FORMAT}
                            lable={t("End Date")}
                            className="custom-calendar"
                            value={values?.endDate}
                            handleChange={handleChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        // maxDate={new Date()}
                        />
                        <DatePicker
                            id="resultPublishDate"
                            name="resultPublishDate"
                            placeholder={VITE_DATE_FORMAT}
                            lable={t("Result Publish Date")}
                            className="custom-calendar"
                            value={values?.resultPublishDate}
                            handleChange={handleChange}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        // maxDate={new Date()}
                        />



                        <div className="col-md-12 mt-3">
                            <button className="btn btn-primary btn-sm" onClick={handleSave}>
                                {t("Save Exam")}
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={getAllExam}>
                                {t("Get Exam")}
                            </button>
                        </div>

                    </div>
                </div>
                <Tables
                    thead={[
                        { name: t("S.No"), width: "5%" },
                        { name: t("orgName"), width: "35%" },
                        { name: t("branchName"), width: "35%" },
                        { name: t("examTypeName"), width: "35%" },
                        { name: t("examName"), width: "35%" },
                        { name: t("startDate"), width: "35%" },
                        { name: t("endDate"), width: "35%" },
                        { name: t("resultPublishDate"), width: "35%" },
                        { name: t("Action"), width: "10%", className: "text-center" }
                    ]}
                    tbody={tableData.map((item, index) => ({
                        "S.No": index + 1,
                        "orgName": item.orgName,
                        "branchName": item.branchName,
                        "examTypeName": item.examTypeName,
                        "examName": item.examName,
                        "startDate": moment(item.startDate).format("DD-MM-YYYY"),

                        "endDate": moment(item.endDate).format("DD-MM-YYYY"),
                        "resultPublishDate": moment(item.resultPublishDate).format("DD-MM-YYYY"),
                        "Action": (
                            <div className="text-center">
                                <i
                                    className="fa fa-edit text-primary me-2"
                                    style={{ cursor: "pointer", fontSize: "16px" }}
                                    onClick={() => handleEdit(item)}
                                    title={t("Edit")}
                                ></i>
                                <i
                                    className="fa fa-trash text-danger"
                                    style={{ cursor: "pointer", fontSize: "16px" }}
                                    onClick={() => handleDelete(item)}
                                    title={t("Delete")}
                                ></i>
                            </div>
                        )
                    }))}
                />
            </div>
        </>
    );
};

export default CreateExam;
