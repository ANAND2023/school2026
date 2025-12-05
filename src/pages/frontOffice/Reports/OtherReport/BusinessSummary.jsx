
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '../../../../components/UI/Heading';
import ReportDatePicker from '../../../../components/ReportCommonComponents/ReportDatePicker';
import moment from 'moment';
import { addmissionReportApi, BillingDocBusinessSummaryReport, creditBillPanelwiseApi } from '../../../../networkServices/BillingsApi';
import { RedirectURL } from '../../../../networkServices/PDFURL';
import { exportToExcel } from '../../../../utils/exportLibrary';
import ReactSelect from '../../../../components/formComponent/ReactSelect';
import {  BillingSubCategoryDiscription } from '../../../../networkServices/MRDApi';
import { handleReactSelectDropDownOptions } from '../../../../utils/utils';
import MultiSelectComp from '../../../../components/formComponent/MultiSelectComp';
import { EDPBindPanelsAPI } from '../../../../networkServices/EDP/edpApi';

import { useLocalStorage } from '../../../../utils/hooks/useLocalStorage';
import { notify } from '../../../../utils/ustil2';

const BusinessSummary = ({ reportTypeID }) => {
    const [t] = useTranslation();
        const localData = useLocalStorage("userData", "get");
    const initialValues = {
        fromDate: new Date(),
        toDate: new Date(),
        fileType: "1",
        billType: "0",
        categoryId:"",
        ReportType:"",
        doctor:[],
        Panel:[],
          isLogo: { value: false }

    }
    
    const [values, setValues] = useState({ ...initialValues });
    console.log("values",values)
    const [dropDownState, setDropDownState] = useState({
        RoomType: [],
        ReportOption: [],
        DoctorList: [],
        PanelList: [],
          bindcategory: [],
          SubCategoryDisc: [],
        // Floor:[]
    })
    
          const SubCategoryDiscription = async () => {
                const DeptLedgerNo = localData?.deptLedgerNo;
                // const CategoryID = String(handlePayloadMultiSelect(values?.categoryId));
                try {
                    debugger;
                    const response = await BillingSubCategoryDiscription();
                    if (response?.success) {
                        setDropDownState((val) => ({
                            ...val,
                            SubCategoryDisc: handleReactSelectDropDownOptions(
                                response?.data,
                                "Description",
                                "Description"
                            ),
                        }))
                    }
        
                } catch (error) {
                    console.error(error);
                }
            };
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
   
    useEffect(() => {
        
        getPanelList()
       
        SubCategoryDiscription()
    }, [])
    const handleMultiSelectChange = (name, selectedOptions) => {
        debugger
        if(name==="Panel"){
            setValues((preV)=>({
                ...preV,
                doctor:[],
                [name]: selectedOptions 
            }))
        }
        else if(name==="doctor"){
            setValues((preV)=>({
                ...preV,
                Panel:[],
                [name]: selectedOptions 
            }))
        }
        else{
        setValues({ ...values, [name]: selectedOptions });

        }
    };
    
    const handleReactSelectChange = (name, e) => {
        debugger
        const obj = { ...values };
        obj[name] = e?.value;
        setValues(obj);
    };
    const handleReport = async () => {
      const panelValue = values?.Panel?.map(item => `${item.code}`).join(',');
      
        const payload =
        {
  "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
  "toDate":  moment(values?.toDate).format("YYYY-MM-DD"),
  "categoryName":values?.categoryId??"",
  "panelid": panelValue,
  "fileType": Number(values?.fileType??1),
  "logo":1
}

        try {
            const response = await BillingDocBusinessSummaryReport(payload);
            if (response?.success) {
                if (values?.fileType == 0) {
                   

                    exportToExcel(response?.data, `Investigation Business Summary Report ${moment(values?.fromDate).format("YYYY-MM-DD")} to ${moment(values.toDate).format("YYYY-MM-DD")}`);
                } else {
                    RedirectURL(response?.data?.pdfUrl);
                }
            } else {
                notify(response?.message || "Error fetching report", "error");
            }
        } catch (error) {
            console.error("Census report fetch failed", error);
            // notify("Something went wrong", "error");
        }
    }
    return (
        <div className="card">
            <Heading isBreadcrumb={false} title={"Investigation Business Summary"} />
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
                        // requiredClassName="required-fields"
                        placeholderName={t("SubCategory")}
                        id={"categoryId"}
                        searchable={true}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name={"categoryId"}
                        dynamicOptions={dropDownState?.SubCategoryDisc}
                        // dynamicOptions={DropDownState?.BindCategory}
                        value={values?.categoryId}
                        handleChange={handleReactSelectChange}

                    />
               
                {
                    // values?.ReportType === 6 &&
                    <div className="col-xl-2 col-md-4 col-sm-4 col-12">


                        <MultiSelectComp
                            placeholderName={t("Panel")}
                            id={"Panel"}
                            name="Panel"
                            value={values?.Panel}
                            // requiredClassName={"required-fields"}
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

export default BusinessSummary;