import React, { useEffect, useState } from 'react'
import { BillingToolgetDropDownOfReportTypeName, BillingToolgetListOfReportNameReportType, BillingToolUpdateListOfReportTypeAndReportTypeMaster, getDropDownOfReportNameApi, getListOfReportNameApi, ToolgetDropDownOfReportTypeMaster, updateListOfReportRoleMappingApi } from '../../../networkServices/opdserviceAPI'
import Heading from '../../../components/UI/Heading'
import { useTranslation } from 'react-i18next';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import { handleReactSelectDropDownOptions } from '../../../utils/utils';
import { notify } from '../../../utils/ustil2';
import Tables from '../../../components/UI/customTable';
const ReportTable2 = () => {
    const [t] = useTranslation();
    const [values, setValues] = useState({
        reportName: ""
    })
    const [dropdown, setDropDown] = useState([])
    const [dropDownOfReportTypeName, setDropDownOfReportTypeName] = useState([])
    const [tableData, setTableData] = useState([]);

    const handleAllItemChecked = (e) => {
        const { name, checked } = e.target;
        const data = [...tableData];
        data.forEach((ele, _) => {
            ele[name] = checked ? 1 : 0;
        });
        setTableData(data);
    };
    const isMobile = window.innerWidth <= 800;
    const THEAD = [
        { width: "1%", name: t("SNo") },

        {
            width: "1%",
            name: isMobile ? "Checkbox" :
                <input
                    type="checkbox"
                    name="IsCheck"
                    checked={tableData?.every((ele, _) => ele?.IsCheck)}
                    onChange={handleAllItemChecked}
                />
        },
        t("Role Name"),

    ]
    const fetchList = async (id) => {
        try {
            const res = await getListOfReportNameApi(id)
            if (res?.success) {
                // setTableData(res?.data);
            } else {
                // setTableData([])
                notify(res?.message, "error")
            }
        } catch (error) {
            console.log(error, "error");

        }
    }
    const handleReactSelect = (name, value) => {
        
        setValues((val) => ({ ...val, [name]: value }))
        // fetchList(value.value)
    }


    const handleBindDropDown = async () => {
        const response = await ToolgetDropDownOfReportTypeMaster();
        if (response?.success) {
            setDropDown(response?.data)
        } else {
            setDropDown([])
        }
    }
    const handleSearchListOfReportNameReportType = async () => {
        if(!values?.reportName?.value){
            notify("Please Select Report Name","warn")
            return
        }
        if(!values?.Master?.value){
            notify("Please Select Type Name","warn")
            return
        }
        const payload = {
            "reportTypeNameId": Number(values?.reportName?.value),
            "reportTypeId": Number(values?.Master?.value),
        }
        try {
            const response = await BillingToolgetListOfReportNameReportType(payload);
            if (response?.success) {
                setTableData(response?.data)
                
            } else {
                // setDropDown([])
            }
        } catch (error) {
console.log("error",error)
        }
    }
    const getDropDownOfReportTypeName = async () => {
        const response = await BillingToolgetDropDownOfReportTypeName();
        if (response?.success) {
            setDropDownOfReportTypeName(response?.data)
        } else {
            setDropDownOfReportTypeName([])
        }
    }


    const handleCheckedItem = (e, index) => {
        const { name, checked } = e.target;
        const data = [...tableData];
        data[index][name] = checked ? 1 : 0;
        setTableData(data);
    };

    const handleTableData = (tableData) => {
        return tableData?.map((row, index) => {
            const { IsCheck, RoleName } = row
            return {
                "s.no": index + 1,

                isChecked: (
                    <input
                        type="checkbox"
                        name="IsCheck"
                        checked={IsCheck}
                        onChange={(e) => handleCheckedItem(e, index)}
                    />
                ),
                role: RoleName,
            }
        })
    }
    const handleSave = async () => {

        const data = 
        {
             "reportTypeId":Number(values?.Master?.value),
  "reportTypeNameId":Number(values?.reportName?.value),
            upList: tableData?.map((item) => ({
                // roleId: item?.RoleId || 0,
                // isCheck: item?.IsCheck ? 1 : 0, // convert boolean to 1 or 0


                
      "roleId": item?.ID || 0,
      "isCheck":  item?.IsCheck ? 1 : 0,
            })) || [],
        }
       
        const res = await BillingToolUpdateListOfReportTypeAndReportTypeMaster(data)
        if (res?.success) {
            notify(res?.message,"success")
        } else {
            notify(res?.message,"error")
        }
    }
    useEffect(() => {
        handleBindDropDown()
        getDropDownOfReportTypeName()
    }, [])

    return (
        <div
            className="card patient_registration border" >
                <Heading
        title={t("Sub-Report Mapping")}
        isBreadcrumb={false}
      />
            <div
                className="row w-full p-1"
            >
                <ReactSelect
                    placeholderName={t("reportName")}
                    id={"reportName"}
                    searchable={true}
                    respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                    value={values?.reportName}
                    name={"reportName"}
                    dynamicOptions={handleReactSelectDropDownOptions(dropDownOfReportTypeName, "ReportName", "ReportTypeNameId")}
                    // dynamicOptions={handleReactSelectDropDownOptions(dropdown, "ReportName", "ID")}
                    handleChange={handleReactSelect}
                    removeIsClearable={true}

                />
                <ReactSelect
                    placeholderName={t("Report Type")}
                    id={"Master"}
                    searchable={true}
                    respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                    value={values?.Master}
                    name={"Master"}
                    dynamicOptions={handleReactSelectDropDownOptions(dropdown, "TypeName", "ReportTypeId")}
                    // dynamicOptions={handleReactSelectDropDownOptions(dropdown, "ReportName", "ID")}
                    handleChange={handleReactSelect}
                    removeIsClearable={true}

                />
                    <button
                        // className="btn btn-sm btn-primary"
                        className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
                        onClick={handleSearchListOfReportNameReportType}
                    >
                        {t("Search")}
                    </button>
                {tableData?.some((row, _) => row?.IsCheck) && (
                    // <div className="d-flex align-items-end justify-content-end ">
                    <button
                        // className="btn btn-sm btn-primary"
                        className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
                        onClick={handleSave}
                    >
                        {t("Map Role")}
                    </button>
                    // </div>
                )}
            </div>
            <Tables isSearch={true} thead={THEAD} tbody={handleTableData(tableData)} style={{ height: "65vh", padding: "0px" }} />

        </div>
    )
}

export default ReportTable2;