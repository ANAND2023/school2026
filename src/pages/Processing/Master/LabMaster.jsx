import React, { useEffect, useState } from "react";
import { BindCategory, BindSubcategory } from "../../../networkServices/BillingsApi";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import { notify } from "../../../utils/ustil2";
import { insertReportNumberFormatApi } from "../../../networkServices/resultEntry";


const LabMaster = () => {
  const [DropDownState, setDropDownState] = useState({
    category: [],
    subcategory: [],

  })
  const { t } = useTranslation();
  const [payload, setPayload] = useState({

  })
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const handleCategoryChange = (name, value) => {
    debugger
    const selectedId = value?.value;
    setSelectedCategoryId(selectedId);

    const matchedSubcats = DropDownState?.subcategory.filter(
      (sub) => sub.categoryID === selectedId
    );
    setFilteredSubcategories(matchedSubcats);
    setPayload((val) => ({
      ...val,
      [name]: value,
      SubCategoryID: null, // reset subcategory on category change
    }));
  };

  const handleReactSelectItem = (name, value) => {
    console.log(value);
    setPayload((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((val) => ({ ...val, [name]: value }))
  };

  const handleSave = async () => {
    console.log("Saved Payload:", payload);
    if (!payload?.Category?.value) {
      notify("Category Fields Is Required", "error")
      return
    }
    if (!payload?.SubCategoryID?.value) {
      notify("subCategory Fields Is Required", "error")
    }
    try {
      const data = {
        id: 0,
        subCategoryId: payload?.SubCategoryID?.value,
        categoryId: payload?.categoryID?.value,
        numricFormat: payload?.numricFormat,
        textFormat: payload?.textFormat,
        type: ""
      }
      const response = await insertReportNumberFormatApi(data)
      debugger
      if (response?.success) {
        notify(response?.message, "success")
        setPayload({
          numricFormat:"",
          textFormat:""
        })
      } else {
        notify(response?.message, "error")
      }
    } catch (error) {
      notify(error?.message, "error")
    }
  }


  const getBindCategory = async () => {
    try {
      const data = await BindCategory(12);
      return data?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getBindSubcategory = async () => {
    try {
      const data = await BindSubcategory();
      return data?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const [
        BindCategory,
        BindSubcategory
      ] = await Promise.all([
        getBindCategory(),
        getBindSubcategory(),
      ]);
      const dropDownData = {
        category: [
          // { label: "All", value: "0" },
          ...handleReactSelectDropDownOptions(
            BindCategory,
            "name",
            "categoryID"
          ),
        ],
        subcategory: [
          // { label: "All", value: "0" },
          ...handleReactSelectDropDownOptions(
            BindSubcategory,
            "name",
            "subCategoryID"
          ),
        ],
      }
      setDropDownState(dropDownData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    FetchAllDropDown()
  }, [])
  return (
    <div className="card mt-2">
      <Heading title={t("LAb Master")} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Category")}
          id={"Category"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name={"Category"}
          requiredClassName={"required-fields"}
          dynamicOptions={DropDownState?.category}
          value={payload?.Category}
          handleChange={handleCategoryChange}
        />
        <ReactSelect
          placeholderName={t(
            "Sub_Category"
          )}
          id={"SubCategoryID"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name={"SubCategoryID"}
          requiredClassName={"required-fields"}
          dynamicOptions={filteredSubcategories}
          value={payload?.SubCategoryID?.value}
          handleChange={handleReactSelectItem}
        />
        <Input
          type="text"
          className="form-control"
          id="numricFormat"
          name="numricFormat"
          value={payload?.numricFormat}
          onChange={handleChange}
          lable={t("Numric Format")}
          placeholder=""
          respclass="col-xl-3 col-md-2 col-sm-6 col-12"
        />
        <Input
          type="text"
          className="form-control"
          id="textFormat"
          name="textFormat"
          value={payload?.textFormat}
          onChange={handleChange}
          lable={t("Text Format")}
          placeholder=""
          respclass="col-xl-3 col-md-2 col-sm-6 col-12"
        />
        <button
          className="btn btn-sm btn-success ml-1"
          onClick={handleSave}
        >
          {t("Add_Items")}
        </button>
      </div>
    </div>
  );
};

export default LabMaster;
