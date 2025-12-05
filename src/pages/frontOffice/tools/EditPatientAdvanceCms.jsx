

import React, { useState } from 'react'
import ReactSelect from '../../../components/formComponent/ReactSelect'
import { PRSearchPRDetailsPDF } from '../../../networkServices/Purchase'
import store from '../../../store/store'
import { setLoading } from '../../../store/reducers/loadingSlice/loadingSlice'
import { notify } from '../../../utils/utils'
import { RedirectURL } from '../../../networkServices/PDFURL'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/formComponent/Input'
import { OPDUpdateCMSAdvancedAmount } from '../../../networkServices/opdserviceAPI'

const EditPatientAdvanceCms = ({ valuesData, setModalData ,getPatientAdvanceCms}) => {
console.log("valuesData",valuesData)
    let [t] = useTranslation()
    const [values, setValues] = useState({
        amountType: { label: "Sancation Amt", value: "2" },
        Amount:""

    })
console.log("valuessss",values)
    const handleReactChange = (name, e) => {
        setValues((val) => ({ ...val, [name]: e }));
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }
 const handleUpdate=async()=>{
    if(!values?.Amount){
        notify("Please Fill Amount","warn")
        return
    }
    const payload={
  "patientId": String(valuesData?.Patient_ID),
  "amount": Number(values?.Amount),
  "amountType": Number(values?.amountType?.value),
  "id": Number(valuesData?.ID)
}
try {
    const response = await OPDUpdateCMSAdvancedAmount(payload)
    if(response?.success){
        notify(response?.message,"success")
        setModalData((val) => ({ ...val, visible: false }))
        getPatientAdvanceCms({MRNo:valuesData?.Patient_ID})
    }
    else{
         notify(response?.message,"error")
    }
} catch (error) {
    console.log("error",error)
}
 }
    return (
        <div>
            <ReactSelect
                placeholderName={t("Amount Type")}
                searchable={true}
                id={"amountType"}
                name={"amountType"}
                removeIsClearable={true}
                handleChange={(name, e) => handleReactChange(name, e)}
                dynamicOptions={[{
                    label: "Sancation Amount", value: "2"
                },
                { label: "Cash Amount", value: "1" }
                ]}
                value={values?.amountType?.value}
            />

            <Input
                type="number"
                className="form-control"
                lable={t("Amount")}
                placeholder=" "
                id="Amount"
                name="Amount"
                onChange={handleChange}
                value={values?.Amount}
                required={true}
            //  respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            //  onKeyDown={Tabfunctionality}
            />
            <button className="btn btn-sm btn-primary ml-2" onClick={handleUpdate}>

                {t("Upate")}
            </button>
        </div>
    )
}

export default EditPatientAdvanceCms