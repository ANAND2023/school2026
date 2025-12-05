import React, { useEffect, useState, useRef } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useSelector } from "react-redux";
import {
    getEmployeeWise,
    GetRoleListByEmployeeIDAndCentreID,
} from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
import {
    BindMedicineStoreDepartment,
    BindStoreGroup,
    BindStoreItems,
    BindStoreSubCategory,
    IssueDetail,
    SaveDirectMedicalIssue,
    SearchDirectDepartment,
    SearchItem,
} from "../../../networkServices/InventoryApi";
import { AutoComplete } from "primereact/autocomplete";
import Input from "../../../components/formComponent/Input";
import DirectDepartmentItemDetailsTable from "../../../components/UI/customTable/MedicalStore/DirectDepartmentItemDetailsTable";
import IssueItemDetailsTable from "../../../components/UI/customTable/MedicalStore/IssueItemDetailsTable";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import SearchItemEassyUI from "../../../components/commonComponents/SearchItemEassyUI";
import { BIND_TABLE_DEPARTMENT } from "../../../utils/constant";
import { GetDepartmentDetails } from "../../../networkServices/InventoryApi";
import { BindSupplier, DirectDepartmentReport, GetStore, ReportMenu, ReportSubMenu } from "../../../networkServices/BillingsApi";
import { RedirectURL } from "../../../networkServices/PDFURL";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import LabeledInput from "../../../components/formComponent/LabeledInput";

