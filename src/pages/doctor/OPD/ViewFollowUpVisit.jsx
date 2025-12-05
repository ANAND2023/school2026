import React, { useEffect } from 'react'
import Tables from '../../../components/UI/customTable'
import { useTranslation } from 'react-i18next';
import { DoctorFollowReport } from '../../../networkServices/DoctorApi';
import moment from 'moment';
import DatePicker from '../../../components/formComponent/DatePicker';
import { exportToExcel } from '../../../utils/exportLibrary';

const ViewFollowUpVisit = () => {

    const { t } = useTranslation();
    const THEAD = [
        { name: t("Sr.No"), width: "1%" },
        { name: t("Patient Name"), width: "5%" },
        { name: t("UHID"), width: "2%" },
        { name: t("Age"), width: "5%" },
        { name: t("Gender"), width: "5%" },
        { name: t("Mobile No."), width: "5%" },
        { name: t("Appt. Date-Time"), width: "5%" },
        { name: t("Follow Visit Date"), width: "5%" },
        { name: t("IsConverted"), width: "5%" },
        { name: t("Panel"), width: "5%" },
        { name: t("Doc.Name"), width: "5%" },
    ];
    const [values, setValues] = React.useState({
        fromDate: new Date(),
        toDate: new Date(),
    });
    const [tableData, setTableData] = React.useState([]);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const getFollowUpVisit = async () => {
        try {
            let payload = {
                "fromDate":values?.fromDate,
                "toDate":values?.toDate,
                // "fromDate":moment(values?.fromDate).format("YYYY-MM-DD"),
                // "toDate":moment(values?.toDate).format("YYYY-MM-DD"),

            }
            const response = await DoctorFollowReport(payload);
            if (response?.success) {
                setTableData(response?.data);
            } else {
                setTableData([]);
                console.log("message", response?.message);
            }
            console.log("firstresponse", response);
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };

    useEffect(() => {
        getFollowUpVisit();
    }, []);

    return (
        <div className='col-xl-12 col-md-12 col-sm-12 col-12'>
            <div className='row'>
                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mt-1">
                    <div className="form-group">
                        <DatePicker
                            className="custom-calendar"
                            id="fromDate"
                            name="fromDate"
                            lable={t("FromDate")}
                            // placeholder={VITE_DATE_FORMAT}
                            handleChange={handleChange}
                            // value={values?.Appfromdate}
                            value={values?.fromDate}
                            
                        />

                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-4 col-12 mt-1">
                    <div className="form-group">
                        <DatePicker
                            className="custom-calendar"
                            id="toDate"
                            name="toDate"
                            lable={t("ToDate")}
                            // placeholder={VITE_DATE_FORMAT}
                            handleChange={handleChange}
                            value={values?.toDate}
                           
                        />

                    </div>
                </div>
                <div className="col-xl-5 col-md-8 col-sm-5 col-12 mt-1 ">
                <button
                  className="btn btn-sm btn-success"
                  onClick={getFollowUpVisit}
                >
                  {t("Search")}
                </button>
                <button
                  className="btn btn-sm btn-success ml-3"
                  onClick={() => {
                      exportToExcel(tableData,"Follow-Up Visit");
                  }}
                >
                  {t("Download Excel")}
                </button>
              </div>
            </div>
            <Tables
                thead={THEAD}
                tbody={tableData?.length>0 ? tableData?.map((item, index) => ({
                    SrNo: index + 1,
                    PatientName: item?.PName || "",
                    UHID: item?.PatientID || "",
                    Age: item?.Age || "",
                    Gender: item?.gender || "",
                    MobileNo: item?.Mobile || "",
                    ApptDateTime: item?.AppointmentDateTime || "",
                    FollowVisitDate: item?.NextVisitFrom   || "",
                    IsConverted: item?.IsConverted || "",
                    Panel: item?.Panel || "",
                    DocName: item?.DoctorName || "",
                    colorcode: item?.IsConverted === "Yes" ? "#90EE90" : "",
                }))

                    : []}
                
            />
        </div>
    )
}

export default ViewFollowUpVisit