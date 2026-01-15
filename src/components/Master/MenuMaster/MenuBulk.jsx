
import React, { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/utils";
import { MenuCreatebulk, MenuManagmentgetmenus } from "../../../networkServices/MenuMaster";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getEmployeeWise } from "../../../store/reducers/common/CommonExportFunction";
import { GetAllBranches } from "../../../networkServices/AcademicYear";
// import { CreateMenu, GetMenus } from "../../../networkServices/menuApi";

const MenuBulk = () => {
    const localData = useLocalStorage("userData", "get");
    const initialData = {
        name: "",
        code: "",
        icon: "",
        displayOrder: "",
        branchId: null,
        orgId: localData?.OrganizationId// normally login se aata hai
    };
    const dispatch = useDispatch();
    //   const localData = useLocalStorage("userData", "get");
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState([]);
    const [branchList, setBranchList] = useState([])


const getBranchData = async () => {
        const payload = {
          "employeeId": "",
          "organisationID": localData?.OrganizationId,
          "isAll": 1
        }
        try {
          const res = await GetAllBranches(payload);
          if (res?.success) setBranchList(res.data);
          else notify(res?.message, "error");
        } catch {
          notify("Error fetching data", "error");
        }
      };

    /* =======================
        INPUT HANDLER
    ======================== */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name, value) => {

        setValues((prev) => ({ ...prev, [name]: value }));
        if (name === "branchId") {
            getModuleBulk(value?.value);

        }
    };

    /* =======================
        SAVE DATA
    ======================== */
    const handleSave = async () => {
        if (!values.name || !values.code) {
            notify("Name & Code required", "error");
            return;
        }

        const payload = [
            {
                name: values.name,
                code: values.code,
                icon: values.icon?.value,
                displayOrder: Number(values.displayOrder),
                branchId: values.branchId?.value,
                // branchId: values.branchId?.value,
                // orgId: "5bbf859d-9907-4117-aead-c260d030d335"
                orgId: values.orgId
            }
        ];


        try {
            const res = await MenuCreatebulk(payload);
            if (res?.success) {
                getModuleBulk(values.branchId?.value)
                //   setTableData((prev) => [...prev, payload[0]]);
                setValues(initialData);
                notify("Saved Successfully", "success");

            } else {
                notify(res?.message, "error");
            }
        } catch (error) {
            notify("Something went wrong", "error");
        }
    };
    const getModuleBulk = async (branchId) => {
        const payload =
        {
            "searchText": "",
            "isAll": 0,
            "orgId": localData?.OrganizationId,
            "branchId": branchId ?? "",
            "isActive": 0
        }

        try {
            const res = await MenuManagmentgetmenus(payload);
            if (res?.success) {
                console.log("first", res);
                setTableData(res?.data);

                //   notify("Saved Successfully", "success");

            } else {
                notify(res?.message, "error");
            }
        } catch (error) {
            notify("Something went wrong", "error");
        }
    };

    /* =======================
        EDIT / DELETE
    ======================== */
    const handleEdit = (row) => {
        setValues({
            ...row,
            branchId: branchList.find(b => b.value === row.branchId)
        });
    };

    const handleDelete = (index) => {
        const data = [...tableData];
        data.splice(index, 1);
        setTableData(data);
    };

   
    useEffect(() => {
        getBranchData()
    }, [])
    //  {GetEmployeeWiseCenter?.map((ele) => (
    //               <option key={ele.id} value={ele.id}>{ele.name}</option>
    //             ))}


     const iconOptions = [
  { value: "fa fa-cash-register", label: <i className="fa fa-cash-register" /> },
  { value: "fa fa-money-bill", label: <i className="fa fa-money-bill" /> },
  { value: "fa fa-credit-card", label: <i className="fa fa-credit-card" /> },
  { value: "fa fa-wallet", label: <i className="fa fa-wallet" /> },
  { value: "fa fa-university", label: <i className="fa fa-university" /> },

  { value: "fa fa-school", label: <i className="fa fa-school" /> },
  { value: "fa fa-book", label: <i className="fa fa-book" /> },
  { value: "fa fa-book-open", label: <i className="fa fa-book-open" /> },
  { value: "fa fa-user-graduate", label: <i className="fa fa-user-graduate" /> },
  { value: "fa fa-chalkboard-teacher", label: <i className="fa fa-chalkboard-teacher" /> },

  { value: "fa fa-users", label: <i className="fa fa-users" /> },
  { value: "fa fa-user", label: <i className="fa fa-user" /> },
  { value: "fa fa-id-card", label: <i className="fa fa-id-card" /> },
  { value: "fa fa-address-card", label: <i className="fa fa-address-card" /> },
  { value: "fa fa-user-circle", label: <i className="fa fa-user-circle" /> },

  { value: "fa fa-calendar", label: <i className="fa fa-calendar" /> },
  { value: "fa fa-calendar-alt", label: <i className="fa fa-calendar-alt" /> },
  { value: "fa fa-clock", label: <i className="fa fa-clock" /> },
  { value: "fa fa-bell", label: <i className="fa fa-bell" /> },
  { value: "fa fa-bell-slash", label: <i className="fa fa-bell-slash" /> },

  { value: "fa fa-cog", label: <i className="fa fa-cog" /> },
  { value: "fa fa-tools", label: <i className="fa fa-tools" /> },
  { value: "fa fa-wrench", label: <i className="fa fa-wrench" /> },
  { value: "fa fa-sliders-h", label: <i className="fa fa-sliders-h" /> },
  { value: "fa fa-database", label: <i className="fa fa-database" /> },

  { value: "fa fa-file", label: <i className="fa fa-file" /> },
  { value: "fa fa-file-alt", label: <i className="fa fa-file-alt" /> },
  { value: "fa fa-file-excel", label: <i className="fa fa-file-excel" /> },
  { value: "fa fa-file-pdf", label: <i className="fa fa-file-pdf" /> },
  { value: "fa fa-upload", label: <i className="fa fa-upload" /> },

  { value: "fa fa-download", label: <i className="fa fa-download" /> },
  { value: "fa fa-print", label: <i className="fa fa-print" /> },
  { value: "fa fa-eye", label: <i className="fa fa-eye" /> },
  { value: "fa fa-edit", label: <i className="fa fa-edit" /> },
  { value: "fa fa-trash", label: <i className="fa fa-trash" /> },

  { value: "fa fa-check", label: <i className="fa fa-check" /> },
  { value: "fa fa-times", label: <i className="fa fa-times" /> },
  { value: "fa fa-plus", label: <i className="fa fa-plus" /> },
  { value: "fa fa-minus", label: <i className="fa fa-minus" /> },
  { value: "fa fa-search", label: <i className="fa fa-search" /> },

  { value: "fa fa-chart-bar", label: <i className="fa fa-chart-bar" /> },
  { value: "fa fa-chart-pie", label: <i className="fa fa-chart-pie" /> },
  { value: "fa fa-chart-line", label: <i className="fa fa-chart-line" /> },
  { value: "fa fa-home", label: <i className="fa fa-home" /> },
  { value: "fa fa-dashboard", label: <i className="fa fa-dashboard" /> },
];
    return (
        <>
            <div className="card p-2">
                <Heading title="Menu Master" isBreadcrumb={false} />

                {/* ================= FORM ================= */}
                <div className="row p-2">
                    <ReactSelect
                        placeholderName="Branch"
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="branchId"
                        // dynamicOptions={branchList}
                        dynamicOptions={branchList?.map((ele) => ({
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
                        lable="Name"
                        placeholder={""}
                        respclass="col-xl-3 col-md-4 col-sm-6 col-12"
                        onChange={handleChange}
                        className="form-control"
                    />

                    <Input
                        type="text"
                        name="code"
                        value={values.code}
                        lable="Code"
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        onChange={handleChange}
                        className="form-control"
                    />

                    {/* <Input
                        type="text"
                        name="icon"
                        value={values.icon}
                        lable="Icon"
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        onChange={handleChange}
                        className="form-control"
                    /> */}
                     <ReactSelect
                                                      placeholderName="icon"
                                                      respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                                                      name="icon"
                                                      dynamicOptions={iconOptions}
                                                      handleChange={handleSelect}
                                                      value={values.icon}
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




                    <div className="col-xl-1 col-md-4 col-sm-6 col-12 ">
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
                        { name: "Order" },
                        { name: "Icon" },
                        { name: "Branch" },
                        { name: "Action" }
                    ]}
                    tbody={tableData.map((item, index) => ({
                        name: item.name,
                        code: item.code,
                        Order: item.displayOrder,

                        // Icon:<span><i className="fa fa-solid fa-user"></i></span> ,
                        Icon: <i className={`${item.icon} me-2`}></i>,
                        // Icon: item.icon,
                        Branch: item.Branch,
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
                    }))}
                />
            </div>
        </>
    );
};

export default MenuBulk;

