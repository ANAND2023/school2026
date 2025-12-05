import React, { useEffect, useState } from 'react'
import Heading from '../../components/UI/Heading'
import { t } from 'i18next'
import Input from '../../components/formComponent/Input'
import moment from 'moment'
import DatePicker from '../../components/formComponent/DatePicker'
import ReactSelect from '../../components/formComponent/ReactSelect'
import { LaundryDeleteLaundaryDetails, LaundryGetLaundaryDetails, LaundryGetLaundryCategory, LaundryGetLaundryDepartment, LaundryGetLaundryItemMaster, LaundryGetLaundryItemReport, LaundrySaveLaundaryDetails } from '../../networkServices/laundry'
import { notify } from '../../utils/ustil2'
import TextAreaInput from '../../components/formComponent/TextAreaInput'
import { exportToExcel } from '../../utils/exportLibrary'
import Tables from '../../components/UI/customTable'

const LaundryEntry = () => {
  const [dropdownOptions, setDropdownOptions] = React.useState({
    departmentlist: [],
    categorylist: [],
    itemList: [],
  });

  const initialState = {
    issueDate: new Date(),
    item: "",
    issueQty: "",
    remarks: "",
    receiptQty: "",
  }
  const [searchValues, setSearchValues] = React.useState({
    searchDate: new Date(),
    department: "",
    category: "",
  })
  const [values, setValues] = React.useState(initialState)

  const [tbodyData, setTBodyData] = useState([]);

  const handleChange = (e) => {
    if (e.target.name === "searchDate") {
      setSearchValues((val) => ({ ...val, [e.target.name]: e.target.value }));
      return;
    }
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  const handleReactSelect = (name, value) => {
    if (name === "department" || name === "category") {
      setSearchValues((val) => ({ ...val, [name]: value }));
      return;
    }
    setValues((val) => ({ ...val, [name]: value }));
  };


  console.log(values)

  const handleSearch = async (e, isShowNotify = false) => {
    try {
      
      const res = await LaundryGetLaundaryDetails(searchValues)
      if (res?.success) {
        setTBodyData(res?.data)
        isShowNotify && notify(res?.message, "success")
      }
      else {
        setTBodyData([])
        notify(res?.message, "error")
      }

    } catch (err) {
      console.log(err)
    }
  }

  const handleSave = async () => {
    try {
      if(!values?.item) return notify("Please Select Item", "error")
      let payload = {
        "LDate": moment(values?.issueDate).format("YYYY-MM-DD"),
        "RecivedQty": Number(values?.receiptQty || 0),
        "IssueQty": Number(values?.issueQty || 0),
        "ItemId": values?.item?.value,
        "DepartmentId": searchValues?.department?.value || 0,
        "CategoryId": searchValues?.category?.value || 0,
        "Remark": values?.remarks || ""
      }
      const res = await LaundrySaveLaundaryDetails(payload)
      if (res?.success) {
        handleSearch()
        setValues(initialState)
        notify(res?.message, "success")
      }
      else {
        notify(res?.message, "error")
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleReport = async () => {
    try {
      const res = await LaundryGetLaundryItemReport(searchValues)
      if (res?.success) {
        notify(res?.message, "success")
        exportToExcel(res?.data, `Laundry Report ${moment(searchValues?.searchDate).format("YYYY-MM-DD")}`)
      }
      else {
        notify(res?.message, "error")
      }

    } catch (error) {

    }
  }

  const deleteItem = async (id) => {
    try {
      const res = await LaundryDeleteLaundaryDetails(id)
      if (res?.success) {
        notify(res?.message, "success")
        handleSearch()
      }
      else {
        notify(res?.message, "error")
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  const fetchDropdownData = async () => {
    try {
      const [departmentRes, categoryRes, itemRes] = await Promise.all([
        LaundryGetLaundryDepartment(),
        LaundryGetLaundryCategory(),
        LaundryGetLaundryItemMaster(),
      ]);

      const departments = departmentRes?.data?.map((val) => ({ label: val?.dept_name, value: val?.ID })) || [];
      const categories = categoryRes?.data?.map((val) => ({ label: val?.descr, value: val?.ID })) || [];
      const items = itemRes?.data?.map((val) => ({ label: val?.ItemName, value: val?.Id })) || [];

      setDropdownOptions((prev) => ({
        ...prev,
        departmentlist: departments,
        categorylist: categories,
        itemList: items,
      }));

      setSearchValues((prev) => ({
        ...prev,
        department: departments[0] || "",
        category: categories[0] || "",

      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    
  }, []);

  useEffect(() => {
    if(searchValues?.category && searchValues?.department){
      handleSearch();
    }
  },[searchValues?.category, searchValues?.department])



  return (
    <>
      <div className="card patient_registration ">
        <Heading
          title={t("Laundry Entry")}
          isBreadcrumb={true}
        />
        <div className="row pt-2 px-2">
          <ReactSelect
            placeholderName={t("Department")}
            respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
            id={"department"}
            requiredClassName={"required-fields"}
            searchable={true}
            name={"department"}
            dynamicOptions={
              dropdownOptions?.departmentlist || []}
            handleChange={handleReactSelect}
            value={searchValues?.department?.value}
            removeIsClearable={false}
          />
          <ReactSelect
            placeholderName={t("Category")}
            respclass={"col-xl-2 col-md-2 col-sm-4 col-sm-4 col-12"}
            id={"category"}
            requiredClassName={"required-fields"}
            searchable={true}
            name={"category"}
            dynamicOptions={
              dropdownOptions?.categorylist || []
            }
            handleChange={handleReactSelect}
            value={searchValues?.category?.value}
            removeIsClearable={false}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="searchDate"
            name="searchDate"
            value={moment(searchValues?.searchDate).toDate()}
            handleChange={handleChange}
            lable={t("Date")}

          />

          <button
            className="btn btn-sm btn-info ml-2"
            type="button"
            onClick={(e) => handleSearch(e, true)}
          >
            {t("search")}
          </button>
          <button
            className="btn btn-sm btn-info ml-2"
            type="button"
            onClick={handleReport}
          >
            {t("Report")}
          </button>






        </div>



      </div>
      <div className="card patient_registration ">
        <Heading
          title={t("Issue Items")}
          isBreadcrumb={false}
        />
        <div className="row pt-2 px-2">
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="issueDate"
            name="issueDate"
            value={moment(values?.issueDate).toDate()}
            handleChange={handleChange}
            lable={t("Issue Date")}
          />

          <ReactSelect
            placeholderName={t("Item")}
            respclass={"col-xl-3 col-md-2 col-sm-4 col-sm-4 col-12"}
            id={"item"}
            requiredClassName={"required-fields"}
            searchable={true}
            name={"item"}
            dynamicOptions={
              dropdownOptions?.itemList || []
            }
            handleChange={handleReactSelect}
            value={values?.item?.value}
            removeIsClearable={false}
          />
          <Input
            type="number"
            className="form-control required-fields"
            // id="item"
            lable={t("Issue Qty")}
            placeholder=" "
            required={true}
            value={values?.issueQty || ""}
            respclass="col-xl-1 col-md-4 col-sm-6 col-12"
            name="issueQty"
            onChange={handleChange}
          />
          <Input
            type="number"
            className="form-control required-fields"
            // id="item"
            lable={t("Receipt Qty")}
            placeholder=" "
            required={true}
            value={values?.receiptQty || ""}
            respclass="col-xl-1 col-md-4 col-sm-6 col-12"
            name="receiptQty"
            onChange={handleChange}
          />
          <div className='col-xl-3 col-md-6 col-sm-4 col-12 '>
            <TextAreaInput
              className="form-control"
              lable={"Remarks"}
              rows={2}
              // respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="remarks"
              value={values?.remarks}
              onChange={handleChange}
            />
          </div>

          <button
            className="btn btn-sm btn-info ml-2"
            type="button"
            onClick={handleSave}
          >
            {t("Save")}
          </button>








        </div>



      </div>

      <div className="card patient_registration ">
        <Tables
          thead={[
            { name: t("S.no"), width: "1%" },
            { name: t("Department"), width: "5%" },
            { name: t("Category"), width: "5%" },
            { name: t("Item"), width: "10%" },
            { name: t("Date"), width: "5%" },
            { name: t("Issue Qty"), width: "2%" },
            { name: t("Receive Qty"), width: "1%" },
            { name: t("Remarks"), width: "10%" },
            { name: t("Action"), width: "1%" }
          ]}
          tbody={tbodyData?.map((item, ind) => ({
            sNo: ind + 1,
            department: item?.Department || "",
            category: item?.CategoryName || "",
            item: item?.ItemName || "",
            date: item?.EntryDate || "",
            issueQty: item?.IssueQty || "0",
            receiptQty: item?.RecivedQty || "0",
            remarks: item?.Remarks || "",
            action: <span> <i className="fa fa-trash text-danger" aria-hidden="true" onClick={() => deleteItem(item?.Id)} ></i></span>,
          }))}
        />
      </div>

    </>
  )
}

export default LaundryEntry