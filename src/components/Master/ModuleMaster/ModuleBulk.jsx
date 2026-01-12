import React, { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/utils";
import { MenuCreatebulk, MenuManagmentCreateModuleBulk, MenuManagmentGeModuleBulk } from "../../../networkServices/MenuMaster";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getEmployeeWise } from "../../../store/reducers/common/CommonExportFunction";

const ModuleBulk = () => {
  const localData = useLocalStorage("userData", "get");
  const { GetEmployeeWiseCenter, GetMenuList, GetRoleList } = useSelector(
    (state) => state?.CommonSlice
  );
  const dispatch = useDispatch();
  const initialData = {
    name: "",
    code: "",
    description: "",
    icon: "",
    displayOrder: "",
    branchId: null,
    orgId: localData?.OrganizationId
  };

  const [values, setValues] = useState(initialData);
  const [tableData, setTableData] = useState([]);


  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, option) => {
    setValues(prev => ({ ...prev, [name]: option }));
    if (name === "branchId") {
      getModuleBulk(option?.value);
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!values.name || !values.code) {
      notify("Name & Code required", "error");
      return;
    }

    const payload =


      [
        {
          name: values.name,
          code: values.code,
          description: values.description,
          icon: values.icon,
          displayOrder: Number(values.displayOrder),
          branchId: values.branchId?.value,
          orgId: values.orgId
        }
      ];

    try {
      const res = await MenuManagmentCreateModuleBulk(payload);
      if (res?.success) {
        // setTableData(prev => [...prev, payload[0]]);
        setValues(initialData);
        notify(res?.message, "success");
        getModuleBulk(values.branchId?.value);
      } else {
        notify(res?.message, "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };
  const getModuleBulk = async ( branchId) => {


    const payload =
    {
      "searchText": "",
      "isAll": 1,
      "orgId": localData?.OrganizationId,
      "branchId": branchId ?? "",
      // "branchId": "3436b5be-7dd9-43b0-9de8-82d80d8c4683",
      "isActive": 0
    }

    try {
      const res = await MenuManagmentGeModuleBulk(payload);
      if (res?.success) {
        setTableData(res?.data);
        // setValues(initialData);
        notify(res?.message, "success");
      } else {
        notify(res?.message, "error");
      }
    } catch (error) {
      notify("Something went wrong", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (index) => {
    const data = [...tableData];
    data.splice(index, 1);
    setTableData(data);
  };

  useEffect(() => {
    if (localData?.UserId) {
      dispatch(getEmployeeWise({
        employeeId: localData?.UserId,
        OrganizationId: localData?.OrganizationId
      }));
    }
  }, [dispatch]);
  useEffect(() => {
    getModuleBulk();
  }, []);
  return (
    <>
      <div className="card p-2">
        <Heading title="Module Master" isBreadcrumb={false} />

        {/* ================= FORM ================= */}
        <div className="row p-2">
          <ReactSelect
            placeholderName="Branch"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="branchId"
            // dynamicOptions={branchList}
            dynamicOptions={GetEmployeeWiseCenter?.map((ele) => ({
              value: ele.id,
              label: ele.name
            }))}
            handleChange={handleSelect}
            value={values.branchId}
            className="form-control"
          />
          <Input
            type="text"
            name="name"
            value={values.name}
            lable="Module Name"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <Input
            type="text"
            name="code"
            value={values.code}
            lable="Module Code"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            className="form-control"
          />

          {/* <Input
            type="text"
            name="description"
            value={values.description}
            lable="Description"
            respclass="col-xl-3 col-md-6 col-sm-12 col-12"
            onChange={handleChange}
            className="form-control"
          /> */}

          <Input
            type="text"
            name="icon"
            value={values.icon}
            lable="Icon (fa-solid fa-user)"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            className="form-control"
          />

          <Input
            type="number"
            name="displayOrder"
            value={values.displayOrder}
            lable="Display Order"
           respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            className="form-control"
          />
          
          {/* 
          <ReactSelect
            placeholderName="Branch"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="branchId"
            dynamicOptions={branchList}
            handleChange={handleSelect}
            value={values.branchId}
          /> */}

          <div className="col-12 text-end mt-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <Tables
          thead={[
            { name: "Name" },
            { name: "Code" },
            { name: "Description" },
            { name: "Order" },
            { name: "Action" }
          ]}
          tbody={tableData.map((item, index) => ({
            name: item.name,
            code: item.code,
            description: item.description,
            Order: item.displayOrder,

            action: <>

              <div
                className="d-flex align-items-center justify-content-center gap-2"
              // className="row gap-2"
              >
                <button
                  id="editBtn"
                  onclick="handleEdit(item.id)"
                  title="Edit"
                  className="d-flex align-items-center justify-content-center"
                >
                  <i class=" bi-pencil-square"></i>
                </button>

                <button
                  id="deleteBtn"
                  onclick="handleDelete(item.id)"
                  title="Delete"
                >
                  <i class="bi-trash3"></i>
                </button>
              </div>

            </>,


            // <button
            //   className="btn btn-sm btn-danger"
            //   onClick={() => handleDelete(index)}
            // >
            //   🗑️
            // </button>

          }))}
        />
      </div>
    </>
  );
};

export default ModuleBulk;
