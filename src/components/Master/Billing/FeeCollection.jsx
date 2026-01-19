import React, { useEffect, useState } from 'react';
import { t } from 'i18next';
import Heading from '../../UI/Heading';
import SearchComponent from '../../commonComponents/SearchComponent';
import Input from '../../formComponent/Input';
import ReactSelect from '../../formComponent/ReactSelect';
import Tables from '../../UI/customTable';
import moment from 'moment';
import MultiSelectComp from '../../formComponent/MultiSelectComp';
import { GetAllCategory, GetAllMonthType, GetAllSubCategory } from '../../../networkServices/FeeMaster';
import { useLocalStorage } from '../../../utils/hooks/useLocalStorage';


// Mock data for initial table state
const INITIAL_ITEMS = [
  { id: 1, isMandatory: true, itemName: 'Tuition Fee', itemRate: 5000, description: 'Monthly Fee', qty: 1, disc: 0, discPerc: 0 },
  { id: 2, isMandatory: false, itemName: 'Transport Fee', itemRate: 2000, description: 'Bus Route 5', qty: 1, disc: 0, discPerc: 0 },
];

const FeeCollection = () => {
  const localData = useLocalStorage("userData", "get");
  const [studentData, setStudentData] = useState(null);
  const [feeItems, setFeeItems] = useState(INITIAL_ITEMS);
  const [monthlist, setMonthList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);


  const [values, setValues] = useState({
    discountPerc: "",
    months: [],
    searchType: { label: "All", value: "0" },
    searchCategory: null,
    searchSubCategory: null,
    searchText: ""
  });



  const typeOptions = [
    { label: "All", value: "0" },
  ];

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setValues((prev) => ({ ...prev, [name]: selectedOption }));
  };

  // Table Input Handler
  const handleTableChange = (id, field, value) => {
    const updatedItems = feeItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setFeeItems(updatedItems);
  };

  const AllMonthType = async () => {
    try {
      const res = await GetAllMonthType(localData?.OrganizationId, localData?.defaultCentre);
      if (res?.success) {
        setMonthList(res?.data);
      }
    } catch {
      notify("Failed to load categories", "error");
    }
  };

  const getAllCategory = async () => {
    try {
      const res = await GetAllCategory(localData?.OrganizationId, localData?.defaultCentre);
      if (res?.success) {
        setCategoryList(res?.data);
      }
    } catch {
      notify("Failed to load categories", "error");
    }
  };

  const getAllSubCategory = async () => {
    try {
      const res = await GetAllSubCategory(localData?.OrganizationId, localData?.defaultCentre);
      if (res?.success) {
        setSubCategoryList(res?.data);
      }
    } catch {
      notify("Failed to load categories", "error");
    }
  };


  useEffect(() => {
    AllMonthType()
    getAllCategory()
    getAllSubCategory()
  }, [localData?.OrganizationId, localData?.defaultCentre])


  console.log("studentData", studentData);
  return (
    <div className='card border'>
      <Heading title={t("Fee Collection")}

        secondTitle={

          studentData &&
          (<span className='text-danger mr-2 d-flex justify-content-center align-items-center'
            style={{
              background: " #df2222",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              cursor: "pointer"
            }}
            title='close'
            onClick={() => {
              setStudentData(null)
            }}
          >
            <i class="fa fa-times " aria-hidden="true"
              style={{
                color: " #ffffff",

              }}
            ></i>
          </span>)


        }
      />


      {!studentData && (
        <div className="p-2">
          <SearchComponent onClick={setStudentData} />
        </div>
      )}


      {studentData && (
        <div className=" ">


          <div className="row mb-2 p-2">
            <div className=''>

            </div>
            <Input
              type="text"
              className="form-control"
              id="studentFirstName"
              name="studentFirstName"
              lable={t("Student First Name")}
              value={studentData?.student?.firstName}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <Input
              type="text"
              className="form-control"
              id="studentLastName"
              name="studentLastName"
              lable={t("Student lastName Name")}
              value={studentData?.student?.lastName}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <Input
              type="text"
              className="form-control"
              id="studentID"
              name="studentID"
              lable={t("Student ID")}
              value={studentData?.student?.studentId}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <Input
              type="text"
              className="form-control"
              id="class"
              name="class"
              lable={t("Class")}
              value={studentData?.academic?.classId}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <Input
              type="text"
              className="form-control"
              id="admissionDate"
              name="admissionDate"
              lable={t("Admission Date")}
              value={moment(studentData?.academic?.admissionDate).format("DD-MM-YYYY")}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <Input
              type="text"
              className="form-control"
              id="contactNo"
              name="contactNo"
              lable={t("Contact No.")}
              value={studentData?.student?.phone}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <Input
              type="text"
              className="form-control"
              id="discountPer"
              name="discountPer"
              lable={t("Discount %")}
              value={studentData?.student?.discountPer}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              disabled={true}
            />
            <MultiSelectComp
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="months"
              id="months"
              placeholderName={t("Months")}
              // dynamicOptions={module}
              dynamicOptions={monthlist?.map((ele) => ({
                name: ele?.name,
                code: ele?.id
              }))}
              handleChange={handleSelectChange}
              value={values.months}
            />
          </div>
          <Heading title={t("Search Item")} />
          <div className="row mb-3 align-items-end mt-2 p-2">
            <ReactSelect
              placeholderName={t("Type")}
              id="searchType"
              name="searchType"
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              dynamicOptions={typeOptions}
              value={values?.searchType?.value}
              handleChange={handleSelectChange}
            />
            <ReactSelect
              placeholderName={t("Category")}
              id="searchCategory"
              name="searchCategory"
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              dynamicOptions={categoryList?.map((item) => ({ label: item?.categoryName, value: item?.id }))}
              value={values.searchCategory}
              handleChange={handleSelectChange}
            />
            <ReactSelect
              placeholderName={t("Sub Category")}
              id="searchSubCategory"
              name="searchSubCategory"
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              dynamicOptions={subCategoryList?.map((item) => ({ label: item?.displayName, value: item?.id }))}
              value={values.searchSubCategory}
              handleChange={handleSelectChange}
            />
            <Input
              type="text"
              className="form-control"
              id="searchText"
              name="searchText"
              lable={t("Search Item")}
              value={values.searchText}
              onChange={handleChange}
              respclass="col-xl-6 col-md-3 col-sm-6 col-12"
            />
            {/* <div className="col-xl-2 col-md-12 col-sm-12 col-12 mb-1">
              <button className="btn btn-sm btn-primary w-100">{t("Search")}</button>
            </div> */}
          </div>


        </div>
      )}
    </div>
  );
};

export default FeeCollection;