import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '../../../../components/UI/Heading';
import ReportDatePicker from '../../../../components/ReportCommonComponents/ReportDatePicker';
import moment from 'moment';
import { addmissionReportApi, creditBillPanelwiseApi } from '../../../../networkServices/BillingsApi';
import { RedirectURL } from '../../../../networkServices/PDFURL';
import { exportToExcel } from '../../../../utils/exportLibrary';
import ReactSelect from '../../../../components/formComponent/ReactSelect';
import { BillingBindReportOption } from '../../../../networkServices/MRDApi';
import { handleReactSelectDropDownOptions } from '../../../../utils/utils';
import MultiSelectComp from '../../../../components/formComponent/MultiSelectComp';
import { EDPBindPanelsAPI } from '../../../../networkServices/EDP/edpApi';
import { BindDoctorDept } from '../../../../networkServices/EDP/karanedp';
import { notify } from '../../../../utils/ustil2';

const CreaditBillReport = ({ reportTypeID }) => {
    const [t] = useTranslation();
    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        fileType: "1",
        billType: "0",
        ReportType: "",
        doctor: [],
        Panel: [],

    }

    const [values, setValues] = useState({ ...initialValues });
    console.log("values", values)
    const [dropDownState, setDropDownState] = useState({
        RoomType: [],
        ReportOption: [],
        DoctorList: [],
        PanelList: [],
        // Floor:[]
    })
    const getPanelList = async () => {
        try {
            const response = await EDPBindPanelsAPI();
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    PanelList: handleReactSelectDropDownOptions(
                        response?.data,
                        "Company_Name",
                        "PanelID"
                    ),
                }));
            }
            else {
                setDropDownState([])

            }
            return response;

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const bindDropdownData = async () => {
        const [DoctorList] = await Promise.all([
            BindDoctorDept("All"),
            //   getBindCenterAPI()
        ]);

        // if (CentreList?.success) {
        //   setDropDownData((val) => ({ ...val, CentreList: handleReactSelectDropDownOptions(CentreList?.data, "CentreName", "CentreID") }))
        // }

        if (DoctorList?.success) {
            setDropDownState((val) => ({ ...val, DoctorList: handleReactSelectDropDownOptions(DoctorList?.data, "Name", "DoctorID") }))
        }
    }
    const BindReportOption = async () => {
        try {
            const response = await BillingBindReportOption(reportTypeID);
            if (response?.success) {
                setDropDownState((val) => ({
                    ...val,
                    ReportOption: handleReactSelectDropDownOptions(
                        response?.data,
                        "TypeName",
                        "TypeID"
                    ),
                }));

            }
            else {
                setDropDownState([])

            }
            //   return response;

        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    useEffect(() => {
        BindReportOption()
        bindDropdownData()
        getPanelList()
    }, [])
    const handleMultiSelectChange = (name, selectedOptions) => {
        debugger
        if (name === "Panel") {
            setValues((preV) => ({
                ...preV,
                doctor: [],
                [name]: selectedOptions
            }))
        }
        else if (name === "doctor") {
            setValues((preV) => ({
                ...preV,
                Panel: [],
                [name]: selectedOptions
            }))
        }
        else {
            setValues({ ...values, [name]: selectedOptions });

        }
    };
    const handleReactSelectChange = (name, e) => {
        // debugger
        const obj = { ...values };
        obj[name] = e?.value;
        setValues(obj);
    };
    const handleReport = async () => {
        if (!values?.ReportType) {
            notify("Report Type Is Required", "warn")
            return
        }
        const panelValue = values?.Panel?.map(item => `'${item.code}'`).join(',');
        const doctorValue = values?.doctor?.map(item => `'${item.code}'`).join(',');
        if (values?.ReportType == "2") {
            if (!doctorValue) {
                notify("Doctor Field Is Required", "warn")
                return
            }
        }
        else {
            if (!panelValue) {
                notify("Panel Field Is Required", "warn")
                return
            }
        }
        const payload =


        {
            fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
            toDate: moment(values?.toDate).format("YYYY-MM-DD"),
            rType: values?.ReportType ?? 0,
            itemIds: values?.ReportType === 2 ? doctorValue : panelValue,
            fileType: Number(values?.fileType),
            "isBillClose": Number(values?.billType)

        }

        //         {
        //   "fromDate": "string",
        //   "toDate": "string",
        //   "fileType": 0,
        //   "isBillClose": 0,
        //   "rType": 0,
        //   "itemIds": "string"
        // }
        try {
            const response = await creditBillPanelwiseApi(payload);
            if (response?.success) {
                if (payload?.fileType === 0) {
                    const filterField = response?.data?.map(item => {
                        const { toDate, reportName, fromDate, logo, ...rest } = item;
                        return rest;
                    });

                    exportToExcel(filterField, "Creadit Bill Report");
                } else {
                    RedirectURL(response?.data?.pdfUrl);
                }
            } else {
                notify(response?.message || "Error fetching report", "error");
            }
        } catch (error) {
            console.error("Census report fetch failed", error);
            notify("Something went wrong", "error");
        }
    }
    return (
        <div className="card">
            <Heading isBreadcrumb={false} title={"Creadit Bill Report"} />
            <div className="row p-2">

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

                <ReactSelect
                    placeholderName={t("Report Type")}
                    id={"ReportType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 colt-sm-6 col-12"

                    dynamicOptions={[
                        // { label: "All", value: "0" },
                        ...(dropDownState?.ReportOption || [])
                    ]}

                    name="ReportType"
                    handleChange={handleReactSelectChange}
                    value={values.ReportType}
                    requiredClassName={"required-fields"}
                />


                {
                    values?.ReportType === 2 &&
                    <div className="col-xl-2 col-md-4 col-sm-4 col-12">


                        <MultiSelectComp
                            placeholderName={t("Doctor")}
                            id={"doctor"}
                            name="doctor"
                            value={values?.doctor}
                            requiredClassName={"required-fields"}
                            handleChange={handleMultiSelectChange}
                            dynamicOptions={dropDownState?.DoctorList?.map((item) => ({
                                name: item?.label,
                                code: item?.value,
                            }))}
                            searchable={true}

                        />
                    </div>

                }
                {
                    values?.ReportType === 6 &&
                    <div className="col-xl-2 col-md-4 col-sm-4 col-12">


                        <MultiSelectComp
                            placeholderName={t("Panel")}
                            id={"Panel"}
                            name="Panel"
                            value={values?.Panel}
                            requiredClassName={"required-fields"}
                            handleChange={handleMultiSelectChange}
                            dynamicOptions={dropDownState?.PanelList?.map((item) => ({
                                name: item?.label,
                                code: item?.value,
                            }))}

                            searchable={true}

                        />

                    </div>

                }
                <ReactSelect
                    placeholderName={t("Bill Type")}
                    id={"billType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-2 colt-sm-4 col-12"

                    dynamicOptions={[
                        { label: "Open", value: "0" },
                        { label: "Close", value: "1" },

                    ]}

                    name="billType"
                    handleChange={handleReactSelectChange}
                    value={values?.billType}
                />
                <ReactSelect
                    placeholderName={t("fileType")}
                    id={"fileType"}
                    searchable={true}
                    respclass="col-xl-1 col-md-2 col-sm-3 col-12"
                    dynamicOptions={[
                        { label: "Pdf", value: "1" },
                        { label: "Excel", value: "0" },
                    ]}
                    name="fileType"
                    handleChange={handleReactSelectChange}
                    value={values.fileType}
                />
                <div className="col-sm-1">
                    <button className="btn btn-sm btn-success mx-1" onClick={handleReport} >Report</button>
                </div>
            </div>
        </div>
    )
}

export default CreaditBillReport;