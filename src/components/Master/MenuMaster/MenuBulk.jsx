
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
// import { CreateMenu, GetMenus } from "../../../networkServices/menuApi";

const MenuBulk = () => {
    const initialData = {
        name: "",
        code: "",
        icon: "",
        displayOrder: "",
        branchId: null,
        orgId: "ORG001" // normally login se aata hai
    };
     const dispatch = useDispatch();
  const localData = useLocalStorage("userData", "get");
    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState([]);
  const { GetEmployeeWiseCenter, GetMenuList, GetRoleList } = useSelector(
    (state) => state?.CommonSlice
  );


    const branchList = [
        { label: "Main Branch", value: "BR001" },
        { label: "City Branch", value: "BR002" }
    ];

    /* =======================
        INPUT HANDLER
    ======================== */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
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
                icon: values.icon,
                displayOrder: Number(values.displayOrder),
                branchId: "3436b5be-7dd9-43b0-9de8-82d80d8c4683",
                // branchId: values.branchId?.value,
                orgId: "5bbf859d-9907-4117-aead-c260d030d335"
                // orgId: values.orgId
            }
        ];

        console.log("FINAL PAYLOAD 👉", payload);

        try {
            const res = await MenuCreatebulk(payload);
            if (res?.success) {

                //   setTableData((prev) => [...prev, payload[0]]);
                setValues(initialData);
                notify("Saved Successfully", "success");
                handleGetMenus()
            } else {
                notify(res?.message, "error");
            }
        } catch (error) {
            notify("Something went wrong", "error");
        }
    };
    const handleGetMenus = async () => {
        const payload =
        {
            "searchText": "",
            "isAll": 0,
            "orgId": "5bbf859d-9907-4117-aead-c260d030d335",
            "branchId": "3436b5be-7dd9-43b0-9de8-82d80d8c4683",
            "isActive": 0
        }

        try {
            const res = await MenuManagmentgetmenus(payload);
            if (res?.success) {
                console.log("first", res);
                setTableData(res?.data);
                setValues(initialData);
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
    if (localData?.UserId) {
      dispatch(getEmployeeWise({ 
        employeeId: localData?.UserId,
        OrganizationId: localData?.OrganizationId
      }));
    }
  }, [dispatch]);
    useEffect(() => {
        handleGetMenus()
    }, [])
//  {GetEmployeeWiseCenter?.map((ele) => (
//               <option key={ele.id} value={ele.id}>{ele.name}</option>
//             ))}
    return (
        <>
            <div className="card p-2">
                <Heading title="Menu Master" isBreadcrumb={false} />

                {/* ================= FORM ================= */}
                <div className="row p-2">
                    <Input
                        type="text"
                        name="name"
                        value={values.name}
                        lable="Name"
                        placeholder={""}
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
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

                    <Input
                        type="text"
                        name="icon"
                        value={values.icon}
                        lable="Icon"
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
                        action: (
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleEdit(item)}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(index)}
                                >
                                    🗑️
                                </button>
                            </div>
                        )
                    }))}
                />
            </div>
        </>
    );
};

export default MenuBulk;