const SearchTable = () => {
    //   const localData = useLocalStorage("userData", "get");
    const [t] = useTranslation();
    
    const ip = useLocalStorage("ip", "get");
    const dispatch = useDispatch();
    const localdata = useLocalStorage("userData", "get");
  
    const [list, setList] = useState([]);
   
    const MedicineRef = useRef(null);
   
    const { GetEmployeeWiseCenter, GetRoleList } = useSelector(
        (state) => state.CommonSlice
    );

    console.log("GetRoleListGetRoleList", GetRoleList);
    const initialPayload = {
        centreID: localdata?.centreID,
        toDate: moment().format("YYYY-MM-DD"),
        fromDate: moment().format("YYYY-MM-DD"),
        DepartmentId: "LSHHI17",
        Quantity: "",
        ItemID: "",
        ItemName: "",
        IssueNo: "",
        RequisitionNo: "",
        IndentNo: "",
        categoryId: [],
        subcategoryId: [],
         itemId: [],
    };
    const [stockShow, setStockShow] = useState([]);
    const [item, setItem] = useState("");
    const [payload, setPayload] = useState({ ...initialPayload });
    console.log("Payload", payload);
    const [subGroup, setSubGroup] = useState([]);
   
    const search = async (searchItem) => {
        const Subcategory = handlePayloadMultiSelect(payload?.subcategoryId);
        const ItemName = searchItem || item;

        // const ItemName = values?.TypeName;
        try {
            if (ItemName?.length > 2) {
                const response = await BindStoreItems(Subcategory, ItemName);
                setStockShow(response?.data || []);
            }
        } catch (error) {
            console.log(error, "SomeThing Went Wrong");
        }
    };
    const handleSelectRow = (e) => {
        
        const { value } = e;
        console.log(value);
        // setNewRowData([value]);
        setNewRowData((prevData) => {
            if (prevData.some((item) => item.ItemID === value.ItemID)) {
                return prevData;
            }
            return [...prevData, value];
        });
     
        setPayload((prevPayload) => ({
            ...prevPayload,
            ItemID: Array.isArray(value?.ItemID)
                ? value.ItemID.join(", ")
                : value?.ItemID,
        }));
        setItem("");
    };
    const itemTemplate = (item) => {

        return (
            <div className="p-clearfix">
                <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
                    {item?.TypeName}
                </div>
            </div>
        );
    };
    useEffect(() => {
        dispatch(
            GetRoleListByEmployeeIDAndCentreID({
                employeeID: localdata?.employeeID,
                centreID: payload?.centreID,
            })
        );
        if (localdata?.employeeID) {
            dispatch(getEmployeeWise({ employeeID: localdata?.employeeID }));
        }
    }, []);

    // const [newRowData, setNewRowData] = useState({});
      const [newRowData, setNewRowData] = useState([]);
    const [DropDownState, setDropDownState] = useState({
        bindreportlist: [],
        bindStore: [],
        binddepartment: [],
        bindcategory: [],
        issuedetail: [],
        bindsupply: [],
    });
    const [tableData, setTableData] = useState([]);
    // console.log("TableData", tableData);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setPayload((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const searchHandleChange = (e) => {
        const { name, value } = e.target;
        setPayload((prevState) => ({
            ...prevState,
            [name]: moment(value).format("YYYY-MM-DD"),
        }));
    };


    const [issTabData, setIssTabData] = useState([]);
  

    const focusInput = (inputRef) => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        focusInput(MedicineRef);
    }, []);
    console.log(list);
  
  
 
   
    const Reprint = async (issNo) => {
       

        const paylaod = {
            SalesNo: issNo,
            CentreIDTo: payload?.centreID || localdata?.centreID,
            // UserValidateID: localdata?.userValidateID,
        };

        const response = await DirectDepartmentReport(paylaod);

        if (response?.success) {
            notify(response?.message, "success");
            RedirectURL(response?.data?.pdfUrl);
        } else {
            notify(response?.message, "error");
        }

        console.log("Payload", paylaod);
    };
    const { VITE_DATE_FORMAT } = import.meta.env;

    const handleSearch = async () => {
        debugger
        const Item =  newRowData?.map((val)=>val?.ItemID);
        let data = {
            salesNo: Number(payload?.IssueNo ?? 0),
            fromDate: payload?.fromDate ?? "",
            toDate: payload?.toDate??"",
            itemIDs: Item,
            indentNo: String(payload?.IndentNo ?? "")
        };



        console.log(data);

        let response = await SearchDirectDepartment(data);
        if (response?.success) {
            // notify(response?.message, "success");
            setIssTabData(response.data);
        } else {
            notify(response?.message, "error");
             setIssTabData([]);
        }
    };
    const issTabHead = [
        { name: t("S.No."), width: "1%" },
        { name: t("IssueNo"), with: "5%" },
        { name: t("Indent No."), with: "5%" },
        { name: t("ItemName"), with: "5%" },
        { name: t("BatchNumber"), with: "5%" },
        { name: t("FromDept"), with: "5%" },
        { name: t("DATE"), with: "5%" },
        { name: t("ToDept"), with: "5%" },

        { name: t("Status"), with: "5%" },
        { name: t("AcceptBy"), with: "5%" },
        { name: t("RePrint"), with: "5%" },
    ];
    const GetReportMenu = async () => {
        try {
            const response = await ReportMenu();
            return response?.data;
        } catch (error) {
            console.error(error);
        }
    };
   
    const GetBindStoreID = async () => {
        try {
            const response = await GetStore();
            return response?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const GetBindDepartment = async () => {
        const DeptID = localdata?.deptLedgerNo;
        try {
            const response = await BindMedicineStoreDepartment(DeptID);
            return response?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const getBindGroup = async () => {
        debugger
        const DeptLedgerNo = localdata?.deptLedgerNo;
        try {
            const response = await BindStoreGroup(DeptLedgerNo);
            return response?.data;
        } catch (error) {
            console.error(error);
        }
    };
    const getBindSupplier = async () => {
        try {
            const response = await BindSupplier();
            return response?.data;
        } catch (error) {
            console.error(error);
        }
    };

  
    const FetchAllDropDown = async () => {
        try {
            const [
                BindReportMenu,
                BindGetStore,
                BindStoreDept,
                BindGroupId,
                BindSupply,
            ] = await Promise.all([
                GetReportMenu(),
                GetBindStoreID(),
                GetBindDepartment(),
                getBindGroup(),
                getBindSupplier(),
            ]);
            console.log("BindGroupIdBindGroupId", BindGroupId)
            const dropDownData = {
                bindreportlist: handleReactSelectDropDownOptions(
                    BindReportMenu,
                    "ReportName",
                    "ID"
                ),
                bindStore: handleReactSelectDropDownOptions(
                    BindGetStore,
                    "LedgerName",
                    "LedgerNumber"
                ),
                binddepartment: handleReactSelectDropDownOptions(
                    BindStoreDept,
                    "ledgerName",
                    "ledgerNumber"
                ),
                bindcategory: handleReactSelectDropDownOptions(
                    BindGroupId,
                    "name",
                    "categoryID"
                ),
                bindsupply: handleReactSelectDropDownOptions(
                    BindSupply,
                    "LedgerName",
                    "LedgerNumber"
                ),
            };

            setDropDownState(dropDownData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const handlePayloadMultiSelect = (data) => {
        return data?.map((items, _) => String(items?.code))?.join(",");
    };
    const getBindStoreSubCategory = async () => {
        debugger
        const CategoryID = String(handlePayloadMultiSelect(payload?.categoryId));
        try {
            // debugger;
            const response = await BindStoreSubCategory(CategoryID);
            setSubGroup(response?.data);
            console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmm", response?.data);
        } catch (error) {
            console.error(error);
        }
    };
      const deleteDocument = (doc) => {
    console.log(doc);
    const docDetail = newRowData?.filter((val) => val.ItemID !== doc?.ItemID);
    // setValues((val) => ({ ...val, documentIds: docDetail }));
    setNewRowData(docDetail);
  };
    useEffect(() => {
        debugger
        if (payload?.categoryId?.length > 0) {
            getBindStoreSubCategory();
        }
    }, [payload.categoryId]);
    useEffect(() => {
        FetchAllDropDown()
    }, [])

    return (
        <>


            <div className="mt-2">
                <Heading isBreadcrumb={false} title={"View Details"} />
                <div className="card">
                    <div className="row p-2">
                        <Input
                            type="number"
                            className="form-control"
                            id="IssueNo"
                            name="IssueNo"
                            value={payload?.IssueNo}
                            onChange={handleChange}
                            lable={"Issue No."}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        />
                        <Input
                            type="text"
                            className="form-control"
                            id="IndentNo"
                            name="IndentNo"
                            value={payload?.IndentNo}
                            onChange={handleChange}
                            lable={"Indent No."}
                            placeholder=" "
                            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                        />
                        <ReportsMultiSelect
                            name="categoryId"
                            placeholderName={t("Groups")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            values={payload}
                            setValues={setPayload}
                            dynamicOptions={DropDownState?.bindcategory}
                            labelKey="name"
                            valueKey="categoryID"
                        />
                        <ReportsMultiSelect
                            name="subcategoryId"
                            placeholderName={t("Sub Groups")}
                            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                            values={payload}
                            setValues={setPayload}
                            dynamicOptions={subGroup}
                            labelKey="Name"
                            valueKey="SubCategoryID"
                        // disabled={values?.categoryId?.length > 0 ? false : true}
                        />
                        <div className="col-xl-2 col-md-4 col-sm-6 col-12 pb-2">
                            <AutoComplete
                                style={{ width: "100%" }}
                                value={item}
                                // suggestions={stockShow}
                                suggestions={Array.isArray(stockShow) ? stockShow : []}
                                completeMethod={() => search(item)}
                                className="w-100 "
                                onSelect={(e) => handleSelectRow(e)}
                                id="searchtest"
                                onChange={(e) => {
                                    const data =
                                        typeof e.value === "object"
                                            ? e?.value?.TypeName
                                            : e.value;
                                    setItem(data);
                                    search(data);
                                    setPayload({ ...payload, TypeName: data });
                                }}
                                itemTemplate={itemTemplate}
                            // disabled={
                            //   values?.subcategoryId?.length > 0 ? false : true
                            // }
                            />
                            <label htmlFor={"searchtest"} className="lable searchtest">
                                {t(" Search Items")}
                            </label>
                        </div>
                        <div
                         className=" d-flex"
                        //  className=" col-sm-12 d-flex"
                         >
                    {newRowData?.map((doc, key) => (
                      <div className="d-flex ml-2 mb-2" key={key}>
                        <LabeledInput
                          label={"Items"}
                          value={doc?.TypeName}
                          className={"document_label"}
                        />
                        <button
                          className="btn btn-sm btn-primary ml-2"
                          type="button"
                          onClick={() => {
                            deleteDocument(doc);
                          }}
                        >
                          <i className="fa fa-times fa-sm new_record_pluse"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                       
                        <DatePicker
                            className="custom-calendar"
                            id="From Data"
                            name="fromDate"
                            lable={t("From Date")}
                            placeholder={VITE_DATE_FORMAT}
                            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                            value={
                                payload.fromDate
                                    ? moment(payload.fromDate, "YYYY-MM-DD").toDate()
                                    : null
                            }
                            maxDate={new Date()}
                            handleChange={searchHandleChange}
                        />
                        <DatePicker
                            className="custom-calendar"
                            id="toDate"
                            name="toDate"
                            lable={t("To Date")}
                            value={
                                payload.toDate
                                    ? moment(payload.toDate, "YYYY-MM-DD").toDate()
                                    : null
                            }
                            maxDate={new Date()}
                            handleChange={searchHandleChange}
                            placeholder={VITE_DATE_FORMAT}
                            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                        />
                      

                        <div className="col-sm-1">
                            <button className="btn btn-sm btn-success px-3" onClick={handleSearch}>{t("Search")}</button>
                        </div>
                    </div>
                </div>
                {issTabData.length > 0 && (
                    <div className="mt-2 spatient_registration_card">
                        <Tables
                            scrollView="scrollView"
                            style={{ maxHeight: "60vh" }}
                            thead={issTabHead}
                            tbody={issTabData?.map((item, index) => ({
                                "S.No": index + 1,
                                IssueNo: item?.IssueNo,
                                IndentNo: item?.IndentNo,
                                ItemName: item?.ItemName,
                                BatchNumber: item?.BatchNumber,
                                FromDept: item?.FromDept,
                                DATE: moment(item?.DATE).format("DD-MMM-YYYY"),
                                ToDept: item?.ToDept,
                                Status: item?.Status,
                                IsDirectIssueDeptAcceptBy: item?.IsDirectIssueDeptAcceptBy,
                                RePrint: (
                                    <i
                                        className="fa fa-print card-print-upload-image-icon"
                                        aria-hidden="true"
                                        onClick={() => {
                                            Reprint(item.IssueNo);
                                        }}
                                    ></i>
                                ),
                            }))}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchTable;
