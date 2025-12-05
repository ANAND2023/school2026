import React, { useState } from 'react'
import Heading from '../../../components/UI/Heading';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/formComponent/Input';
import { getOpdPackageDetailsApi, updateOpdPackageDetailsApi } from '../../../networkServices/opdserviceAPI';
import { notify } from '../../../utils/ustil2';
// import moment from 'moment';
import Tables from '../../../components/UI/customTable';
import LabeledInput from '../../../components/formComponent/LabeledInput';
import moment from 'moment';

const OpdPackageItemRemove = () => {
  const [values, setValues] = useState({
    BillNo: ""
  })
  const [list, setList] = useState([]);
  const [t] = useTranslation();

  const Thead = [
    t("S.No"),
    t("PatientName"),
    t("Status"),
    t("Package"),
    // t("IsPackage"),
    { name: t("Remove"), width: "1%" },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSearch = async () => {
    if (!values?.BillNo) {
      notify("Please Enter Bill No", "warn");
    }
    try {
      const res = await getOpdPackageDetailsApi(values?.BillNo)
      if (res?.success) {
        setList(res?.data)
      } else {
        setList([])
        notify(res?.message, "error")
      }
    } catch (error) {
      console.log(error,"error")
    }
  }

  const handleDelete = async (item) => {
    try {
      const data = {
        // ledgerTnxRefID: Number(item?.LedgerTnxRefID),
        // packageID: Number(item?.PackageID),
        // isPackage: Number(item?.IsPackage),
        // isVerified: Number(item?.IsVerified),
        ltdId: Number(item?.ltdId),
        ledgertransactionNo: Number(item?.LedgertransactionNo)
      }
      const response = await updateOpdPackageDetailsApi(data)
      if (response?.success) {
        notify(response?.message, "success")
        handleSearch()
      } else {
        notify(response?.message, "error")
      }
    } catch (error) {
      console.log(error,"error")
    }
  }


  return (
    <div className="card patient_registration border">
      <Heading
        title={t("card patient_registration border")}
        isBreadcrumb={true}
      />
      <div className="row  p-2">
        <Input
          type="text"
          className="form-control"
          id="BillNo"
          name="BillNo"
          onChange={handleChange}
          value={values.BillNo}
          lable={t("BillNo")}
          placeholder=" "
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
        />
        <button
          className="btn btn-sm btn-primary ml-2"
          type="submit"
          onClick={handleSearch}
        >
          {t("Search")}
        </button>
      </div>
      {list?.length > 0 ? (
        <>
          <div className="row p-2">
            <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2 ">
              <LabeledInput label={t("Patient Name")} value={list[0]?.PName} />
            </div>
            <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2 ">
              <LabeledInput label={t("Bill No")} value={list[0]?.BillNo} />
            </div>
            <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2 ">
              <LabeledInput label={t("Bill Date")} value={moment(list[0]?.BillDate).format("DD-MM-YYYY")} />
            </div>
          </div>
          <Heading
            title={t("Opd Package Item List")}
            isBreadcrumb={false}
          />
          <Tables
            thead={Thead}
            tbody={
              list?.map((item, index) => ({
                "S.No": index + 1,
                ItemName: item.ItemName,
                Status: item.STATUS,
                package:item?.IsItemPackage,
                // IsPackage: item.IsPackage ? "Yes" : "No",
                Edit: (
                  <>
                    {item?.IsPackage !== 0 &&
                      <i
                        className="fa fa-times-circle text-danger"
                        onClick={() => handleDelete(item)}
                      />
                    }
                  </>
                ),
              }))
            }
          />

        </>
      ) : ""
      }


    </div>
  )
}

export default OpdPackageItemRemove;