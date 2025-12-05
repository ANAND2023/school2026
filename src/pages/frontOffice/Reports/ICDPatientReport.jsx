import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading'
import DatePicker from '../../../components/formComponent/DatePicker'
import moment from 'moment';
import { t } from 'i18next';
import { notify } from '../../../utils/ustil2';
import { SearchByICDDesc } from '../../../networkServices/DoctorApi';
import { AutoComplete } from 'primereact/autocomplete';
import { CancerPatientExcel_IPD, GetNonCancerReportExcel } from '../../../networkServices/opdserviceAPI';
import { exportToExcel } from '../../../utils/exportLibrary';

const ICDPatientReport = () => {

    const [values, setValues] = useState({
        fromDate: new Date(),
        toDate: new Date(),
    });

    const [selectedICDData, setSelectedICDData] = useState({
        diagnosis: "",
        icdDetails: [],
    });
    const [searchByICD, setSearchByICD] = useState({
        searchByICDDecs: "",
    });
    const [suggestions, setSuggestions] = useState([]);

    const [activeClass, setActiveClass] = useState("DS");

    const handleClickShiftChange = (classes) => {
        setActiveClass(classes);
    };
    console.log(selectedICDData, "selectedICDData")

    const HandleShiftPage = () => {
        return (
            <>
                <span
                    className={`pointer-cursor bold ${activeClass === "DS" ? "Active-Shift" : ""}`}
                    onClick={() => {
                        handleClickShiftChange("DS");
                    }}
                >
                    {" "}
                    {t("ICD Coding Date wise")}{" "}
                </span>
                <span
                    className={`pointer-cursor ml-2  bold ${activeClass === "RS" ? "Active-Shift" : ""}`}
                    onClick={() => {
                        handleClickShiftChange("RS");
                    }}
                >
                    {" "}
                    {t("ICD Coding Data")}{" "}
                </span>
            </>
        );
    };

    const handleChange = (e) => {
        setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
    };

    const SearchByICDDescData = async (query) => {
        try {
            const apiRes = await SearchByICDDesc({
                prefixText: query,
                count: 10,
            });
            // const apiRes = await getICDCodesApi(query)
            const data = apiRes?.data?.slice(0, 20)
            const suggestionData = data?.map((item) => ({
                WHO_Full_Desc: item?.WHO_Full_Desc,
                ICD10_3_Code: item?.ICD10_3_Code,
                ...item // Include the entire object for later use
            }))

            setSuggestions(suggestionData);

        } catch (error) {
            console.error(error);
        }
    };
    const SearchByICDDescgetData = (event) => {
        const { query } = event;
        SearchByICDDescData(query);
    };
    const handleChangebySerachByICD = (e, name) => {
        const { value } = e;
        setSearchByICD((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelect = (e) => {
        ;
        const selectedValue = e.value;
        let data = {
            id: selectedValue?.icd_id,
            transactionId: String(values?.transactions?.ipdNo),
            icd_Coding: String(selectedValue?.ICD10_Code),
            icd_Descr: String(selectedValue?.WHO_Full_Desc),
        }
        // handleDischargeSummaryICDDescriptionSave(data)
        setSelectedICDData((prev) => {

            return {

                icdDetails: [data]
            }
        });
        setSearchByICD({ searchByICDDecs: selectedValue?.WHO_Full_Desc });

    };
    const handleKeyPress = (e) => {

        if (e.key === "Enter" && suggestions.length > 0) {
            const selectedValue = suggestions[0];
            const isDuplicate = selectedICDData.some(
                (item) => item.ICD10_3_Code === selectedValue.ICD10_3_Code
            );

            if (!isDuplicate) {
                setSelectedICDData((prev) => [...prev, selectedValue]);
                setSearchByICD({ searchByICDDecs: "" });
            } else {
                const errorMessage = "This ICD code has already been added.";

                setSearchByICD({ searchByICDDecs: "" });
                notify(errorMessage, "error");
            }
        }
    };
    const itemTemplate = (item) => (
        <div>
            <strong>{item?.WHO_Full_Desc + " -" + item?.ICD10_Code}</strong>
        </div>
    );

    const handleSearch = async (Type) => {

        try {
            let payload = {
                fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
                toDate: moment(values?.toDate).format("YYYY-MM-DD"),
                type: Type,
            }
            let response = await GetNonCancerReportExcel(payload)
            if (response.success) {
                exportToExcel(response?.data, Type === "detail" ? "ICD Detail Report" : "ICD Coding Summary Report");
            }
            else {
                notify(response?.message, "error")
            }

        } catch (error) {

        }
    }

    const handleICDSearch = async () => {

        try {
            const response = await CancerPatientExcel_IPD(selectedICDData?.icdDetails?.length > 0 && selectedICDData?.icdDetails[0].icd_Coding)
            if (response.success) {
                exportToExcel(response?.data, "ICD Search Report");
            }
            else {
                notify(response?.message, "error")
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="card patient_registration ">
            <Heading
                title={t("Search_Criteria")}
                secondTitle={<HandleShiftPage />}
                isBreadcrumb={true}
            />

            {activeClass === "DS" ? <div className="row pt-2 px-2">
                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="fromDate"
                    name="fromDate"
                    value={moment(values?.fromDate).toDate()}
                    handleChange={handleChange}
                    lable={t("From Date")}

                />

                <DatePicker
                    className="custom-calendar"
                    respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                    id="toDate"
                    name="toDate"
                    value={moment(values?.toDate).toDate()}
                    handleChange={handleChange}
                    lable={t("To Date")}

                />

                <button
                    className="btn btn-sm btn-info ml-2"
                    type="button"
                    onClick={() => handleSearch("detail")}
                >
                    {t("ICD Detail")}
                </button>
                <button
                    className="btn btn-sm btn-info ml-2"
                    type="button"
                    onClick={() => handleSearch("summary")}
                >
                    {t("ICD Summary")}
                </button>

            </div>

                :
                <div className='row  row-cols-lg-7 row-cols-md-2 row-cols-1 p-2'>

                    <AutoComplete
                        completeMethod={(e) => SearchByICDDescgetData(e)}
                        className="tag-input px-2"
                        value={searchByICD.searchByICDDecs}
                        placeholder="Search By ICD Desc and press Enter"
                        onChange={(e) => handleChangebySerachByICD(e, "searchByICDDecs")}
                        suggestions={suggestions}
                        name={"searchByICDDecs"}
                        onSelect={handleSelect}
                        id="searchByICDDecs"
                        onKeyPress={handleKeyPress}
                        itemTemplate={itemTemplate}
                    />
                    <div className='m-auto'>
                        <button className='btn btn-primary'
                            onClick={handleICDSearch}
                        >
                            {t("Search")}
                        </button>
                        <button className='btn btn-primary mx-2'
                            onClick={
                                () => {
                                    setSearchByICD({ searchByICDDecs: "" })
                                    selectedICDData({
                                        diagnosis: "",
                                        icdDetails: [],
                                    })
                                }
                            }
                        >
                            {t("Clear")}
                        </button>
                    </div>
                </div>

            }



        </div>
    )
}

export default ICDPatientReport