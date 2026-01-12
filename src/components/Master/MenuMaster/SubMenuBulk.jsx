import React, { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { notify } from "../../../utils/utils";
import { MenuCreatebulk, MenuManagmentcreatesubmenubulk, MenuManagmentgetmenus, MenuManagmentgetsubmenus } from "../../../networkServices/MenuMaster";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { getEmployeeWise } from "../../../store/reducers/common/CommonExportFunction";

const SubMenuBulk = () => {
    const localData = useLocalStorage("userData", "get");
    const { GetEmployeeWiseCenter, GetMenuList, GetRoleList } = useSelector(
        (state) => state?.CommonSlice
    );
    const dispatch = useDispatch();
    const initialData = {
        menuId: null,
        name: "",
        code: "",
        pageUrl: "",
        icon: "",
        displayOrder: "",
        branchId: null,
        orgId: "ORG001"
    };

    const [values, setValues] = useState(initialData);
    const [tableData, setTableData] = useState([]);
    const [menuList, setMenuList] = useState([]);


    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name, option) => {
        setValues(prev => ({ ...prev, [name]: option }));
        if (name === "branchId") {
            handleGetSubMenus()
            handleGetMenus(option?.value);
        }
    };

    /* ================= SAVE ================= */
    const handleSave = async () => {
        if (!values.menuId || !values.name || !values.code) {
            notify("Menu, Name & Code required", "error");
            return;
        }

        const payload = [
            {
                menuId: values.menuId.value,
                name: values.name,
                code: values.code,
                pageUrl: values.pageUrl,
                icon: values.icon,
                displayOrder: Number(values.displayOrder),
                branchId: values.branchId?.value,
                orgId: values.orgId
            }
        ];

        try {
            const res = await MenuManagmentcreatesubmenubulk(payload);
            debugger
            if (res?.success) {
                // handleGetSubMenus()
                // setTableData(prev => [...prev, payload[0]]);
                // setValues(initialData);
               
                notify(res?.message, "success");
                 handleGetMenus(values.branchId?.value)
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
    const handleGetMenus = async (branchId) => {
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

                setMenuList(res?.data);
                // setValues(initialData);
                //   notify("Saved Successfully", "success");

            } else {
                notify(res?.message, "error");
            }
        } catch (error) {
            notify("Something went wrong", "error");
        }
    };
    const handleGetSubMenus = async () => {
        const payload =
        {
            "searchText": "",
            "isAll": 1,
            "orgId": "5bbf859d-9907-4117-aead-c260d030d335",
            "branchId": values.branchId?.value ?? "",
            // "branchId": "3436b5be-7dd9-43b0-9de8-82d80d8c4683",
            "isActive": 0
        }

        try {
            const res = await MenuManagmentgetsubmenus(payload);
            if (res?.success) {
                setTableData(res?.data);


            } else {
                notify(res?.message, "error");
            }
        } catch (error) {
            notify("Something went wrong", "error");
        }
    };
    useEffect(() => {
        // handleGetMenus()
        handleGetSubMenus()
    }, [])
    useEffect(() => {
        if (localData?.UserId) {
            dispatch(getEmployeeWise({
                employeeId: localData?.UserId,
                OrganizationId: localData?.OrganizationId
            }));
        }
    }, [dispatch]);
    return (
        <>
            <div className="card p-2">
                <Heading title="Sub Menu Master" isBreadcrumb={false} />
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
                    <ReactSelect
                        placeholderName=" Menu"
                        respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                        name="menuId"
                        dynamicOptions={menuList?.map((ele) => ({
                            value: ele.id,
                            label: ele.name
                        }))}
                        handleChange={handleSelect}
                        value={values.menuId}
                    />

                    <Input
                        type="text"
                        name="name"
                        value={values.name}
                        lable="Sub Menu Name"
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
                        name="pageUrl"
                        value={values.pageUrl}
                        lable="Page URL"
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
                        { name: "Menu" },
                        { name: "Name" },
                        { name: "Code" },
                        { name: "URL" },
                        { name: "Order" },
                        { name: "Action" }
                    ]}
                    tbody={tableData.map((item, index) => ({
                        menu: item.menuId,
                        name: item.name,
                        code: item.code,
                        url: item.pageUrl,
                        Order: item.displayOrder,
                        action: (
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(index)}
                            >
                                🗑️
                            </button>
                        )
                    }))}
                />
            </div>
        </>
    );
};

export default SubMenuBulk;
